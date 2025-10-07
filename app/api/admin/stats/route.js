import { NextResponse } from "next/server"

export async function GET(request) {
  // Mock admin stats - replace with real database queries
  const stats = {
    totalUsers: 1247,
    newUsersThisMonth: 89,
    activeServices: 342,
    pendingServices: 12,
    totalRevenue: 125430,
    revenueGrowth: 15.3,
    completedProjects: 856,
    activeProjects: 124,
  }

  return NextResponse.json({ stats })
}
