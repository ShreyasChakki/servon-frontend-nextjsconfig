import { NextResponse } from "next/server"

export async function GET(request) {
  // Mock activity data
  const activity = [
    {
      id: 1,
      title: "Quotation Accepted",
      service: "Professional Web Development",
      status: "accepted",
      date: "2 hours ago",
    },
    {
      id: 2,
      title: "Quotation Pending",
      service: "Logo & Brand Identity Design",
      status: "pending",
      date: "1 day ago",
    },
    {
      id: 3,
      title: "Service Completed",
      service: "Home Cleaning Service",
      status: "completed",
      date: "3 days ago",
    },
  ]

  return NextResponse.json({ activity })
}
