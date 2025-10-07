import Link from "next/link"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, Laptop, Palette, Briefcase, GraduationCap, Wrench } from "lucide-react"

const categories = [
  {
    id: "home",
    name: "Home Services",
    description: "Cleaning, repairs, maintenance",
    icon: Home,
    count: 234,
  },
  {
    id: "tech",
    name: "Technology",
    description: "Web development, IT support",
    icon: Laptop,
    count: 189,
  },
  {
    id: "design",
    name: "Design",
    description: "Graphic design, branding",
    icon: Palette,
    count: 156,
  },
  {
    id: "business",
    name: "Business",
    description: "Consulting, accounting",
    icon: Briefcase,
    count: 142,
  },
  {
    id: "education",
    name: "Education",
    description: "Tutoring, training",
    icon: GraduationCap,
    count: 98,
  },
  {
    id: "other",
    name: "Other Services",
    description: "Various professional services",
    icon: Wrench,
    count: 76,
  },
]

export default function CategoriesPage() {
  return (
    <div className="min-h-screen">
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Service Categories</h1>
          <p className="text-muted-foreground">Explore services by category</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Link key={category.id} href={`/services?category=${category.id}`}>
                <Card className="h-full hover:border-accent transition-colors cursor-pointer">
                  <CardHeader>
                    <Icon className="h-10 w-10 mb-3 text-accent" />
                    <CardTitle>{category.name}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                    <p className="text-sm text-muted-foreground pt-2">{category.count} services available</p>
                  </CardHeader>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
