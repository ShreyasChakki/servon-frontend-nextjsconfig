import { NextResponse } from "next/server"

export async function GET(request) {
  // Mock services data - replace with real database queries
  const services = [
    {
      id: 1,
      title: "Professional Web Development",
      provider: "Jane Provider",
      category: "Web Development",
      price: 2500,
      status: "approved",
    },
    {
      id: 2,
      title: "Modern Logo Design",
      provider: "Bob Designer",
      category: "Graphic Design",
      price: 500,
      status: "pending",
    },
    {
      id: 3,
      title: "Mobile App Development",
      provider: "Charlie Developer",
      category: "Mobile Development",
      price: 5000,
      status: "approved",
    },
    {
      id: 4,
      title: "SEO Optimization Package",
      provider: "Jane Provider",
      category: "Digital Marketing",
      price: 800,
      status: "pending",
    },
    {
      id: 5,
      title: "Brand Identity Design",
      provider: "Bob Designer",
      category: "Graphic Design",
      price: 1200,
      status: "approved",
    },
  ]

  return NextResponse.json({ services })
}
