import { NextResponse } from "next/server"
import { getServices } from "@/lib/services-store"

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const sortBy = searchParams.get("sortBy") || "rating"
  const locationCity = searchParams.get("location") || searchParams.get("city")
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")
  const radiusKm = searchParams.get("radiusKm") || searchParams.get("radius")

  const services = getServices({
    category,
    sortBy,
    locationCity,
    lat: lat != null ? Number(lat) : undefined,
    lon: lon != null ? Number(lon) : undefined,
    radiusKm: radiusKm != null ? Number(radiusKm) : undefined,
  })

  return NextResponse.json({ services })
}
