import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet, Platform, Dimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useIsFocused } from "@react-navigation/native"
import Sidebar from "../components/Sidebar"
import ProgressRow from "../components/ProgressRow"
import CardsRing from "../components/CardsRing"
import { auth, db } from "../firebase"
import { doc, getDoc, onSnapshot, collectionGroup } from "firebase/firestore"
import { listenUserProgress, DeckProgress } from "../services/progressService"

type DeckId = "beginner" | "intermediate" | "advanced" | "nolifers"
type RowItem = { label: string; value: number; max: number }

const { width: SCREEN_WIDTH } = Dimensions.get("window")
const RIGHT_TARGET = Math.min(340, Math.max(280, SCREEN_WIDTH * 0.35))
const MAX_QUOTE_LENGTH = 100

export default function PerformanceScreen({ navigation }: any) {
  const [name, setName] = useState<string>("")
  const [deckTotals, setDeckTotals] = useState<Record<DeckId, number>>({
    beginner: 10,
    intermediate: 10,
    advanced: 10,
    nolifers: 10
  })
  const [rows, setRows] = useState<RowItem[]>([
    { label: "Beginner", value: 0, max: 10 },
    { label: "Intermediate", value: 0, max: 10 },
    { label: "Advanced", value: 0, max: 10 },
    { label: "No Lifers", value: 0, max: 10 }
  ])
  const [correctCount, setCorrectCount] = useState<number>(0)
  const [totalCards, setTotalCards] = useState<number>(40)
  const [quote, setQuote] = useState<string>("It’s not a bug; it’s an undocumented feature.")
  const [author, setAuthor] = useState<string>("Anonymous")
  const isFocused = useIsFocused()

  const loadShortQuote = async () => {
    const urls = [
      "https://programming-quotesapi.vercel.app/api/random",
      "https://programming-quotes-api-pi.vercel.app/quotes/random"
    ]
    for (const base of urls) {
      try {
        const res = await fetch(`${base}?_=${Date.now()}`, { headers: { Accept: "application/json" } })
        if (!res.ok) continue
        const ct = res.headers.get("content-type") || ""
        if (!ct.includes("application/json")) continue
        const data: any = await res.json()
        const text: string = (data.en || data.quote || data.text || "").trim()
        const who: string = (data.author || data.authorName || "").trim()
        if (text && text.length <= MAX_QUOTE_LENGTH) {
          setQuote(text)
          setAuthor(who || "Anonymous")
          return
        }
      } catch {}
    }
  }

  useEffect(() => {
    if (!auth.currentUser) return
    getDoc(doc(db, "users", auth.currentUser.uid)).then(snap => {
      const data = snap.data() as any
      setName((data && data.name) || "")
    })
    const unsubProgress = listenUserProgress(auth.currentUser.uid, data => {
      setRows([
        { label: "Beginner", value: data.beginner?.bestScore ?? 0, max: deckTotals.beginner },
        { label: "Intermediate", value: data.intermediate?.bestScore ?? 0, max: deckTotals.intermediate },
        { label: "Advanced", value: data.advanced?.bestScore ?? 0, max: deckTotals.advanced },
        { label: "No Lifers", value: data.nolifers?.bestScore ?? 0, max: deckTotals.nolifers }
      ])
    })
    const unsubUser = onSnapshot(doc(db, "users", auth.currentUser.uid), snap => {
      const data: any = snap.data() || {}
      const map = data.correctCards || {}
      const n = typeof map === "object" && map ? Object.keys(map).length : 0
      setCorrectCount(n)
    })
    const unsubCards = onSnapshot(collectionGroup(db, "cards"), s => {
      setTotalCards(s.size || 0)
    })
    const deckUnsubs: Array<() => void> = []
    ;(["beginner","intermediate","advanced","nolifers"] as DeckId[]).forEach(id => {
      const u = onSnapshot(doc(db, "decks", id), d => {
        const cnt = (d.exists() && typeof d.data().cardCount === "number") ? d.data().cardCount : deckTotals[id]
        setDeckTotals(prev => {
          const next = { ...prev, [id]: Math.max(0, Number(cnt || 0)) }
          setRows(r => [
            { label: "Beginner", value: r[0]?.value ?? 0, max: next.beginner },
            { label: "Intermediate", value: r[1]?.value ?? 0, max: next.intermediate },
            { label: "Advanced", value: r[2]?.value ?? 0, max: next.advanced },
            { label: "No Lifers", value: r[3]?.value ?? 0, max: next.nolifers }
          ])
          return next
        })
      })
      deckUnsubs.push(u)
    })
    loadShortQuote()
    return () => {
      unsubProgress && unsubProgress()
      unsubUser && unsubUser()
      unsubCards && unsubCards()
      deckUnsubs.forEach(fn => fn && fn())
    }
  }, [])

  useEffect(() => {
    if (isFocused) loadShortQuote()
  }, [isFocused])

  return (
    <SafeAreaView style={styles.safeArea} edges={["left", "right", "top", "bottom"]}>
      <View style={styles.root}>
        <Sidebar name={name} navigation={navigation} active="Performance" />
        <View style={styles.content}>
          <Text style={styles.pageTitle}>My Performance</Text>
          <View style={styles.row}>
            <View style={[styles.card, styles.leftCard]}>
              <Text style={styles.cardTitle}>Card Points</Text>
              {rows.map((r, i) => (
                <View key={i} style={{ marginBottom: i === rows.length - 1 ? 0 : 10 }}>
                  <ProgressRow label={r.label} value={r.value} max={r.max} barHeight={12} compact />
                </View>
              ))}
            </View>
            <View style={[styles.rightColumn, { maxWidth: RIGHT_TARGET }]}>
              <View style={styles.card}>
                <CardsRing value={correctCount} max={totalCards} size={120} title="Cards Correct" />
              </View>
              <View style={[styles.card, styles.cardQuote]}>
                <Text style={styles.quote}>{quote}</Text>
                <Text style={styles.quoteAuthor}>— {author}</Text>
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
    paddingRight: Platform.OS === "android" ? 10 : 0,
  },
  root: {
    flex: 1,
    flexDirection: "row"
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16
  },
  pageTitle: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 16,
    letterSpacing: 0.5
  },
  row: {
    flex: 1,
    flexDirection: "row"
  },
  leftCard: {
    flex: 1,
    height: "102%",
    marginRight: 20,
    paddingBottom: 12
  },
  rightColumn: {
    flexGrow: 1,
    flexShrink: 1,
    justifyContent: "flex-start"
  },
  card: {
    backgroundColor: "#0E0E0E",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#7AE2CF",
    marginBottom: 16
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 12,
    letterSpacing: 0.5
  },
  cardQuote: {
    marginBottom: 6
  },
  quote: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600"
  },
  quoteAuthor: {
    color: "#A7A7A7",
    fontSize: 12,
    marginTop: 6
  }
})
