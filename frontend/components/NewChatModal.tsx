'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Search, Users, MessageCircle, Phone, Video, UserPlus, Shield } from 'lucide-react'

interface NewChatModalProps {
  isOpen: boolean
  onClose: () => void
  onChatCreated: (chatId: string) => void
}

export default function NewChatModal({ isOpen, onClose, onChatCreated }: NewChatModalProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'group'>('chat')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [groupName, setGroupName] = useState('')

  // Mock contacts data - replace with real data
  const contacts = [
    { id: '1', name: 'Sunita Mummy', phone: '+919876543210', avatar: 'SM', status: 'online', relation: 'family' },
    { id: '2', name: 'Rajesh Papa', phone: '+919876543211', avatar: 'RP', status: 'online', relation: 'family' },
    { id: '3', name: 'Priya Didi', phone: '+919876543212', avatar: 'PD', status: 'away', relation: 'family' },
    { id: '4', name: 'Nani Ji', phone: '+919876543213', avatar: 'NJ', status: 'offline', relation: 'family' },
    { id: '5', name: 'Rohit Chacha', phone: '+919876543214', avatar: 'RC', status: 'online', relation: 'family' },
    { id: '6', name: 'Kavya Best Friend', phone: '+919876543215', avatar: 'KB', status: 'online', relation: 'friend' },
  ]

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery)
  )

  const handleContactSelect = (contactId: string) => {
    if (activeTab === 'chat') {
      // Start 1:1 chat
      onChatCreated(contactId)
    } else {
      // Add to group selection
      setSelectedContacts(prev =>
        prev.includes(contactId)
          ? prev.filter(id => id !== contactId)
          : [...prev, contactId]
      )
    }
  }

  const handleCreateGroup = () => {
    if (groupName.trim() && selectedContacts.length > 0) {
      const groupId = `group_${Date.now()}`
      onChatCreated(groupId)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'away': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-card w-full max-w-md max-h-[80vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">
            {activeTab === 'chat' ? 'New Chat' : 'New Group'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-white/5 m-4 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md transition-all ${
              activeTab === 'chat'
                ? 'bg-blue-500/30 text-blue-300'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <MessageCircle size={16} />
            <span className="text-sm font-medium">New Chat</span>
          </button>
          <button
            onClick={() => setActiveTab('group')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md transition-all ${
              activeTab === 'group'
                ? 'bg-blue-500/30 text-blue-300'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Users size={16} />
            <span className="text-sm font-medium">New Group</span>
          </button>
        </div>

        {/* Group Name Input (only for group tab) */}
        {activeTab === 'group' && (
          <div className="px-4 mb-4">
            <input
              type="text"
              placeholder="Group name (e.g., Family Chat)"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        )}

        {/* Search */}
        <div className="px-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={16} />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
            />
          </div>
        </div>

        {/* Selected Contacts (for groups) */}
        {activeTab === 'group' && selectedContacts.length > 0 && (
          <div className="px-4 mb-4">
            <div className="flex flex-wrap gap-2">
              {selectedContacts.map(contactId => {
                const contact = contacts.find(c => c.id === contactId)
                return contact ? (
                  <div
                    key={contactId}
                    className="flex items-center space-x-2 bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm"
                  >
                    <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                      {contact.avatar}
                    </div>
                    <span>{contact.name}</span>
                    <button
                      onClick={() => setSelectedContacts(prev => prev.filter(id => id !== contactId))}
                      className="text-blue-300/60 hover:text-blue-300"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : null
              })}
            </div>
          </div>
        )}

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto px-4">
          <div className="space-y-2">
            {filteredContacts.map((contact) => (
              <motion.button
                key={contact.id}
                onClick={() => handleContactSelect(contact.id)}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${
                  selectedContacts.includes(contact.id)
                    ? 'bg-blue-500/20 border border-blue-500/30'
                    : 'hover:bg-white/10'
                }`}
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {contact.avatar}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(contact.status)} rounded-full border-2 border-gray-800`} />
                </div>
                
                <div className="flex-1 text-left">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-white">{contact.name}</h3>
                    {contact.relation === 'family' && (
                      <Shield size={14} className="text-green-400" title="Family Member" />
                    )}
                  </div>
                  <p className="text-sm text-white/60">{contact.phone}</p>
                </div>

                {activeTab === 'chat' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        // Handle voice call
                      }}
                      className="p-2 rounded-full text-green-400 hover:bg-green-500/20"
                      title="Voice Call"
                    >
                      <Phone size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        // Handle video call
                      }}
                      className="p-2 rounded-full text-blue-400 hover:bg-blue-500/20"
                      title="Video Call"
                    >
                      <Video size={16} />
                    </button>
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          {activeTab === 'group' ? (
            <motion.button
              onClick={handleCreateGroup}
              disabled={!groupName.trim() || selectedContacts.length === 0}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Users size={18} />
              <span>Create Group ({selectedContacts.length} members)</span>
            </motion.button>
          ) : (
            <div className="flex items-center justify-center space-x-2 text-white/60 text-sm">
              <UserPlus size={16} />
              <span>Select a contact to start chatting</span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}