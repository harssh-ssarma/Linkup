'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Search, MessageCircle, Users, Radio } from 'lucide-react'

interface NewChatModalProps {
  isOpen: boolean
  onClose: () => void
  onChatCreated: (chatId: string) => void
}

export default function NewChatModal({ isOpen, onClose, onChatCreated }: NewChatModalProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const options = [
    { id: 'new-chat', icon: MessageCircle, label: 'New Chat', description: 'Start a personal conversation' },
    { id: 'new-group', icon: Users, label: 'New Group', description: 'Create a group chat' },
    { id: 'new-broadcast', icon: Radio, label: 'New Broadcast', description: 'Send messages to multiple contacts' },
  ]

  const contacts = [
    { id: '1', name: 'Alice Johnson', avatar: 'https://ui-avatars.com/api/?name=Alice+Johnson&background=6366f1&color=fff', status: 'Online' },
    { id: '2', name: 'Bob Smith', avatar: 'https://ui-avatars.com/api/?name=Bob+Smith&background=8b5cf6&color=fff', status: 'Last seen 2 hours ago' },
    { id: '3', name: 'Carol Davis', avatar: 'https://ui-avatars.com/api/?name=Carol+Davis&background=ec4899&color=fff', status: 'Online' },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-20 bottom-20 md:inset-x-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-96 md:h-auto md:max-h-[80vh] menu-gradient rounded-xl shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/20">
              <h2 className="text-lg font-semibold text-white">New Chat</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-blue-600">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={16} />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                />
              </div>
            </div>

            {/* Options */}
            <div className="p-4 border-b border-blue-600">
              {options.map((option) => {
                const Icon = option.icon
                return (
                  <button
                    key={option.id}
                    onClick={() => {
                      onChatCreated(option.id)
                      onClose()
                    }}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors text-left"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Icon size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{option.label}</p>
                      <p className="text-sm text-white/60">{option.description}</p>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Contacts */}
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="text-sm font-medium text-white/80 mb-3">Recent Contacts</h3>
              {contacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => {
                    onChatCreated(contact.id)
                    onClose()
                  }}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors text-left"
                >
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{contact.name}</p>
                    <p className="text-sm text-white/60 truncate">{contact.status}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}