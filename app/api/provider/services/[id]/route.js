import { NextResponse } from "next/server"
import { deleteService, updateService, getServiceById } from "@/lib/services-store"

export async function GET(request, { params }) {
  const service = getServiceById(params.id)

  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 })
  }

  return NextResponse.json({ service })
}

export async function PATCH(request, { params }) {
  try {
    const body = await request.json()
    const updatedService = updateService(params.id, body)

    if (!updatedService) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    return NextResponse.json({ service: updatedService })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const deleted = deleteService(params.id)

    if (!deleted) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Service deleted" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 })
  }
}
