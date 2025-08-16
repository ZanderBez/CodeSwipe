import React, { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Sidebar from "../components/Sidebar"
import { auth, db } from "../firebase"
import { doc, getDoc } from "firebase/firestore"
import { listenUserProgress, DeckProgress } from "../services/progressService"
import ProgressRow from "../components/ProgressRow"

type DeckId = "beginner" | "intermediate" | "advanced" | "nolifers"

export default function HomeScreen({ navigation }: any) {
  const [name, setName] = useState<string>("")
  const [progress, setProgress] = useState<Record<DeckId, DeckProgress | undefined>>({
    beginner: undefined,
    intermediate: undefined,
    advanced: undefined,
    nolifers: undefined
  })

  useEffect(() => {
    if (auth.currentUser) {
      getDoc(doc(db, "users", auth.currentUser.uid)).then((snap) => {
        if (snap.exists()) {
          const data = snap.data() as any
          setName(data.name || "")
        }
      })
      const unsub = listenUserProgress(auth.currentUser.uid, (data) => {
        setProgress((prev) => ({ ...prev, ...data }))
      })
      return unsub
    }
  }, [])

  const progressData = [
    { label: "Beginner", value: progress.beginner?.bestScore ?? 0, max: progress.beginner?.bestTotal ?? 10, deckId: "beginner" as DeckId, title: "Beginner" },
    { label: "Intermediate", value: progress.intermediate?.bestScore ?? 0, max: progress.intermediate?.bestTotal ?? 10, deckId: "intermediate" as DeckId, title: "Intermediate" },
    { label: "Advanced", value: progress.advanced?.bestScore ?? 0, max: progress.advanced?.bestTotal ?? 10, deckId: "advanced" as DeckId, title: "Advanced" },
    { label: "No Lifers", value: progress.nolifers?.bestScore ?? 0, max: progress.nolifers?.bestTotal ?? 10, deckId: "nolifers" as DeckId, title: "No Lifers" }
  ]

  const goDeck = (deckId: DeckId, title: string) => {
    navigation.navigate("Flashcards", { deckId, title })
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.root}>
        <Sidebar name={name} navigation={navigation} />
        <View style={styles.content}>
          <View style={styles.cardsRow}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Code Points</Text>
              {progressData.map((row) => (
                <ProgressRow key={row.label} label={row.label} value={row.value} max={row.max} />
              ))}
              <TouchableOpacity style={styles.pillBtn} onPress={() => navigation.navigate("Performance")}>
                <Text style={styles.pillBtnText}>Details</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>How Brave are you?</Text>
              <View style={styles.grid}>
                <TouchableOpacity style={styles.gridItem} onPress={() => goDeck("beginner", "Beginner")}>
                  <Image source={require("../assets/card1.png")} style={styles.illustrationImg} resizeMode="cover" />
                  <View style={styles.levelPill}>
                    <Text style={styles.levelPillText}>Beginner</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.gridItem} onPress={() => goDeck("intermediate", "Intermediate")}>
                  <Image source={require("../assets/card2.png")} style={styles.illustrationImg} resizeMode="cover" />
                  <View style={styles.levelPill}>
                    <Text style={styles.levelPillText}>Intermediate</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.gridItem} onPress={() => goDeck("advanced", "Advanced")}>
                  <Image source={require("../assets/card3.png")} style={styles.illustrationImg} resizeMode="cover" />
                  <View style={styles.levelPill}>
                    <Text style={styles.levelPillText}>Advanced</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.gridItem} onPress={() => goDeck("nolifers", "No Lifers")}>
                  <Image source={require("../assets/card4.png")} style={styles.illustrationImg} resizeMode="cover" />
                  <View style={styles.levelPill}>
                    <Text style={styles.levelPillText}>No Lifers</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
    paddingRight: Platform.OS === "android" ? 10 : 0
  },
  root: {
    flex: 1,
    flexDirection: "row"
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16
  },
  cardsRow: {
    flex: 1,
    flexDirection: "row",
    columnGap: 20
  },
  card: {
    height: "100%",
    flex: 1,
    backgroundColor: "#0E0E0E",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#7AE2CF"
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 12,
    letterSpacing: 0.5
  },
  pillBtn: {
    marginTop: "auto",
    alignSelf: "stretch",
    backgroundColor: "#7AE2CF",
    height: Platform.OS === "android" ? 34 : 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center"
  },
  pillBtnText: {
    color: "#ffffffff",
    fontWeight: "800",
    fontSize: Platform.OS === "android" ? 13 : 14
  },
  grid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12
  },
  gridItem: {
    width: Platform.OS === "android" ? "47.5%" : "48%",
    aspectRatio: Platform.OS === "android" ? 1.26 : 1,
    backgroundColor: "#ffffffff",
    borderRadius: 16,
    padding: Platform.OS === "android" ? 8 : 10,
    overflow: "hidden",
    justifyContent: "space-between"
  },
  illustrationImg: {
    width: "100%",
    flex: 1,
    borderRadius: 12
  },
  levelPill: {
    width: "100%",
    alignSelf: "center",
    height: 25,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: "#7AE2CF",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8
  },
  levelPillText: {
    color: "#ffffffff",
    fontWeight: "800",
    fontSize: 11
  }
})
