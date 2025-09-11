'use client'

import { useState } from 'react'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import ChatSection from '@/components/features/ChatSection'
import Navigation from '@/components/layout/Navigation'
import { useNavigation } from '@/context/NavigationContext'

function ChatsContent() {
  const [activeChat, setActiveChat] = useState<string | null>(null)
  const { isSidebarExpanded } = useNavigation()

  return (
    <div className="flex h-full">
      {/* Navigation - Hidden on mobile when chat is active */}
      <div className={activeChat ? 'hidden md:block' : 'block'}>
        <Navigation />
      </div>
      
      {/* Main content */}
      <main
        className={`flex-1 h-full overflow-hidden transition-all duration-300 ${
          activeChat 
            ? 'bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900' 
            : `pb-20 md:pb-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 ${
                isSidebarExpanded ? 'md:ml-64' : 'md:ml-16'
              }`
        }`}
      >
        <ChatSection 
          activeChat={activeChat} 
          onChatChange={setActiveChat} 
        />
      </main>
    </div>
  )
}

export default function ChatsPage() {
  return (
    <ProtectedRoute>
      <ChatsContent />
    </ProtectedRoute>
  )
}
