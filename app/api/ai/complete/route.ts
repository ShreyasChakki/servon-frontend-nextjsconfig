import { generateText } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { prompt } = await req.json()

  const { text } = await generateText({
    model: "google/gemini-1.5-flash",
    prompt,
    maxOutputTokens: 800,
    temperature: 0.7,
  })

  return Response.json({ text })
}
