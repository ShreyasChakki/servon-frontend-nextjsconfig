const payoutStatus = new Map()

export async function POST(req) {
  try {
    const body = await req.json()
    const { payoutId, amount } = body || {}
    if (!payoutId) {
      return new Response(JSON.stringify({ ok: false, error: "payoutId is required" }), { status: 400 })
    }
    // Store status in-memory for demo purposes
    payoutStatus.set(payoutId, { status: "Paid", amount: amount ?? null, at: Date.now() })
    return new Response(JSON.stringify({ ok: true, status: "Paid" }), { status: 200 })
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e?.message || "Unknown error" }), { status: 500 })
  }
}

export async function GET() {
  // for debugging or polling
  const all = Array.from(payoutStatus.entries()).map(([id, v]) => ({ id, ...v }))
  return new Response(JSON.stringify({ ok: true, items: all }), { status: 200 })
}
