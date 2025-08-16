export type Quote = { quote: string; author: string }

const BASE = "https://programming-quotes-api-pi.vercel.app"

export async function fetchRandomQuote(): Promise<Quote> {
  const res = await fetch(`${BASE}/quotes/random`)
  if (!res.ok) throw new Error("quote_failed")
  const data = await res.json()
  return { quote: data.quote || data.text || "", author: data.author || "" }
}
