'use client'

import { useState } from 'react'
import AuthCheck from '@/components/auth/AuthCheck'
import ChatSection from '@/components/features/ChatSection'
import LayoutContent from '../LayoutContent'

export default function ChatsPage() {
  const [activeChat, setActiveChat] = useState<string | null>(null)

  return (
    <AuthCheck>
      <LayoutContent>
        <div className="h-full">
          <ChatSection 
            activeChat={activeChat} 
            onChatChange={setActiveChat} 
          />
        </div>
      </LayoutContent>
    </AuthCheck>
  )
}
