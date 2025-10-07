import { NextResponse } from "next/server"

// Mock quotations data
const quotations = [
  {
    id: 1,
    service: "Professional Web Development",
    customer: "John Customer",
    details: "Need a responsive website for my small business with contact form and gallery",
    budget: 2500,
    deadline: "2025-11-15",
    status: "accepted",
    response: "I'd be happy to help! I can deliver a fully responsive website with all the features you need.",
    quotedPrice: 2400,
    createdAt: "2025-10-01",
  },
  {
    id: 2,
    service: "Professional Web Development",
    customer: "Sarah Smith",
    details: "E-commerce website with payment integration",
    budget: 5000,
    deadline: "2025-12-01",
    status: "pending",
    response: null,
    quotedPrice: null,
    createdAt: "2025-10-04",
  },
]

export async function GET(request) {
  return NextResponse.json({ quotations })
}
