import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { name, email, password, role } = await request.json()

    // Validate input
    if (!name || !email || !password || !role) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters" }, { status: 400 })
    }

    // Mock user creation - replace with real database
    const newUser = {
      id: Date.now(),
      name,
      email,
      role,
    }

    const token = `mock-token-${newUser.id}-${Date.now()}`

    return NextResponse.json({
      user: newUser,
      token,
    })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
