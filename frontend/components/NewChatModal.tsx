'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Users, Radio, X, Phone, UserPlus, Globe } from 'lucide-react'
import Image from 'next/image'

interface Contact {
  id: string
  name: string
  phone: string
  avatar: string
  isOnline: boolean
  isRegistered: boolean
}

interface NewChatModalProps {
  isOpen: boolean
  onClose: () => void
  onChatCreated: (chatId: string) => void
}

export default function NewChatModal({ isOpen, onClose, onChatCreated }: NewChatModalProps) {
  const [activeTab, setActiveTab] = useState<'contacts' | 'groups' | 'channels'>('contacts')
  const [searchQuery, setSearchQuery] = useState('')
  const [contacts, setContacts] = useState<Contact[]>([])
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [isLoadingContacts, setIsLoadingContacts] = useState(false)

  // Mock contacts data
  const mockContacts: Contact[] = [
    {
      id: '1',
      name: 'Alice Johnson',
      phone: '+1 (555) 123-4567',
      avatar: 'https://ui-avatars.com/api/?name=Alice+Johnson&background=random&color=fff',
      isOnline: true,
      isRegistered: true
    },
    {
      id: '2',
      name: 'Bob Smith',
      phone: '+1 (555) 987-6543',
      avatar: 'https://ui-avatars.com/api/?name=Bob+Smith&background=random&color=fff',
      isOnline: false,
      isRegistered: true
    },
    {
      id: '3',
      name: 'Carol Davis',
      phone: '+1 (555) 456-7890',
      avatar: 'https://ui-avatars.com/api/?name=Carol+Davis&background=random&color=fff',
      isOnline: true,
      isRegistered: false
    }
  ]

  useEffect(() => {
    if (isOpen) {
      setContacts(mockContacts)
    }
  }, [isOpen])

  const loadGoogleContacts = async () => {
    setIsLoadingContacts(true)
    // Simulate Google Contacts API call
    setTimeout(() => {
      setContacts(mockContacts)
      setIsLoadingContacts(false)
    }, 2000)
  }

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery)
  )

  const handleContactSelect = (contactId: string) => {
    if (activeTab === 'contacts') {
      // Start 1-on-1 chat
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

  const createGroup = () => {
    if (selectedContacts.length > 0) {
      const groupId = `group_${Date.now()}`
      onChatCreated(groupId)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-2xl mx-4 h-[80vh]"
      >
        <div className="glass-effect rounded-2xl border border-white/20 h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">New Chat</h2>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-white/5 rounded-lg p-1">
              {[
                { id: 'contacts', label: 'Contacts', icon: UserPlus },
                { id: 'groups', label: 'New Group', icon: Users },
                { id: 'channels', label: 'New Channel', icon: Radio }
              ].map((tab) => {
                const isActive = activeTab === tab.id
                const Icon = tab.icon
                
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md transition-all duration-200 ${
                      isActive 
                        ? 'bg-blue-500/30 text-blue-300' 
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon size={16} />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Search & Actions */}
            <div className="p-4 border-b border-white/10">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
                <input
                  type="text"
                  placeholder="Search contacts or enter phone number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>

              {/* Quick Actions */}
              <div className="flex space-x-2">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={loadGoogleContacts}
                  disabled={isLoadingContacts}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 rounded-lg text-green-400 hover:bg-green-500/30 transition-colors disabled:opacity-50"
                >
                  {isLoadingContacts ? (
                    <div className="w-4 h-4 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin" />
                  ) : (
                    <Globe size={16} />
                  )}
                  <span className="text-sm">Import from Google</span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 rounded-lg text-blue-400 hover:bg-blue-500/30 transition-colors"
                >
                  <Phone size={16} />
                  <span className="text-sm">Invite Friends</span>
                </motion.button>
              </div>
            </div>

            {/* Contacts List */}
            <div className="flex-1 overflow-y-auto">
              {filteredContacts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-white/60">
                  <UserPlus size={48} className="mb-4 text-white/30" />
                  <h3 className="text-lg font-semibold mb-2">No contacts found</h3>
                  <p className="text-sm text-center">Import contacts from Google or invite friends to get started</p>
                </div>
              ) : (
                <div className="p-4 space-y-2">
                  {filteredContacts.map((contact) => (
                    <motion.div
                      key={contact.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleContactSelect(contact.id)}
                      className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                        selectedContacts.includes(contact.id)
                          ? 'bg-blue-500/20 border border-blue-500/30'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      {/* Avatar */}
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/20">
                          <Image
                            src={contact.avatar}
                            alt={contact.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {contact.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900"></div>
                        )}
                      </div>

                      {/* Contact Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-white truncate">{contact.name}</h3>
                          {!contact.isRegistered && (
                            <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                              Invite
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-white/60 truncate">{contact.phone}</p>
                      </div>

                      {/* Selection Indicator */}
                      {activeTab !== 'contacts' && (
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedContacts.includes(contact.id)
                            ? 'bg-blue-500 border-blue-500'
                            : 'border-white/30'
                        }`}>
                          {selectedContacts.includes(contact.id) && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {activeTab !== 'contacts' && selectedContacts.length > 0 && (
              <div className="p-4 border-t border-white/10">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={createGroup}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-semibold shadow-lg"
                >
                  Create {activeTab === 'groups' ? 'Group' : 'Channel'} ({selectedContacts.length} members)
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}