import { useEffect, useMemo, useState } from "react"
import { auth } from "../firebase"
import { listenToCorrectCount } from "../services/progressService"

const REQUIRED = 20

export default function useEligibility() {
  const [count, setCount] = useState<number | null>(null)
  const uid = auth.currentUser?.uid || null

  useEffect(() => {
    if (!uid) { setCount(null); return }
    const unsub = listenToCorrectCount(uid, (n) => setCount(n))
    return unsub
  }, [uid])

  const eligible = useMemo(() => (typeof count === "number" ? count >= REQUIRED : false), [count])

  return { eligible, count: count ?? 0, required: REQUIRED, loading: count === null }
}
