"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare } from "lucide-react"
import Link from "next/link"
import { QuotationResponseModal } from "@/components/quotation-response-modal"

function ProviderQuotationsContent() {
  const { token } = useAuth()
  const [quotations, setQuotations] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [respondingTo, setRespondingTo] = useState(null)

  useEffect(() => {
    fetchQuotations()
  }, [])

  const fetchQuotations = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/provider/quotations", {
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
          <h1 className="text-3xl font-bold">Quotation Requests</h1>
          <p className="text-muted-foreground mt-1">Respond to customer inquiries</p>
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
                  <p className="text-muted-foreground">No quotations found</p>
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
                          <CardDescription>Customer: {quotation.customer}</CardDescription>
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

                        {quotation.response && (
                          <div className="p-4 rounded-lg bg-muted">
                            <p className="text-sm font-medium mb-1">Your Response</p>
                            <p className="text-sm text-muted-foreground">{quotation.response}</p>
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
                          {quotation.status === "pending" && (
                            <Button onClick={() => setRespondingTo(quotation)}>Respond to Request</Button>
                          )}

                          {quotation.status === "accepted" && (
                            <Button asChild>
                              <Link href={`/provider/chat/${quotation.id}`}>
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Open Chat
                              </Link>
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

      {respondingTo && (
        <QuotationResponseModal
          quotation={respondingTo}
          onClose={() => setRespondingTo(null)}
          onSuccess={() => {
            setRespondingTo(null)
            fetchQuotations()
          }}
        />
      )}
    </div>
  )
}

export default function ProviderQuotationsPage() {
  return (
    <ProtectedRoute allowedRoles={["provider"]}>
      <ProviderQuotationsContent />
    </ProtectedRoute>
  )
}
