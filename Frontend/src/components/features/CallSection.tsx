'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Phone, Video, PhoneCall, PhoneOff, UserPlus, Settings } from 'lucide-react'
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
      return <PhoneOff className="h-4 w-4 text-[color:var(--danger)]" />
    }
    return callType === 'video'
      ? <Video className="h-4 w-4 text-[color:var(--success)]" />
      : <Phone className="h-4 w-4 text-[color:var(--success)]" />
  }

  const getCallTypeColor = (type: string) => {
    switch (type) {
      case 'missed':
        return 'text-[color:var(--danger)]'
      case 'incoming':
        return 'text-[color:var(--success)]'
      case 'outgoing':
        return 'text-[color:var(--accent-strong)]'
      default:
        return 'text-muted'
    }
  }

  const filteredCallHistory = callHistory.filter(call =>
    call.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="base-gradient flex h-full flex-col">
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
      <div className="border-b border-subtle px-4 py-3">
        <div className="flex rounded-lg border border-transparent bg-surface-soft p-1">
          {[
            { id: 'recent', label: 'Recent' },
            { id: 'contacts', label: 'Contacts' }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border border-[color:var(--accent)] bg-surface text-foreground shadow-soft'
                  : 'text-muted hover:bg-surface-strong hover:text-foreground'
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
                <div className="py-12 text-center">
                  <PhoneCall className="mx-auto mb-4 h-16 w-16 text-muted" />
                  <p className="text-muted">No recent calls</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredCallHistory.map((call) => (
                    <motion.div
                      key={call.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-card cursor-pointer rounded-xl p-4 transition-colors hover:bg-surface-strong"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Image
                              src={call.avatar}
                              alt={call.name}
                              width={48}
                              height={48}
                              className="h-12 w-12 rounded-full object-cover"
                            />
                            <div className="absolute -bottom-1 -right-1 rounded-full border border-subtle bg-surface-strong p-1">
                              {getCallIcon(call.type, call.callType)}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-foreground">{call.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted">
                              <span className={getCallTypeColor(call.type)}>
                                {call.type === 'incoming' ? '↓' : call.type === 'outgoing' ? '↑' : '✕'}
                              </span>
                              <span>{call.timestamp}</span>
                              {call.duration && (
                                <>
                                  <span>•</span>
                                  <span>{call.duration}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="glass-card flex h-10 w-10 items-center justify-center rounded-full text-[color:var(--success)] transition-colors hover:bg-surface-strong"
                          >
                            <Phone className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="glass-card flex h-10 w-10 items-center justify-center rounded-full text-[color:var(--accent)] transition-colors hover:bg-surface-strong"
                          >
                            <Video className="h-4 w-4" />
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
                <div className="py-12 text-center">
                  <UserPlus className="mx-auto mb-4 h-16 w-16 text-muted" />
                  <p className="text-muted">No contacts found</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredContacts.map((contact) => (
                    <motion.div
                      key={contact.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-card cursor-pointer rounded-xl p-4 transition-colors hover:bg-surface-strong"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Image
                              src={contact.avatar}
                              alt={contact.name}
                              width={48}
                              height={48}
                              className="h-12 w-12 rounded-full object-cover"
                            />
                            <div
                              className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-[color:var(--surface)] ${
                                contact.status === 'online'
                                  ? 'bg-[color:var(--success)]'
                                  : contact.status === 'busy'
                                    ? 'bg-[color:var(--danger)]'
                                    : 'bg-[color:rgba(148,163,184,0.6)]'
                              }`}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-foreground">{contact.name}</h3>
                            <p className="text-sm text-muted">
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
                            className="glass-card flex h-10 w-10 items-center justify-center rounded-full text-[color:var(--success)] transition-colors hover:bg-surface-strong"
                          >
                            <Phone className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="glass-card flex h-10 w-10 items-center justify-center rounded-full text-[color:var(--accent)] transition-colors hover:bg-surface-strong"
                          >
                            <Video className="h-4 w-4" />
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
