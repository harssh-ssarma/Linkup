'use client'

import { motion } from 'framer-motion'
import { Check, CheckCheck, Mic, Camera, File, Pin } from 'lucide-react'
import Image from 'next/image'

interface Chat {
  id: string
  name: string
  avatar: string
  lastMessage: string
  time: string
  unreadCount?: number
  isOnline?: boolean
  messageType?: 'text' | 'voice' | 'image' | 'file'
  messageStatus?: 'sent' | 'delivered' | 'read'
  isPinned?: boolean
  isGroup?: boolean
}

interface ChatListProps {
  activeChat: string | null
  onChatSelect: (chatId: string) => void
  chatType?: string
  searchQuery?: string
}

export default function ChatList({ activeChat, onChatSelect, searchQuery }: ChatListProps) {
  const chats: Chat[] = [
    {
      id: '1',
      name: 'Harsh',
      avatar: 'https://ui-avatars.com/api/?name=Harsh&background=4F46E5&color=fff',
      lastMessage: 'Hey! How are you doing?',
      time: '12:30',
      unreadCount: 2,
      isOnline: true,
      messageStatus: 'delivered',
      isPinned: true
    },
    {
      id: '2',
      name: 'Family Group',
      avatar: 'https://ui-avatars.com/api/?name=Family&background=059669&color=fff',
      lastMessage: 'Papa: Ghar aa jao dinner ke liye',
      time: '11:45',
      unreadCount: 5,
      messageType: 'text',
      isGroup: true
    },
    {
      id: '3',
      name: 'Aman',
      avatar: 'https://ui-avatars.com/api/?name=Aman&background=7C3AED&color=fff',
      lastMessage: 'Voice message',
      time: '10:20',
      messageType: 'voice',
      messageStatus: 'read'
    },
    {
      id: '4',
      name: 'Priya',
      avatar: 'https://ui-avatars.com/api/?name=Priya&background=DC2626&color=fff',
      lastMessage: 'Photo',
      time: 'Yesterday',
      messageType: 'image',
      messageStatus: 'sent'
    },
    {
      id: '5',
      name: 'Office Team',
      avatar: 'https://ui-avatars.com/api/?name=Office&background=EA580C&color=fff',
      lastMessage: 'Rahul: Meeting at 3 PM',
      time: 'Yesterday',
      unreadCount: 1,
      isGroup: true
    },
    {
      id: '6',
      name: 'Mohit',
      avatar: 'https://ui-avatars.com/api/?name=Mohit&background=0891B2&color=fff',
      lastMessage: 'Kal milte hain!',
      time: '2 days ago',
      messageStatus: 'read'
    }
  ]

  const filteredChats = searchQuery 
    ? chats.filter(chat => 
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : chats

  const getMessageIcon = (type?: string) => {
    switch (type) {
      case 'voice': return <Mic size={14} className="text-blue-400 flex-shrink-0" />
      case 'image': return <Camera size={14} className="text-green-400 flex-shrink-0" />
      case 'file': return <File size={14} className="text-purple-400 flex-shrink-0" />
      default: return null
    }
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'sent': return <Check size={14} className="text-white/60 flex-shrink-0" />
      case 'delivered': return <CheckCheck size={14} className="text-white/60 flex-shrink-0" />
      case 'read': return <CheckCheck size={14} className="text-blue-400 flex-shrink-0" />
      default: return null
    }
  }

  return (
    <div className="divide-y divide-white/10">
      {filteredChats.map((chat, index) => (
        <motion.div
          key={chat.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onChatSelect(chat.id)}
          className={`flex items-center px-3 sm:px-4 py-3 sm:py-4 cursor-pointer transition-all duration-200 relative hover:bg-white/5 ${
            activeChat === chat.id 
              ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 border-r-2 border-blue-400' 
              : ''
          }`}
        >
          {/* Pin Indicator */}
          {chat.isPinned && (
            <Pin size={12} className="absolute top-2 left-2 text-yellow-400 rotate-45" />
          )}

          {/* Avatar */}
          <div className="relative mr-3 flex-shrink-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden ring-2 ring-white/20">
              <Image
                src={chat.avatar}
                alt={chat.name}
                width={56}
                height={56}
                className="w-full h-full object-cover"
              />
            </div>
            {chat.isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-slate-900" />
            )}
          </div>

          {/* Chat Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-white font-semibold truncate pr-2 text-sm sm:text-base">
                {chat.name}
              </h3>
              <span className="text-xs text-white/60 whitespace-nowrap flex-shrink-0">
                {chat.time}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 flex-1 min-w-0">
                {getStatusIcon(chat.messageStatus)}
                {getMessageIcon(chat.messageType)}
                <p className="text-xs sm:text-sm text-white/70 truncate">
                  {chat.lastMessage}
                </p>
              </div>
              
              {chat.unreadCount && (
                <div className="ml-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center font-bold flex-shrink-0 shadow-lg">
                  {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}