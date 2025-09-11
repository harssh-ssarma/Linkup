'use client'

import { useEffect, useState } from 'react'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged, User } from 'firebase/auth'
import { SessionManager } from '@/lib/session'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
      
      // Clear session data if user is not authenticated
      if (!currentUser) {
        SessionManager.clearSession()
      }
    })

    return () => unsubscribe()
  }, [])

  return { user, loading }
}

export function useAuthRequired() {
  const { user, loading } = useAuth()
  
  return {
    user,
    loading,
    isAuthenticated: !!user,
    isUnauthenticated: !loading && !user
  }
}
