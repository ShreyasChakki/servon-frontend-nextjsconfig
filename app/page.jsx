import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Shield, Zap, Users, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl text-balance">
              The complete platform to find services.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Connect with trusted service providers. Request quotations, chat in real-time, and manage everything in
              one place.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
              <Button size="lg" asChild>
                <Link href="/register/customer">
                  Get Started as Customer
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/register/provider">Become a Provider</Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/services">Browse Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Why Choose ServiceHub</h2>
            <p className="mt-4 text-lg text-muted-foreground">Everything you need in one platform</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-card">
              <CardHeader>
                <Search className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Find Services</CardTitle>
                <CardDescription>
                  Browse thousands of verified service providers across multiple categories
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card">
              <CardHeader>
                <Zap className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Quick Quotes</CardTitle>
                <CardDescription>Request and receive quotations instantly from multiple providers</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card">
              <CardHeader>
                <Users className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Real-time Chat</CardTitle>
                <CardDescription>
                  Communicate directly with providers through our integrated chat system
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card">
              <CardHeader>
                <Shield className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Secure Platform</CardTitle>
                <CardDescription>All providers are verified and reviewed by our community</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to get started?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join thousands of customers and providers on ServiceHub
            </p>
            <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
              <Button size="lg" asChild>
                <Link href="/register/customer">Sign Up as Customer</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/register/provider">Sign Up as Provider</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
