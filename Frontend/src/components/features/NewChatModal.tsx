'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
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
  isOnLinkup: boolean
  phone: string
}

export default function NewChatModal({ isOpen, onClose, onChatCreated }: NewChatModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const { setShowMobileNavigation, isSidebarExpanded } = useNavigation()
  const [isDesktop, setIsDesktop] = useState(false)
  const desktopNavWidth = isSidebarExpanded ? 256 : 64

  // Hide navigation when modal opens (mobile only)
  useEffect(() => {
    const isMobile = window.innerWidth < 768
    if (isOpen && isMobile) {
      setShowMobileNavigation(false)
    } else if (!isOpen) {
      setShowMobileNavigation(true)
    }
  }, [isOpen, setShowMobileNavigation])

  // Track desktop breakpoint
  useEffect(() => {
    const updateIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768)
    }

    updateIsDesktop()
    window.addEventListener('resize', updateIsDesktop)

    return () => {
      window.removeEventListener('resize', updateIsDesktop)
    }
  }, [])

  const contacts: Contact[] = [
    { id: 'me', name: 'You (Message yourself)', avatar: 'https://ui-avatars.com/api/?name=You&background=6366f1&color=fff', status: 'Message yourself', isOnLinkup: true, phone: '+91 98765 43210' },
    { id: '1', name: 'Priya Sharma', avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=8b5cf6&color=fff', status: 'Hey there! I am using Linkup.', isOnLinkup: true, phone: '+91 98765 43211' },
    { id: '2', name: 'Arjun Patel', avatar: 'https://ui-avatars.com/api/?name=Arjun+Patel&background=ec4899&color=fff', status: 'Available', isOnLinkup: true, phone: '+91 98765 43212' },
    { id: '3', name: 'Sneha Gupta', avatar: 'https://ui-avatars.com/api/?name=Sneha+Gupta&background=10b981&color=fff', status: 'Busy', isOnLinkup: true, phone: '+91 98765 43213' },
    { id: '4', name: 'Rahul Singh', avatar: 'https://ui-avatars.com/api/?name=Rahul+Singh&background=f59e0b&color=fff', status: 'Last seen yesterday', isOnLinkup: false, phone: '+91 98765 43214' },
    { id: '5', name: 'Anita Verma', avatar: 'https://ui-avatars.com/api/?name=Anita+Verma&background=ef4444&color=fff', status: 'Online', isOnLinkup: false, phone: '+91 98765 43215' },
    { id: '6', name: 'Vikram Joshi', avatar: 'https://ui-avatars.com/api/?name=Vikram+Joshi&background=3b82f6&color=fff', status: 'At work', isOnLinkup: false, phone: '+91 98765 43216' },
    { id: '7', name: 'Riya Agarwal', avatar: 'https://ui-avatars.com/api/?name=Riya+Agarwal&background=a855f7&color=fff', status: 'Sleeping', isOnLinkup: false, phone: '+91 98765 43217' },
  ]

  // Filter contacts based on search query
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery)
  )

  // Separate contacts by Linkup status
  const LinkupContacts = filteredContacts.filter(contact => contact.isOnLinkup)
  const inviteContacts = filteredContacts.filter(contact => !contact.isOnLinkup)

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
      <>
        {/* Backdrop - only on mobile */}
        <div
          className="fixed inset-0 z-40 bg-[rgba(15,23,42,0.65)] backdrop-blur-sm md:hidden"
          onClick={onClose}
        />

        {/* Desktop backdrop - only for area to the right of navigation */}
        <div
          className={`hidden md:block fixed top-0 bottom-0 right-0 z-40 bg-[rgba(15,23,42,0.4)] transition-all duration-300 ${
            isDesktop ? (isSidebarExpanded ? 'left-64' : 'left-16') : 'left-0'
          }`}
          onClick={onClose}
        />

        {/* Modal Content */}
        <div
          className={`fixed inset-0 z-50 flex flex-col bg-surface shadow-deep md:inset-auto md:right-0 md:top-0 md:bottom-0 transition-all duration-300 ${
            isDesktop ? (isSidebarExpanded ? 'md:left-64' : 'md:left-16') : ''
          }`}
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
  <div className="base-gradient flex-1 overflow-y-auto">
          {/* Quick Actions */}
          <div className="space-y-3 p-4">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <button
                  key={action.id}
                  onClick={action.action}
                  className="glass-card flex w-full items-center gap-4 rounded-xl p-4 text-left hover:bg-surface-strong"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--accent-subtle)] text-[color:var(--accent-strong)]">
                    <Icon size={20} />
                  </div>
                  <span className="text-sm font-semibold text-foreground">{action.label}</span>
                </button>
              )
            })}
          </div>

          {/* Contacts on Linkup */}
          {LinkupContacts.length > 0 && (
            <div className="mb-6 px-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Contacts on Linkup</h2>
                <span className="text-sm text-muted">{LinkupContacts.length}</span>
              </div>
              
              <div className="space-y-2">
                {LinkupContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => {
                      onChatCreated(contact.id)
                      onClose()
                    }}
                    className="glass-card flex w-full items-center gap-4 rounded-xl p-3 text-left hover:bg-surface-strong"
                  >
                    <div className="relative">
                      <Image
                        src={contact.avatar}
                        alt={contact.name}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      {contact.id === 'me' && (
                        <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--accent)] text-inverse shadow-soft">
                          <MessageCircle size={12} />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 text-left">
                      <h3 className="font-medium text-foreground">{contact.name}</h3>
                      <p className="truncate text-sm text-muted">{contact.status}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Invite to Linkup */}
          {inviteContacts.length > 0 && (
            <div className="mb-6 px-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Invite to Linkup</h2>
                <span className="text-sm text-muted">{inviteContacts.length}</span>
              </div>
              
              <div className="space-y-2">
                {inviteContacts.map((contact) => (
                  <button
                    key={contact.id}
                    className="glass-card flex w-full items-center gap-4 rounded-xl p-3 text-left opacity-90 hover:bg-surface-strong"
                  >
                    <div className="relative">
                      <Image
                        src={contact.avatar}
                        alt={contact.name}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-full object-cover opacity-80"
                      />
                    </div>
                    
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-foreground">{contact.name}</h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            console.log('Invite', contact.name)
                          }}
                          className="flex items-center gap-1 rounded-full bg-[color:var(--accent)] px-3 py-1 text-xs font-semibold text-inverse hover:bg-[color:var(--accent-strong)]"
                        >
                          <Send size={10} />
                          <span>Invite</span>
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-muted">Not on Linkup • {contact.phone}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No contacts found */}
          {filteredContacts.length === 0 && searchQuery && (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-surface-soft text-[color:var(--accent)]">
                <Users size={32} />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">No contacts found</h3>
              <p className="text-center text-sm text-muted">
                Try searching with a different name or phone number
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}