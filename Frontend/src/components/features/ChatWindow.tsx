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
  Settings,
  Image as ImageIcon,
  FileText,
  MapPin,
  User,
  Camera,
  Music,
  BarChart3,
  Calendar,
  X
} from 'lucide-react'
import dynamic from 'next/dynamic'
import Header from '@/components/layout/Header'
import ContactProfile from '@/components/features/ContactProfile'
import SettingsModal from '@/components/features/SettingsModal'
import { ContextMenuItem } from '@/components/ui/ContextMenu'

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
  const [showAttachMenu, setShowAttachMenu] = useState(false)
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
      <div className="base-gradient flex flex-1 items-center justify-center">
        <div className="glass-card mx-4 max-w-sm rounded-2xl p-6 text-center sm:p-8">
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full border border-subtle bg-surface-soft sm:mb-6 sm:h-32 sm:w-32">
            <Bot size={32} className="text-muted sm:h-12 sm:w-12" />
          </div>
          <h3 className="text-lg font-semibold text-foreground sm:text-xl">Welcome to Linkup</h3>
          <p className="mt-2 text-sm text-muted sm:text-base">Select a chat to start messaging</p>
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

  // Chat menu items
  const chatMenuItems: ContextMenuItem[] = [
    { icon: Bot, label: 'AI Assistant', action: () => setShowAIAssistant(!showAIAssistant) },
    { icon: MoreVertical, label: 'View Contact', action: () => setShowContactProfile(true) },
    { icon: Star, label: 'Add to Favorites', action: () => console.log('Add to Favorites') },
    { icon: Bell, label: 'Mute Notifications', action: () => { setSettingsSection('notifications'); setShowSettings(true) } },
    { icon: Shield, label: 'Privacy Settings', action: () => { setSettingsSection('privacy'); setShowSettings(true) } },
    { icon: Settings, label: 'Chat Settings', action: () => { setSettingsSection('main'); setShowSettings(true) } },
  ]

  return (
    <div className="base-gradient flex h-full flex-col">
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
        menuItems={chatMenuItems}
        onTitleClick={() => setShowContactProfile(true)}
      />

      {/* Messages */}
  <div className="scrollbar-hide flex-1 space-y-3 overflow-y-auto p-3 sm:space-y-4 sm:p-4">
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
              <div className={`max-w-[78%] rounded-2xl px-3 py-2 sm:max-w-[72%] sm:px-4 sm:py-3 lg:max-w-[68%] ${
                message.sender === 'me'
                  ? 'chat-bubble-sent'
                  : message.sender === 'ai'
                  ? 'chat-bubble-ai glass-card-premium'
                  : 'chat-bubble-received'
              }`}>
                {message.sender === 'ai' && (
                  <div className="mb-1 flex items-center space-x-1 text-muted">
                    <Bot size={12} className="text-[var(--accent)] sm:h-4 sm:w-4" />
                    <span className="text-xs font-medium">AI Assistant</span>
                  </div>
                )}
                <p className="leading-relaxed text-sm sm:text-base">{message.content}</p>
                <div className="mt-1 flex items-center justify-between sm:mt-2">
                  <p className={`text-xs ${
                    message.sender === 'me' || message.sender === 'ai'
                      ? 'text-inverse opacity-80'
                      : 'text-muted'
                  }`}>
                    {message.timestamp}
                  </p>
                  {message.sender === 'me' && message.status && (
                    <div className="flex items-center gap-1 text-inverse opacity-80">
                      {message.status === 'sent' && <Check size={12} />}
                      {message.status === 'delivered' && <CheckCheck size={12} />}
                      {message.status === 'read' && <CheckCheck size={12} className="text-[var(--accent)]" />}
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
            <div className="rounded-lg border border-subtle bg-surface-soft px-3 py-2 text-muted shadow-soft sm:rounded-2xl sm:px-4 sm:py-3">
              <div className="flex space-x-2">
                <span className="typing-indicator-dot" />
                <span className="typing-indicator-dot" />
                <span className="typing-indicator-dot" />
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
            className="glass-effect flex-shrink-0 border-t border-subtle p-3 sm:p-4"
          >
            <div className="mb-3 flex items-center space-x-2">
              <Bot className="text-[var(--accent)]" size={20} />
              <span className="text-sm font-semibold text-foreground sm:text-base">AI Assistant</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="chip-button">
                Smart Reply
              </button>
              <button type="button" className="chip-button">
                Translate
              </button>
              <button type="button" className="chip-button">
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
        className="relative flex-shrink-0 glass-effect border-t border-subtle p-3 sm:p-4"
      >
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Message Input Container with Attachment & Emoji inside */}
          <div className="flex-1 relative flex items-center h-[46px] rounded-3xl border border-subtle bg-surface shadow-soft overflow-hidden">
            {/* Attachment Button inside input (left) */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.preventDefault()
                setShowAttachMenu(!showAttachMenu)
              }}
              onMouseDown={(e) => e.preventDefault()}
              className="flex-shrink-0 p-2.5 text-muted hover:bg-[rgba(37,99,235,0.12)] hover:text-[var(--accent)] transition-all rounded-xl ml-1 cursor-pointer"
              aria-label="Attach file"
            >
              <Paperclip size={18} />
            </motion.button>
            
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 resize-none bg-transparent px-2 text-sm text-foreground placeholder:text-muted !outline-none !border-none focus:!outline-none focus:!ring-0 focus:!border-transparent sm:text-base"
            />
            
            {/* Emoji Button inside input (right) */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.preventDefault()
                setShowEmojiPicker(!showEmojiPicker)
              }}
              onMouseDown={(e) => e.preventDefault()}
              className="flex-shrink-0 p-2.5 text-muted hover:bg-[rgba(37,99,235,0.12)] hover:text-[var(--accent)] transition-all rounded-xl mr-1 cursor-pointer"
              aria-label="Emoji"
            >
              <Smile size={18} />
            </motion.button>
          </div>
          
          {/* Send/Mic Button */}
          {newMessage.trim() ? (
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={sendMessage}
              className="flex-shrink-0 h-[46px] w-[46px] flex items-center justify-center rounded-full bg-[var(--accent)] text-inverse shadow-soft hover:bg-[var(--accent-strong)] transition-colors"
              aria-label="Send message"
            >
              <Send size={20} className="ml-0.5" />
            </motion.button>
          ) : (
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0 h-[46px] w-[46px] flex items-center justify-center rounded-full bg-surface-soft border border-subtle text-muted hover:text-foreground transition-colors shadow-soft"
              aria-label="Record voice message"
            >
              <Mic size={20} />
            </motion.button>
          )}
        </div>
        
        {/* Attachment Menu */}
        <AnimatePresence>
          {showAttachMenu && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowAttachMenu(false)}
              />
              <div className="context-menu" style={{ position: 'absolute', bottom: '100%', left: '12px', marginBottom: '8px', width: '320px', padding: '8px 0' }}>
                <div className="grid grid-cols-3 gap-2 p-2">
                <button
                  onClick={() => { console.log('Photos'); setShowAttachMenu(false) }}
                  className="context-menu-item !flex-col !items-center !gap-2 !p-3 !rounded-xl"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(147,51,234,0.16)]">
                    <ImageIcon size={20} className="text-purple-500" />
                  </div>
                  <span className="text-xs font-medium">Photos</span>
                </button>
                
                <button
                  onClick={() => { console.log('Document'); setShowAttachMenu(false) }}
                  className="context-menu-item !flex-col !items-center !gap-2 !p-3 !rounded-xl"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(59,130,246,0.16)]">
                    <FileText size={20} className="text-blue-500" />
                  </div>
                  <span className="text-xs font-medium">Document</span>
                </button>
                
                <button
                  onClick={() => { console.log('Camera'); setShowAttachMenu(false) }}
                  className="context-menu-item !flex-col !items-center !gap-2 !p-3 !rounded-xl"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(236,72,153,0.16)]">
                    <Camera size={20} className="text-pink-500" />
                  </div>
                  <span className="text-xs font-medium">Camera</span>
                </button>
                
                <button
                  onClick={() => { console.log('Location'); setShowAttachMenu(false) }}
                  className="context-menu-item !flex-col !items-center !gap-2 !p-3 !rounded-xl"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(34,197,94,0.16)]">
                    <MapPin size={20} className="text-green-500" />
                  </div>
                  <span className="text-xs font-medium">Location</span>
                </button>
                
                <button
                  onClick={() => { console.log('Contact'); setShowAttachMenu(false) }}
                  className="context-menu-item !flex-col !items-center !gap-2 !p-3 !rounded-xl"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(249,115,22,0.16)]">
                    <User size={20} className="text-orange-500" />
                  </div>
                  <span className="text-xs font-medium">Contact</span>
                </button>
                
                <button
                  onClick={() => { console.log('Audio'); setShowAttachMenu(false) }}
                  className="context-menu-item !flex-col !items-center !gap-2 !p-3 !rounded-xl"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(14,165,233,0.16)]">
                    <Music size={20} className="text-sky-500" />
                  </div>
                  <span className="text-xs font-medium">Audio</span>
                </button>
                
                <button
                  onClick={() => { console.log('Poll'); setShowAttachMenu(false) }}
                  className="context-menu-item !flex-col !items-center !gap-2 !p-3 !rounded-xl"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(234,179,8,0.16)]">
                    <BarChart3 size={20} className="text-yellow-500" />
                  </div>
                  <span className="text-xs font-medium">Poll</span>
                </button>
                
                <button
                  onClick={() => { console.log('Event'); setShowAttachMenu(false) }}
                  className="context-menu-item !flex-col !items-center !gap-2 !p-3 !rounded-xl"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(239,68,68,0.16)]">
                    <Calendar size={20} className="text-red-500" />
                  </div>
                  <span className="text-xs font-medium">Event</span>
                </button>
                
                <button
                  onClick={() => { console.log('Video'); setShowAttachMenu(false) }}
                  className="context-menu-item !flex-col !items-center !gap-2 !p-3 !rounded-xl"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(168,85,247,0.16)]">
                    <Video size={20} className="text-purple-400" />
                  </div>
                  <span className="text-xs font-medium">Video</span>
                </button>
                </div>
              </div>
            </>
          )}
        </AnimatePresence>
        
        {/* Emoji Picker */}
        <AnimatePresence>
          {showEmojiPicker && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowEmojiPicker(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-full right-3 mb-2 z-50 overflow-hidden rounded-2xl border border-subtle shadow-deep"
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
            </>
          )}
        </AnimatePresence>
      </motion.div>

    
      { <SettingsModal 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        initialSection={settingsSection}
      /> }
    </div>
  )
}
