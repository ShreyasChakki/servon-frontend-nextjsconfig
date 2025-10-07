import { NextResponse } from "next/server"

export async function PATCH(request, { params }) {
  try {
    const id = Number.parseInt(params.id)
    // Mock marking notification as read - replace with real database update
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to mark as read" }, { status: 500 })
  }
}
