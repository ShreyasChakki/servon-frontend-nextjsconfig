import { NextResponse } from "next/server"

// Mock quotation data
const quotations = {
  1: {
    id: 1,
    service: "Professional Web Development",
    customer: { id: 1, name: "John Customer", avatar: null },
    provider: { id: 2, name: "Jane Provider", avatar: null },
    status: "accepted",
    budget: 2500,
  },
}

export async function GET(request, { params }) {
  const id = Number.parseInt(params.id)
  const quotation = quotations[id]

  if (!quotation) {
    return NextResponse.json({ error: "Quotation not found" }, { status: 404 })
  }

  return NextResponse.json({ quotation })
}
