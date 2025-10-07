import { NextResponse } from "next/server"

// Mock user database - replace with real database
const users = [
  { id: 1, name: "John Customer", email: "customer@test.com", password: "password123", role: "customer" },
  { id: 2, name: "Jane Provider", email: "provider@test.com", password: "password123", role: "provider" },
  { id: 3, name: "Admin User", email: "admin@test.com", password: "password123", role: "admin" },
]

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    const user = users.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    // Generate mock token
    const token = `mock-token-${user.id}-${Date.now()}`

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
