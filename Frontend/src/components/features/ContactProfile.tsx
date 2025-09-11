'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  MoreVertical, 
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
  const [showMenu, setShowMenu] = useState(false)
  const [activeTab, setActiveTab] = useState<'media' | 'docs' | 'links'>('media')

  const menuItems = [
    { icon: Share, label: 'Share Contact', action: () => { console.log('Share'); setShowMenu(false) } },
    { icon: UserPlus, label: 'Add to Contacts', action: () => { console.log('Add Contact'); setShowMenu(false) } },
    { icon: Info, label: 'More Information', action: () => { console.log('More Info'); setShowMenu(false) } },
  ]

  return (
    <div className="h-full flex flex-col base-gradient relative">
      {/* Header */}
      <div className="header-premium px-4 py-3 relative z-10">
        <div className="flex items-center justify-between">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </motion.button>

          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-white" />
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowMenu(false)} 
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-48 context-menu z-50"
                  >
                    {menuItems.map((item, index) => {
                      const Icon = item.icon
                      return (
                        <motion.button
                          key={item.label}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={item.action}
                          className="context-menu-item"
                        >
                          <Icon className="context-menu-icon" />
                          <span className="context-menu-text">{item.label}</span>
                        </motion.button>
                      )
                    })}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Profile Section */}
        <div className="px-6 py-8 text-center">
          <div className="relative inline-block mb-4">
            <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-white/20">
              <Image
                src={contact.avatar}
                alt={contact.name}
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>
            {contact.isOnline && (
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
            )}
          </div>

          <div className="mb-2">
            <h1 className="text-2xl font-bold text-white mb-1">{contact.name}</h1>
            {contact.isVerified && (
              <div className="flex items-center justify-center space-x-1">
                <span className="text-blue-400 text-sm">Verified</span>
              </div>
            )}
          </div>

          <p className="text-white/70 text-sm mb-1">{contact.phone}</p>
          {contact.lastSeen && !contact.isOnline && (
            <p className="text-white/50 text-xs">Last seen {contact.lastSeen}</p>
          )}
          {contact.isOnline && (
            <p className="text-green-400 text-xs">Online</p>
          )}

          {contact.bio && (
            <div className="mt-4 p-3 bg-white/10 rounded-lg">
              <p className="text-white/80 text-sm">{contact.bio}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="px-6 mb-6">
          <div className="grid grid-cols-3 gap-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center space-y-2 p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-colors"
            >
              <Phone className="w-6 h-6 text-green-400" />
              <span className="text-white text-xs font-medium">Audio</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center space-y-2 p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-colors"
            >
              <Video className="w-6 h-6 text-blue-400" />
              <span className="text-white text-xs font-medium">Video</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center space-y-2 p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-colors"
            >
              <MessageCircle className="w-6 h-6 text-purple-400" />
              <span className="text-white text-xs font-medium">Message</span>
            </motion.button>
          </div>
        </div>

        {/* Contact Info */}
        <div className="px-6 mb-6">
          <h3 className="text-white font-semibold mb-4">Contact Info</h3>
          <div className="space-y-3">
            {contact.email && (
              <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                <Mail className="w-5 h-5 text-white/60" />
                <div>
                  <p className="text-white text-sm">{contact.email}</p>
                  <p className="text-white/50 text-xs">Email</p>
                </div>
              </div>
            )}
            {contact.location && (
              <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                <MapPin className="w-5 h-5 text-white/60" />
                <div>
                  <p className="text-white text-sm">{contact.location}</p>
                  <p className="text-white/50 text-xs">Location</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Media Section */}
        <div className="px-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Media</h3>
            <span className="text-white/60 text-sm">{sampleMedia.length} items</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {sampleMedia.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="cursor-pointer aspect-square bg-white/10 rounded-lg overflow-hidden"
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
          <h3 className="text-white font-semibold mb-4">Settings</h3>
          <div className="space-y-2">
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-white"
            >
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5" />
                <span className="font-medium">Mute Notifications</span>
              </div>
              <ChevronRight className="w-4 h-4 text-white/40" />
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-white"
            >
              <div className="flex items-center space-x-3">
                <Star className="w-5 h-5" />
                <span className="font-medium">Add to Starred</span>
              </div>
              <ChevronRight className="w-4 h-4 text-white/40" />
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-red-300"
            >
              <div className="flex items-center space-x-3">
                <UserX className="w-5 h-5" />
                <span className="font-medium">Block Contact</span>
              </div>
              <ChevronRight className="w-4 h-4 text-white/40" />
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-red-300"
            >
              <div className="flex items-center space-x-3">
                <Trash2 className="w-5 h-5" />
                <span className="font-medium">Delete Chat</span>
              </div>
              <ChevronRight className="w-4 h-4 text-white/40" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}