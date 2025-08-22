import React, { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Platform, StyleSheet as RNStyleSheet } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Sidebar from "../components/Sidebar"
import { auth, db } from "../firebase"
import { doc, getDoc, onSnapshot } from "firebase/firestore"
import { listenUserProgress, DeckProgress } from "../services/progressService"
import ProgressRow from "../components/ProgressRow"
import OnboardingOverlay from "../components/OnboardingOverlay"
import LoaderImage from "../components/LoaderImage"

type DeckId = "beginner" | "intermediate" | "advanced" | "nolifers"

export default function HomeScreen({ navigation, route }: any) {
  const [name, setName] = useState<string>("")
  const [progress, setProgress] = useState<Record<DeckId, DeckProgress | undefined>>({
    beginner: undefined,
    intermediate: undefined,
    advanced: undefined,
    nolifers: undefined
  })
  const [deckTotals, setDeckTotals] = useState<Record<DeckId, number>>({
    beginner: 10,
    intermediate: 10,
    advanced: 10,
    nolifers: 10
  })
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    if (!auth.currentUser) return
    getDoc(doc(db, "users", auth.currentUser.uid)).then(snap => {
      const data = snap.data() as any
      setName((data && data.name) || "")
    })
    const unsub = listenUserProgress(auth.currentUser.uid, data => {
      setProgress(prev => ({ ...prev, ...data }))
    })
    const unsubs: Array<() => void> = []
    ;(["beginner","intermediate","advanced","nolifers"] as DeckId[]).forEach(id => {
      const u = onSnapshot(doc(db, "decks", id), d => {
        const cnt = (d.exists() && typeof d.data().cardCount === "number") ? d.data().cardCount : deckTotals[id]
        setDeckTotals(prev => ({ ...prev, [id]: Math.max(0, Number(cnt || 0)) }))
      })
      unsubs.push(u)
    })
    return () => {
      unsub && unsub()
      unsubs.forEach(fn => fn && fn())
    }
  }, [])

  useEffect(() => {
    const shouldShow = route?.params?.showOnboarding === true
    if (shouldShow) {
      setShowOnboarding(true)
      navigation.setParams({ showOnboarding: undefined })
    }
  }, [route?.params?.showOnboarding, navigation])

  const progressData = [
    { label: "Beginner", value: progress.beginner?.bestScore ?? 0, max: deckTotals.beginner, deckId: "beginner" as DeckId, title: "Beginner" },
    { label: "Intermediate", value: progress.intermediate?.bestScore ?? 0, max: deckTotals.intermediate, deckId: "intermediate" as DeckId, title: "Intermediate" },
    { label: "Advanced", value: progress.advanced?.bestScore ?? 0, max: deckTotals.advanced, deckId: "advanced" as DeckId, title: "Advanced" },
    { label: "No Lifers", value: progress.nolifers?.bestScore ?? 0, max: deckTotals.nolifers, deckId: "nolifers" as DeckId, title: "No Lifers" }
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
              {progressData.map(row => (
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
                  <View style={styles.illustrationBox}>
                    <LoaderImage source={require("../assets/card1.png")} resizeMode="cover" containerStyle={styles.loaderFill} />
                  </View>
                  <View style={styles.levelPill}>
                    <Text style={styles.levelPillText}>Beginner</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.gridItem} onPress={() => goDeck("intermediate", "Intermediate")}>
                  <View style={styles.illustrationBox}>
                    <LoaderImage source={require("../assets/card2.png")} resizeMode="cover" containerStyle={styles.loaderFill} />
                  </View>
                  <View style={styles.levelPill}>
                    <Text style={styles.levelPillText}>Intermediate</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.gridItem} onPress={() => goDeck("advanced", "Advanced")}>
                  <View style={styles.illustrationBox}>
                    <LoaderImage source={require("../assets/card3.png")} resizeMode="cover" containerStyle={styles.loaderFill} />
                  </View>
                  <View style={styles.levelPill}>
                    <Text style={styles.levelPillText}>Advanced</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.gridItem} onPress={() => goDeck("nolifers", "No Lifers")}>
                  <View style={styles.illustrationBox}>
                    <LoaderImage source={require("../assets/card4.png")} resizeMode="cover" containerStyle={styles.loaderFill} />
                  </View>
                  <View style={styles.levelPill}>
                    <Text style={styles.levelPillText}>No Lifers</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {showOnboarding && (
          <View style={[RNStyleSheet.absoluteFill, { zIndex: 1000 }]} pointerEvents="auto">
            <OnboardingOverlay onDone={() => setShowOnboarding(false)} />
          </View>
        )}
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
    fontSize: 20,
    marginBottom: 12,
    letterSpacing: 0.5,
    includeFontPadding: false,
    fontFamily: "Orbitron_700Bold"
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
    color: "#FFFFFF",
    fontSize: Platform.OS === "android" ? 13 : 14,
    includeFontPadding: false,
    fontFamily: "Orbitron_700Bold"
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
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: Platform.OS === "android" ? 8 : 10,
    overflow: "hidden",
    justifyContent: "space-between"
  },
  illustrationBox: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden"
  },
  loaderFill: {
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
    color: "#FFFFFF",
    fontSize: 11,
    includeFontPadding: false,
    fontFamily: "Orbitron_700Bold"
  }
})
