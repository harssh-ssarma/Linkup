'use client'

import ProtectedRoute from '@/components/auth/ProtectedRoute'
import ProfileSection from '@/components/features/ProfileSection'
import LayoutContent from '../LayoutContent'

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <LayoutContent>
        <ProfileSection />
      </LayoutContent>
    </ProtectedRoute>
  )
}
