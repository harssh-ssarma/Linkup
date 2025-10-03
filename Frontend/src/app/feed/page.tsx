'use client'

import AuthCheck from '@/components/auth/AuthCheck'
import FeedCreateSection from '@/components/features/FeedCreateSection'
import AppShell from '../AppShell'

export default function FeedPage() {
  return (
    <AuthCheck>
      <AppShell>
        <FeedCreateSection />
      </AppShell>
    </AuthCheck>
  )
}
