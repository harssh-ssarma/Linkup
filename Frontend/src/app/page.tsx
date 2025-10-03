'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import SimpleAuth from '@/components/features/SimpleAuth'
import { useAuth } from '@/context/AuthContext'

export default function Home() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [showAuth, setShowAuth] = useState(false)

  useEffect(() => {
    if (loading) return

    if (user) {
      router.push('/chats')
    } else {
      setShowAuth(true)
    }
  }, [loading, router, user])

  const handleAuthSuccess = () => {
    setShowAuth(false)
    router.push('/chats')
  }

  if (loading) {
    return (
      <div className="h-screen base-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)]/30 mx-auto mb-4"></div>
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    )
  }

  if (showAuth) {
    return <SimpleAuth onAuthenticated={handleAuthSuccess} />
  }

  return (
    <div className="h-screen base-gradient flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)]/30 mx-auto mb-4"></div>
        <p className="text-muted">Redirecting...</p>
      </div>
    </div>
  )
}
