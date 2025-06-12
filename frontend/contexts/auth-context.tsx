"use client"

import { createContext, useContext, useEffect, useState, type ReactNode, useCallback } from "react"
import { authService } from "@/services/auth-service"
import type { User } from "@/types"

interface AuthContextType {
  isAuthenticated: () => boolean
  user: User | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadUser = useCallback(async () => {
    try {
      const userData = await authService.getCurrentUser()
      setUser(userData)
    } catch (err) {
      console.error("Failed to load user:", err)
      setError("Failed to load user data")
      authService.logout()
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (authService.isAuthenticated()) {
      loadUser()
    } else {
      setLoading(false)
    }
  }, [loadUser])

  const login = async (username: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      await authService.login(username, password)
      await loadUser()
    } catch (err) {
      console.error("Login failed:", err)
      setError("Invalid username or password")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  const isAuthenticated = useCallback(() => {
    return authService.isAuthenticated()
  }, [])

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    loading,
    error,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
