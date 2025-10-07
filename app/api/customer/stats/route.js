import { NextResponse } from "next/server"
import { computeSpendingBreakdown, getBookings } from "../../_store/mock-db"

export async function GET() {
  const { total, byService, byMonth } = computeSpendingBreakdown()
  const bookings = getBookings()
  const stats = {
    activeQuotations: 3,
    pendingResponses: 2,
    completedServices: bookings.filter((b) => b.status === "completed").length,
    totalSpent: total,
    breakdown: {
      byService,
      byMonth,
    },
  }
  return NextResponse.json({ stats })
}
