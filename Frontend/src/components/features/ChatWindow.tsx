'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  Phone, 
  Video, 
  MoreVertical, 
  Send, 
  Paperclip, 
  Smile, 
  Mic, 
  Bot, 
  Check,
  CheckCheck,
  Bell,
  Star,
  Shield,
  Settings
} from 'lucide-react'
import dynamic from 'next/dynamic'
import Header from '@/components/layout/Header'
import ContactProfile from '@/components/features/ContactProfile'
import SettingsModal from '@/components/features/SettingsModal'

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false })

interface Message {
  id: string
  sender: 'me' | 'other' | 'ai'
  content: string
  timestamp: string
  status?: 'sent' | 'delivered' | 'read'
}

interface Chat {
  id: string
  name: string
  avatar: string
  lastMessage: string
  timestamp: string
  unreadCount: number
  isOnline?: boolean
  status?: string
}

interface ChatWindowProps {
  chat?: Chat | null
  onBack?: () => void
}

export default function ChatWindow({ chat, onBack }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'other',
      content: 'Hey! How are you doing?',
      timestamp: '10:30 AM',
      status: 'read'
    },
    {
      id: '2',
      sender: 'me',
      content: 'I\'m good, thanks! How about you?',
      timestamp: '10:32 AM',
      status: 'read'
    },
    {
      id: '3',
      sender: 'ai',
      content: 'I can help you compose a response or provide suggestions for this conversation.',
      timestamp: '10:33 AM',
      status: 'delivered'
    },
    {
      id: '4',
      sender: 'other',
      content: 'Just finished a great workout! 💪',
      timestamp: '10:35 AM',
      status: 'read'
    }
  ])

  const [newMessage, setNewMessage] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [showContactProfile, setShowContactProfile] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [settingsSection, setSettingsSection] = useState<'main' | 'account' | 'privacy' | 'notifications' | 'storage' | 'help'>('main')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [newMessage])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = () => {
    if (newMessage.trim() === '') return

    const message: Message = {
      id: Date.now().toString(),
      sender: 'me',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')
    setShowEmojiPicker(false)

    // Simulate typing indicator
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      // Simulate response
      const response: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'other',
        content: 'Thanks for your message!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'delivered'
      }
      setMessages(prev => [...prev, response])
    }, 2000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center base-gradient">
        <div className="text-center p-4">
          <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4 sm:mb-6 rounded-full bg-white/10 flex items-center justify-center">
            <Bot size={32} className="sm:w-12 sm:h-12 text-white/50" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Welcome to Linkup</h3>
          <p className="text-sm sm:text-base text-white/60">Select a chat to start messaging</p>
        </div>
      </div>
    )
  }

  // Sample contact data
  const contactData = {
    id: chat?.id || '1',
    name: chat?.name || 'Unknown',
    phone: '+1 234 567 8900',
    avatar: chat?.avatar || 'https://ui-avatars.com/api/?name=Unknown&background=6366f1&color=fff',
    isOnline: chat?.isOnline || false,
    lastSeen: 'Last seen 2 hours ago',
    bio: 'Hey there! I am using Linkup.',
    isVerified: true,
    isMuted: false,
    isBlocked: false,
    isStarred: false,
    email: 'john@example.com',
    location: 'New York, USA',
    website: 'https://johndoe.com',
    joinedDate: 'January 2023'
  }

  if (showContactProfile) {
    return (
      <ContactProfile 
        contact={contactData}
        onBack={() => setShowContactProfile(false)}
      />
    )
  }

  return (
    <div className="flex flex-col h-full base-gradient text-white">
      {/* WhatsApp-style Header */}
      <Header 
        showBackButton={true}
        onBackClick={onBack}
        title={chat.name}
        subtitle={chat.status || (chat.isOnline ? 'Online' : 'Last seen recently')}
        actionButtons={[
          { icon: Phone, label: 'Voice Call', action: () => console.log('Voice Call') },
          { icon: Video, label: 'Video Call', action: () => console.log('Video Call') }
        ]}
        menuItems={[
          { icon: Bot, label: 'AI Assistant', action: () => setShowAIAssistant(!showAIAssistant) },
          { icon: MoreVertical, label: 'View Contact', action: () => setShowContactProfile(true) },
          { icon: Star, label: 'Add to Favorites', action: () => console.log('Add to Favorites') },
          { icon: Bell, label: 'Mute Notifications', action: () => { setSettingsSection('notifications'); setShowSettings(true) } },
          { icon: Shield, label: 'Privacy Settings', action: () => { setSettingsSection('privacy'); setShowSettings(true) } },
          { icon: Settings, label: 'Chat Settings', action: () => { setSettingsSection('main'); setShowSettings(true) } },
        ]}
        onTitleClick={() => setShowContactProfile(true)}
      />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs sm:max-w-sm lg:max-w-md xl:max-w-lg px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-2xl ${
                message.sender === 'me' 
                  ? 'chat-bubble-sent text-white' 
                  : message.sender === 'ai'
                  ? 'accent-gradient text-white glass-card-premium'
                  : 'chat-bubble-received text-white backdrop-blur-sm'
              }`}>
                {message.sender === 'ai' && (
                  <div className="flex items-center space-x-1 mb-1">
                    <Bot size={12} className="sm:w-4 sm:h-4" />
                    <span className="text-xs opacity-80">AI Assistant</span>
                  </div>
                )}
                <p className="text-sm sm:text-base leading-relaxed">{message.content}</p>
                <div className="flex items-center justify-between mt-1 sm:mt-2">
                  <p className={`text-xs ${
                    message.sender === 'me' || message.sender === 'ai' ? 'text-white/70' : 'text-white/60'
                  }`}>
                    {message.timestamp}
                  </p>
                  {message.sender === 'me' && message.status && (
                    <div className="flex items-center text-white/70">
                      {message.status === 'sent' && <Check size={12} />}
                      {message.status === 'delivered' && <CheckCheck size={12} />}
                      {message.status === 'read' && <CheckCheck size={12} className="text-blue-300" />}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-gradient-to-r from-indigo-600/60 to-purple-600/60 backdrop-blur-sm text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-2xl border border-white/20">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* AI Assistant Panel */}
      <AnimatePresence>
        {showAIAssistant && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex-shrink-0 glass-effect border-t border-white/20 p-3 sm:p-4"
          >
            <div className="flex items-center space-x-2 mb-3">
              <Bot className="text-purple-400" size={20} />
              <span className="text-white font-semibold text-sm sm:text-base">AI Assistant</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="px-2 sm:px-3 py-1 bg-white/20 text-white rounded-full text-xs sm:text-sm hover:bg-white/30 transition-colors">
                Smart Reply
              </button>
              <button className="px-2 sm:px-3 py-1 bg-white/20 text-white rounded-full text-xs sm:text-sm hover:bg-white/30 transition-colors">
                Translate
              </button>
              <button className="px-2 sm:px-3 py-1 bg-white/20 text-white rounded-full text-xs sm:text-sm hover:bg-white/30 transition-colors">
                Summarize
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WhatsApp-style Message Input */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative flex-shrink-0 glass-effect border-t border-white/20 p-3 sm:p-4"
      >
        <div className="flex items-end space-x-2 sm:space-x-3">
          {/* Attachment Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2.5 rounded-full glass-card hover:bg-white/10 transition-colors text-white/60 hover:text-white flex-shrink-0"
          >
            <Paperclip size={20} />
          </motion.button>
          
          {/* Message Input Container */}
          <div className="flex-1 relative min-h-[44px] flex items-center">
            <div className="w-full relative">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                rows={1}
                style={{ height: 'auto', minHeight: '44px', maxHeight: '120px' }}
                className="w-full message-input text-sm sm:text-base resize-none pr-12 py-3 leading-5"
              />
              
              {/* Emoji Button inside input */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
              >
                <Smile size={20} />
              </motion.button>
            </div>
          </div>
          
          {/* Send/Mic Button - WhatsApp Style */}
          {newMessage.trim() ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={sendMessage}
              className="p-3 rounded-full btn-primary shadow-lg flex-shrink-0 min-w-[48px] min-h-[48px] flex items-center justify-center"
            >
              <Send size={20} className="ml-0.5" />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 rounded-full glass-card hover:bg-white/10 transition-colors text-white/60 hover:text-white flex-shrink-0 min-w-[48px] min-h-[48px] flex items-center justify-center"
            >
              <Mic size={20} />
            </motion.button>
          )}
        </div>
        
        {/* Simple Clean Emoji Picker */}
        <AnimatePresence>
          {showEmojiPicker && (
            <div className="fixed inset-0 z-50 flex items-end justify-center">
              {/* Backdrop */}
              <div 
                className="absolute inset-0 bg-black/20" 
                onClick={() => setShowEmojiPicker(false)}
              />
              
              {/* Emoji Picker */}
              <motion.div
                initial={{ y: 300, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 300, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative mb-20 mx-4 rounded-2xl overflow-hidden"
                style={{
                  background: '#1a1b23',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)'
                }}
              >
                <EmojiPicker
                  onEmojiClick={(emojiData) => {
                    setNewMessage(prev => prev + emojiData.emoji)
                    setShowEmojiPicker(false)
                  }}
                  width={320}
                  height={420}
                  skinTonesDisabled
                  searchDisabled={false}
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSignOut={() => {
          setShowSettings(false)
          // Handle sign out
        }}
        initialSection={settingsSection}
      />
    </div>
  )
}
