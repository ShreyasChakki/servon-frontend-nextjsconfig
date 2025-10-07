import { NextResponse } from "next/server"

// Mock messages data
const messagesStore = {
  1: [
    {
      id: 1,
      senderId: 1,
      senderName: "John Customer",
      content: "Hi! I'm interested in your web development service.",
      timestamp: "10:30 AM",
    },
    {
      id: 2,
      senderId: 2,
      senderName: "Jane Provider",
      content: "Hello! I'd be happy to help. Can you tell me more about your project?",
      timestamp: "10:32 AM",
    },
    {
      id: 3,
      senderId: 1,
      senderName: "John Customer",
      content: "I need a responsive website for my small business with a contact form and gallery.",
      timestamp: "10:35 AM",
    },
    {
      id: 4,
      senderId: 2,
      senderName: "Jane Provider",
      content: "Perfect! I can definitely help with that. I'll start working on the initial design mockups.",
      timestamp: "10:40 AM",
    },
  ],
}

export async function GET(request, { params }) {
  const quotationId = Number.parseInt(params.id)
  const messages = messagesStore[quotationId] || []

  return NextResponse.json({ messages })
}

export async function POST(request, { params }) {
  try {
    const quotationId = Number.parseInt(params.id)
    const body = await request.json()
    const { message } = body

    // Mock creating message - replace with real database insert
    const newMessage = {
      id: Date.now(),
      senderId: 1, // Would come from auth
      senderName: "User",
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    if (!messagesStore[quotationId]) {
      messagesStore[quotationId] = []
    }
    messagesStore[quotationId].push(newMessage)

    return NextResponse.json({ message: newMessage }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
