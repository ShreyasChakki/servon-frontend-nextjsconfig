import { NextResponse } from "next/server"

export async function PATCH(request, { params }) {
  try {
    const id = Number.parseInt(params.id)
    // Mock marking quotation as complete - replace with real database update
    return NextResponse.json({ success: true, message: "Quotation marked as complete" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to mark as complete" }, { status: 500 })
  }
}
