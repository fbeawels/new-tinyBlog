'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Loader2 } from 'lucide-react'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated()) {
      // Store the current path for redirecting after login
      const redirectPath = window.location.pathname + window.location.search
      router.push(`/login?redirect=${encodeURIComponent(redirectPath)}`)
    }
  }, [isAuthenticated, loading, router])

  if (loading || !isAuthenticated()) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return <>{children}</>
}

export function withAuth<T extends object>(
  WrappedComponent: React.ComponentType<T>
) {
  return function WithAuthWrapper(props: T) {
    return (
      <ProtectedRoute>
        <WrappedComponent {...(props as any)} />
      </ProtectedRoute>
    )
  }
}
