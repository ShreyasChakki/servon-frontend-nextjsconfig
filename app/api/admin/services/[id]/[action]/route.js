import { NextResponse } from "next/server"

export async function PATCH(request, { params }) {
  try {
    const { id, action } = params
    // Mock service action - replace with real database update
    console.log(`Admin action: ${action} on service ${id}`)
    return NextResponse.json({ success: true, message: `Service ${action} successful` })
  } catch (error) {
    return NextResponse.json({ error: "Failed to perform action" }, { status: 500 })
  }
}
