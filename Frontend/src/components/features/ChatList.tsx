'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MoreVertical, Pin, Archive, VolumeX, Users, Lock, CheckCircle, Check, CheckCheck, Image as ImageIcon, Mic, Edit3, Trash2, Bell, BellOff } from 'lucide-react'
import Image from 'next/image'

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
}

interface ChatListProps {
  activeChat: string | null
  onChatSelect: (chatId: string) => void
  chatType: 'personal' | 'groups' | 'channels'
  searchQuery: string
  chats?: Chat[]
}

// Sample data for demonstration
const sampleChats: Chat[] = [
  {
    id: '1',
    name: 'John Doe',
    lastMessage: 'Hey! How are you doing?',
    timestamp: '2:30 PM',
    unreadCount: 3,
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff',
    isOnline: true,
    isGroup: false,
    isChannel: false,
    isPinned: true,
    isMuted: false,
    isVerified: true,
    messageType: 'text',
    messageStatus: 'delivered'
  },
  {
    id: '2',
    name: 'Family Group',
    lastMessage: 'Mom: Don\'t forget dinner tonight!',
    timestamp: '1:45 PM',
    unreadCount: 0,
    avatar: 'https://ui-avatars.com/api/?name=Family+Group&background=8b5cf6&color=fff',
    isOnline: false,
    isGroup: true,
    isChannel: false,
    isPinned: false,
    isMuted: true,
    isVerified: false,
    participantCount: 5,
    messageType: 'text',
    messageStatus: 'read'
  },
  {
    id: '3',
    name: 'Sarah Wilson',
    lastMessage: 'Photo',
    timestamp: '12:20 PM',
    unreadCount: 1,
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Wilson&background=ec4899&color=fff',
    isOnline: true,
    isGroup: false,
    isChannel: false,
    isPinned: false,
    isMuted: false,
    isVerified: false,
    messageType: 'image',
    messageStatus: 'sent'
  },
  {
    id: '4',
    name: 'Tech Updates',
    lastMessage: 'New features coming soon!',
    timestamp: '11:30 AM',
    unreadCount: 0,
    avatar: 'https://ui-avatars.com/api/?name=Tech+Updates&background=10b981&color=fff',
    isOnline: false,
    isGroup: false,
    isChannel: true,
    isPinned: false,
    isMuted: false,
    isVerified: true,
    participantCount: 1250,
    messageType: 'text',
    messageStatus: 'read'
  }
]

