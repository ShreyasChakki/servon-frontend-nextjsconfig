"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MapPin, Clock, CheckCircle2, Heart } from "lucide-react"
import { QuotationRequestModal } from "@/components/quotation-request-modal"

export default function ServiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated, user, token } = useAuth()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showQuotationModal, setShowQuotationModal] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    fetchService()
    // initialize favorite state
    initFavorite()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

  const initFavorite = async () => {
    try {
      const res = await fetch("/api/customer/saved-services", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      const data = await res.json()
      const saved = (data.services || []).some((s) => String(s.id) === String(params.id))
      setIsFavorite(saved)
    } catch (e) {
      // non-fatal
    }
  }

  const fetchService = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/services/${params.id}`)
      const data = await response.json()
      setService(data.service)
    } catch (error) {
      console.error("Failed to fetch service:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRequestQuotation = () => {
    if (!isAuthenticated) {
      router.push("/login/customer")
      return
    }
    setShowQuotationModal(true)
  }

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      router.push("/login/customer")
      return
    }
    try {
      if (!isFavorite) {
        await fetch("/api/customer/saved-services", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            service: {
              id: service.id,
              title: service.title,
              category: service.category,
              price: service.price,
              rating: service.rating,
              reviews: service.reviews,
              location: service.location,
            },
          }),
        })
        setIsFavorite(true)
      } else {
        await fetch(`/api/customer/saved-services/${service.id}`, {
          method: "DELETE",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        setIsFavorite(false)
      }
    } catch (e) {
      console.error("Favorite toggle failed:", e)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Service not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative h-96 bg-muted rounded-lg overflow-hidden">
              <img
                src={service.image || `/placeholder.svg?height=400&width=800&query=${service.title}`}
                alt={service.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Reviews placed right after hero */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Reviews</h2>
              <div className="space-y-4">
                {(service.reviewsList || []).length === 0 ? (
                  <p className="text-sm text-muted-foreground">No reviews yet.</p>
                ) : (
                  service.reviewsList.map((review) => (
                    <Card key={review.id} className="bg-card">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={review.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{review.name?.[0] || "U"}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{review.name || "Anonymous"}</p>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {review.date ? new Date(review.date).toLocaleDateString() : ""}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>

            <Separator />

            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{service.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-foreground">{service.rating}</span>
                      <span>({service.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{service.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>{service.category}</Badge>
                  <Button variant="outline" size="icon" onClick={handleToggleFavorite}>
                    <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                  </Button>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed">{service.description}</p>
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-semibold mb-4">What's Included</h2>
              <ul className="space-y-3">
                {service.features?.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4 bg-card">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={service.provider?.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{service.provider?.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{service.provider?.name}</p>
                    <p className="text-sm text-muted-foreground">Service Provider</p>
                  </div>
                </div>
                <Separator />
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Starting Price</p>
                  <p className="text-3xl font-bold">${service.price}</p>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{service.deliveryTime} delivery</span>
                </div>

                <Button className="w-full" size="lg" onClick={handleRequestQuotation}>
                  Request Quotation
                </Button>

                <p className="text-xs text-center text-muted-foreground">Get a custom quote for your specific needs</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {showQuotationModal && (
        <QuotationRequestModal
          service={service}
          onClose={() => setShowQuotationModal(false)}
          onSuccess={() => {
            setShowQuotationModal(false)
            router.push("/customer/quotations")
          }}
        />
      )}
    </div>
  )
}
