'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, Users, Archive, MessageCircle, Phone, Video, ArrowLeft, MoreVertical, Star, Bell, BellOff } from 'lucide-react'
import ChatList from './ChatList'
import ChatWindow from './ChatWindow'
import NewChatModal from './NewChatModal'

export default function ChatSection() {
  const [activeChat, setActiveChat] = useState<string | null>(null)
  const [chatTab, setChatTab] = useState<'all' | 'groups' | 'archived'>('all')
  const [showNewChat, setShowNewChat] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const chatTabs = [
    { id: 'all', label: 'All Chats', icon: MessageCircle, count: 12 },
    { id: 'groups', label: 'Groups', icon: Users, count: 3 },
    { id: 'archived', label: 'Archived', icon: Archive, count: 5 },
  ]

  // Mock chat data
  const mockChats = [
    {
      id: '1',
      name: 'Family Group',
      lastMessage: 'Mummy: Dinner is ready! 🍽️',
      timestamp: '2 min ago',
      unreadCount: 3,
      isGroup: true,
      isOnline: true,
      avatar: 'FG',
      isPinned: true
    },
    {
      id: '2', 
      name: 'Papa',
      lastMessage: 'Can you pick up groceries?',
      timestamp: '15 min ago',
      unreadCount: 1,
      isGroup: false,
      isOnline: true,
      avatar: 'RS',
      isPinned: false
    },
    {
      id: '3',
      name: 'Priya Didi',
      lastMessage: 'Thanks for the help! ❤️',
      timestamp: '1 hour ago',
      unreadCount: 0,
      isGroup: false,
      isOnline: false,
      avatar: 'PD',
      isPinned: false
    }
  ]

  return (
    <div className="h-full flex bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-slate-900 dark:to-blue-900/20">
      {/* Left Pane - Chat List */}
      <div className={`${
        activeChat && isMobile ? 'hidden' : 'flex'
      } ${activeChat ? 'lg:w-96 xl:w-[420px]' : 'w-full lg:w-96 xl:w-[420px]'} glass-card border-r border-gray-200 dark:border-white/10 flex-col`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Messages</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Stay connected with family</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNewChat(true)}
              className="touch-target-comfortable rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all"
              title="New Chat"
            >
              <Plus size={22} />
            </motion.button>
          </div>

          {/* Local Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-white/40" size={18} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-white/10 border-2 border-gray-200 dark:border-white/20 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 dark:focus:border-blue-500/50 transition-all"
            />
          </div>

          {/* Chat Tabs */}
          <div className="flex space-x-2 bg-gray-100 dark:bg-white/5 rounded-2xl p-2">
            {chatTabs.map((tab) => {
              const isActive = chatTab === tab.id
              const Icon = tab.icon
              
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setChatTab(tab.id as any)}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-white dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 shadow-md' 
                      : 'text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10'
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm font-semibold hidden sm:block">{tab.label}</span>
                  {tab.count > 0 && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      isActive 
                        ? 'bg-blue-100 dark:bg-blue-500/30 text-blue-600 dark:text-blue-300'
                        : 'bg-gray-200 dark:bg-white/20 text-gray-600 dark:text-white/60'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-2">
            {mockChats.map((chat) => (
              <motion.div
                key={chat.id}
                onClick={() => setActiveChat(chat.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-2xl cursor-pointer transition-all ${
                  activeChat === chat.id
                    ? 'bg-blue-50 dark:bg-blue-500/10 border-2 border-blue-200 dark:border-blue-500/30'
                    : 'bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 border-2 border-transparent'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                      {chat.avatar}
                    </div>
                    {chat.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">{chat.name}</h3>
                        {chat.isPinned && <Star size={14} className="text-yellow-500 fill-current" />}
                        {chat.isGroup && <Users size={14} className="text-gray-500 dark:text-gray-400" />}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{chat.timestamp}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{chat.lastMessage}</p>
                      {chat.unreadCount > 0 && (
                        <span className="ml-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-full min-w-[20px] text-center">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>


      </div>

      {/* Right Pane - Chat Window */}
      <div className={`${activeChat ? 'flex' : 'hidden lg:flex'} flex-1`}>
        {activeChat ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-6 border-b border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {isMobile && (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveChat(null)}
                      className="touch-target rounded-xl text-gray-600 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/10"
                    >
                      <ArrowLeft size={22} />
                    </motion.button>
                  )}
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-sm">
                      FG
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900 dark:text-white">Family Group</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">4 members • Online</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="touch-target rounded-xl text-green-600 hover:bg-green-50 dark:hover:bg-green-500/10"
                  >
                    <Phone size={20} />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="touch-target rounded-xl text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                  >
                    <Video size={20} />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="touch-target rounded-xl text-gray-600 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/10"
                  >
                    <MoreVertical size={20} />
                  </motion.button>
                </div>
              </div>
            </div>
            
            {/* Chat Messages Area */}
            <div className="flex-1 bg-gray-50 dark:bg-gray-900/30 p-6">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
                <p>Start chatting with your family!</p>
              </div>
            </div>
            
            {/* Message Input */}
            <div className="p-6 border-t border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900/50">
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-6 py-4 bg-gray-100 dark:bg-white/10 border-2 border-transparent rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-white/15 transition-all"
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="touch-target-comfortable rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all"
                >
                  <span className="text-lg">📤</span>
                </motion.button>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center p-8 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-slate-900/50 dark:to-blue-900/20">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center max-w-md"
            >
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-3xl flex items-center justify-center">
                <MessageCircle size={48} className="text-blue-500 dark:text-blue-400" />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Welcome to Linkup</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">Select a conversation to start messaging with your family and friends</p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNewChat(true)}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white font-semibold shadow-lg hover:shadow-xl transition-all flex items-center space-x-3 mx-auto"
              >
                <Plus size={22} />
                <span className="text-lg">Start New Chat</span>
              </motion.button>
            </motion.div>
          </div>
        )}
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