import { NextResponse } from "next/server"
import { getServices, addService } from "@/lib/services-store"

export async function GET(request) {
  const providerId = 1 // In real app, extract from JWT token

  const services = getServices({ providerId })
  return NextResponse.json({ services })
}

export async function POST(request) {
  try {
    const body = await request.json()
    const providerId = 1
    const providerName = "Current Provider"

    const { location, city, lat, lon, ...rest } = body

    const serviceData = {
      ...rest,
      location: city || location || "Unknown",
      geoLat: typeof lat === "string" ? Number(lat) : lat,
      geoLon: typeof lon === "string" ? Number(lon) : lon,
      city: city || location,
      providerId,
      provider: { id: providerId, name: providerName, avatar: null },
    }

    const newService = addService(serviceData)
    return NextResponse.json({ service: newService }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 })
  }
}
