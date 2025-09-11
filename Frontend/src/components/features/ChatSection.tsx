'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus, MoreVertical, Phone, Video, Users, Radio, Settings, ArrowLeft, MessageCircle } from 'lucide-react'
import ChatList from '@/components/features/ChatList'
import ChatWindow from '@/components/features/ChatWindow'
import NewChatModal from '@/components/features/NewChatModal'
import Header from '@/components/layout/Header'

interface Chat {
  id: string
  name: string
  lastMessage: string
  timestamp: string
  unreadCount: number
  avatar: string
  isOnline: boolean
  isGroup: boolean
  isChannel: boolean
  isPinned: boolean
  isMuted: boolean
  isVerified: boolean
  participantCount?: number
  lastSeen?: string
  messageType?: 'text' | 'image' | 'voice'
  messageStatus?: 'sent' | 'delivered' | 'read'
  status?: string
}

interface ChatSectionProps {
  activeChat: string | null
  onChatChange: (chatId: string | null) => void
}

export default function ChatSection({ activeChat: propActiveChat, onChatChange }: ChatSectionProps) {
  // Use props instead of internal state
  const activeChat = propActiveChat
  const setActiveChat = onChatChange
  
  const [chatTab, setChatTab] = useState<'personal' | 'groups' | 'channels'>('personal')
  const [showNewChat, setShowNewChat] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [chats, setChats] = useState<Chat[]>([])

  // Tab title mapping
  const tabTitles = {
    personal: 'Chats',
    groups: 'Groups', 
    channels: 'Channels'
  }

  // Mock data based on chat type
  useEffect(() => {
    const mockChats: Record<string, Chat[]> = {
      personal: [
        {
          id: '1',
          name: 'Priya Patel',
          lastMessage: 'Hey! How are you doing today? 😊',
          timestamp: '2m ago',
          unreadCount: 3,
          avatar: 'https://ui-avatars.com/api/?name=Priya+Patel&background=6366f1&color=fff',
          isOnline: true,
          isGroup: false,
          isChannel: false,
          isPinned: true,
          isMuted: false,
          isVerified: false,
          messageType: 'text',
          messageStatus: 'delivered',
          status: 'typing...'
        },
        {
          id: '2',
          name: 'Arjun Singh',
          lastMessage: 'Can we schedule a meeting for tomorrow?',
          timestamp: '5m ago',
          unreadCount: 1,
          avatar: 'https://ui-avatars.com/api/?name=Arjun+Singh&background=8b5cf6&color=fff',
          isOnline: true,
          isGroup: false,
          isChannel: false,
          isPinned: false,
          isMuted: false,
          isVerified: true,
          messageType: 'text',
          messageStatus: 'read'
        }
      ],
      groups: [
        {
          id: '10',
          name: 'Project Team',
          lastMessage: 'Alice: The presentation is ready!',
          timestamp: '1h ago',
          unreadCount: 12,
          avatar: 'https://ui-avatars.com/api/?name=Project+Team&background=10b981&color=fff',
          isOnline: false,
          isGroup: true,
          isChannel: false,
          isPinned: true,
          isMuted: false,
          isVerified: false,
          participantCount: 8,
          messageType: 'text',
          messageStatus: 'read'
        }
      ],
      channels: []
    }
    
    setChats(mockChats[chatTab] || [])
  }, [chatTab])

  const chatTabs = [
    { id: 'personal', label: 'Personal', icon: Phone },
    { id: 'groups', label: 'Groups', icon: Users },
    { id: 'archive', label: 'Archive', icon: Radio },
  ]

  return (
    <div className="h-full flex base-gradient">
      {/* Mobile: Stacked Layout */}
      <div className="flex flex-col md:flex-row w-full h-full">
        
        {/* Left Pane - Chat List */}
        <div className={`${
          activeChat ? 'hidden md:flex' : 'flex'
        } ${
          activeChat 
            ? 'w-full md:w-1/3 lg:w-[400px] xl:w-[420px]' 
            : 'w-full'
        } base-gradient-light backdrop-blur-lg ${activeChat ? 'border-r border-indigo-600/50' : ''} flex-col`}>
          
          {/* Header */}
          <Header 
            onSearchToggle={() => setShowSearch(!showSearch)}
            onNewChatClick={() => setShowNewChat(true)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            showSearch={showSearch}
            currentTab={chatTab}
            tabTitle={tabTitles[chatTab]}
            chatCount={chats.length}
          />

          {/* Chat Tabs */}
          <div className="px-4 py-3 border-b border-indigo-600/50">
            <div className="flex space-x-1 bg-white/10 rounded-lg p-1">
              {chatTabs.map((tab) => {
                const isActive = chatTab === tab.id
                const Icon = tab.icon
                
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setChatTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center space-x-1 sm:space-x-2 py-2 sm:py-3 px-2 sm:px-4 rounded-md transition-all duration-200 text-xs sm:text-sm ${
                      isActive 
                        ? 'bg-white/20 text-white shadow-md' 
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon size={14} className="sm:hidden" />
                    <Icon size={16} className="hidden sm:block" />
                    <span className="font-semibold hidden sm:block">{tab.label}</span>
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-hidden">
            <ChatList 
              activeChat={activeChat}
              onChatSelect={setActiveChat}
              chatType={chatTab}
              searchQuery={searchQuery}
              chats={chats}
            />
          </div>
        </div>

        {/* Right Pane - Chat Window */}
        <div className={`${activeChat ? 'flex' : 'hidden md:flex'} flex-1 base-gradient-light`}>
          {activeChat ? (
            <div className="flex-1 flex flex-col">
              {/* Mobile Back Button Header */}
              <div className="md:hidden p-4 base-gradient-light backdrop-blur-lg border-b border-indigo-600/50">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveChat(null)}
                  className="p-2 rounded-full text-white/70 hover:bg-white/10 transition-colors touch-manipulation"
                >
                  <ArrowLeft size={20} />
                </motion.button>
              </div>
              
              <ChatWindow 
                chat={chats.find(chat => chat.id === activeChat)} 
                onBack={() => setActiveChat(null)} 
              />
            </div>
          ) : (
            /* Welcome Screen */
            <div className="flex-1 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center px-4 sm:px-8 max-w-md"
              >
                <div className="w-16 h-16 sm:w-24 sm:h-24 menu-gradient rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
                  <MessageCircle size={32} className="text-white sm:w-12 sm:h-12" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white">Welcome to Linkup</h2>
                <p className="text-white/70 mb-6 sm:mb-8 text-base sm:text-lg">Select a conversation to start messaging</p>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowNewChat(true)}
                  className="px-6 sm:px-8 py-3 sm:py-4 menu-gradient rounded-xl sm:rounded-2xl text-white font-semibold shadow-lg hover:shadow-xl transition-all flex items-center space-x-2 sm:space-x-3 mx-auto text-sm sm:text-lg touch-manipulation"
                >
                  <Plus size={18} className="sm:w-5 sm:h-5" />
                  <span>Start New Chat</span>
                </motion.button>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      {/* New Chat Modal */}
      <NewChatModal 
        isOpen={showNewChat}
        onClose={() => setShowNewChat(false)}
        onChatCreated={(chatId) => {
          setActiveChat(chatId)
          setShowNewChat(false)
        }}
      />
    </div>
  )
}