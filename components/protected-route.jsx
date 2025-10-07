"use client"

import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
      // Redirect to appropriate dashboard based on role
      if (user?.role === "customer") router.push("/customer/dashboard")
      else if (user?.role === "provider") router.push("/provider/dashboard")
      else if (user?.role === "admin") router.push("/admin/dashboard")
      else router.push("/")
    }
  }, [isAuthenticated, user, allowedRoles, router])

  if (!isAuthenticated) return null
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) return null

  return <>{children}</>
}
