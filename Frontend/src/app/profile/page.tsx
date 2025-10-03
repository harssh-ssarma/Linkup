'use client'

import AuthCheck from '@/components/auth/AuthCheck'
import ProfileSection from '@/components/features/ProfileSection'
import AppShell from '../AppShell'

export default function ProfilePage() {
  return (
    <AuthCheck>
      <AppShell>
        <ProfileSection />
      </AppShell>
    </AuthCheck>
  )
}
