'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged, User, isSignInWithEmailLink } from 'firebase/auth'
import AuthModal from '@/components/features/AuthModal'

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isVerifying, setIsVerifying] = useState(false)
  const [shouldShowAuth, setShouldShowAuth] = useState(false)

  useEffect(() => {
    // Check if we're processing an email verification link
    if (typeof window !== 'undefined' && window.location.href.includes('apiKey=')) {
      setIsVerifying(true)
      setLoading(false)
      return
    }

    const checkBackendAndAuth = async () => {
      // Check if session exists (frontend restart vs backend restart)
      const sessionStarted = typeof window !== 'undefined' ? sessionStorage.getItem('session_started') : null
      
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        setUser(currentUser)
        
        if (currentUser) {
          // User is authenticated in Firebase
          if (sessionStarted) {
            // Session exists = frontend restart, go directly to chats
            setLoading(false)
            router.push('/chats')
          } else {
            // No session = fresh start/backend restart, set session and go to chats
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('session_started', 'true')
            }
            setLoading(false)
            router.push('/chats')
          }
        } else {
          // User not authenticated
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem('session_started')
          }
          setLoading(false)
          setShouldShowAuth(true)
        }
      })

      return unsubscribe
    }

    const unsubscribePromise = checkBackendAndAuth()
    return () => {
      unsubscribePromise.then(unsubscribe => unsubscribe())
    }
  }, [router])

  const handleAuthSuccess = () => {
    setIsVerifying(false)
    // Set session as started after successful auth
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('session_started', 'true')
    }
    router.push('/chats')
  }

  // Show loading while checking auth state
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

  // Only show auth modal if user should see auth screen
  if (shouldShowAuth || isVerifying) {
    return (
      <AuthModal 
        isOpen={true}
        onClose={() => {
          setIsVerifying(false)
        }}
        onAuthenticated={handleAuthSuccess}
      />
    )
  }

  // User is authenticated, redirect to chats (this shouldn't be visible normally)
  return (
    <div className="h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/30 mx-auto mb-4"></div>
        <p className="text-white/80">Redirecting to chats...</p>
      </div>
    </div>
  )
}
