import { db } from "../firebase"
import { doc, setDoc, getDoc, serverTimestamp, increment, onSnapshot, collection, Unsubscribe } from "firebase/firestore"
import { DeckId } from "../types/flashcards"

export type DeckProgress = {
  bestScore: number
  bestTotal: number
  lastScore: number
  lastTotal: number
  attempts: number
  totalCorrect: number
  totalAnswered: number
  lastUpdated: any
}

export async function saveQuizResult(uid: string, deckId: DeckId, score: number, total: number) {
  const ref = doc(db, "users", uid, "progress", deckId)
  const snap = await getDoc(ref)
  const now = serverTimestamp()

  if (!snap.exists()) {
    await setDoc(ref, {
      deckId,
      bestScore: score,
      bestTotal: total,
      lastScore: score,
      lastTotal: total,
      attempts: 1,
      totalCorrect: score,
      totalAnswered: total,
      lastUpdated: now
    })
    return
  }

  const cur = snap.data() as DeckProgress
  const curBestPct = cur.bestTotal > 0 ? cur.bestScore / cur.bestTotal : 0
  const newPct = total > 0 ? score / total : 0
  const nextBestScore = newPct > curBestPct ? score : cur.bestScore
  const nextBestTotal = newPct > curBestPct ? total : cur.bestTotal

  await setDoc(ref, {
    deckId,
    bestScore: nextBestScore,
    bestTotal: nextBestTotal,
    lastScore: score,
    lastTotal: total,
    attempts: increment(1),
    totalCorrect: increment(score),
    totalAnswered: increment(total),
    lastUpdated: now
  }, { merge: true })
}

export function listenUserProgress(uid: string, cb: (data: Record<DeckId, DeckProgress>) => void): Unsubscribe {
  const col = collection(db, "users", uid, "progress")
  return onSnapshot(col, (qs) => {
    const map: Record<string, DeckProgress> = {}
    qs.forEach(d => { map[d.id] = d.data() as DeckProgress })
    cb(map as Record<DeckId, DeckProgress>)
  })
}

export async function recordCorrectCard(uid: string, deckId: string, cardId: string) {
  const key = `${deckId}:${cardId}`
  const ref = doc(db, "users", uid)
  await setDoc(ref, { correctCards: { [key]: true } }, { merge: true })
}
