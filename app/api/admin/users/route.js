import { NextResponse } from "next/server"

export async function GET(request) {
  // Mock users data - replace with real database queries
  const users = [
    {
      id: 1,
      name: "John Customer",
      email: "john@example.com",
      role: "customer",
      status: "active",
      joinedDate: "Jan 15, 2024",
    },
    {
      id: 2,
      name: "Jane Provider",
      email: "jane@example.com",
      role: "provider",
      status: "active",
      joinedDate: "Feb 3, 2024",
    },
    {
      id: 3,
      name: "Bob Designer",
      email: "bob@example.com",
      role: "provider",
      status: "active",
      joinedDate: "Mar 12, 2024",
    },
    {
      id: 4,
      name: "Alice Smith",
      email: "alice@example.com",
      role: "customer",
      status: "suspended",
      joinedDate: "Apr 5, 2024",
    },
    {
      id: 5,
      name: "Charlie Developer",
      email: "charlie@example.com",
      role: "provider",
      status: "active",
      joinedDate: "May 20, 2024",
    },
  ]

  return NextResponse.json({ users })
}
