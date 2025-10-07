import { NextResponse } from "next/server"

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const timeRange = searchParams.get("timeRange") || "month"

  // Mock earnings data - replace with real database query
  const earnings = {
    total: 12450,
    thisMonth: 3250,
    lastMonth: 2800,
    pending: 850,
    available: 2400,
  }

  // Mock transactions based on time range
  const allTransactions = [
    {
      id: 1,
      type: "earning",
      description: "Payment received",
      service: "Web Development - E-commerce Site",
      amount: 1500,
      status: "completed",
      date: "2024-01-15",
    },
    {
      id: 2,
      type: "earning",
      description: "Payment received",
      service: "UI/UX Design - Mobile App",
      amount: 800,
      status: "completed",
      date: "2024-01-12",
    },
    {
      id: 3,
      type: "earning",
      description: "Payment received",
      service: "Consulting - Business Strategy",
      amount: 950,
      status: "completed",
      date: "2024-01-08",
    },
    {
      id: 4,
      type: "earning",
      description: "Payment pending",
      service: "Mobile App Development",
      amount: 850,
      status: "pending",
      date: "2024-01-20",
    },
    {
      id: 5,
      type: "payout",
      description: "Withdrawal to bank",
      service: "Bank Transfer",
      amount: 2000,
      status: "completed",
      date: "2024-01-05",
    },
    {
      id: 6,
      type: "earning",
      description: "Payment received",
      service: "Logo Design",
      amount: 450,
      status: "completed",
      date: "2024-01-03",
    },
    {
      id: 7,
      type: "earning",
      description: "Payment received",
      service: "Website Maintenance",
      amount: 350,
      status: "completed",
      date: "2023-12-28",
    },
    {
      id: 8,
      type: "earning",
      description: "Payment received",
      service: "SEO Optimization",
      amount: 600,
      status: "completed",
      date: "2023-12-20",
    },
  ]

  // Filter transactions based on time range
  let transactions = allTransactions
  if (timeRange === "week") {
    transactions = allTransactions.slice(0, 3)
  } else if (timeRange === "month") {
    transactions = allTransactions.slice(0, 6)
  }

  return NextResponse.json({
    earnings,
    transactions,
  })
}
