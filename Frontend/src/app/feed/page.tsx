'use client'

import ProtectedRoute from '@/components/auth/ProtectedRoute'
import FeedSection from '@/components/features/FeedSection'
import LayoutContent from '../LayoutContent'

export default function FeedPage() {
  return (
    <ProtectedRoute>
      <LayoutContent>
        <FeedSection />
      </LayoutContent>
    </ProtectedRoute>
  )
}
