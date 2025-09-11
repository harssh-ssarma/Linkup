'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, UserPlus, Bot, MessageCircle, Send, Settings, UserPlus as InviteFriend, RefreshCw, HelpCircle } from 'lucide-react'
import { useNavigation } from '@/context/NavigationContext'
import Header from '@/components/layout/Header'

interface NewChatModalProps {
  isOpen: boolean
  onClose: () => void
  onChatCreated: (chatId: string) => void
}

interface Contact {
  id: string
  name: string
  avatar: string
  status: string
  isOnEcho: boolean
  phone: string
}

export default function NewChatModal({ isOpen, onClose, onChatCreated }: NewChatModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const { setShowMobileNavigation } = useNavigation()

  // Hide navigation when modal opens
  useEffect(() => {
    if (isOpen) {
      setShowMobileNavigation(false)
    } else {
      setShowMobileNavigation(true)
    }
  }, [isOpen, setShowMobileNavigation])

  const contacts: Contact[] = [
    { id: 'me', name: 'You (Message yourself)', avatar: 'https://ui-avatars.com/api/?name=You&background=6366f1&color=fff', status: 'Message yourself', isOnEcho: true, phone: '+91 98765 43210' },
    { id: '1', name: 'Priya Sharma', avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=8b5cf6&color=fff', status: 'Hey there! I am using Echo.', isOnEcho: true, phone: '+91 98765 43211' },
    { id: '2', name: 'Arjun Patel', avatar: 'https://ui-avatars.com/api/?name=Arjun+Patel&background=ec4899&color=fff', status: 'Available', isOnEcho: true, phone: '+91 98765 43212' },
    { id: '3', name: 'Sneha Gupta', avatar: 'https://ui-avatars.com/api/?name=Sneha+Gupta&background=10b981&color=fff', status: 'Busy', isOnEcho: true, phone: '+91 98765 43213' },
    { id: '4', name: 'Rahul Singh', avatar: 'https://ui-avatars.com/api/?name=Rahul+Singh&background=f59e0b&color=fff', status: 'Last seen yesterday', isOnEcho: false, phone: '+91 98765 43214' },
    { id: '5', name: 'Anita Verma', avatar: 'https://ui-avatars.com/api/?name=Anita+Verma&background=ef4444&color=fff', status: 'Online', isOnEcho: false, phone: '+91 98765 43215' },
    { id: '6', name: 'Vikram Joshi', avatar: 'https://ui-avatars.com/api/?name=Vikram+Joshi&background=3b82f6&color=fff', status: 'At work', isOnEcho: false, phone: '+91 98765 43216' },
    { id: '7', name: 'Riya Agarwal', avatar: 'https://ui-avatars.com/api/?name=Riya+Agarwal&background=a855f7&color=fff', status: 'Sleeping', isOnEcho: false, phone: '+91 98765 43217' },
  ]

  // Filter contacts based on search query
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery)
  )

  // Separate contacts by Echo status
  const echoContacts = filteredContacts.filter(contact => contact.isOnEcho)
  const inviteContacts = filteredContacts.filter(contact => !contact.isOnEcho)

  // Quick actions for new chat options
  const quickActions = [
    { 
      id: 'new-group', 
      label: 'New group', 
      icon: Users, 
      action: () => console.log('Create new group') 
    },
    { 
      id: 'new-contact', 
      label: 'New contact', 
      icon: UserPlus, 
      action: () => console.log('Add new contact') 
    },
    { 
      id: 'chat-ai', 
      label: 'Chat with AI', 
      icon: Bot, 
      action: () => {
        onChatCreated('ai-assistant')
        onClose()
      }
    },
  ]

  // Menu options for header
  const menuOptions = [
    { 
      id: 'contact-settings', 
      label: 'Contact settings', 
      icon: Settings, 
      action: () => console.log('Contact settings') 
    },
    { 
      id: 'invite-friend', 
      label: 'Invite a friend', 
      icon: InviteFriend, 
      action: () => console.log('Invite a friend') 
    },
    { 
      id: 'refresh', 
      label: 'Refresh', 
      icon: RefreshCw, 
      action: () => console.log('Refresh contacts') 
    },
    { 
      id: 'help', 
      label: 'Help', 
      icon: HelpCircle, 
      action: () => console.log('Help') 
    },
  ]

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed inset-0 z-50 flex flex-col"
        style={{
          background: 'linear-gradient(135deg, var(--surface-dark) 0%, var(--surface-main) 30%, var(--primary-950) 60%, var(--accent-950) 90%, var(--surface-dark) 100%)'
        }}
      >
        {/* Header with universal search */}
        <Header
          title="Select contact"
          showBackButton={true}
          onBackClick={onClose}
          showSearchButton={true}
          searchPlaceholder="Search contacts..."
          onSearchResults={(query: string) => setSearchQuery(query)}
          searchData={contacts}
          searchFields={['name', 'phone']}
          menuItems={menuOptions}
        />

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Quick Actions */}
          <div className="p-4 space-y-2">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <motion.button
                  key={action.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={action.action}
                  className="w-full flex items-center space-x-4 p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Icon size={20} className="text-white" />
                  </div>
                  <span className="text-white font-medium">{action.label}</span>
                </motion.button>
              )
            })}
          </div>

          {/* Contacts on Echo */}
          {echoContacts.length > 0 && (
            <div className="px-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white/80 font-medium">Contacts on Echo</h2>
                <span className="text-white/60 text-sm">{echoContacts.length}</span>
              </div>
              
              <div className="space-y-1">
                {echoContacts.map((contact, index) => (
                  <motion.button
                    key={contact.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onChatCreated(contact.id)
                      onClose()
                    }}
                    className="w-full flex items-center space-x-4 p-3 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <div className="relative">
                      <img
                        src={contact.avatar}
                        alt={contact.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {contact.id === 'me' && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <MessageCircle size={12} className="text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 text-left">
                      <h3 className="font-medium text-white">{contact.name}</h3>
                      <p className="text-sm text-white/60 truncate">{contact.status}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Invite to Echo */}
          {inviteContacts.length > 0 && (
            <div className="px-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white/80 font-medium">Invite to Echo</h2>
                <span className="text-white/60 text-sm">{inviteContacts.length}</span>
              </div>
              
              <div className="space-y-1">
                {inviteContacts.map((contact, index) => (
                  <motion.button
                    key={contact.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (echoContacts.length + index) * 0.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center space-x-4 p-3 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <div className="relative">
                      <img
                        src={contact.avatar}
                        alt={contact.name}
                        className="w-12 h-12 rounded-full object-cover opacity-70"
                      />
                    </div>
                    
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-white">{contact.name}</h3>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation()
                            console.log('Invite', contact.name)
                          }}
                          className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full text-white text-xs font-medium flex items-center space-x-1"
                        >
                          <Send size={10} />
                          <span>Invite</span>
                        </motion.button>
                      </div>
                      <p className="text-xs text-white/40 mt-1">Not on Echo • {contact.phone}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* No contacts found */}
          {filteredContacts.length === 0 && searchQuery && (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-4">
                <Users size={32} className="text-white/60" />
              </div>
              <h3 className="text-white/80 font-medium mb-2">No contacts found</h3>
              <p className="text-white/60 text-sm text-center">
                Try searching with a different name or phone number
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}