export default function ChatList({ activeChat, onChatSelect, chatType, searchQuery, chats = sampleChats }: ChatListProps) {
  const [longPressMenu, setLongPressMenu] = useState<{
    chat: Chat | null
    position: { x: number; y: number }
  }>({ chat: null, position: { x: 0, y: 0 } })
  const [touchStart, setTouchStart] = useState<{ x: number; y: number; time: number } | null>(null)

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Sort chats: pinned first, then by timestamp
  const sortedChats = [...filteredChats].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return 0 // Keep original order for same pin status
  })

  const formatParticipantCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count.toString()
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'sent': return <Check size={12} className="text-slate-400" />
      case 'delivered': return <CheckCheck size={12} className="text-slate-400" />
      case 'read': return <CheckCheck size={12} className="text-blue-500" />
      default: return null
    }
  }

  const getMessageIcon = (type?: string) => {
    switch (type) {
      case 'image': return <ImageIcon size={12} className="text-slate-500" />
      case 'voice': return <Mic size={12} className="text-slate-500" />
      default: return null
    }
  }

  return (
    <div className="h-full overflow-y-auto">
      {sortedChats.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-white/50 p-6 sm:p-8">
          <div className="text-4xl sm:text-6xl mb-4">💬</div>
          <h3 className="text-base sm:text-lg font-semibold mb-2 text-center text-white/70">No {chatType || 'chats'} found</h3>
          <p className="text-xs sm:text-sm text-center">
            {searchQuery 
              ? `No results for "${searchQuery}"`
              : `Start a new ${chatType ? chatType.slice(0, -1) : 'conversation'} to begin chatting`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-1 sm:space-y-2 p-2 sm:p-4 h-full">
          {sortedChats.map((chat, index) => (
            <motion.div
              key={chat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={(e) => {
                // Only handle click on desktop (non-touch devices)
                if (!touchStart) {
                  onChatSelect(chat.id)
                }
              }}
              onTouchStart={(e) => {
                const touch = e.touches[0]
                setTouchStart({ x: touch.clientX, y: touch.clientY, time: Date.now() })
                
                // Add haptic feedback for mobile
                if ('vibrate' in navigator) {
                  setTimeout(() => {
                    if (touchStart && Date.now() - touchStart.time > 400) {
                      navigator.vibrate(50) // Short vibration for long press
                    }
                  }, 400)
                }
              }}
              onTouchEnd={(e) => {
                if (!touchStart) return
                const touchEnd = e.changedTouches[0]
                const timeDiff = Date.now() - touchStart.time
                const distance = Math.sqrt(
                  Math.pow(touchEnd.clientX - touchStart.x, 2) + 
                  Math.pow(touchEnd.clientY - touchStart.y, 2)
                )
                
                if (timeDiff < 350 && distance < 25) {
                  // Regular tap - select chat
                  onChatSelect(chat.id)
                }
                setTouchStart(null)
              }}
              onTouchMove={(e) => {
                if (!touchStart) return
                const touch = e.touches[0]
                const distance = Math.sqrt(
                  Math.pow(touch.clientX - touchStart.x, 2) + 
                  Math.pow(touch.clientY - touchStart.y, 2)
                )
                
                // Cancel long press if user moves finger too much
                if (distance > 20) {
                  setTouchStart(null)
                }
              }}
              className={`relative p-3 sm:p-4 cursor-pointer transition-all duration-200 rounded-xl group touch-manipulation select-none ${
                activeChat === chat.id 
                  ? 'bg-white/20 border-2 border-indigo-400' 
                  : 'bg-white/10 hover:bg-white/20 border-2 border-transparent hover:border-indigo-500/50'
              }`}
            >
              {/* Pin Indicator */}
              {chat.isPinned && (
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                  <Pin size={10} className="text-blue-500 sm:w-3 sm:h-3" />
                </div>
              )}

              <div className="flex items-center space-x-3 sm:space-x-4">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl overflow-hidden ring-1 sm:ring-2 ring-white/20">
                    <Image
                      src={chat.avatar}
                      alt={chat.name}
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Online Status */}
                  {chat.isOnline && !chat.isGroup && !chat.isChannel && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                  
                  {/* Group/Channel Indicator */}
                  {(chat.isGroup || chat.isChannel) && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-indigo-600 rounded-full border-2 border-white flex items-center justify-center">
                      {chat.isChannel ? (
                        <CheckCircle size={8} className="text-blue-400 sm:w-2.5 sm:h-2.5" />
                      ) : (
                        <Users size={8} className="text-white sm:w-2.5 sm:h-2.5" />
                      )}
                    </div>
                  )}
                </div>

                {/* Chat Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <h3 className="font-semibold text-white truncate text-sm sm:text-base">{chat.name}</h3>
                      {chat.isVerified && (
                        <CheckCircle size={12} className="text-blue-400 sm:w-4 sm:h-4" />
                      )}
                      {chat.isMuted && (
                        <VolumeX size={10} className="text-white/40 sm:w-3.5 sm:h-3.5" />
                      )}
                      {chat.isChannel && (
                        <Lock size={10} className="text-white/40 sm:w-3.5 sm:h-3.5" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-white/60 whitespace-nowrap">{chat.timestamp}</span>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-white/10 transition-all touch-manipulation"
                        onClick={(e) => {
                          e.stopPropagation()
                          // Handle more options
                        }}
                      >
                        <MoreVertical size={12} className="text-white/60 sm:w-3.5 sm:h-3.5" />
                      </motion.button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 flex-1 min-w-0">
                      {getStatusIcon(chat.messageStatus)}
                      {getMessageIcon(chat.messageType)}
                      <p className="text-xs sm:text-sm text-white/70 truncate">{chat.lastMessage}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {/* Participant Count for Groups/Channels */}
                      {(chat.isGroup || chat.isChannel) && chat.participantCount && (
                        <span className="text-xs text-white/50 hidden sm:inline">
                          {formatParticipantCount(chat.participantCount)}
                        </span>
                      )}
                      
                      {/* Unread Badge */}
                      {chat.unreadCount > 0 && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={`min-w-[16px] h-4 sm:min-w-[20px] sm:h-5 px-1.5 sm:px-2 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                            chat.isMuted 
                              ? 'bg-white/20 text-white/60' 
                              : 'menu-gradient text-white shadow-lg'
                          }`}
                        >
                          {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                        </motion.div>
                      )}
                    </div>
                  </div>
                  
                  {/* Last Seen for Personal Chats */}
                  {!chat.isGroup && !chat.isChannel && chat.lastSeen && !chat.isOnline && (
                    <p className="text-xs text-white/50 mt-1 hidden sm:block">{chat.lastSeen}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}