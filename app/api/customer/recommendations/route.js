import { NextResponse } from "next/server"

export async function GET(request) {
  // Mock recommendations - in real app, use AI/ML
  const recommendations = [
    { id: 4, title: "Business Consulting", rating: 4.7, price: 500 },
    { id: 5, title: "Math & Science Tutoring", rating: 4.9, price: 75 },
    { id: 6, title: "Mobile App Development", rating: 4.8, price: 5000 },
  ]

  return NextResponse.json({ recommendations })
}
