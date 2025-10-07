import { NextResponse } from "next/server"

export async function PATCH(request, { params }) {
  try {
    const id = Number.parseInt(params.id)
    // Mock canceling quotation - replace with real database update
    return NextResponse.json({ success: true, message: "Quotation cancelled" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to cancel quotation" }, { status: 500 })
  }
}
