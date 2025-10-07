"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { MessageSquare, X, Star } from "lucide-react"
import { ReviewModal } from "@/components/review-modal"

function CustomerQuotationsContent() {
  const { token } = useAuth()
  const [quotations, setQuotations] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [reviewingQuotation, setReviewingQuotation] = useState(null)
  const [myReviews, setMyReviews] = useState([])
  const [loadingReviews, setLoadingReviews] = useState(false)

  useEffect(() => {
    fetchQuotations()
  }, [])

  useEffect(() => {
    const fetchMyReviews = async () => {
      try {
        setLoadingReviews(true)
        // In a real app, pass the authenticated user id; mock as 1
        const res = await fetch("/api/reviews?userId=1", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        setMyReviews(data.reviews || [])
      } catch (e) {
        console.error("Failed to fetch my reviews:", e)
      } finally {
        setLoadingReviews(false)
      }
    }
    fetchMyReviews()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchQuotations = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/quotations", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      setQuotations(data.quotations)
    } catch (error) {
      console.error("Failed to fetch quotations:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelQuotation = async (id) => {
    const ok = typeof window !== "undefined" ? window.confirm("Cancel this request?") : true
    if (!ok) return
    // optimistic update
    setQuotations((prev) => prev.filter((q) => q.id !== id))
    try {
      await fetch(`/api/quotations/${id}/cancel`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      })
    } catch (error) {
      console.error("Failed to cancel quotation:", error)
      // fallback: re-fetch to sync
      fetchQuotations()
    }
  }

  const filteredQuotations = quotations.filter((q) => {
    if (activeTab === "all") return true
    if (activeTab === "pending") return q.status === "pending"
    if (activeTab === "accepted") return q.status === "accepted"
    if (activeTab === "completed") return q.status === "completed"
    return true
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "outline"
      case "accepted":
        return "secondary"
      case "completed":
        return "default"
      case "rejected":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="min-h-screen">
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">My Quotations</h1>
          <p className="text-muted-foreground mt-1">Manage your service requests</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="accepted">Accepted</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-muted rounded w-1/3" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : filteredQuotations.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No quotations found</p>
                  <Button asChild>
                    <Link href="/services">Browse Services</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredQuotations.map((quotation) => (
                  <Card key={quotation.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle>{quotation.service}</CardTitle>
                            <Badge variant={getStatusColor(quotation.status)}>{quotation.status}</Badge>
                          </div>
                          <CardDescription>Provider: {quotation.provider}</CardDescription>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Budget</p>
                          <p className="text-xl font-bold">${quotation.budget}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium mb-1">Project Details</p>
                          <p className="text-sm text-muted-foreground">{quotation.details}</p>
                        </div>

                        {quotation.providerResponse && (
                          <div className="p-4 rounded-lg bg-muted">
                            <p className="text-sm font-medium mb-1">Provider Response</p>
                            <p className="text-sm text-muted-foreground">{quotation.providerResponse}</p>
                            {quotation.quotedPrice && (
                              <p className="text-sm font-semibold mt-2">Quoted Price: ${quotation.quotedPrice}</p>
                            )}
                          </div>
                        )}

                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>Deadline: {quotation.deadline}</span>
                          <span>•</span>
                          <span>Requested: {quotation.createdAt}</span>
                        </div>

                        <div className="flex gap-3">
                          {quotation.status === "accepted" && (
                            <Button asChild>
                              <Link href={`/customer/chat/${quotation.id}`}>
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Open Chat
                              </Link>
                            </Button>
                          )}

                          {quotation.status === "completed" && !quotation.reviewed && (
                            <Button onClick={() => setReviewingQuotation(quotation)}>
                              <Star className="h-4 w-4 mr-2" />
                              Leave Review
                            </Button>
                          )}

                          {quotation.status === "pending" && (
                            <Button
                              variant="outline"
                              onClick={() => handleCancelQuotation(quotation.id)}
                              className="text-destructive"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Cancel Request
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">My Reviews</h2>
        {loadingReviews ? (
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-1/3" />
            <div className="h-4 bg-muted rounded w-2/3" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        ) : myReviews.length === 0 ? (
          <p className="text-muted-foreground text-sm">You haven't submitted any reviews yet.</p>
        ) : (
          <div className="space-y-3">
            {myReviews.map((r) => (
              <Card key={r.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">{r.serviceTitle}</CardTitle>
                      <Badge variant="outline">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${i < r.rating ? "fill-yellow-400 text-yellow-400" : ""}`}
                          />
                        ))}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">{new Date(r.date).toLocaleDateString()}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{r.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {reviewingQuotation && (
        <ReviewModal
          quotation={reviewingQuotation}
          onClose={() => setReviewingQuotation(null)}
          onSuccess={() => {
            setReviewingQuotation(null)
            fetchQuotations()
          }}
        />
      )}
    </div>
  )
}

export default function CustomerQuotationsPage() {
  return (
    <ProtectedRoute allowedRoles={["customer"]}>
      <CustomerQuotationsContent />
    </ProtectedRoute>
  )
}
