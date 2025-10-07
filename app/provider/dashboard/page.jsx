"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { DollarSign, FileText, Star, TrendingUp, Plus } from "lucide-react"

function ProviderDashboardContent() {
  const { user, token } = useAuth()
  const [stats, setStats] = useState({
    totalEarnings: 0,
    pendingQuotations: 0,
    activeProjects: 0,
    averageRating: 0,
  })
  const [recentQuotations, setRecentQuotations] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const [statsRes, quotationsRes, servicesRes] = await Promise.all([
        fetch("/api/provider/stats", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/provider/quotations", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/provider/services", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      const statsData = await statsRes.json()
      const quotationsData = await quotationsRes.json()
      const servicesData = await servicesRes.json()

      setStats(statsData.stats)
      setRecentQuotations(quotationsData.quotations.slice(0, 5))
      setServices(servicesData.services)
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Provider Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your services and quotations</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Link href="/provider/earnings">
            <Card className="cursor-pointer hover:border-primary transition-colors bg-card/60 shadow-sm outline outline-1 outline-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.totalEarnings}</div>
                <p className="text-xs text-muted-foreground mt-1">All time</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/provider/quotations">
            <Card className="cursor-pointer hover:border-primary transition-colors bg-card/60 shadow-sm outline outline-1 outline-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending Quotations</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingQuotations}</div>
                <p className="text-xs text-muted-foreground mt-1">Awaiting response</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/provider/services">
            <Card className="cursor-pointer hover:border-primary transition-colors bg-card/60 shadow-sm outline outline-1 outline-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeProjects}</div>
                <p className="text-xs text-muted-foreground mt-1">In progress</p>
              </CardContent>
            </Card>
          </Link>

          <Card className="bg-card/60 shadow-sm outline outline-1 outline-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageRating}</div>
              <p className="text-xs text-muted-foreground mt-1">From reviews</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Recent Quotations */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Quotation Requests</CardTitle>
                    <CardDescription>Respond to customer inquiries</CardDescription>
                  </div>
                  <Button variant="outline" asChild>
                    <Link href="/provider/quotations">View All</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-20 bg-muted rounded" />
                      </div>
                    ))}
                  </div>
                ) : recentQuotations.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No quotation requests yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentQuotations.map((quotation) => (
                      <div
                        key={quotation.id}
                        className="flex items-start gap-4 p-4 rounded-lg border border-border bg-card/50 shadow-sm"
                      >
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-medium">{quotation.service}</p>
                              <p className="text-sm text-muted-foreground line-clamp-1">{quotation.details}</p>
                            </div>
                            <Badge variant={quotation.status === "pending" ? "outline" : "secondary"}>
                              {quotation.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>Budget: ${quotation.budget}</span>
                            <span>•</span>
                            <span>Deadline: {quotation.deadline}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* My Services */}
          <div className="lg:col-span-1">
            <Card className="bg-card/60 shadow-sm outline outline-1 outline-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>My Services</CardTitle>
                  <Button size="sm" asChild>
                    <Link href="/provider/services/new">
                      <Plus className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <CardDescription>Manage your offerings (view-only list)</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-16 bg-muted rounded" />
                      </div>
                    ))}
                  </div>
                ) : services.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-sm text-muted-foreground mb-3">No services yet</p>
                    <Button size="sm" asChild>
                      <Link href="/provider/services/new">Create Service</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className="p-3 rounded-lg border border-border bg-card/50 shadow-sm cursor-default"
                        aria-disabled="true"
                        role="article"
                      >
                        <p className="font-medium text-sm line-clamp-1">{service.title}</p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="outline" className="text-xs">
                            {service.category}
                          </Badge>
                          <span className="text-sm font-semibold">${service.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Button asChild>
            <Link href="/provider/services/new">
              <Plus className="h-4 w-4 mr-2" />
              Create New Service
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/provider/quotations">View All Quotations</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/provider/earnings">View Earnings</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function ProviderDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["provider"]}>
      <ProviderDashboardContent />
    </ProtectedRoute>
  )
}
