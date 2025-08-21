import { collection, deleteDoc, doc, getDoc, getDocs, increment, limit, orderBy, query, serverTimestamp, setDoc, addDoc, updateDoc, where } from "firebase/firestore"
import { db } from "../firebase"
import { CardDoc, DeckId } from "../types/flashcards"

export type UserCardItem = {
  id: string
  deckId: DeckId
  index: number
  question: string
  options: string[]
  correctIndex: number
  approved?: boolean
}

export async function fetchDeckCards(deckId: DeckId): Promise<CardDoc[]> {
  const ref = collection(db, "decks", deckId, "cards")
  const q = query(ref, orderBy("index", "asc"))
  const snap = await getDocs(q)
  const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as CardDoc[]
  const approved = items.filter(it => it.approved !== false)
  approved.sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
  return approved
}

export async function getNextIndex(deckId: DeckId): Promise<number> {
  const ref = collection(db, "decks", deckId, "cards")
  const q = query(ref, orderBy("index", "desc"), limit(1))
  const s = await getDocs(q)
  if (s.empty) return 1
  const top = s.docs[0].data() as any
  const cur = Number(top.index || 0)
  return cur + 1
}

export async function createCard(deckId: DeckId, question: string, options: string[], uid: string): Promise<void> {
  const idx = await getNextIndex(deckId)
  const ref = collection(db, "decks", deckId, "cards")
  await addDoc(ref, {
    index: idx,
    question: question.trim(),
    options: options.map(o => o.trim()),
    correctIndex: 0,
    approved: true,
    createdAt: serverTimestamp(),
    createdBy: uid
  })
  await setDoc(doc(db, "decks", deckId), { cardCount: increment(1) }, { merge: true })
}

export async function updateCard(deckId: DeckId, cardId: string, question: string, options: string[]): Promise<void> {
  const cardRef = doc(db, "decks", deckId, "cards", cardId)
  await updateDoc(cardRef, { question, options, correctIndex: 0 })
}

export async function deleteCard(deckId: DeckId, cardId: string): Promise<void> {
  const cardRef = doc(db, "decks", deckId, "cards", cardId)
  await deleteDoc(cardRef)
  const deckRef = doc(db, "decks", deckId)
  await updateDoc(deckRef, { cardCount: increment(-1) })
}

export async function fetchUserCardsCreatedBy(uid: string): Promise<UserCardItem[]> {
  const decks: DeckId[] = ["beginner", "intermediate", "advanced", "nolifers"]
  const all: UserCardItem[] = []
  for (const deckId of decks) {
    const col = collection(db, "decks", deckId, "cards")
    const qy = query(col, where("createdBy", "==", uid))
    const snap = await getDocs(qy)
    snap.forEach(d => {
      const v = d.data() as any
      all.push({
        id: d.id,
        deckId,
        index: Number(v.index ?? 0),
        question: v.question ?? "",
        options: Array.isArray(v.options) ? v.options : [],
        correctIndex: typeof v.correctIndex === "number" ? v.correctIndex : 0,
        approved: v.approved
      })
    })
  }
  all.sort((a, b) => a.deckId.localeCompare(b.deckId) || a.index - b.index)
  return all
}

export async function fetchUserName(uid: string): Promise<string> {
  const snap = await getDoc(doc(db, "users", uid))
  const d = snap.data() as any
  return (d && d.name) || ""
}
