// Shared services storage accessible by both customer and provider APIs
export const servicesStore = {
  services: [
    {
      id: 1,
      title: "Professional Web Development",
      description: "Custom websites and web applications built with modern technologies",
      category: "tech",
      price: 2500,
      rating: 4.9,
      reviews: 127,
      location: "New York, NY",
      image: "/web-dev-workspace.png",
      provider: { id: 2, name: "Jane Provider", avatar: null },
      providerId: 2,
      deliveryTime: "2-4 weeks",
      features: [
        "Responsive design for all devices",
        "SEO optimization included",
        "3 rounds of revisions",
        "Post-launch support for 30 days",
      ],
      views: 342,
      reviewsList: [
        {
          id: 1,
          name: "John Smith",
          rating: 5,
          comment: "Excellent work! Very professional and delivered on time.",
          date: "2 weeks ago",
          avatar: null,
        },
        {
          id: 2,
          name: "Sarah Johnson",
          rating: 5,
          comment: "Great communication throughout the project. Highly recommend!",
          date: "1 month ago",
          avatar: null,
        },
      ],
    },
    {
      id: 2,
      title: "Home Cleaning Service",
      description: "Deep cleaning for homes and apartments",
      category: "home",
      price: 150,
      rating: 4.8,
      reviews: 89,
      location: "Los Angeles, CA",
      image: "/clean-modern-home-interior-with-cleaning-supplies.jpg",
      provider: { id: 3, name: "Clean Pro", avatar: null },
      providerId: 3,
      deliveryTime: "Same day",
      features: ["Eco-friendly products", "Insured and bonded", "Flexible scheduling", "Satisfaction guaranteed"],
      views: 256,
      reviewsList: [
        {
          id: 3,
          name: "Mike Davis",
          rating: 5,
          comment: "My house has never looked better!",
          date: "1 week ago",
          avatar: null,
        },
      ],
    },
    {
      id: 3,
      title: "Logo & Brand Identity Design",
      description: "Professional logo design and complete brand identity packages",
      category: "design",
      price: 800,
      rating: 4.9,
      reviews: 156,
      location: "Chicago, IL",
      image: "/creative-design-workspace-with-logo-sketches-and-c.jpg",
      provider: { id: 4, name: "Creative Studio", avatar: null },
      providerId: 4,
      deliveryTime: "1-2 weeks",
      features: [
        "Multiple design concepts",
        "Unlimited revisions",
        "All file formats included",
        "Brand style guide",
        "Social media kit",
      ],
      views: 412,
      reviewsList: [
        {
          id: 4,
          name: "Emily Chen",
          rating: 5,
          comment: "Amazing designer! Captured our vision perfectly.",
          date: "3 days ago",
          avatar: null,
        },
      ],
    },
    {
      id: 4,
      title: "Business Consulting",
      description: "Strategic business consulting for startups and small businesses",
      category: "business",
      price: 500,
      rating: 4.7,
      reviews: 64,
      location: "Boston, MA",
      image: "/professional-business-meeting-with-charts-and-stra.jpg",
      provider: { id: 5, name: "Business Advisors", avatar: null },
      providerId: 5,
      deliveryTime: "Flexible",
      features: ["Market analysis", "Growth strategy", "Financial planning", "Ongoing support"],
      views: 189,
      reviewsList: [],
    },
    {
      id: 5,
      title: "Math & Science Tutoring",
      description: "One-on-one tutoring for high school and college students",
      category: "education",
      price: 75,
      rating: 4.9,
      reviews: 203,
      location: "Austin, TX",
      image: "/student-learning-with-books-and-educational-materi.jpg",
      provider: { id: 6, name: "Tutor Pro", avatar: null },
      providerId: 6,
      deliveryTime: "Flexible",
      features: ["Personalized lesson plans", "Homework help", "Test preparation", "Progress tracking"],
      views: 567,
      reviewsList: [],
    },
    {
      id: 6,
      title: "Mobile App Development",
      description: "iOS and Android app development services",
      category: "tech",
      price: 5000,
      rating: 4.8,
      reviews: 45,
      location: "San Francisco, CA",
      image: "/mobile-app-development-with-smartphone-and-code-in.jpg",
      provider: { id: 7, name: "App Developers Inc", avatar: null },
      providerId: 7,
      deliveryTime: "6-8 weeks",
      features: ["Native or cross-platform", "UI/UX design included", "App store submission", "6 months support"],
      views: 298,
      reviewsList: [],
    },
  ],
}

export function addService(service) {
  const newService = {
    ...service,
    id: Date.now(),
    rating: 0,
    reviews: 0,
    views: 0,
    reviewsList: [],
  }
  servicesStore.services.push(newService)
  return newService
}

const coordsByCity = {
  "New York, NY": { lat: 40.7128, lon: -74.006 },
  "Los Angeles, CA": { lat: 34.0522, lon: -118.2437 },
  "Chicago, IL": { lat: 41.8781, lon: -87.6298 },
  "Boston, MA": { lat: 42.3601, lon: -71.0589 },
  "Austin, TX": { lat: 30.2672, lon: -97.7431 },
  "San Francisco, CA": { lat: 37.7749, lon: -122.4194 },
}

function toRad(v) {
  return (v * Math.PI) / 180
}

