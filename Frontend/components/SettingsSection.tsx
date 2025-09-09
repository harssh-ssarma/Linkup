'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Bell, 
  Shield, 
  Moon, 
  Sun,
  Globe, 
  HelpCircle, 
  LogOut, 
  ChevronRight,
  Camera,
  Lock,
  Eye,
  Smartphone,
  Users,
  Volume2,
  Palette,
  Phone,
  Heart,
  Info,
  Edit3,
  Settings
} from 'lucide-react'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export default function SettingsSection() {
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const [simplifiedMode, setSimplifiedMode] = useState(false)
  const [fontSize, setFontSize] = useState('medium')

  const user = {
    name: 'Harsh Sharma',
    email: 'harsh.sharma@example.com',
    phone: '+91 98765 43210',
    bio: 'Software Engineer | Family First ❤️',
    avatar: 'HS',
    location: 'Mumbai, India',
    joinDate: 'January 2023',
    relation: 'family'
  }

  const settingsGroups = [
    {
      title: 'Profile & Account',
      items: [
        { icon: User, label: 'My Profile', action: () => setShowProfile(true) },
        { icon: Shield, label: 'Privacy & Security', action: () => {} },
        { icon: Users, label: 'Family & Friends', action: () => {} },
        { icon: Lock, label: 'Blocked Contacts', action: () => {} },
      ]
    },
    {
      title: 'Chat & Messaging',
      items: [
        { icon: Bell, label: 'Notifications', action: () => {} },
        { icon: Palette, label: 'Chat Themes', action: () => {} },
        { icon: Volume2, label: 'Sound & Vibration', action: () => {} },
        { icon: Eye, label: 'Read Receipts', action: () => {} },
      ]
    },
    {
      title: 'Accessibility',
      items: [
        { icon: Eye, label: 'Simplified Mode', action: () => setSimplifiedMode(!simplifiedMode), toggle: true, value: simplifiedMode },
        { icon: Settings, label: 'Font Size', action: () => {}, subtitle: fontSize },
        { icon: darkMode ? Sun : Moon, label: 'Dark Mode', action: () => setDarkMode(!darkMode), toggle: true, value: darkMode },
        { icon: Globe, label: 'Language', action: () => {}, subtitle: 'English' },
      ]
    },
    {
      title: 'Calls & Media',
      items: [
        { icon: Phone, label: 'Call Settings', action: () => {} },
        { icon: Camera, label: 'Camera & Photos', action: () => {} },
        { icon: Smartphone, label: 'Multi-Device Sync', action: () => {} },
      ]
    },
    {
      title: 'Help & Support',
      items: [
        { icon: HelpCircle, label: 'Help Center', action: () => {} },
        { icon: Phone, label: 'Contact Support', action: () => {} },
        { icon: Info, label: 'About Linkup', action: () => {} },
        { icon: LogOut, label: 'Sign Out', action: () => setShowLogoutModal(true), danger: true },
      ]
    }
  ]

  const handleLogout = async () => {
    try {
      await signOut(auth)
      setShowLogoutModal(false)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div className="h-full bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900/10 overflow-y-auto">
      {/* Header */}
      <div className="glass-card border-b border-white/10 px-4 py-3">
        <h1 className="text-xl font-bold text-white">Settings</h1>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Profile Card */}
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {user.avatar}
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white"
              >
                <Camera size={14} />
              </motion.button>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">{user.name}</h2>
              <p className="text-white/60">{user.email}</p>
              <p className="text-white/60 text-sm">{user.bio}</p>
              <div className="flex items-center space-x-2 mt-2">
                <Heart size={14} className="text-green-400" />
                <span className="text-xs text-green-400">Family Member</span>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowProfile(true)}
              className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10"
            >
              <Edit3 size={18} />
            </motion.button>
          </div>
        </div>

        {/* Settings Groups */}
        {settingsGroups.map((group) => (
          <div key={group.title} className="glass-card p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">{group.title}</h3>
            <div className="space-y-2">
              {group.items.map((item, index) => {
                const Icon = item.icon
                return (
                  <motion.button
                    key={index}
                    whileTap={{ scale: 0.98 }}
                    onClick={item.action}
                    className="w-full flex items-center p-3 rounded-xl hover:bg-white/5 transition-colors text-left"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center">
                          <Icon size={18} className={item.danger ? 'text-red-400' : 'text-white/80'} />
                        </div>
                        <div>
                          <span className={`font-medium ${item.danger ? 'text-red-400' : 'text-white'}`}>
                            {item.label}
                          </span>
                          {item.subtitle && (
                            <p className="text-sm text-white/60">{item.subtitle}</p>
                          )}
                        </div>
                      </div>
                      {item.toggle ? (
                        <div className={`w-12 h-6 rounded-full transition-colors ${item.value ? 'bg-blue-500' : 'bg-white/20'}`}>
                          <div className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-transform ${item.value ? 'translate-x-6' : 'translate-x-0.5'}`} />
                        </div>
                      ) : (
                        <ChevronRight size={16} className="text-white/40" />
                      )}
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Edit Profile</h2>
              <button
                onClick={() => setShowProfile(false)}
                className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10"
              >
                ×
              </button>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                  {user.avatar}
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg"
                >
                  <Camera size={16} />
                </motion.button>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">{user.name}</h2>
                <div className="flex items-center space-x-2 mb-3">
                  <Heart size={16} className="text-green-400" />
                  <span className="text-sm text-green-400">Family Member</span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/30 hover:bg-blue-500/30 transition-colors text-sm"
                >
                  Update Profile
                </motion.button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  defaultValue={user.name}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Bio</label>
                <textarea
                  defaultValue={user.bio}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  defaultValue={user.phone}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowProfile(false)}
                  className="flex-1 py-3 px-4 bg-white/10 rounded-xl text-white font-medium hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowProfile(false)}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-medium"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card p-6 w-full max-w-sm text-center"
          >
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut size={24} className="text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Sign Out</h3>
            <p className="text-white/60 mb-6">Are you sure you want to sign out of Linkup?</p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3 px-4 bg-white/10 rounded-xl text-white font-medium hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 px-4 bg-red-500 rounded-xl text-white font-medium hover:bg-red-600 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}