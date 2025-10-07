export const db = {
  user: {
    id: "1",
    name: "John Doe",
    email: "user@example.com",
    phone: "",
    bio: "",
    location: "",
    role: "customer",
    avatar: "/placeholder.svg",
    createdAt: new Date("2024-01-01").toISOString(),
  },
  savedServices: [
    // initial saved services (same as previous mock)
    {
      id: "1",
      title: "Professional House Cleaning",
      category: "Home Services",
      price: 150,
      rating: 4.8,
      reviews: 124,
      location: "New York, NY",
    },
    {
      id: "2",
      title: "Expert Plumbing Services",
      category: "Home Services",
      price: 200,
      rating: 4.9,
      reviews: 89,
      location: "New York, NY",
    },
    {
      id: "3",
      title: "Lawn Care & Maintenance",
      category: "Outdoor Services",
      price: 120,
      rating: 4.7,
      reviews: 156,
      location: "Brooklyn, NY",
    },
    {
      id: "4",
      title: "Interior Design Consultation",
      category: "Design Services",
      price: 300,
      rating: 5.0,
      reviews: 45,
      location: "Manhattan, NY",
    },
  ],
  bookings: [
    // include paymentStatus and keep earlier mock fields
    {
      id: "1",
      serviceName: "Professional House Cleaning",
      category: "Home Services",
      providerName: "Clean Pro Services",
      providerId: "provider1",
      date: "May 15, 2024 at 10:00 AM",
      location: "123 Main St, New York, NY",
      amount: 150,
      status: "active",
      paymentStatus: "pending",
      description: "Deep cleaning of 3-bedroom apartment including kitchen and bathrooms",
    },
    {
      id: "2",
      serviceName: "Plumbing Repair",
      category: "Home Services",
      providerName: "Quick Fix Plumbing",
      providerId: "provider2",
      date: "May 12, 2024 at 2:00 PM",
      location: "123 Main St, New York, NY",
      amount: 200,
      status: "active",
      paymentStatus: "pending",
      description: "Fix leaking kitchen sink and replace faucet",
    },
    {
      id: "3",
      serviceName: "Lawn Maintenance",
      category: "Outdoor Services",
      providerName: "Green Thumb Landscaping",
      providerId: "provider3",
      date: "May 8, 2024",
      location: "123 Main St, New York, NY",
      amount: 120,
      status: "completed",
      paymentStatus: "paid",
      description: "Monthly lawn mowing and trimming service",
    },
    {
      id: "4",
      serviceName: "AC Installation",
      category: "Home Services",
      providerName: "Cool Air HVAC",
      providerId: "provider4",
      date: "April 28, 2024",
      location: "123 Main St, New York, NY",
      amount: 800,
      status: "completed",
      paymentStatus: "paid",
      description: "Installation of new central air conditioning unit",
    },
    {
      id: "5",
      serviceName: "Interior Painting",
      category: "Home Services",
      providerName: "Perfect Paint Co",
      providerId: "provider5",
      date: "April 15, 2024",
      location: "123 Main St, New York, NY",
      amount: 450,
      status: "cancelled",
      paymentStatus: "pending",
      description: "Paint living room and bedroom - cancelled due to scheduling conflict",
    },
  ],
}

export function getUser() {
  return db.user
}
export function updateUser(patch) {
  db.user = { ...db.user, ...patch }
  return db.user
}

export function getSavedServices() {
  return db.savedServices
}
export function addSavedService(service) {
  const exists = db.savedServices.some((s) => s.id === service.id)
  if (!exists) {
    db.savedServices.unshift(service)
  }
  return db.savedServices
}
export function removeSavedService(id) {
  db.savedServices = db.savedServices.filter((s) => s.id !== id)
  return db.savedServices
}

export function getBookings() {
  return db.bookings
}
export function setBookingPaid(id) {
  db.bookings = db.bookings.map((b) => (b.id === id ? { ...b, paymentStatus: "paid" } : b))
  return db.bookings.find((b) => b.id === id)
}

export function computeSpendingBreakdown() {
  const paid = db.bookings.filter((b) => b.paymentStatus === "paid")
  const total = paid.reduce((sum, b) => sum + (Number(b.amount) || 0), 0)
  const byService = {}
  const byMonth = {}
  for (const b of paid) {
    byService[b.serviceName] = (byService[b.serviceName] || 0) + (Number(b.amount) || 0)
    // naive month parsing from date string
    const month = (b.date || "").split(" ")[0] || "Unknown"
    byMonth[month] = (byMonth[month] || 0) + (Number(b.amount) || 0)
  }
  return { total, byService, byMonth }
}
