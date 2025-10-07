import { NextResponse } from "next/server"
import { getUser, updateUser } from "../../_store/mock-db"

export const userDataStore = {
  avatar: null,
}

export async function PUT(request) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, phone, bio, location } = body

    // keep current avatar unless changed via avatar route
    const current = getUser()
    const updatedUser = updateUser({
      name: name ?? current.name,
      phone: phone ?? current.phone,
      bio: bio ?? current.bio,
      location: location ?? current.location,
    })

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully",
    })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ message: "Failed to update profile" }, { status: 500 })
  }
}
