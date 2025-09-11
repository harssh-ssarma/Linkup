'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Video, PhoneCall, Clock, PhoneOff, Search, MoreVertical, UserPlus, Settings } from 'lucide-react'
import Header from '@/components/layout/Header'
import { ContextMenuItem } from '@/components/ui/ContextMenu'

interface CallHistory {
  id: string
  name: string
  avatar: string
  type: 'incoming' | 'outgoing' | 'missed'
  callType: 'voice' | 'video'
  timestamp: string
  duration?: string
}

interface Contact {
  id: string
  name: string
  avatar: string
  status: 'online' | 'offline' | 'busy'
  lastSeen?: string
}

export default function CallSection() {
  const [activeTab, setActiveTab] = useState<'recent' | 'contacts'>('recent')
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)

  // Custom menu items for Calls section
  const callMenuItems: ContextMenuItem[] = [
    { icon: UserPlus, label: 'Add Contact', action: () => console.log('Add Contact') },
    { icon: Settings, label: 'Call Settings', action: () => console.log('Call Settings') },
  ]

  const callHistory: CallHistory[] = [
    {
      id: '1',
      name: 'Sneha Mehta',
      avatar: '/api/placeholder/40/40',
      type: 'incoming',
      callType: 'video',
      timestamp: '2 minutes ago',
      duration: '12:34'
    },
    {
      id: '2',
      name: 'Vikram Singh',
      avatar: '/api/placeholder/40/40',
      type: 'outgoing',
      callType: 'voice',
      timestamp: '1 hour ago',
      duration: '5:23'
    },
    {
      id: '3',
      name: 'Ananya Iyer',
      avatar: '/api/placeholder/40/40',
      type: 'missed',
      callType: 'video',
      timestamp: '3 hours ago'
    },
    {
      id: '4',
      name: 'Rohan Kumar',
      avatar: '/api/placeholder/40/40',
      type: 'outgoing',
      callType: 'voice',
      timestamp: 'Yesterday',
      duration: '8:45'
    },
    {
      id: '5',
      name: 'Ishita Agarwal',
      avatar: '/api/placeholder/40/40',
      type: 'incoming',
      callType: 'voice',
      timestamp: 'Yesterday',
      duration: '15:20'
    }
  ]

  const contacts: Contact[] = [
    {
      id: '1',
      name: 'Sneha Mehta',
      avatar: '/api/placeholder/40/40',
      status: 'online'
    },
    {
      id: '2',
      name: 'Vikram Singh',
      avatar: '/api/placeholder/40/40',
      status: 'online'
    },
    {
      id: '3',
      name: 'Ananya Iyer',
      avatar: '/api/placeholder/40/40',
      status: 'offline',
      lastSeen: 'last seen 5 minutes ago'
    },
    {
      id: '4',
      name: 'Rohan Kumar',
      avatar: '/api/placeholder/40/40',
      status: 'busy'
    },
    {
      id: '5',
      name: 'Ishita Agarwal',
      avatar: '/api/placeholder/40/40',
      status: 'online'
    }
  ]

  const getCallIcon = (type: string, callType: string) => {
    if (type === 'missed') {
      return <PhoneOff className="w-4 h-4 text-red-400" />
    }
    return callType === 'video' ? 
      <Video className="w-4 h-4 text-green-400" /> : 
      <Phone className="w-4 h-4 text-green-400" />
  }

  const getCallTypeColor = (type: string) => {
    switch (type) {
      case 'missed':
        return 'text-red-400'
      case 'incoming':
        return 'text-green-400'
      case 'outgoing':
        return 'text-blue-400'
      default:
        return 'text-white'
    }
  }

  const filteredCallHistory = callHistory.filter(call =>
    call.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <Header 
        tabTitle="Calls"
        currentTab={activeTab}
        onSearchToggle={() => setShowSearch(!showSearch)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showSearch={showSearch}
        menuItems={callMenuItems}
      />

      {/* Tab Navigation */}
      <div className="px-4 py-3 border-b border-white/20">
        <div className="flex bg-white/10 rounded-lg p-1">
          {[
            { id: 'recent', label: 'Recent' },
            { id: 'contacts', label: 'Contacts' }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="wait">
          {activeTab === 'recent' ? (
            <motion.div
              key="recent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="p-4"
            >
              {filteredCallHistory.length === 0 ? (
                <div className="text-center py-12">
                  <PhoneCall className="w-16 h-16 text-white/30 mx-auto mb-4" />
                  <p className="text-white/60">No recent calls</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredCallHistory.map((call) => (
                    <motion.div
                      key={call.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-card p-4 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={call.avatar}
                              alt={call.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className="absolute -bottom-1 -right-1 p-1 bg-slate-800 rounded-full">
                              {getCallIcon(call.type, call.callType)}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white font-medium">{call.name}</h3>
                            <div className="flex items-center gap-2 text-sm">
                              <span className={getCallTypeColor(call.type)}>
                                {call.type === 'incoming' ? '↓' : call.type === 'outgoing' ? '↑' : '✕'}
                              </span>
                              <span className="text-white/60">{call.timestamp}</span>
                              {call.duration && (
                                <>
                                  <span className="text-white/30">•</span>
                                  <span className="text-white/60">{call.duration}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
                          >
                            <Phone className="w-4 h-4 text-white" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors"
                          >
                            <Video className="w-4 h-4 text-white" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="contacts"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="p-4"
            >
              {filteredContacts.length === 0 ? (
                <div className="text-center py-12">
                  <UserPlus className="w-16 h-16 text-white/30 mx-auto mb-4" />
                  <p className="text-white/60">No contacts found</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredContacts.map((contact) => (
                    <motion.div
                      key={contact.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-card p-4 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={contact.avatar}
                              alt={contact.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-800 ${
                              contact.status === 'online' ? 'bg-green-400' :
                              contact.status === 'busy' ? 'bg-red-400' : 'bg-gray-400'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white font-medium">{contact.name}</h3>
                            <p className="text-white/60 text-sm">
                              {contact.status === 'online' ? 'Online' :
                               contact.status === 'busy' ? 'Busy' :
                               contact.lastSeen || 'Offline'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
                          >
                            <Phone className="w-4 h-4 text-white" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors"
                          >
                            <Video className="w-4 h-4 text-white" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
