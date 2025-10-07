"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { Search, Star, Filter, MapPin, Crosshair } from "lucide-react"

const categories = [
  "All Categories",
  "Web Development",
  "Mobile Development",
  "UI/UX Design",
  "Digital Marketing",
  "Content Writing",
  "Video Editing",
  "Photography",
  "Consulting",
  "Other",
]

export default function ServicesPage() {
  const [services, setServices] = useState([])
  const [filteredServices, setFilteredServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [sortBy, setSortBy] = useState("popular")
  const [userCity, setUserCity] = useState("")
  const [radiusKm, setRadiusKm] = useState("25")
  const [geoAllowed, setGeoAllowed] = useState(false)
  const [coords, setCoords] = useState(null)

  useEffect(() => {
    fetchServices()
  }, [userCity, radiusKm]) // refetch when location settings change

  useEffect(() => {
    filterAndSortServices()
  }, [services, searchQuery, selectedCategory, sortBy])

  const fetchServices = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (userCity) params.set("location", userCity)
      if (coords?.lat && coords?.lon) {
        params.set("lat", String(coords.lat))
        params.set("lon", String(coords.lon))
      }
      if (radiusKm) params.set("radiusKm", radiusKm)

      const url = params.toString() ? `/api/services?${params.toString()}` : "/api/services"
      const response = await fetch(url)
      const data = await response.json()
      setServices(data.services || [])
    } catch (error) {
      console.error("[v0] Failed to fetch services:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortServices = () => {
    let filtered = [...services]

    if (selectedCategory !== "All Categories") {
      filtered = filtered.filter((service) => service.category === selectedCategory)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (service) =>
          service.title.toLowerCase().includes(query) ||
          service.description.toLowerCase().includes(query) ||
          service.provider.name.toLowerCase().includes(query),
      )
    }

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "popular":
      default:
        filtered.sort((a, b) => b.reviews - a.reviews)
        break
    }

    setFilteredServices(filtered)
  }

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoAllowed(true)
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude })
      },
      () => {
        setGeoAllowed(false)
      },
      { enableHighAccuracy: true, timeout: 8000 },
    )
  }

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Browse Services</h1>
          <p className="text-muted-foreground mt-1">
            Find the perfect service for your needs{userCity || coords ? ` near your area` : ""}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* New: Location + Radius */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Enter city (e.g., New York, NY)"
                value={userCity}
                onChange={(e) => setUserCity(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={handleUseMyLocation}>
              <Crosshair className="mr-2 h-4 w-4" />
              Use my location
            </Button>
            <Select value={radiusKm} onValueChange={setRadiusKm}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Radius" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 km</SelectItem>
                <SelectItem value="25">25 km</SelectItem>
                <SelectItem value="50">50 km</SelectItem>
                <SelectItem value="100">100 km</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filter count + Clear */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredServices.length} {filteredServices.length === 1 ? "service" : "services"} found
            </p>
            {(selectedCategory !== "All Categories" || searchQuery) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedCategory("All Categories")
                  setSearchQuery("")
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <Card>
                  <div className="h-48 bg-muted rounded-t-lg" />
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2 mt-2" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-5/6 mt-2" />
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No services found matching your criteria</p>
            <Button
              onClick={() => {
                setSelectedCategory("All Categories")
                setSearchQuery("")
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => (
              <Link key={service.id} href={`/services/${service.id}`}>
                <Card className="h-full hover:border-primary transition-colors cursor-pointer">
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <img
                      src={service.image || "/placeholder.svg?height=200&width=400"}
                      alt={service.title}
                      className="h-full w-full object-cover"
                    />
                    <Badge className="absolute top-3 right-3">{service.category}</Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{service.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <img
                        src={service.provider.avatar || "/placeholder.svg"}
                        alt={service.provider.name}
                        className="h-6 w-6 rounded-full"
                      />
                      <span>{service.provider.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{service.rating}</span>
                        <span className="text-sm text-muted-foreground">({service.reviews})</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Starting at</p>
                        <p className="text-lg font-bold">${service.price}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Optional: Small AI helper button for this page */}
        {/* You can uncomment the next line to add a small helper on this page: */}
        {/* <div className="fixed bottom-4 right-4 z-50"><ChatbotWidget /></div> */}
      </div>
    </div>
  )
}
