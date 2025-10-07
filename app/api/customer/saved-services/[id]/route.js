import { NextResponse } from "next/server"
import { removeSavedService } from "../../../_store/mock-db"

export async function DELETE(request, { params }) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    const { id } = params
    removeSavedService(id)
    return NextResponse.json({
      success: true,
      message: "Service removed from favorites",
    })
  } catch (error) {
    console.error("Error removing favorite:", error)
    return NextResponse.json({ error: "Failed to remove favorite" }, { status: 500 })
  }
}
