import type { NextRequest } from "next/server"
import { generateText } from "ai"

// Tip: Vercel AI Gateway supports Google Vertex models by default in Next.js.
// We'll try a Gemini flash model; adjust if your project uses a different alias.
const MODEL = "google/gemini-1.5-flash"

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()
    const prompt = typeof message === "string" ? message : "Help me with my service marketplace question."
    const { text } = await generateText({
      model: MODEL,
      prompt,
    })
    return new Response(JSON.stringify({ ok: true, reply: text }), { status: 200 })
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e?.message || "AI error" }), { status: 500 })
  }
}
