import { NextResponse } from "next/server"
import { updateUser } from "../../_store/mock-db"

export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("avatar")

    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString("base64")
    const avatarUrl = `data:${file.type};base64,${base64}`

    const user = updateUser({ avatar: avatarUrl })

    return NextResponse.json({
      success: true,
      avatarUrl: user.avatar,
      message: "Avatar uploaded successfully",
    })
  } catch (error) {
    console.error("Avatar upload error:", error)
    return NextResponse.json({ message: "Failed to upload avatar" }, { status: 500 })
  }
}
