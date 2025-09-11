'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { SessionManager } from '@/lib/session'

interface AuthCheckProps {
  children: React.ReactNode
}

export default function AuthCheck({ children }: AuthCheckProps) {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      // Check if backend is running
      try {
        const response = await fetch('http://localhost:8000/api/auth/validate/', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
        
        if (response.status === 404) {
          // Backend is down - redirect to signin
          SessionManager.clearSession()
          router.push('/')
          return
        }
      } catch {
        // Backend is down - redirect to signin
        SessionManager.clearSession()
        router.push('/')
        return
      }

      // Check if session is valid
      const hasValidSession = SessionManager.isSessionValid()
      if (!hasValidSession) {
        // No valid session - redirect to signin
        router.push('/')
        return
      }

      setIsChecking(false)
    }

    checkAuth()
  }, [router])

  if (isChecking) {
    return (
      <div className="h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/30 mx-auto mb-4"></div>
          <p className="text-white/80">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}