'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  MoreVertical, 
  Smile, 
  Paperclip, 
  Mic, 
  Send,
  Check,
  CheckCheck,
  Phone,
  Video
} from 'lucide-react'
import Image from 'next/image'

interface Message {
  id: string
  text: string
  time: string
  isSent: boolean
  status?: 'sent' | 'delivered' | 'read'
  type?: 'text' | 'image' | 'voice'
}

interface ChatWindowProps {
  chatId: string
  onBack?: () => void
}

export default function ChatWindow({ chatId, onBack }: ChatWindowProps) {
  const [message, setMessage] = useState('')
  const [messages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hey! How are you doing?',
      time: '12:30',
      isSent: false
    },
    {
      id: '2',
      text: 'I\'m doing great! Just finished work. How about you?',
      time: '12:32',
      isSent: true,
      status: 'read'
    },
    {
      id: '3',
      text: 'That\'s awesome! I\'m planning to go out for dinner tonight. Want to join?',
      time: '12:35',
      isSent: false
    },
    {
      id: '4',
      text: 'Sounds perfect! What time and where?',
      time: '12:36',
      isSent: true,
      status: 'delivered'
    }
  ])

  const contact = {
    name: 'Harsh',
    avatar: 'https://ui-avatars.com/api/?name=Harsh&background=4F46E5&color=fff',
    isOnline: true,
    lastSeen: 'online'
  }

  const handleSend = () => {
    if (message.trim()) {
      // Handle send message
      setMessage('')
    }
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'sent': return <Check size={14} className="text-white/60" />
      case 'delivered': return <CheckCheck size={14} className="text-white/60" />
      case 'read': return <CheckCheck size={14} className="text-blue-400" />
      default: return null
    }
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="glass-effect border-b border-white/20 px-3 sm:px-4 py-2 sm:py-3 flex items-center">
        {/* Back Button - Mobile & Tablet Only */}
        {onBack && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="mr-2 sm:mr-3 p-1.5 sm:p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors lg:hidden"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </motion.button>
        )}

        {/* Contact Info */}
        <div className="flex items-center flex-1 min-w-0">
          <div className="relative mr-2 sm:mr-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden ring-1 sm:ring-2 ring-blue-500/30">
              <Image
                src={contact.avatar}
                alt={contact.name}
                width={56}
                height={56}
                className="w-full h-full object-cover"
              />
            </div>
            {contact.isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full border-1 sm:border-2 border-slate-900" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-semibold truncate text-sm sm:text-base">{contact.name}</h2>
            <p className="text-xs sm:text-sm text-green-400">{contact.lastSeen}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="p-1.5 sm:p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="p-1.5 sm:p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Video className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="p-1.5 sm:p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
        </div>
      </div>

      {/* Messages */}
      <div 
        className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 sm:py-4 space-y-2 sm:space-y-3"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='a' patternUnits='userSpaceOnUse' width='20' height='20' patternTransform='scale(0.5) rotate(0)'%3e%3crect x='0' y='0' width='100%25' height='100%25' fill='%23000000'/%3e%3cpath d='m0 10h20v1h-20zm10-10v20h1v-20z' stroke-width='0.1' stroke='%23ffffff' fill='none' opacity='0.02'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100%25' height='100%25' fill='url(%23a)'/%3e%3c/svg%3e")`,
        }}
      >
        {messages.map((msg, index) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex ${msg.isSent ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[80%] px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl backdrop-blur-md border ${
                msg.isSent
                  ? 'bg-gradient-to-r from-blue-500/80 to-purple-600/80 border-blue-400/30 text-white ml-auto'
                  : 'bg-white/10 border-white/20 text-white mr-auto'
              }`}
            >
              <p className="text-xs sm:text-sm leading-relaxed break-words">{msg.text}</p>
              <div className="flex items-center justify-end space-x-1 mt-1 sm:mt-2">
                <span className="text-xs text-white/70">{msg.time}</span>
                {msg.isSent && getStatusIcon(msg.status)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Input Area */}
      <div className="glass-effect border-t border-white/20 px-3 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Attachment Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="p-1.5 sm:p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
          >
            <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>

          {/* Message Input */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="w-full px-3 sm:px-4 py-2 sm:py-3 pr-10 sm:pr-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="absolute right-1.5 sm:right-2 top-1/2 transform -translate-y-1/2 p-1 sm:p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Smile className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>
          </div>

          {/* Send/Voice Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={message.trim() ? handleSend : undefined}
            className={`p-2 sm:p-2.5 rounded-full flex-shrink-0 transition-all ${
              message.trim()
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            {message.trim() ? <Send className="w-4 h-4 sm:w-5 sm:h-5" /> : <Mic className="w-4 h-4 sm:w-5 sm:h-5" />}
          </motion.button>
        </div>
      </div>
    </div>
  )
}