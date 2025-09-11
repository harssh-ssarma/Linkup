'use client'

import AuthCheck from '@/components/auth/AuthCheck'
import FeedSection from '@/components/features/FeedSection'
import LayoutContent from '../LayoutContent'

export default function FeedPage() {
  return (
    <AuthCheck>
      <LayoutContent>
        <FeedSection />
      </LayoutContent>
    </AuthCheck>
  )
}
