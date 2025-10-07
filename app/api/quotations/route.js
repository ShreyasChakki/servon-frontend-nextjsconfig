import { NextResponse } from "next/server"

// Mock quotations data
const quotations = [
  {
    id: 1,
    serviceId: 1,
    service: "Professional Web Development",
    provider: "Jane Provider",
    details: "Need a responsive website for my small business with contact form and gallery",
    budget: 2500,
    deadline: "2025-11-15",
    status: "accepted",
    providerResponse: "I'd be happy to help! I can deliver a fully responsive website with all the features you need.",
    quotedPrice: 2400,
    createdAt: "2025-10-01",
    reviewed: false,
  },
  {
    id: 2,
    serviceId: 3,
    service: "Logo & Brand Identity Design",
    provider: "Creative Studio",
    details: "Looking for a modern logo for my tech startup",
    budget: 800,
    deadline: "2025-10-20",
    status: "pending",
    providerResponse: null,
    quotedPrice: null,
    createdAt: "2025-10-04",
    reviewed: false,
  },
  {
    id: 3,
    serviceId: 2,
    service: "Home Cleaning Service",
    provider: "Clean Pro",
    details: "Deep cleaning for 3-bedroom apartment",
    budget: 150,
    deadline: "2025-10-10",
    status: "completed",
    providerResponse: "We can do a thorough deep clean for your apartment.",
    quotedPrice: 150,
    createdAt: "2025-10-01",
    reviewed: false,
  },
]

export async function GET(request) {
  return NextResponse.json({ quotations })
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { serviceId, details, budget, deadline } = body

    // Mock creating quotation
    const newQuotation = {
      id: Date.now(),
      serviceId,
      details,
      budget,
      deadline,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({ quotation: newQuotation }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create quotation" }, { status: 500 })
  }
}
