import { NextResponse } from "next/server"
import { getBookings } from "../../_store/mock-db"

export async function GET() {
  try {
    const bookings = getBookings()
    return NextResponse.json({ bookings })
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json({ error: "Failed to fetch bookings", bookings: [] }, { status: 500 })
  }
}
