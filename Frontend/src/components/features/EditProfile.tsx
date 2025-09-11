'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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
      className="fixed inset-0 z-50 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex flex-col"
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
        <div className="flex flex-col items-center py-8 px-4">
          <div className="relative group">
            <img
              src={avatar}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-white/20"
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handlePhotoChange}
              className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Camera size={24} className="text-white" />
            </motion.button>
          </div>
          
          <div className="flex space-x-4 mt-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handlePhotoChange}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-sm font-medium"
            >
              Change Photo
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleRemovePhoto}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white text-sm font-medium"
            >
              Remove
            </motion.button>
          </div>
        </div>

        {/* Profile Details */}
        <div className="px-4 space-y-6">
          {/* Name Section */}
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-sm">Name</span>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNameEdit(!showNameEdit)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Edit3 size={16} className="text-white/60" />
              </motion.button>
            </div>
            {showNameEdit ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => setShowNameEdit(false)}
                onKeyPress={(e) => e.key === 'Enter' && setShowNameEdit(false)}
                className="w-full bg-transparent text-white text-lg font-medium focus:outline-none border-b border-white/20 pb-1"
                autoFocus
              />
            ) : (
              <p className="text-white text-lg font-medium">{name}</p>
            )}
          </div>

          {/* About Section */}
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-sm">About</span>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAboutEdit(!showAboutEdit)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Edit3 size={16} className="text-white/60" />
              </motion.button>
            </div>
            {showAboutEdit ? (
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                onBlur={() => setShowAboutEdit(false)}
                className="w-full bg-transparent text-white resize-none focus:outline-none border-b border-white/20 pb-1"
                rows={2}
                autoFocus
              />
            ) : (
              <p className="text-white">{about}</p>
            )}
          </div>

          {/* Phone Section */}
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-white/60 text-sm block mb-1">Phone</span>
                <p className="text-white text-lg">{phone}</p>
              </div>
              <Phone size={20} className="text-white/60" />
            </div>
          </div>

          {/* Links Section */}
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/60 text-sm">Links</span>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleAddLink}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Plus size={16} className="text-white/60" />
              </motion.button>
            </div>
            
            <div className="space-y-3">
              {links.map((link) => (
                <div key={link.id} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                  <Link size={16} className="text-white/60" />
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">{link.title}</p>
                    <p className="text-white/60 text-xs truncate">{link.url}</p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setLinks(links.filter(l => l.id !== link.id))}
                    className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <X size={14} className="text-white/60" />
                  </motion.button>
                </div>
              ))}
              
              {links.length === 0 && (
                <p className="text-white/40 text-sm text-center py-4">No links added</p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Spacing */}
        <div className="h-8"></div>
      </div>
    </motion.div>
  )
}