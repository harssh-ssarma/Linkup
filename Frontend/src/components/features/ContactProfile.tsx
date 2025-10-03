'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Share, 
  UserPlus, 
  Info, 
  Phone, 
  Video, 
  MessageCircle,
  Bell,
  BellOff,
  Star,
  UserX,
  Trash2,
  Image as ImageIcon,
  FileText,
  Link as LinkIcon,
  Calendar,
  MapPin,
  Mail,
  Globe,
  ChevronRight,
  Download,
  Play
} from 'lucide-react'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import type { ContextMenuItem } from '@/components/ui/ContextMenu'

interface ContactProfileProps {
  contact: {
    id: string
    name: string
    phone: string
    avatar: string
    isOnline: boolean
    lastSeen?: string
    bio?: string
    isVerified: boolean
    isMuted: boolean
    isBlocked: boolean
    isStarred: boolean
    email?: string
    location?: string
    website?: string
    joinedDate?: string
  }
  onBack: () => void
}

interface MediaItem {
  id: string
  type: 'image' | 'video' | 'document' | 'link'
  url: string
  thumbnail?: string
  title?: string
  date: string
}

const sampleMedia: MediaItem[] = [
  {
    id: '1',
    type: 'image',
    url: 'https://picsum.photos/200/200?random=1',
    date: '2 days ago'
  },
  {
    id: '2',
    type: 'video',
    url: 'https://picsum.photos/200/200?random=2',
    thumbnail: 'https://picsum.photos/200/200?random=2',
    date: '1 week ago'
  },
  {
    id: '3',
    type: 'image',
    url: 'https://picsum.photos/200/200?random=3',
    date: '2 weeks ago'
  }
]

export default function ContactProfile({ contact, onBack }: ContactProfileProps) {
  const [activeTab, setActiveTab] = useState<'media' | 'docs' | 'links'>('media')

  const menuItems: ContextMenuItem[] = [
    { icon: Share, label: 'Share Contact', action: () => console.log('Share') },
    { icon: UserPlus, label: 'Add to Contacts', action: () => console.log('Add Contact') },
    { icon: Info, label: 'More Information', action: () => console.log('More Info') },
  ]

  return (
    <div className="base-gradient relative flex h-full flex-col">
      {/* Header */}
      <Header
        showBackButton
        onBackClick={onBack}
        title={contact.name}
        subtitle={
          contact.isOnline
            ? 'Online'
            : contact.lastSeen
              ? `Last seen ${contact.lastSeen}`
              : contact.phone
        }
        showSearchButton={false}
        menuItems={menuItems}
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Profile Section */}
        <div className="px-6 py-8 text-center">
          <div className="relative mb-4 inline-block">
            <div className="h-32 w-32 overflow-hidden rounded-full ring-4 ring-[var(--accent)] ring-opacity-30">
              <Image
                src={contact.avatar}
                alt={contact.name}
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>
            {contact.isOnline && (
              <div className="absolute bottom-2 right-2 h-6 w-6 rounded-full border-4 border-[var(--surface)] bg-green-500"></div>
            )}
          </div>

          <div className="mb-2">
            <h1 className="mb-1 text-2xl font-bold text-foreground">{contact.name}</h1>
            {contact.isVerified && (
              <div className="flex items-center justify-center space-x-1">
                <span className="text-sm text-[var(--accent)]">Verified</span>
              </div>
            )}
          </div>

          <p className="mb-1 text-sm text-muted">{contact.phone}</p>
          {contact.lastSeen && !contact.isOnline && (
            <p className="text-xs text-muted">Last seen {contact.lastSeen}</p>
          )}
          {contact.isOnline && (
            <p className="text-xs text-green-400">Online</p>
          )}

          {contact.bio && (
            <div className="mt-4 rounded-lg border border-subtle bg-surface-soft p-3">
              <p className="text-sm text-muted">{contact.bio}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mb-6 px-6">
          <div className="grid grid-cols-3 gap-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="glass-card flex flex-col items-center space-y-2 rounded-2xl p-4 text-muted transition-colors hover:bg-surface-strong hover:text-foreground"
            >
              <Phone className="h-6 w-6 text-green-400" />
              <span className="text-xs font-medium">Audio</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="glass-card flex flex-col items-center space-y-2 rounded-2xl p-4 text-muted transition-colors hover:bg-surface-strong hover:text-foreground"
            >
              <Video className="h-6 w-6 text-blue-400" />
              <span className="text-xs font-medium">Video</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="glass-card flex flex-col items-center space-y-2 rounded-2xl p-4 text-muted transition-colors hover:bg-surface-strong hover:text-foreground"
            >
              <MessageCircle className="h-6 w-6 text-purple-400" />
              <span className="text-xs font-medium">Message</span>
            </motion.button>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mb-6 px-6">
          <h3 className="mb-4 font-semibold text-foreground">Contact Info</h3>
          <div className="space-y-3">
            {contact.email && (
              <div className="flex items-center space-x-3 rounded-lg border border-subtle bg-surface-soft p-3">
                <Mail className="h-5 w-5 text-muted" />
                <div>
                  <p className="text-sm text-foreground">{contact.email}</p>
                  <p className="text-xs text-muted">Email</p>
                </div>
              </div>
            )}
            {contact.location && (
              <div className="flex items-center space-x-3 rounded-lg border border-subtle bg-surface-soft p-3">
                <MapPin className="h-5 w-5 text-muted" />
                <div>
                  <p className="text-sm text-foreground">{contact.location}</p>
                  <p className="text-xs text-muted">Location</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Media Section */}
        <div className="mb-6 px-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Media</h3>
            <span className="text-sm text-muted">{sampleMedia.length} items</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {sampleMedia.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="aspect-square cursor-pointer overflow-hidden rounded-lg border border-subtle bg-surface-soft"
              >
                <Image
                  src={item.url}
                  alt="Media"
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="px-6 pb-6">
          <h3 className="mb-4 font-semibold text-foreground">Settings</h3>
          <div className="space-y-2">
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="glass-effect flex w-full items-center justify-between rounded-lg border border-subtle bg-surface-soft p-3 text-foreground transition-colors hover:bg-surface-strong"
            >
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-muted" />
                <span className="font-medium">Mute Notifications</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted" />
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="glass-effect flex w-full items-center justify-between rounded-lg border border-subtle bg-surface-soft p-3 text-foreground transition-colors hover:bg-surface-strong"
            >
              <div className="flex items-center space-x-3">
                <Star className="h-5 w-5 text-muted" />
                <span className="font-medium">Add to Starred</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted" />
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="glass-effect flex w-full items-center justify-between rounded-lg border border-subtle bg-surface-soft p-3 text-[var(--danger)] transition-colors hover:bg-surface-strong"
            >
              <div className="flex items-center space-x-3">
                <UserX className="h-5 w-5" />
                <span className="font-medium">Block Contact</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted" />
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="glass-effect flex w-full items-center justify-between rounded-lg border border-subtle bg-surface-soft p-3 text-[var(--danger)] transition-colors hover:bg-surface-strong"
            >
              <div className="flex items-center space-x-3">
                <Trash2 className="h-5 w-5" />
                <span className="font-medium">Delete Chat</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}