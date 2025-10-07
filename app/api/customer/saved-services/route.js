import { NextResponse } from "next/server"
import { getSavedServices, addSavedService } from "../../_store/mock-db"

export async function GET() {
  try {
    const services = getSavedServices()
    return NextResponse.json({ services })
  } catch (error) {
    console.error("Error fetching saved services:", error)
    return NextResponse.json({ error: "Failed to fetch saved services", services: [] }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    const body = await request.json()
    const service = body?.service
    if (!service?.id) {
      return NextResponse.json({ message: "Invalid service payload" }, { status: 400 })
    }
    const services = addSavedService(service)
    return NextResponse.json({ success: true, services })
  } catch (error) {
    console.error("Error adding favorite:", error)
    return NextResponse.json({ error: "Failed to add favorite" }, { status: 500 })
  }
}
