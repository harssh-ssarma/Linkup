'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus, MoreVertical } from 'lucide-react'
import Image from 'next/image'

interface Chat {
  id: string
  name: string
  lastMessage: string
  timestamp: string
  unreadCount: number
  avatar: string
  isOnline: boolean
}

interface ChatSidebarProps {
  activeChat: string | null
  onChatSelect: (chatId: string) => void
}

export default function ChatSidebar({ activeChat, onChatSelect }: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [chats, setChats] = useState<Chat[]>([
    {
      id: '1',
      name: 'Alice Johnson',
      lastMessage: 'Hey! How are you doing?',
      timestamp: '2m ago',
      unreadCount: 2,
      avatar: 'https://avatar.iran.liara.run/public/girl?username=alice',
      isOnline: true
    },
    {
      id: '2',
      name: 'Bob Smith',
      lastMessage: 'Can we meet tomorrow?',
      timestamp: '1h ago',
      unreadCount: 0,
      avatar: 'https://avatar.iran.liara.run/public/boy?username=bob',
      isOnline: false
    },
    {
      id: '3',
      name: 'Team Project',
      lastMessage: 'Sarah: Great work everyone! 🎉',
      timestamp: '3h ago',
      unreadCount: 5,
      avatar: 'https://avatar.iran.liara.run/public/boy?username=team',
      isOnline: true
    }
  ])

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full w-[200px]">
      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.map((chat, index) => (
          <motion.div
            key={chat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            onClick={() => onChatSelect(chat.id)}
            className={`p-4 cursor-pointer transition-all duration-200 border-b border-white/10 hover:bg-white/5 ${
              activeChat === chat.id ? 'bg-blue-500/20 border-l-4 border-l-blue-500' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              {/* Avatar */}
              <div className="relative">
                <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/20">
                  <Image
                    src={chat.avatar}
                    alt={chat.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                {chat.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900"></div>
                )}
              </div>

              {/* Chat Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-white truncate">{chat.name}</h3>
                  <span className="text-xs text-white/60">{chat.timestamp}</span>
                </div>
                <p className="text-sm text-white/70 truncate">{chat.lastMessage}</p>
              </div>

              {/* Unread Badge */}
              {chat.unreadCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold"
                >
                  {chat.unreadCount}
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* New Chat Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="m-4 p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-semibold flex items-center justify-center space-x-2 shadow-lg"
      >
        <Plus size={20} />
        <span>New Chat</span>
      </motion.button>
    </div>
  )
}