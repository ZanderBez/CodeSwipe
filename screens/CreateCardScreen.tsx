import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet, Platform, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import Sidebar from "../components/Sidebar"
import { auth, db } from "../firebase"
import { doc, getDoc, collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs, setDoc, increment } from "firebase/firestore"

type DeckId = "beginner" | "intermediate" | "advanced" | "nolifers"

export default function CreateCardScreen({ route, navigation }: any) {
  const p = route?.params || {}
  const deckId: DeckId = (p.deckId as DeckId) || "beginner"
  const deckTitle: string = p.deckTitle || "Beginner"

  const [name, setName] = useState<string>("")
  const [question, setQuestion] = useState("")
  const [rightAns, setRightAns] = useState("")
  const [wrong1, setWrong1] = useState("")
  const [wrong2, setWrong2] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!auth.currentUser) return
    getDoc(doc(db, "users", auth.currentUser.uid)).then(snap => {
      const data = snap.data() as any
      setName((data && data.name) || "")
    })
  }, [])

  const getNextIndex = async (): Promise<number> => {
    const ref = collection(db, "decks", deckId, "cards")
    const q = query(ref, orderBy("index", "desc"), limit(1))
    const s = await getDocs(q)
    if (s.empty) return 1
    const top = s.docs[0].data() as any
    const cur = Number(top.index || 0)
    return cur + 1
  }

  const onSave = async () => {
    if (!question.trim() || !rightAns.trim() || !wrong1.trim() || !wrong2.trim()) {
      Alert.alert("Fill all fields")
      return
    }
    if (!auth.currentUser) {
      Alert.alert("Not signed in")
      return
    }
    try {
      setSaving(true)
      const idx = await getNextIndex()
      const ref = collection(db, "decks", deckId, "cards")
      await addDoc(ref, {
        index: idx,
        question: question.trim(),
        options: [rightAns.trim(), wrong1.trim(), wrong2.trim()],
        correctIndex: 0,
        approved: true,
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser.uid
      })
      await setDoc(doc(db, "decks", deckId), { cardCount: increment(1) }, { merge: true })
      setQuestion("")
      setRightAns("")
      setWrong1("")
      setWrong2("")
      Alert.alert("Card created")
      navigation.navigate("ChooseDeck")
    } catch {
      Alert.alert("Failed to create")
    } finally {
      setSaving(false)
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["left","right","top","bottom"]}>
      <View style={styles.root}>
        <Sidebar name={name} navigation={navigation} active="Create" />
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.navigate("ChooseDeck")} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={18} color="#000000" />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.title}>Create a Card</Text>
              <Text style={styles.subtitle}>{deckTitle}</Text>
            </View>
            <View style={styles.headerSpacer} />
          </View>

          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.kav}>
            <View style={styles.formCard}>
              <TextInput style={styles.input} placeholder="Write Question" placeholderTextColor="#96A0A0" value={question} onChangeText={setQuestion} />
              <TextInput style={styles.input} placeholder="Right Answer" placeholderTextColor="#96A0A0" value={rightAns} onChangeText={setRightAns} />
              <TextInput style={styles.input} placeholder="Wrong Answer" placeholderTextColor="#96A0A0" value={wrong1} onChangeText={setWrong1} />
              <TextInput style={styles.input} placeholder="Wrong Answer" placeholderTextColor="#96A0A0" value={wrong2} onChangeText={setWrong2} />
              <TouchableOpacity disabled={saving} onPress={onSave} style={[styles.submitBtn, saving && { opacity: 0.6 }]}>
                <Text style={styles.submitText}>{saving ? "Saving..." : "CREATE CARD"}</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000000",
    paddingLeft: Platform.OS === "android" ? 10 : 0,
    paddingRight: Platform.OS === "android" ? 10 : 0,
    paddingBottom: Platform.OS === "android" ? 28 : 14
  },
  root: {
    flex: 1,
    flexDirection: "row"
  },
  content: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: Platform.OS === "android" ? 12 : 8
  },
  headerRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#7AE2CF",
    alignItems: "center",
    justifyContent: "center"
  },
  headerCenter: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  },
  headerSpacer: {
    width: 34,
    height: 34
  },
  title: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800"
  },
  subtitle: {
    color: "#7AE2CF",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2
  },
  kav: {
    flex: 1
  },
  formCard: {
    backgroundColor: "#0E0E0E",
    borderRadius: 18,
    padding: 20,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#7AE2CF"
  },
  input: {
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#7AE2CF",
    paddingHorizontal: 15,
    color: "#FFFFFF",
    marginBottom: 8,
    fontSize: 13
  },
  submitBtn: {
    marginTop: 6,
    height: 40,
    borderRadius: 18,
    backgroundColor: "#7AE2CF",
    alignItems: "center",
    justifyContent: "center"
  },
  submitText: {
    color: "#000000",
    fontWeight: "800",
    fontSize: 13
  }
})
