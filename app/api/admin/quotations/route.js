import { NextResponse } from "next/server"

export async function GET(request) {
  // Mock quotations data - replace with real database queries
  const quotations = [
    {
      id: 1,
      customer: "John Customer",
      provider: "Jane Provider",
      service: "Professional Web Development",
      budget: 2500,
      status: "accepted",
      date: "May 1, 2024",
    },
    {
      id: 2,
      customer: "Alice Smith",
      provider: "Bob Designer",
      service: "Modern Logo Design",
      budget: 500,
      status: "completed",
      date: "Apr 28, 2024",
    },
    {
      id: 3,
      customer: "John Customer",
      provider: "Charlie Developer",
      service: "Mobile App Development",
      budget: 5000,
      status: "pending",
      date: "May 3, 2024",
    },
    {
      id: 4,
      customer: "Alice Smith",
      provider: "Jane Provider",
      service: "SEO Optimization Package",
      budget: 800,
      status: "accepted",
      date: "May 2, 2024",
    },
  ]

  return NextResponse.json({ quotations })
}
