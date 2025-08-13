import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { db } from "../firebase";
import { CardDoc, DeckId } from "../types/flashcards";

export async function fetchDeckCards(deckId: DeckId): Promise<CardDoc[]> {
  const ref = collection(db, "decks", deckId, "cards");
  const q = query(ref, orderBy("index", "asc"), limit(10));
  const snap = await getDocs(q);
  const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as CardDoc[];
  const approved = items.filter(it => it.approved !== false);
  approved.sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
  return approved;
}
