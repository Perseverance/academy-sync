"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

interface User {
  email: string
  name: string
  picture?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signIn: () => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const storedUser = localStorage.getItem("stravaLoggerUser")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (!isLoading && !user && pathname !== "/") {
      router.push("/")
    } else if (!isLoading && user && pathname === "/") {
      router.push("/dashboard")
    }
  }, [user, isLoading, pathname, router])

  const signIn = async () => {
    setIsLoading(true)
    // Simulate Google OAuth flow
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const mockUser = {
      email: "user@example.com",
      name: "Strava User",
      picture: "/placeholder.svg?height=40&width=40",
    }
    setUser(mockUser)
    localStorage.setItem("stravaLoggerUser", JSON.stringify(mockUser))
    router.push("/dashboard")
    setIsLoading(false)
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem("stravaLoggerUser")
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
