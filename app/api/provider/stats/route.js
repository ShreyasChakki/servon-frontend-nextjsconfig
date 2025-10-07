import { NextResponse } from "next/server"

export async function GET(request) {
  // Mock stats - replace with real database query
  const stats = {
    totalEarnings: 12450,
    pendingQuotations: 5,
    activeProjects: 3,
    averageRating: 4.8,
  }

  return NextResponse.json({ stats })
}
