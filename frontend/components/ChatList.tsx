'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MoreVertical, Pin, Archive, VolumeX, Users, Lock, CheckCircle } from 'lucide-react'
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
}

interface ChatListProps {
  activeChat: string | null
  onChatSelect: (chatId: string) => void
  chatType: 'personal' | 'groups' | 'channels'
  searchQuery: string
}

export default function ChatList({ activeChat, onChatSelect, chatType, searchQuery }: ChatListProps) {
  const [chats, setChats] = useState<Chat[]>([])

  // Mock data based on chat type
  useEffect(() => {
    const mockChats: Record<string, Chat[]> = {
      personal: [
        {
          id: '1',
          name: 'Alice Johnson',
          lastMessage: 'Hey! How are you doing today? 😊',
          timestamp: '2m ago',
          unreadCount: 3,
          avatar: 'https://ui-avatars.com/api/?name=Alice+Johnson&background=4F46E5&color=fff',
          isOnline: true,
          isGroup: false,
          isChannel: false,
          isPinned: true,
          isMuted: false,
          isVerified: true,
          lastSeen: 'online'
        },
        {
          id: '2',
          name: 'Bob Smith',
          lastMessage: 'Can we meet tomorrow for the project discussion?',
          timestamp: '1h ago',
          unreadCount: 0,
          avatar: 'https://ui-avatars.com/api/?name=Bob+Smith&background=059669&color=fff',
          isOnline: false,
          isGroup: false,
          isChannel: false,
          isPinned: false,
          isMuted: false,
          isVerified: false,
          lastSeen: 'last seen 30 minutes ago'
        },
        {
          id: '3',
          name: 'Carol Davis',
          lastMessage: 'Thanks for the help! 🙏',
          timestamp: '3h ago',
          unreadCount: 1,
          avatar: 'https://ui-avatars.com/api/?name=Carol+Davis&background=DC2626&color=fff',
          isOnline: true,
          isGroup: false,
          isChannel: false,
          isPinned: false,
          isMuted: true,
          isVerified: false,
          lastSeen: 'online'
        }
      ],
      groups: [
        {
          id: 'g1',
          name: 'Team Project',
          lastMessage: 'Sarah: Great work everyone! 🎉',
          timestamp: '30m ago',
          unreadCount: 5,
          avatar: 'https://ui-avatars.com/api/?name=Team+Project&background=7C3AED&color=fff',
          isOnline: true,
          isGroup: true,
          isChannel: false,
          isPinned: true,
          isMuted: false,
          isVerified: false,
          participantCount: 12
        },
        {
          id: 'g2',
          name: 'Family Group',
          lastMessage: 'Mom: Dinner at 7 PM today',
          timestamp: '2h ago',
          unreadCount: 2,
          avatar: 'https://ui-avatars.com/api/?name=Family+Group&background=EA580C&color=fff',
          isOnline: true,
          isGroup: true,
          isChannel: false,
          isPinned: false,
          isMuted: false,
          isVerified: false,
          participantCount: 6
        }
      ],
      channels: [
        {
          id: 'c1',
          name: 'Tech News',
          lastMessage: 'New AI breakthrough announced by OpenAI',
          timestamp: '1h ago',
          unreadCount: 12,
          avatar: 'https://ui-avatars.com/api/?name=Tech+News&background=1D4ED8&color=fff',
          isOnline: true,
          isGroup: false,
          isChannel: true,
          isPinned: true,
          isMuted: false,
          isVerified: true,
          participantCount: 1250
        },
        {
          id: 'c2',
          name: 'Design Inspiration',
          lastMessage: 'Check out this amazing UI design trend',
          timestamp: '4h ago',
          unreadCount: 0,
          avatar: 'https://ui-avatars.com/api/?name=Design+Inspiration&background=BE185D&color=fff',
          isOnline: true,
          isGroup: false,
          isChannel: true,
          isPinned: false,
          isMuted: true,
          isVerified: true,
          participantCount: 890
        }
      ]
    }

    setChats(mockChats[chatType] || [])
  }, [chatType])

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

  return (
    <div className="h-full overflow-y-auto">
      {sortedChats.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-white/60 p-8">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-lg font-semibold mb-2">No {chatType} found</h3>
          <p className="text-sm text-center">
            {searchQuery 
              ? `No results for "${searchQuery}"`
              : `Start a new ${chatType.slice(0, -1)} to begin chatting`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-1 p-2">
          {sortedChats.map((chat, index) => (
            <motion.div
              key={chat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => onChatSelect(chat.id)}
              className={`relative p-3 cursor-pointer transition-all duration-200 rounded-xl group ${
                activeChat === chat.id 
                  ? 'bg-blue-500/20 border border-blue-500/30' 
                  : 'hover:bg-white/5'
              }`}
            >
              {/* Pin Indicator */}
              {chat.isPinned && (
                <div className="absolute top-2 right-2">
                  <Pin size={12} className="text-blue-400" />
                </div>
              )}

              <div className="flex items-center space-x-3">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-white/20">
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
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900"></div>
                  )}
                  
                  {/* Group/Channel Indicator */}
                  {(chat.isGroup || chat.isChannel) && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-slate-700 rounded-full border-2 border-slate-900 flex items-center justify-center">
                      {chat.isChannel ? (
                        <CheckCircle size={10} className="text-blue-400" />
                      ) : (
                        <Users size={10} className="text-white" />
                      )}
                    </div>
                  )}
                </div>

                {/* Chat Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-white truncate">{chat.name}</h3>
                      {chat.isVerified && (
                        <CheckCircle size={16} className="text-blue-400" />
                      )}
                      {chat.isMuted && (
                        <VolumeX size={14} className="text-white/40" />
                      )}
                      {chat.isChannel && (
                        <Lock size={14} className="text-white/40" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-white/60">{chat.timestamp}</span>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-white/10 transition-all"
                        onClick={(e) => {
                          e.stopPropagation()
                          // Handle more options
                        }}
                      >
                        <MoreVertical size={14} className="text-white/60" />
                      </motion.button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-white/70 truncate flex-1 mr-2">
                      {chat.lastMessage}
                    </p>
                    
                    <div className="flex items-center space-x-2">
                      {/* Participant Count for Groups/Channels */}
                      {(chat.isGroup || chat.isChannel) && chat.participantCount && (
                        <span className="text-xs text-white/50">
                          {formatParticipantCount(chat.participantCount)}
                        </span>
                      )}
                      
                      {/* Unread Badge */}
                      {chat.unreadCount > 0 && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={`min-w-[20px] h-5 px-2 rounded-full flex items-center justify-center text-xs font-bold ${
                            chat.isMuted 
                              ? 'bg-white/20 text-white/60' 
                              : 'bg-blue-500 text-white'
                          }`}
                        >
                          {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                        </motion.div>
                      )}
                    </div>
                  </div>
                  
                  {/* Last Seen for Personal Chats */}
                  {!chat.isGroup && !chat.isChannel && chat.lastSeen && !chat.isOnline && (
                    <p className="text-xs text-white/50 mt-1">{chat.lastSeen}</p>
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