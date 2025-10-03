'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthRequired } from '@/context/AuthContext'

interface AuthCheckProps {
  children: React.ReactNode
}

export default function AuthCheck({ children }: AuthCheckProps) {
  const router = useRouter()
  const { loading, isUnauthenticated } = useAuthRequired()

  useEffect(() => {
    if (loading) return
    if (isUnauthenticated) {
      router.replace('/')
    }
  }, [isUnauthenticated, loading, router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 px-6">
        <div className="text-center text-slate-100">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-slate-500/40 border-t-white"></div>
          <p className="text-sm font-medium text-slate-200">Verifying your access...</p>
        </div>
      </div>
    )
  }

  if (isUnauthenticated) {
    return null
  }

  return <>{children}</>
}