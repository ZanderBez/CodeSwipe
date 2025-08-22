import React, { useCallback, useEffect, useRef, useState } from "react"
import { View, Text, StyleSheet, Platform, FlatList, TextInput, TouchableOpacity, Alert, Modal, KeyboardAvoidingView, ScrollView, InteractionManager } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import * as ScreenOrientation from "expo-screen-orientation"
import Sidebar from "../components/Sidebar"
import { auth } from "../firebase"
import { deleteCard as svcDeleteCard, fetchUserCardsCreatedBy, fetchUserName, updateCard as svcUpdateCard, UserCardItem } from "../services/flashcardService"
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import { onAuthStateChanged } from "firebase/auth"

export default function ManageCardsScreen() {
  const navigation = useNavigation()
  const [uid, setUid] = useState<string | null>(auth.currentUser?.uid ?? null)
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(true)
  const [cards, setCards] = useState<UserCardItem[]>([])
  const [editing, setEditing] = useState<UserCardItem | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editQ, setEditQ] = useState("")
  const [editA, setEditA] = useState("")
  const [editW1, setEditW1] = useState("")
  const [editW2, setEditW2] = useState("")
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => setUid(user?.uid ?? null))
    return unsub
  }, [])

  useEffect(() => {
    if (!uid) return
    fetchUserName(uid).then(n => mountedRef.current && setName(n || ""))
  }, [uid])

  const loadCards = useCallback(async () => {
    if (!uid) return
    setLoading(true)
    try {
      const data = await fetchUserCardsCreatedBy(uid)
      if (mountedRef.current) setCards(Array.isArray(data) ? data : [])
    } catch {
      if (mountedRef.current) Alert.alert("Error", "Couldn't load your cards")
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [uid])

  useEffect(() => {
    loadCards()
  }, [loadCards])

  useFocusEffect(useCallback(() => {
    loadCards()
  }, [loadCards]))

  async function lockToCurrentLandscape() {
    try {
      const o = await ScreenOrientation.getOrientationAsync()
      if (o === ScreenOrientation.Orientation.LANDSCAPE_LEFT) {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT)
      } else if (o === ScreenOrientation.Orientation.LANDSCAPE_RIGHT) {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT)
      } else {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)
      }
    } catch {}
  }

  async function unlockToLandscape() {
    try {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)
    } catch {}
  }

  const startEdit = async (c: UserCardItem) => {
    const o0 = String(c?.options?.[0] ?? "")
    const o1 = String(c?.options?.[1] ?? "")
    const o2 = String(c?.options?.[2] ?? "")
    setEditQ(String(c?.question ?? ""))
    setEditA(o0)
    setEditW1(o1)
    setEditW2(o2)
    await lockToCurrentLandscape()
    InteractionManager.runAfterInteractions(() => {
      setEditing(c)
      setShowModal(true)
    })
  }

  const closeModal = async () => {
    setShowModal(false)
    setEditing(null)
    await unlockToLandscape()
  }

  const saveEdit = async () => {
    if (!editing) return
    const q = editQ.trim()
    const a = editA.trim()
    const w1 = editW1.trim()
    const w2 = editW2.trim()
    if (!q || !a || !w1 || !w2) return Alert.alert("Fill all fields")
    try {
      await svcUpdateCard(editing.deckId, editing.id, q, [a, w1, w2])
      if (!mountedRef.current) return
      setCards(prev =>
        prev.map(c =>
          c.id === editing.id && c.deckId === editing.deckId
            ? { ...c, question: q, options: [a, w1, w2], correctIndex: 0 }
            : c
        )
      )
      await closeModal()
    } catch {
      Alert.alert("Error", "Couldn't save changes")
    }
  }

  const deleteCard = (c: UserCardItem) => {
    Alert.alert("Delete card", "Are you sure you want to delete this card?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await svcDeleteCard(c.deckId, c.id)
            if (!mountedRef.current) return
            setCards(prev => prev.filter(x => !(x.id === c.id && x.deckId === c.deckId)))
          } catch {
            Alert.alert("Error", "Couldn't delete the card")
          }
        }
      }
    ])
  }

  const Badge = ({ label }: { label: string }) => (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{label}</Text>
    </View>
  )

  const renderItem = ({ item, index }: { item: UserCardItem; index: number }) => (
    <View style={styles.card}>
      <View style={styles.cardTopRow}>
        <Badge label={String(item.deckId || "").toUpperCase()} />
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.btnEdit} onPress={() => startEdit(item)}>
            <Text style={styles.btnEditTxt}>Edit</Text>
          </TouchableOpacity>
          <View style={styles.actionSpacer} />
          <TouchableOpacity style={styles.btnDelete} onPress={() => deleteCard(item)}>
            <Text style={styles.btnDeleteTxt}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.qRow}>
        <Text style={styles.questionIndex}>{String(item.index ?? index + 1)}.</Text>
        <Text style={styles.question}>{String(item.question || "")}</Text>
      </View>
      <View style={styles.metaRow}>
        <Text style={styles.metaLabel}>Right</Text>
        <Text style={styles.metaValue}>{String(item.options?.[0] || "")}</Text>
      </View>
      <View style={styles.metaRow}>
        <Text style={styles.metaLabel}>Wrong</Text>
        <Text style={styles.metaValue}>
          {[item.options?.[1], item.options?.[2]].filter(Boolean).map(x => String(x)).join(" • ")}
        </Text>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.safeArea} edges={["left", "right", "top", "bottom"]}>
      <View style={styles.root}>
        <Sidebar name={name} navigation={navigation} active="Create" />
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Manage My Cards</Text>
            <TouchableOpacity style={styles.backBtn} onPress={() => (navigation as any).goBack()}>
              <Ionicons name="arrow-back" size={16} color="#ffffffff" />
              <Text style={styles.backTxt}>Back</Text>
            </TouchableOpacity>
          </View>
          {loading ? (
            <Text style={styles.empty}>Loading…</Text>
          ) : cards.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.empty}>You have not created any cards yet.</Text>
            </View>
          ) : (
            <FlatList
              data={cards}
              keyExtractor={(i, idx) => `${i.deckId || "x"}:${i.id || "x"}:${idx}`}
              renderItem={renderItem}
              contentContainerStyle={styles.listPad}
              ItemSeparatorComponent={() => <View style={styles.listGap} />}
              keyboardShouldPersistTaps="handled"
              removeClippedSubviews={false}
            />
          )}
        </View>
      </View>

      <Modal
        visible={showModal}
        transparent={true}
        animationType="none"
        presentationStyle="overFullScreen"
        supportedOrientations={["landscape-left", "landscape-right"]}
        onRequestClose={closeModal}
        onDismiss={unlockToLandscape}
      >
        <View style={styles.fsContainer}>
          <View style={styles.fsBackdrop} />
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.fsCenter} keyboardVerticalOffset={64}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Edit Card</Text>
              <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.modalScrollPad}>
                <TextInput style={styles.input} placeholder="Question" placeholderTextColor="#96A0A0" value={editQ} onChangeText={t => setEditQ(String(t))} />
                <TextInput style={styles.input} placeholder="Correct answer" placeholderTextColor="#96A0A0" value={editA} onChangeText={t => setEditA(String(t))} />
                <TextInput style={styles.input} placeholder="Wrong option 1" placeholderTextColor="#96A0A0" value={editW1} onChangeText={t => setEditW1(String(t))} />
                <TextInput style={styles.input} placeholder="Wrong option 2" placeholderTextColor="#96A0A0" value={editW2} onChangeText={t => setEditW2(String(t))} />
                <View style={styles.modalRow}>
                  <TouchableOpacity style={styles.modalBtnCancel} onPress={closeModal}>
                    <Text style={styles.modalBtnTxt}>Cancel</Text>
                  </TouchableOpacity>
                  <View style={styles.modalSpacer} />
                  <TouchableOpacity style={styles.modalBtnSave} onPress={saveEdit}>
                    <Text style={styles.modalBtnTxt}>Save</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
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
    paddingHorizontal: 18,
    paddingTop: 10
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10
  },
  title: {
    color: "#FFFFFF",
    fontSize: 22,
    includeFontPadding: false,
    fontFamily: "Orbitron_700Bold"
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#7AE2CF",
    height: 30,
    paddingHorizontal: 10,
    borderRadius: 14
  },
  backTxt: {
    color: "#ffffffff",
    fontSize: 12,
    marginLeft: 6,
    includeFontPadding: false,
    fontFamily: "Orbitron_700Bold"
  },
  listPad: {
    paddingBottom: 40
  },
  listGap: {
    height: 12
  },
  emptyWrap: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40
  },
  empty: {
    color: "#bdbdbd",
    fontSize: 13,
    includeFontPadding: false,
    fontFamily: "Montserrat_400Regular"
  },
  card: {
    backgroundColor: "#0E0E0E",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#1A2A2A",
    shadowColor: "#000000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3
  },
  cardTopRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center"
  },
  actionSpacer: {
    width: 8
  },
  badge: {
    paddingHorizontal: 10,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#7AE2CF",
    alignItems: "center",
    justifyContent: "center"
  },
  badgeText: {
    color: "#ffffffff",
    fontSize: 11,
    letterSpacing: 0.3,
    includeFontPadding: false,
    fontFamily: "Orbitron_700Bold"
  },
  qRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 4
  },
  questionIndex: {
    color: "#9AD9CD",
    fontSize: 12,
    marginRight: 6,
    marginTop: 1,
    includeFontPadding: false,
    fontFamily: "Orbitron_700Bold"
  },
  question: {
    color: "#FFFFFF",
    fontSize: 14,
    flexShrink: 1,
    includeFontPadding: false,
    fontFamily: "Montserrat_400Regular"
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2
  },
  metaLabel: {
    color: "#7AE2CF",
    fontSize: 12,
    marginRight: 6,
    includeFontPadding: false,
    fontFamily: "Orbitron_700Bold"
  },
  metaValue: {
    color: "#D6D6D6",
    fontSize: 12,
    flexShrink: 1,
    includeFontPadding: false,
    fontFamily: "Montserrat_400Regular"
  },
  btnEdit: {
    paddingHorizontal: 14,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#7AE2CF",
    alignItems: "center",
    justifyContent: "center"
  },
  btnEditTxt: {
    color: "#ffffffff",
    fontSize: 12,
    includeFontPadding: false,
    fontFamily: "Orbitron_700Bold"
  },
  btnDelete: {
    paddingHorizontal: 14,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#FD5308",
    alignItems: "center",
    justifyContent: "center"
  },
  btnDeleteTxt: {
    color: "#ffffffff",
    fontSize: 12,
    includeFontPadding: false,
    fontFamily: "Orbitron_700Bold"
  },
  fsContainer: {
    flex: 1
  },
  fsBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)"
  },
  fsCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16
  },
  modalCard: {
    width: "100%",
    maxWidth: 520,
    backgroundColor: "#000000ff",
    borderWidth: 1,
    borderColor: "#7AE2CF",
    borderRadius: 16,
    padding: 16
  },
  modalTitle: {
    color: "#ffffffff",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
    includeFontPadding: false,
    fontFamily: "Orbitron_700Bold"
  },
  modalScrollPad: {
    paddingBottom: 6
  },
  input: {
    width: "100%",
    height: 44,
    backgroundColor: "#F3F5F5",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
    includeFontPadding: false,
    fontFamily: "Montserrat_400Regular"
  },
  modalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 6
  },
  modalSpacer: {
    width: 10
  },
  modalBtnCancel: {
    paddingHorizontal: 16,
    height: 42,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#616161ff"
  },
  modalBtnSave: {
    paddingHorizontal: 16,
    height: 42,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#7AE2CF"
  },
  modalBtnTxt: {
    color: "#ffffffff",
    fontFamily: "Orbitron_700Bold"
  }
})
