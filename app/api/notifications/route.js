import { NextResponse } from "next/server"

// Mock notifications data
const notifications = [
  {
    id: 1,
    title: "New Quotation Response",
    message: "Jane Provider responded to your quotation request",
    timestamp: "2 hours ago",
    read: false,
    link: "/customer/quotations",
  },
  {
    id: 2,
    title: "New Message",
    message: "You have a new message from Jane Provider",
    timestamp: "5 hours ago",
    read: false,
    link: "/customer/chat/1",
  },
  {
    id: 3,
    title: "Service Completed",
    message: "Your web development project has been marked as complete",
    timestamp: "1 day ago",
    read: true,
    link: "/customer/quotations",
  },
]

export async function GET(request) {
  return NextResponse.json({ notifications })
}