function distanceKm(a, b) {
  if (!a || !b) return Number.POSITIVE_INFINITY
  const R = 6371 // km
  const dLat = toRad(b.lat - a.lat)
  const dLon = toRad(b.lon - a.lon)
  const la1 = toRad(a.lat)
  const la2 = toRad(b.lat)
  const sinDLat = Math.sin(dLat / 2)
  const sinDLon = Math.sin(dLon / 2)
  const h = sinDLat * sinDLat + Math.cos(la1) * Math.cos(la2) * sinDLon * sinDLon
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))
  return R * c
}

function resolveCoords({ lat, lon, city }) {
  if (typeof lat === "number" && typeof lon === "number") return { lat, lon }
  if (city && coordsByCity[city]) return coordsByCity[city]
  return null
}

export function getServices(filters = {}) {
  let filtered = [...servicesStore.services]

  // Filter by category/provider as before
  if (filters.category && filters.category !== "all") {
    filtered = filtered.filter((s) => s.category === filters.category)
  }
  if (filters.providerId) {
    filtered = filtered.filter((s) => s.providerId === filters.providerId)
  }

  if (filters.location) {
    const q = String(filters.location).toLowerCase()
    filtered = filtered.filter((s) => (s.location || "").toLowerCase().includes(q))
  }

  if (filters.lat != null && filters.lng != null) {
    const lat = Number(filters.lat)
    const lng = Number(filters.lng)
    const radiusKm = Number(filters.radiusKm) || 50 // default radius 50km
    filtered = filtered.filter((s) => {
      const coords = CITY_COORDS[s.location]
      if (!coords) return false
      const d = haversineDistanceKm(lat, lng, coords.lat, coords.lng)
      return d <= radiusKm
    })
  }

  if (filters) {
    const radiusKm = Number(filters.radiusKm || 25)
    const userPoint = resolveCoords({
      lat: typeof filters.lat === "string" ? Number(filters.lat) : filters.lat,
      lon: typeof filters.lon === "string" ? Number(filters.lon) : filters.lon,
      city: filters.locationCity,
    })

    if (userPoint) {
      filtered = filtered.filter((s) => {
        // try service coords via its location string
        const servicePoint = coordsByCity[s.location] || coordsByCity[s.provider?.location] || null
        const d = distanceKm(userPoint, servicePoint)
        return d <= radiusKm
      })
    }
  }

  if (filters.sortBy === "rating") {
    filtered.sort((a, b) => b.rating - a.rating)
  } else if (filters.sortBy === "price-low") {
    filtered.sort((a, b) => a.price - b.price)
  } else if (filters.sortBy === "price-high") {
    filtered.sort((a, b) => b.price - a.price)
  } else {
    // default sort can remain as-is or reviews/popularity
    filtered.sort((a, b) => b.reviews - a.reviews)
  }

  return filtered
}

export function getServiceById(id) {
  return servicesStore.services.find((s) => s.id === Number.parseInt(id))
}

export function updateService(id, updates) {
  const index = servicesStore.services.findIndex((s) => s.id === Number.parseInt(id))
  if (index !== -1) {
    servicesStore.services[index] = { ...servicesStore.services[index], ...updates }
    return servicesStore.services[index]
  }
  return null
}

export function deleteService(id) {
  const index = servicesStore.services.findIndex((s) => s.id === Number.parseInt(id))
  if (index !== -1) {
    servicesStore.services.splice(index, 1)
    return true
  }
  return false
}

const CITY_COORDS = {
  "New York, NY": { lat: 40.7128, lng: -74.006 },
  "Los Angeles, CA": { lat: 34.0522, lng: -118.2437 },
  "Chicago, IL": { lat: 41.8781, lng: -87.6298 },
  "Boston, MA": { lat: 42.3601, lng: -71.0589 },
  "Austin, TX": { lat: 30.2672, lng: -97.7431 },
  "San Francisco, CA": { lat: 37.7749, lng: -122.4194 },
}

function haversineDistanceKm(lat1, lon1, lat2, lon2) {
  const toRad = (v) => (v * Math.PI) / 180
  const R = 6371 // km
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Helpers to create and query reviews; and compute rating average on new review
export function addReviewForService(serviceId, { userId = 1, name = "Anonymous", rating, comment }) {
  const s = servicesStore.services.find((x) => x.id === Number(serviceId))
  if (!s) return null
  const now = new Date()
  const review = {
    id: Date.now(),
    userId,
    name,
    rating: Number(rating),
    comment,
    date: now.toISOString(),
    avatar: null,
  }
  s.reviewsList = Array.isArray(s.reviewsList) ? s.reviewsList : []
  const prevCount = Number(s.reviews || 0)
  const prevAvg = Number(s.rating || 0)
  const newCount = prevCount + 1
  const newAvg = Number(((prevAvg * prevCount + review.rating) / newCount).toFixed(2))
  s.reviewsList.unshift(review)
  s.reviews = newCount
  s.rating = newAvg
  return review
}

export function getReviewsByService(serviceId) {
  const s = servicesStore.services.find((x) => x.id === Number(serviceId))
  return s?.reviewsList ?? []
}

export function getReviewsByUser(userId = 1) {
  const out = []
  for (const s of servicesStore.services) {
    if (!Array.isArray(s.reviewsList)) continue
    for (const r of s.reviewsList) {
      if (r.userId === Number(userId)) {
        out.push({ ...r, serviceId: s.id, serviceTitle: s.title })
      }
    }
  }
  return out
}
