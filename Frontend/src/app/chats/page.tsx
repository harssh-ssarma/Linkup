'use client'

import { useState } from 'react'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import ChatSection from '@/components/features/ChatSection'
import LayoutContent from '../LayoutContent'

function ChatsContent() {
  const [activeChat, setActiveChat] = useState<string | null>(null)

  return (
    <LayoutContent>
      <div className="h-full bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <ChatSection 
          activeChat={activeChat} 
          onChatChange={setActiveChat} 
        />
      </div>
    </LayoutContent>
  )
}

export default function ChatsPage() {
  return (
    <ProtectedRoute>
      <ChatsContent />
    </ProtectedRoute>
  )
}
