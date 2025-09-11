'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged, User } from 'firebase/auth'
import AuthModal from '@/components/features/AuthModal'
import { SessionManager } from '@/lib/session'

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAuth, setShowAuth] = useState(false)

  // Check backend connection
  const checkBackend = async (): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/validate/', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      return response.status !== 404 // Backend is running
    } catch {
      return false // Backend is down
    }
  }

  useEffect(() => {
    const checkAuthState = async () => {
      const backendRunning = await checkBackend()
      const hasValidSession = SessionManager.isSessionValid()
      
      if (!backendRunning) {
        // Backend down - force authentication
        SessionManager.clearSession()
        setShowAuth(true)
        setLoading(false)
        return
      }

      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser)
        
        if (currentUser && hasValidSession) {
          // User authenticated and session valid
          router.push('/chats')
        } else {
          // No auth or session - show auth modal
          SessionManager.clearSession()
          setShowAuth(true)
        }
        setLoading(false)
      })

      return unsubscribe
    }

    checkAuthState()
  }, [router])

  const handleAuthSuccess = () => {
    if (user) {
      SessionManager.setSession(user.uid)
    }
    setShowAuth(false)
    router.push('/chats')
  }

  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/30 mx-auto mb-4"></div>
          <p className="text-white/80">Loading...</p>
        </div>
      </div>
    )
  }

  if (showAuth) {
    return (
      <AuthModal 
        isOpen={true}
        onClose={() => {}}
        onAuthenticated={handleAuthSuccess}
      />
    )
  }

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/30 mx-auto mb-4"></div>
        <p className="text-white/80">Redirecting...</p>
      </div>
    </div>
  )
}
