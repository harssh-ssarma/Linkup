'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
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
      case 'sent':
        return <Check size={12} className="text-muted" />
      case 'delivered':
        return <CheckCheck size={12} className="text-muted" />
      case 'read':
        return <CheckCheck size={12} className="text-[var(--accent)]" />
      default: return null
    }
  }

  const getMessageIcon = (type?: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon size={12} className="text-muted" />
      case 'voice':
        return <Mic size={12} className="text-muted" />
      default: return null
    }
  }

  return (
    <div className="h-full overflow-y-auto">
      {sortedChats.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center p-6 text-muted sm:p-8">
          <div className="mb-4 text-4xl sm:text-6xl">💬</div>
          <h3 className="text-center text-base font-semibold text-foreground sm:text-lg">No {chatType || 'chats'} found</h3>
          <p className="mt-2 text-center text-xs sm:text-sm">
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
              className={`relative select-none rounded-xl transition-all duration-200 p-3 sm:p-4 group touch-manipulation ${
                activeChat === chat.id
                  ? 'bg-surface-strong'
                  : 'bg-surface-soft hover:bg-surface-strong'
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
                  <div className="h-10 w-10 overflow-hidden rounded-xl border border-subtle bg-surface sm:h-12 sm:w-12 sm:rounded-2xl">
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
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[var(--surface)] bg-green-500 sm:h-4 sm:w-4"></div>
                  )}
                  
                  {/* Group/Channel Indicator */}
                  {(chat.isGroup || chat.isChannel) && (
                    <div className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[var(--surface)] bg-[var(--accent)] sm:h-5 sm:w-5">
                      {chat.isChannel ? (
                        <CheckCircle size={8} className="text-inverse sm:h-2.5 sm:w-2.5" />
                      ) : (
                        <Users size={8} className="text-inverse sm:h-2.5 sm:w-2.5" />
                      )}
                    </div>
                  )}
                </div>

                {/* Chat Info */}
                <div className="flex-1 min-w-0">
                  <div className="mb-1 flex items-center justify-between">
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <h3 className="truncate text-sm font-semibold text-foreground sm:text-base">{chat.name}</h3>
                      {chat.isVerified && (
                        <CheckCircle size={12} className="text-[var(--accent)] sm:h-4 sm:w-4" />
                      )}
                      {chat.isMuted && (
                        <VolumeX size={10} className="text-muted sm:h-3.5 sm:w-3.5" />
                      )}
                      {chat.isChannel && (
                        <Lock size={10} className="text-muted sm:h-3.5 sm:w-3.5" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="whitespace-nowrap text-xs text-muted">{chat.timestamp}</span>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="touch-manipulation rounded-md p-1 opacity-0 transition-all hover:bg-surface-strong group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation()
                          // Handle more options
                        }}
                      >
                        <MoreVertical size={12} className="text-muted sm:h-3.5 sm:w-3.5" />
                      </motion.button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 flex-1 min-w-0">
                      {getStatusIcon(chat.messageStatus)}
                      {getMessageIcon(chat.messageType)}
                      <p className="min-w-0 truncate text-xs text-muted sm:text-sm">{chat.lastMessage}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {/* Participant Count for Groups/Channels */}
                      {(chat.isGroup || chat.isChannel) && chat.participantCount && (
                        <span className="hidden text-xs text-muted sm:inline">
                          {formatParticipantCount(chat.participantCount)}
                        </span>
                      )}
                      
                      {/* Unread Badge */}
                      {chat.unreadCount > 0 && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={`flex h-4 min-w-[16px] flex-shrink-0 items-center justify-center rounded-full px-1.5 text-xs font-semibold sm:h-5 sm:min-w-[20px] sm:px-2 ${
                            chat.isMuted
                              ? 'border border-subtle bg-surface-strong text-muted'
                              : 'menu-gradient shadow-soft'
                          }`}
                        >
                          {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                        </motion.div>
                      )}
                    </div>
                  </div>
                  
                  {/* Last Seen for Personal Chats */}
                  {!chat.isGroup && !chat.isChannel && chat.lastSeen && !chat.isOnline && (
                    <p className="mt-1 hidden text-xs text-muted sm:block">{chat.lastSeen}</p>
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