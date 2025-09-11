'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthRequired } from '@/hooks/useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const router = useRouter()
  const { user, loading, isUnauthenticated } = useAuthRequired()

  useEffect(() => {
    if (isUnauthenticated) {
      router.push('/')
    }
  }, [isUnauthenticated, router])

  if (loading) {
    return (
      fallback || (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/30 mx-auto mb-4"></div>
            <p className="text-white/80">Loading...</p>
          </div>
        </div>
      )
    )
  }

  if (isUnauthenticated) {
    return null // Will redirect
  }

  return <>{children}</>
}
