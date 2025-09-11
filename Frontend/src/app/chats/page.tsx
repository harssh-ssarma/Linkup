'use client'

import ProtectedRoute from '@/components/auth/ProtectedRoute'
import ChatSection from '@/components/features/ChatSection'
import LayoutContent from '../LayoutContent'

export default function ChatsPage() {
  return (
    <ProtectedRoute>
      <LayoutContent>
        <ChatSection />
      </LayoutContent>
    </ProtectedRoute>
  )
}
