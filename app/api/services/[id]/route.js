import { NextResponse } from "next/server"
import { getServiceById } from "@/lib/services-store"

export async function GET(request, { params }) {
  const service = getServiceById(params.id)

  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 })
  }

  return NextResponse.json({ service })
}
