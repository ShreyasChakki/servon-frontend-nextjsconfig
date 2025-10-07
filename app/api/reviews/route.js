import { NextResponse } from "next/server"
import { addReviewForService, getReviewsByService, getReviewsByUser } from "@/lib/services-store"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const serviceId = searchParams.get("serviceId")
    const userId = searchParams.get("userId")

    if (serviceId) {
      const reviews = getReviewsByService(Number(serviceId))
      return NextResponse.json({ reviews })
    }
    if (userId) {
      const reviews = getReviewsByUser(Number(userId))
      return NextResponse.json({ reviews })
    }
    return NextResponse.json({ reviews: [] })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { serviceId, rating, comment, userId = 1, name = "You" } = body

    const review = addReviewForService(Number(serviceId), { userId, name, rating, comment })
    if (!review) return NextResponse.json({ error: "Service not found" }, { status: 404 })

    return NextResponse.json({ review }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 })
  }
}
