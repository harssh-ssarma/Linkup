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

  useEffect(() => {
    // Check if we're processing an email verification link
    if (typeof window !== 'undefined' && window.location.href.includes('apiKey=')) {
      setIsVerifying(true)
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
      
      if (currentUser) {
        // User is signed in, redirect to chats immediately
        router.push('/chats')
      }
    })

    return () => unsubscribe()
  }, [router])

  const handleAuthSuccess = () => {
    setIsVerifying(false)
    router.push('/chats')
  }

  // Always show auth modal - no purple background page
  return (
    <AuthModal 
      isOpen={true}
      onClose={() => {
        if (!loading && !user && !isVerifying) {
          // Can't close if not authenticated
          return
        }
        setIsVerifying(false)
      }}
      onAuthenticated={handleAuthSuccess}
    />
  )
}
