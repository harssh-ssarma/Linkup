'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus, MoreVertical, Phone, Video, Users, Radio, Settings, ArrowLeft, MessageCircle } from 'lucide-react'
import ChatList from '@/components/features/ChatList'
import ChatWindow from '@/components/features/ChatWindow'
import NewChatModal from '@/components/features/NewChatModal'
import SettingsModal from '@/components/features/SettingsModal'
import Header from '@/components/layout/Header'
import { useNavigation } from '@/context/NavigationContext'

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
  const { setShowMobileNavigation } = useNavigation()
  
  const [chatTab, setChatTab] = useState<'personal' | 'groups' | 'channels'>('personal')
  const [showNewChat, setShowNewChat] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [chats, setChats] = useState<Chat[]>([])
  const [openChats, setOpenChats] = useState<string[]>([])
  const [showSettings, setShowSettings] = useState(false)

  // Control mobile navigation based on active chat
  useEffect(() => {
    // Hide navigation when in chat, show when in chat list
    setShowMobileNavigation(!activeChat)
    
    // Cleanup function to restore navigation when component unmounts
    return () => {
      setShowMobileNavigation(true)
    }
  }, [activeChat, setShowMobileNavigation])
  const tabTitles = {
    personal: 'Chats',
    groups: 'Groups', 
    channels: 'Channels',
    archive: 'Archive'
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

  const handleChatSelect = (chatId: string) => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      if (!openChats.includes(chatId)) {
        setOpenChats([...openChats, chatId])
      }
    } else {
      setActiveChat(chatId)
    }
  }

  const handleCloseChat = (chatId: string) => {
    setOpenChats(openChats.filter(id => id !== chatId))
  }

  const chatTabs = [
    { id: 'personal', label: 'Personal', icon: Phone },
    { id: 'groups', label: 'Groups', icon: Users },
    { id: 'channels', label: 'Channels', icon: Radio },
    { id: 'archive', label: 'Archive', icon: Radio }
  ]

  return (
    <div className="base-gradient chat-container-premium flex h-full">
      <div className="flex w-full h-full">
        
        {/* Left Pane - Chat List */}
        <div className={`${
          activeChat ? 'hidden md:flex' : 'flex'
        } w-full md:w-80 lg:w-96 flex-col border-r border-subtle`}>
          
          {/* Header */}
          <Header 
            title={tabTitles[chatTab]}
            subtitle={`${chats.length} ${chatTab === 'personal' ? 'conversation' : chatTab?.slice(0, -1)}${chats.length !== 1 ? 's' : ''}`}
            searchPlaceholder={`Search ${chatTab}...`}
            searchData={chats}
            searchFields={['name', 'lastMessage']}
            onSearchResults={(query, results) => {
              setSearchQuery(query)
            }}
            onNewChatClick={() => setShowNewChat(true)}
            menuItems={[
              { icon: Users, label: 'New Group', action: () => console.log('New Group') },
              { icon: Radio, label: 'New Broadcast', action: () => console.log('New Broadcast') },
              { icon: Settings, label: 'Settings', action: () => setShowSettings(true) }
            ]}
          />

          {/* Chat Tabs */}
          <div className="px-4 py-3">
            <div className="flex space-x-1 rounded-lg bg-surface-soft/80 p-1">
              {chatTabs.map((tab) => {
                const isActive = chatTab === tab.id
                const Icon = tab.icon
                
                return (
                  <motion.button
                    type="button"
                    key={tab.id}
                    onClick={() => setChatTab(tab.id as any)}
                    className={`nav-item flex-1 items-center justify-center gap-1 rounded-xl px-2 py-2 text-xs transition-all duration-200 sm:gap-2 sm:px-4 sm:py-3 sm:text-sm ${
                      isActive
                        ? 'active glass-card-premium text-foreground'
                        : 'text-muted hover:bg-surface-strong/70 hover:text-foreground'
                    }`}
                    whileTap={{ scale: 0.98 }}
                    aria-pressed={isActive}
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
              activeChat={openChats[0] || activeChat}
              onChatSelect={handleChatSelect}
              chatType={chatTab}
              searchQuery={searchQuery}
              chats={chats}
            />
          </div>
        </div>

        {/* Right Pane - Chat Windows */}
        <div className={`${activeChat ? 'flex' : 'hidden md:flex'} ${activeChat ? 'fixed inset-0 z-50 md:relative md:z-auto' : ''} flex-1`}>
          {activeChat && typeof window !== 'undefined' && window.innerWidth < 768 ? (
            <ChatWindow 
              chat={chats.find(chat => chat.id === activeChat)} 
              onBack={() => setActiveChat(null)} 
            />
          ) : openChats.length > 0 ? (
            <div className="flex w-full h-full">
              {openChats.map((chatId, index) => (
                <div 
                  key={chatId} 
                  className={`flex-1 ${index > 0 ? 'border-l border-subtle' : ''}`}
                  style={{ minWidth: '400px', maxWidth: openChats.length === 1 ? '100%' : '50%' }}
                >
                  <ChatWindow 
                    chat={chats.find(chat => chat.id === chatId)} 
                    onBack={() => handleCloseChat(chatId)}
                  />
                </div>
              ))}
            </div>
          ) : (
            /* Welcome Screen */
            <div className="flex flex-1 items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md px-4 text-center sm:px-8"
              >
                <div className="glass-card mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full sm:mb-8 sm:h-24 sm:w-24">
                  <MessageCircle size={32} className="text-[var(--accent)] sm:h-12 sm:w-12" />
                </div>
                <h2 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl">Welcome to Linkup</h2>
                <p className="mb-6 text-base text-muted sm:mb-8 sm:text-lg">Select a conversation to start messaging</p>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowNewChat(true)}
                  className="btn-primary text-sm sm:text-lg touch-manipulation flex items-center space-x-2 sm:space-x-3 mx-auto"
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

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  )
}