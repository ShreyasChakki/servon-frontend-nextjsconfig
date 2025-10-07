"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Calendar, MapPin, DollarSign, User, MessageSquare, CheckCircle2, Clock, XCircle } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import ReviewModal from "@/components/review-modal"

function CustomerBookingsContent() {
  const { user, token } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("active")
  const [payingId, setPayingId] = useState(null)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [reviewingBooking, setReviewingBooking] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/customer/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await response.json()
      setBookings(data.bookings || [])
    } catch (error) {
      console.error("Failed to fetch bookings:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <Clock className="h-4 w-4" />
      case "completed":
        return <CheckCircle2 className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case "active":
        return "default"
      case "completed":
        return "secondary"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  const filterBookings = (status) => {
    if (status === "all") return bookings
    return bookings.filter((booking) => booking.status === status)
  }

  const handleMakePayment = async (id) => {
    // simulate UPI modal open
    setPayingId(id)
  }

  const confirmPayment = async () => {
    if (!payingId) return
    try {
      // pretend we opened a UPI app/link and returned success
      await new Promise((r) => setTimeout(r, 800))
      const res = await fetch(`/api/customer/bookings/${payingId}/pay`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setBookings((prev) => prev.map((b) => (b.id === payingId ? { ...b, paymentStatus: "paid" } : b)))
        toast({ title: "Payment successful", description: "Booking marked as Paid." })
      } else {
        toast({ title: "Payment failed", description: "Please try again.", variant: "destructive" })
      }
    } catch {
      toast({ title: "Payment failed", description: "Please try again.", variant: "destructive" })
    } finally {
      setPayingId(null)
    }
  }

  const BookingCard = ({ booking }) => (
    <Card className="hover:border-primary transition-colors">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{booking.serviceName}</CardTitle>
            <CardDescription className="mt-1">{booking.category}</CardDescription>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={getStatusVariant(booking.status)} className="flex items-center gap-1">
              {getStatusIcon(booking.status)}
              {booking.status}
            </Badge>
            <Badge variant={booking.paymentStatus === "paid" ? "secondary" : "outline"}>
              {booking.paymentStatus === "paid" ? "Paid" : "Pending"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Provider:</span>
            <span className="font-medium">{booking.providerName}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Date:</span>
            <span className="font-medium">{booking.date}</span>
          </div>

          {booking.location && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Location:</span>
              <span className="font-medium">{booking.location}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Amount:</span>
            <span className="font-medium text-lg">${booking.amount}</span>
          </div>
        </div>

        {booking.description && (
          <div className="pt-3 border-t border-border">
            <p className="text-sm text-muted-foreground">{booking.description}</p>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {booking.status === "active" && (
            <>
              <Button size="sm" asChild className="flex-1">
                <Link href={`/customer/chat/${booking.providerId}`}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message Provider
                </Link>
              </Button>
              <Button size="sm" variant="outline" onClick={() => setSelectedBooking(booking)}>
                View Details
              </Button>
              {booking.paymentStatus !== "paid" && (
                <Button size="sm" className="flex-1" onClick={() => handleMakePayment(booking.id)}>
                  Make Payment
                </Button>
              )}
            </>
          )}
          {booking.status === "completed" && (
            <Button
              size="sm"
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => setReviewingBooking(booking)}
            >
              Leave Review
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <p className="text-muted-foreground mt-1">Manage and track your service bookings</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="active">Active ({filterBookings("active").length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({filterBookings("completed").length})</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled ({filterBookings("cancelled").length})</TabsTrigger>
            <TabsTrigger value="all">All ({bookings.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {loading ? (
              <div className="grid gap-4 md:grid-cols-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-64 bg-muted rounded-lg" />
                  </div>
                ))}
              </div>
            ) : filterBookings("active").length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">No active bookings</p>
                  <p className="text-muted-foreground mb-4">Browse services to get started</p>
                  <Button asChild>
                    <Link href="/services">Browse Services</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filterBookings("active").map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {filterBookings("completed").length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">No completed bookings</p>
                  <p className="text-muted-foreground">Your completed services will appear here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filterBookings("completed").map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4">
            {filterBookings("cancelled").length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <XCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">No cancelled bookings</p>
                  <p className="text-muted-foreground">Your cancelled services will appear here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filterBookings("cancelled").map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            {bookings.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">No bookings yet</p>
                  <p className="text-muted-foreground mb-4">Start booking services to see them here</p>
                  <Button asChild>
                    <Link href="/services">Browse Services</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {bookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!payingId} onOpenChange={() => setPayingId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Make UPI Payment</DialogTitle>
            <DialogDescription>Select your UPI app and confirm to continue</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <div className="p-3 rounded border border-border">Razorpay UPI</div>
            <div className="p-3 rounded border border-border">Google Pay</div>
            <div className="p-3 rounded border border-border">Paytm</div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setPayingId(null)}>
              Cancel
            </Button>
            <Button onClick={confirmPayment}>Proceed</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>Complete information about your booking</DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service</span>
                <span className="font-medium">{selectedBooking.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Provider</span>
                <span className="font-medium">{selectedBooking.providerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium">{selectedBooking.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">{selectedBooking.date}</span>
              </div>
              {selectedBooking.location && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-medium">{selectedBooking.location}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-bold">${selectedBooking.amount}</span>
              </div>
              {selectedBooking.description && (
                <div className="pt-2">
                  <p className="text-muted-foreground">{selectedBooking.description}</p>
                </div>
              )}
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setSelectedBooking(null)}>
              Close
            </Button>
            {selectedBooking?.status === "completed" && (
              <Button
                onClick={() => {
                  setReviewingBooking(selectedBooking)
                  setSelectedBooking(null)
                }}
              >
                Leave Review
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {reviewingBooking && (
        <ReviewModal
          quotation={{
            id: reviewingBooking.id,
            serviceId: reviewingBooking.serviceId,
            provider: reviewingBooking.providerName,
          }}
          onClose={() => setReviewingBooking(null)}
          onSuccess={() => {
            setReviewingBooking(null)
            // Optionally refresh service reviews elsewhere if needed
          }}
        />
      )}
    </div>
  )
}

export default function CustomerBookingsPage() {
  return (
    <ProtectedRoute allowedRoles={["customer"]}>
      <CustomerBookingsContent />
    </ProtectedRoute>
  )
}
