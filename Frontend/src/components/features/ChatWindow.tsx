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
  CheckCheck
} from 'lucide-react'
import dynamic from 'next/dynamic'

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
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

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

  return (
    <div className="flex flex-col h-full base-gradient text-white">
      {/* Header */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex-shrink-0 glass-effect border-b border-white/20 p-3 sm:p-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onBack}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 text-white flex-shrink-0"
            >
              <ArrowLeft size={20} />
            </motion.button>
            
            <div className="relative flex-shrink-0">
              <img 
                src={chat.avatar} 
                alt={chat.name}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
              />
              {chat.isOnline && (
                <div className="absolute bottom-0 right-0 w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full border-2 border-white"></div>
              )}
            </div>
            
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-white text-sm sm:text-base truncate">{chat.name}</h3>
              <p className="text-xs sm:text-sm text-white/60 truncate">
                {chat.status || (chat.isOnline ? 'Online' : 'Last seen recently')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-lg hover:bg-white/10 text-white"
            >
              <Phone size={18} className="sm:w-5 sm:h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-lg hover:bg-white/10 text-white"
            >
              <Video size={18} className="sm:w-5 sm:h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowAIAssistant(!showAIAssistant)}
              className={`p-2 rounded-lg text-white transition-colors ${
                showAIAssistant 
                  ? 'menu-gradient' 
                  : 'hover:bg-white/10'
              }`}
            >
              <Bot size={18} className="sm:w-5 sm:h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="hidden sm:block p-2 rounded-lg hover:bg-white/10 text-white"
            >
              <MoreVertical size={18} className="sm:w-5 sm:h-5" />
            </motion.button>
          </div>
        </div>
      </motion.div>

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
                  ? 'menu-gradient text-white'
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
            <div className="bg-white/10 backdrop-blur-sm text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-2xl">
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

      {/* Message Input */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex-shrink-0 glass-effect border-t border-white/20 p-3 sm:p-4"
      >
        <div className="flex items-center space-x-2 sm:space-x-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10"
          >
            <Paperclip size={18} className="sm:w-5 sm:h-5" />
          </motion.button>
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-sm sm:text-base pr-12"
            />
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
            >
              <Smile size={18} className="sm:w-5 sm:h-5" />
            </motion.button>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10"
          >
            <Mic size={18} className="sm:w-5 sm:h-5" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={sendMessage}
            className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white shadow-lg"
          >
            <Send size={18} className="sm:w-5 sm:h-5" />
          </motion.button>
        </div>
        
        {/* Emoji Picker */}
        <AnimatePresence>
          {showEmojiPicker && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-16 sm:bottom-20 right-4"
            >
              <EmojiPicker
                onEmojiClick={(emojiData) => {
                  setNewMessage(prev => prev + emojiData.emoji)
                  setShowEmojiPicker(false)
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
