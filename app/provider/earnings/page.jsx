"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DollarSign, TrendingUp, Calendar, Download, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { jsPDF } from "jspdf"

function ProviderEarningsContent() {
  const { user, token } = useAuth()
  const [timeRange, setTimeRange] = useState("month")
  const [earnings, setEarnings] = useState({
    total: 0,
    thisMonth: 0,
    lastMonth: 0,
    pending: 0,
    available: 0,
  })
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showUPIModal, setShowUPIModal] = useState(false)
  const [upiApp, setUpiApp] = useState("gpay")
  const [paying, setPaying] = useState(false)
  const [payoutStatus, setPayoutStatus] = useState(null)

  useEffect(() => {
    fetchEarningsData()
  }, [timeRange])

  const fetchEarningsData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/provider/earnings?timeRange=${timeRange}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()

      setEarnings(data.earnings)
      setTransactions(data.transactions)
    } catch (error) {
      console.error("Failed to fetch earnings data:", error)
    } finally {
      setLoading(false)
    }
  }

  const percentageChange =
    earnings.lastMonth > 0 ? (((earnings.thisMonth - earnings.lastMonth) / earnings.lastMonth) * 100).toFixed(1) : 0

  const handleExportPdf = () => {
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text("Earnings Report", 14, 20)
    doc.setFontSize(12)
    doc.text(`Provider: ${user?.name || "Provider"}`, 14, 30)
    doc.text(`Time Range: ${timeRange}`, 14, 38)
    doc.text(`Total: $${earnings.total}`, 14, 46)
    doc.text(`This Month: $${earnings.thisMonth} (${percentageChange}%)`, 14, 54)
    doc.text(`Pending: $${earnings.pending}`, 14, 62)
    doc.text(`Available: $${earnings.available}`, 14, 70)

    doc.text("Transactions:", 14, 84)
    let y = 92
    const lineHeight = 8
    transactions.forEach((t) => {
      const line = `${t.date} - ${t.description} - ${t.service} - ${t.status} - ${t.type === "earning" ? "+" : "-"}$${t.amount}`
      doc.text(line.substring(0, 95), 14, y) // simple overflow prevention
      y += lineHeight
      if (y > 280) {
        doc.addPage()
        y = 20
      }
    })

    doc.save(`earnings-report-${timeRange}.pdf`)
  }

  const handleUPIPayout = async () => {
    try {
      setPaying(true)
      const res = await fetch("/api/provider/earnings/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          payoutId: `available-${Date.now()}`,
          amount: earnings.available,
          upiApp,
        }),
      })
      const data = await res.json()
      if (data?.ok) {
        setPayoutStatus("Paid")
        setShowUPIModal(false)
      }
    } catch (e) {
      console.error("[v0] UPI payout error:", e)
    } finally {
      setPaying(false)
    }
  }

  return (
    <div className="min-h-screen">
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Earnings</h1>
              <p className="text-muted-foreground mt-1">Track your income and transactions</p>
            </div>
            <Button variant="outline" onClick={handleExportPdf}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Time Range Selector */}
        <div className="mb-6 flex justify-end">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Earnings Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${earnings.total.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">All time revenue</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${earnings.thisMonth.toLocaleString()}</div>
              <div className="flex items-center gap-1 mt-1">
                {percentageChange >= 0 ? (
                  <>
                    <ArrowUpRight className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-500">+{percentageChange}%</span>
                  </>
                ) : (
                  <>
                    <ArrowDownRight className="h-3 w-3 text-red-500" />
                    <span className="text-xs text-red-500">{percentageChange}%</span>
                  </>
                )}
                <span className="text-xs text-muted-foreground">from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${earnings.pending.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">In escrow</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${earnings.available.toLocaleString()}</div>
              <Button size="sm" className="mt-2 w-full" onClick={() => setShowUPIModal(true)}>
                Receive via UPI
              </Button>
              {payoutStatus && (
                <div className="mt-2">
                  <Badge>{payoutStatus}</Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>Your recent earnings and payouts</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-16 bg-muted rounded" />
                  </div>
                ))}
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No transactions yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            transaction.type === "earning"
                              ? "bg-green-500/10 text-green-500"
                              : "bg-blue-500/10 text-blue-500"
                          }`}
                        >
                          <DollarSign className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-muted-foreground">{transaction.service}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-lg font-bold ${
                          transaction.type === "earning" ? "text-green-500" : "text-foreground"
                        }`}
                      >
                        {transaction.type === "earning" ? "+" : "-"}${transaction.amount.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant={
                            transaction.status === "completed"
                              ? "default"
                              : transaction.status === "pending"
                                ? "outline"
                                : "secondary"
                          }
                        >
                          {transaction.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{transaction.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Earnings Breakdown */}
        <div className="grid gap-6 lg:grid-cols-2 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Top Services</CardTitle>
              <CardDescription>Your highest earning services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Web Development", earnings: 2500, percentage: 35 },
                  { name: "UI/UX Design", earnings: 1800, percentage: 25 },
                  { name: "Mobile App Development", earnings: 1500, percentage: 21 },
                  { name: "Consulting", earnings: 1350, percentage: 19 },
                ].map((service, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{service.name}</span>
                      <span className="text-muted-foreground">${service.earnings}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${service.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payout preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Bank Account</p>
                      <p className="text-sm text-muted-foreground">****1234</p>
                    </div>
                    <Badge>Primary</Badge>
                  </div>
                </div>
                <div className="p-4 rounded-lg border border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">PayPal</p>
                      <p className="text-sm text-muted-foreground">user@example.com</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Set Primary
                    </Button>
                  </div>
                </div>
                <Button variant="outline" className="w-full bg-transparent">
                  Add Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {showUPIModal && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-background/80">
            <div className="w-full max-w-sm rounded-lg bg-card p-4 shadow-lg outline outline-1 outline-border">
              <h3 className="text-lg font-semibold mb-1">Receive payment via UPI</h3>
              <p className="text-sm text-muted-foreground mb-4">Select your UPI app</p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[
                  { key: "gpay", label: "GPay" },
                  { key: "phonepe", label: "PhonePe" },
                  { key: "paytm", label: "Paytm" },
                  { key: "bhim", label: "BHIM UPI" },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setUpiApp(opt.key)}
                    className={`rounded-md px-3 py-2 text-sm border border-border ${
                      upiApp === opt.key ? "bg-primary text-primary-foreground" : "bg-background"
                    }`}
                    aria-pressed={upiApp === opt.key}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-end gap-2">
                <Button variant="outline" onClick={() => setShowUPIModal(false)} disabled={paying}>
                  Cancel
                </Button>
                <Button onClick={handleUPIPayout} disabled={paying || !earnings.available}>
                  {paying ? "Processing..." : "Confirm"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ProviderEarningsPage() {
  return (
    <ProtectedRoute allowedRoles={["provider"]}>
      <ProviderEarningsContent />
    </ProtectedRoute>
  )
}
