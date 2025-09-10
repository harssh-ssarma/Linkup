'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoading(false)
      // Always redirect to chats page for now
      router.push('/chats')
    })

    // Set a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      setIsLoading(false)
      router.push('/chats')
    }, 3000)

    return () => {
      unsubscribe()
      clearTimeout(timeout)
    }
  }, [router])

  if (!isLoading) {
    return null // Will redirect, so show nothing
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  )
}
