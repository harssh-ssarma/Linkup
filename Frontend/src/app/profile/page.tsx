'use client'

import AuthCheck from '@/components/auth/AuthCheck'
import ProfileSection from '@/components/features/ProfileSection'
import LayoutContent from '../LayoutContent'

export default function ProfilePage() {
  return (
    <AuthCheck>
      <LayoutContent>
        <ProfileSection />
      </LayoutContent>
    </AuthCheck>
  )
}
