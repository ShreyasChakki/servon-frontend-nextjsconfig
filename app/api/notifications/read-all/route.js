import { NextResponse } from "next/server"

export async function PATCH(request) {
  try {
    // Mock marking all notifications as read - replace with real database update
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to mark all as read" }, { status: 500 })
  }
}
