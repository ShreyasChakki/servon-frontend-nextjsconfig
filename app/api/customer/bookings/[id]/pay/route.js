import { NextResponse } from "next/server"
import { setBookingPaid } from "../../../../_store/mock-db"

export async function POST(request, { params }) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    const { id } = params
    const updated = setBookingPaid(id)
    if (!updated) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true, booking: updated })
  } catch (error) {
    console.error("Payment update error:", error)
    return NextResponse.json({ message: "Failed to update payment" }, { status: 500 })
  }
}
