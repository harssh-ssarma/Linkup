'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus, MoreVertical, Phone, Video, Users, Radio, Settings, ArrowLeft, MessageCircle } from 'lucide-react'
import ChatList from '@/components/features/ChatList'
import ChatWindow from '@/components/features/ChatWindow'
import NewChatModal from '@/components/features/NewChatModal'

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

export default function ChatSection() {
  const [activeChat, setActiveChat] = useState<string | null>(null)
  const [chatTab, setChatTab] = useState<'personal' | 'groups' | 'channels'>('personal')
  const [showNewChat, setShowNewChat] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [chats, setChats] = useState<Chat[]>([])

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
    <div className="h-full flex bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      {/* Mobile: Stacked Layout */}
      <div className="flex flex-col md:flex-row w-full h-full">
        
        {/* Left Pane - Chat List */}
        <div className={`${
          activeChat ? 'hidden md:flex' : 'flex'
        } w-full md:w-1/3 lg:w-[400px] xl:w-[420px] bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-r border-slate-200/50 dark:border-slate-700/50 flex-col`}>
          
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-slate-200/50 dark:border-slate-700/50 bg-white/60 dark:bg-slate-800/60">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-1">Chats</h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Stay connected</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNewChat(true)}
                className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all touch-manipulation"
                title="New Chat"
              >
                <Plus size={18} className="sm:hidden" />
                <Plus size={22} className="hidden sm:block" />
              </motion.button>
            </div>

            {/* Search */}
            <div className="relative mb-4 sm:mb-6">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-white/40" size={16} />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-slate-100/80 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg sm:rounded-xl text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white dark:focus:bg-slate-700/80 transition-all"
              />
            </div>

            {/* Chat Tabs */}
            <div className="flex space-x-1 bg-slate-100/80 dark:bg-slate-700/50 rounded-lg p-1">
              {chatTabs.map((tab) => {
                const isActive = chatTab === tab.id
                const Icon = tab.icon
                
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setChatTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center space-x-1 sm:space-x-2 py-2 sm:py-3 px-2 sm:px-4 rounded-md transition-all duration-200 text-xs sm:text-sm ${
                      isActive 
                        ? 'bg-white dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 shadow-md' 
                        : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10'
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
        <div className={`${activeChat ? 'flex' : 'hidden md:flex'} flex-1 bg-slate-50 dark:bg-slate-900`}>
          {activeChat ? (
            <div className="flex-1 flex flex-col">
              {/* Mobile Back Button Header */}
              <div className="md:hidden p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-700/50">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveChat(null)}
                  className="p-2 rounded-full text-slate-600 dark:text-white/70 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors touch-manipulation"
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
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
                  <MessageCircle size={32} className="text-white sm:w-12 sm:h-12" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-slate-900 dark:text-white">Welcome to Linkup</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6 sm:mb-8 text-base sm:text-lg">Select a conversation to start messaging</p>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowNewChat(true)}
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl text-white font-semibold shadow-lg hover:shadow-xl transition-all flex items-center space-x-2 sm:space-x-3 mx-auto text-sm sm:text-lg touch-manipulation"
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