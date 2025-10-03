'use client'

import AuthCheck from '@/components/auth/AuthCheck'
import FeedSection from '@/components/features/FeedSection'
import AppShell from '../AppShell'

export default function FeedPage() {
  return (
    <AuthCheck>
      <AppShell>
        <FeedSection />
      </AppShell>
    </AuthCheck>
  )
}
