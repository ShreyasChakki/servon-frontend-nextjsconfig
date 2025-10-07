import { NextResponse } from "next/server"

export async function POST(request, { params }) {
  try {
    // Mock rejecting quotation - replace with real database update
    return NextResponse.json({ success: true, message: "Quotation rejected" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to reject quotation" }, { status: 500 })
  }
}
