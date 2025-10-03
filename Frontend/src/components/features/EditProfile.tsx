'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Camera, X, Edit3, Phone, Link, Plus } from 'lucide-react'
import { useNavigation } from '@/context/NavigationContext'
import Header from '@/components/layout/Header'

interface EditProfileProps {
  isOpen: boolean
  onClose: () => void
}

export default function EditProfile({ isOpen, onClose }: EditProfileProps) {
  const [name, setName] = useState('John Doe')
  const [about, setAbout] = useState('Hey there! I am using Echo.')
  const [phone] = useState('+91 98765 43210')
  const [avatar, setAvatar] = useState('https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff')
  const [showNameEdit, setShowNameEdit] = useState(false)
  const [showAboutEdit, setShowAboutEdit] = useState(false)
  const [links, setLinks] = useState([
    { id: 1, title: 'Instagram', url: 'https://instagram.com/johndoe' },
    { id: 2, title: 'Twitter', url: 'https://twitter.com/johndoe' }
  ])
  const { setShowMobileNavigation } = useNavigation()

  // Hide navigation when modal opens
  useEffect(() => {
    if (isOpen) {
      setShowMobileNavigation(false)
    } else {
      setShowMobileNavigation(true)
    }
  }, [isOpen, setShowMobileNavigation])

  const handlePhotoChange = () => {
    // Simulate photo selection
    console.log('Change photo')
  }

  const handleRemovePhoto = () => {
    setAvatar('https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff')
  }

  const handleAddLink = () => {
    const newLink = {
      id: Date.now(),
      title: 'New Link',
      url: 'https://example.com'
    }
    setLinks([...links, newLink])
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'tween', duration: 0.3 }}
      className="fixed inset-0 z-50 flex flex-col bg-[rgba(15,23,42,0.6)] backdrop-blur-2xl"
    >
      {/* Header - No search and menu buttons */}
      <Header 
        showBackButton={true}
        onBackClick={onClose}
        title="Profile"
        showSearchButton={false}
        menuItems={[]}
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Profile Photo Section */}
        <div className="flex flex-col items-center px-4 py-8">
          <div className="group relative">
            <Image
              src={avatar}
              alt="Profile"
              width={128}
              height={128}
              className="h-32 w-32 rounded-full border-4 border-[rgba(37,99,235,0.2)] object-cover shadow-soft"
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handlePhotoChange}
              className="absolute inset-0 flex items-center justify-center rounded-full bg-[rgba(15,23,42,0.55)] opacity-0 transition-opacity group-hover:opacity-100"
            >
              <Camera size={24} className="text-[color:var(--text-inverse)]" />
            </motion.button>
          </div>
          
          <div className="mt-4 flex gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handlePhotoChange}
              className="btn-primary text-sm"
            >
              Change Photo
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleRemovePhoto}
              className="rounded-full border border-[rgba(239,68,68,0.35)] bg-[rgba(239,68,68,0.12)] px-4 py-2 text-sm font-semibold text-[#ef4444] transition-colors hover:bg-[rgba(239,68,68,0.2)]"
            >
              Remove
            </motion.button>
          </div>
        </div>

        {/* Profile Details */}
        <div className="space-y-6 px-4 pb-8">
          {/* Name Section */}
          <div className="glass-card rounded-2xl p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm uppercase tracking-wide text-muted">Name</span>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNameEdit(!showNameEdit)}
                className="rounded-lg p-2 text-muted transition-colors hover:bg-surface-strong"
              >
                <Edit3 size={16} />
              </motion.button>
            </div>
            {showNameEdit ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => setShowNameEdit(false)}
                onKeyPress={(e) => e.key === 'Enter' && setShowNameEdit(false)}
                className="w-full border-b border-subtle bg-transparent pb-1 text-lg font-semibold text-foreground focus:outline-none"
                aria-label="Edit name"
                placeholder="Enter your name"
                autoFocus
              />
            ) : (
              <p className="text-lg font-semibold text-foreground">{name}</p>
            )}
          </div>

          {/* About Section */}
          <div className="glass-card rounded-2xl p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm uppercase tracking-wide text-muted">About</span>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAboutEdit(!showAboutEdit)}
                className="rounded-lg p-2 text-muted transition-colors hover:bg-surface-strong"
              >
                <Edit3 size={16} />
              </motion.button>
            </div>
            {showAboutEdit ? (
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                onBlur={() => setShowAboutEdit(false)}
                className="w-full resize-none border-b border-subtle bg-transparent pb-1 text-base text-foreground focus:outline-none"
                aria-label="Edit about section"
                placeholder="Tell us about yourself"
                rows={2}
                autoFocus
              />
            ) : (
              <p className="text-base text-foreground">{about}</p>
            )}
          </div>

          {/* Phone Section */}
          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="mb-1 block text-sm uppercase tracking-wide text-muted">Phone</span>
                <p className="text-lg font-medium text-foreground">{phone}</p>
              </div>
              <Phone size={20} className="text-muted" />
            </div>
          </div>

          {/* Links Section */}
          <div className="glass-card rounded-2xl p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm uppercase tracking-wide text-muted">Links</span>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleAddLink}
                className="rounded-lg p-2 text-muted transition-colors hover:bg-surface-strong"
              >
                <Plus size={16} />
              </motion.button>
            </div>
            
            <div className="space-y-3">
              {links.map((link) => (
                <div key={link.id} className="flex items-center gap-3 rounded-xl border border-subtle bg-surface-soft p-3">
                  <Link size={16} className="text-[color:var(--accent)]" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{link.title}</p>
                    <p className="truncate text-xs text-muted">{link.url}</p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setLinks(links.filter(l => l.id !== link.id))}
                    className="rounded-lg p-1 text-muted transition-colors hover:bg-surface-strong"
                  >
                    <X size={14} />
                  </motion.button>
                </div>
              ))}
              
              {links.length === 0 && (
                <p className="py-4 text-center text-sm text-muted">No links added</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}