"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Link from "next/link"
import { FileText, CheckCircle2, Star, Briefcase, DollarSign, Heart, MapPin } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

function CustomerDashboardContent() {
  const { user, token } = useAuth()
  const [stats, setStats] = useState({
    activeQuotations: 0,
    pendingResponses: 0,
    completedServices: 0,
    totalSpent: 0,
    activeBookings: 0,
    pendingQuotations: 0,
    savedServices: 0,
    breakdown: { byService: {}, byMonth: {} },
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [savedServicesList, setSavedServicesList] = useState([])
  const [loading, setLoading] = useState(true)
  const [showSavedServices, setShowSavedServices] = useState(false)
  const [showSpent, setShowSpent] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const [statsRes, activityRes, recsRes] = await Promise.all([
        fetch("/api/customer/stats", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/customer/activity", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/customer/recommendations", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      const statsData = await statsRes.json()
      const activityData = await activityRes.json()
      const recsData = await recsRes.json()

      setStats(statsData.stats)
      setRecentActivity(activityData.activity)
      setRecommendations(recsData.recommendations)
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSavedServices = async () => {
    try {
      const response = await fetch("/api/customer/saved-services", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      setSavedServicesList(data.services || [])
      setShowSavedServices(true)
    } catch (error) {
      console.error("Failed to fetch saved services:", error)
    }
  }

  const handleRemoveFavorite = async (serviceId) => {
    try {
      const response = await fetch(`/api/customer/saved-services/${serviceId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        setSavedServicesList((prev) => prev.filter((service) => service.id !== serviceId))
        setStats((prev) => ({ ...prev, savedServices: Math.max(0, (prev.savedServices || 0) - 1) }))

        toast({
          title: "Removed from favorites",
          description: "Service has been removed from your saved list.",
        })
      }
    } catch (error) {
      console.error("Failed to remove favorite:", error)
      toast({
        title: "Error",
        description: "Failed to remove service from favorites.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-[rgba(245,239,239,1)]">
      <div className="border-b border-border bg-[rgba(245,239,239,1)] text-[rgba(10,10,10,1)]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Welcome back, {user?.name}</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your services</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-[rgba(245,239,239,1)] border-destructive border-solid text-sidebar-accent-foreground font-normal text-xl shadow font-mono">
        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Link href="/customer/bookings">
            <Card className="cursor-pointer hover:border-primary transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeBookings}</div>
                <p className="text-xs text-muted-foreground mt-1">In progress</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/customer/quotations">
            <Card className="cursor-pointer hover:border-primary transition-colors">
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

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completed Services</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedServices}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setShowSpent(true)}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalSpent}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:border-primary transition-colors" onClick={fetchSavedServices}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Saved Services</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.savedServices}</div>
              <p className="text-xs text-muted-foreground mt-1">Favorites</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest quotations and services</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-16 bg-muted rounded" />
                      </div>
                    ))}
                  </div>
                ) : recentActivity.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No recent activity</p>
                    <Button asChild>
                      <Link href="/services">Browse Services</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg border border-border">
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-medium">{activity.title}</p>
                              <p className="text-sm text-muted-foreground">{activity.service}</p>
                            </div>
                            <Badge
                              variant={
                                activity.status === "completed"
                                  ? "default"
                                  : activity.status === "accepted"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {activity.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">{activity.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* AI Recommendations */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Recommended for You</CardTitle>
                <CardDescription>Services you might like</CardDescription>
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
                ) : (
                  <div className="space-y-4">
                    {recommendations.map((rec) => (
                      <Link key={rec.id} href={`/services/${rec.id}`}>
                        <div className="p-3 rounded-lg border border-border hover:border-accent transition-colors">
                          <p className="font-medium text-sm line-clamp-1">{rec.title}</p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1 text-xs">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span>{rec.rating}</span>
                            </div>
                            <span className="text-sm font-semibold">${rec.price}</span>
                          </div>
                        </div>
                      </Link>
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
            <Link href="/services">Browse Services</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/customer/quotations">View All Quotations</Link>
          </Button>
        </div>
      </div>

      {/* Saved Services Dialog */}
      <Dialog open={showSavedServices} onOpenChange={setShowSavedServices}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Saved Services</DialogTitle>
            <DialogDescription>Your favorite services for quick access</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 md:grid-cols-2 mt-4">
            {savedServicesList.length === 0 ? (
              <div className="col-span-2 text-center py-8">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No saved services yet</p>
                <Button asChild>
                  <Link href="/services">Browse Services</Link>
                </Button>
              </div>
            ) : (
              savedServicesList.map((service) => (
                <Card key={service.id} className="hover:border-primary transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{service.title}</CardTitle>
                        <CardDescription className="mt-1">{service.category}</CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleRemoveFavorite(service.id)}
                      >
                        <Heart className="h-5 w-5 fill-red-500 text-red-500 hover:fill-none transition-all" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{service.rating}</span>
                      <span className="text-muted-foreground">({service.reviews} reviews)</span>
                    </div>
                    {service.location && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {service.location}
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-lg font-bold">${service.price}</span>
                      <Button size="sm" asChild>
                        <Link href={`/services/${service.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSpent} onOpenChange={setShowSpent}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Spending Summary</DialogTitle>
            <DialogDescription>Breakdown of your total spending by service and by month</DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium mb-2">By Service</p>
              <div className="space-y-2">
                {Object.keys(stats.breakdown?.byService || {}).length === 0 ? (
                  <p className="text-muted-foreground text-sm">No paid services yet.</p>
                ) : (
                  Object.entries(stats.breakdown.byService).map(([name, amount]) => (
                    <div key={name} className="flex items-center justify-between text-sm">
                      <span className="text-pretty">{name}</span>
                      <span className="font-semibold">${amount}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">By Month</p>
              <div className="space-y-2">
                {Object.keys(stats.breakdown?.byMonth || {}).length === 0 ? (
                  <p className="text-muted-foreground text-sm">No spending recorded.</p>
                ) : (
                  Object.entries(stats.breakdown.byMonth).map(([month, amount]) => (
                    <div key={month} className="flex items-center justify-between text-sm">
                      <span>{month}</span>
                      <span className="font-semibold">${amount}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function CustomerDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["customer"]}>
      <CustomerDashboardContent />
    </ProtectedRoute>
  )
}
