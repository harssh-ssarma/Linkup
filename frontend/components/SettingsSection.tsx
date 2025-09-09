'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  Settings as SettingsIcon, 
  Shield, 
  Bell, 
  Moon, 
  Globe, 
  Lock, 
  LogOut,
  ChevronRight,
  Edit3,
  Camera,
  Trash2,
  Eye
} from 'lucide-react'

export default function SettingsSection() {
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const settingsCategories = [
    {
      id: 'profile',
      title: 'Profile',
      subtitle: 'Manage your profile information',
      icon: User,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      subtitle: 'Control your privacy settings',
      icon: Shield,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      subtitle: 'Manage notification preferences',
      icon: Bell,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'appearance',
      title: 'Appearance',
      subtitle: 'Customize app appearance',
      icon: Moon,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'language',
      title: 'Language & Region',
      subtitle: 'Set your language preferences',
      icon: Globe,
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: 'account',
      title: 'Account Security',
      subtitle: 'Two-factor auth, password',
      icon: Lock,
      color: 'from-red-500 to-orange-500'
    },
    {
      id: 'signout',
      title: 'Sign Out',
      subtitle: 'Sign out of your account',
      icon: LogOut,
      color: 'from-red-600 to-red-700'
    }
  ]

  const renderProfileSection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Profile Header */}
      <div className="glass-card p-6 rounded-xl">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src="/api/placeholder/80/80"
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute -bottom-2 -right-2 p-2 bg-blue-500 rounded-full"
            >
              <Camera className="w-4 h-4 text-white" />
            </motion.button>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white">John Doe</h3>
            <p className="text-white/60">john.doe@example.com</p>
            <p className="text-white/40 text-sm">Last seen recently</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
          >
            <Edit3 className="w-4 h-4 text-white" />
          </motion.button>
        </div>
      </div>

      {/* Profile Options */}
      <div className="space-y-3">
        {[
          { icon: User, title: 'Edit Profile', subtitle: 'Update your information' },
          { icon: Eye, title: 'Profile Visibility', subtitle: 'Control who can see your profile' },
          { icon: Camera, title: 'Media Settings', subtitle: 'Auto-download preferences' },
        ].map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            className="glass-card p-4 rounded-xl cursor-pointer hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <item.icon className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-medium">{item.title}</h4>
                <p className="text-white/60 text-sm">{item.subtitle}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-white/40" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Danger Zone */}
      <div className="space-y-3">
        <h4 className="text-white/60 text-sm font-medium">Account Actions</h4>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="glass-card p-4 rounded-xl cursor-pointer hover:bg-red-500/5 transition-colors border border-red-500/20"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <LogOut className="w-5 h-5 text-red-400" />
            </div>
            <div className="flex-1">
              <h4 className="text-red-400 font-medium">Sign Out</h4>
              <p className="text-white/60 text-sm">Sign out from this device</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )

  const renderMainSettings = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      {settingsCategories.map((category) => {
        const Icon = category.icon
        return (
          <motion.div
            key={category.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (category.id === 'signout') {
                if (confirm('Are you sure you want to sign out?')) {
                  // Clear authentication data
                  localStorage.removeItem('auth_token')
                  localStorage.removeItem('user_data')
                  // Reload the page to trigger re-authentication
                  window.location.reload()
                }
              } else {
                setActiveSection(category.id)
              }
            }}
            className={`glass-card p-4 rounded-xl cursor-pointer transition-colors ${
              category.id === 'signout' 
                ? 'hover:bg-red-500/10 border border-red-500/20' 
                : 'hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-3 bg-gradient-to-r ${category.color} rounded-xl`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold ${category.id === 'signout' ? 'text-red-400' : 'text-white'}`}>
                  {category.title}
                </h3>
                <p className={`text-sm ${category.id === 'signout' ? 'text-red-400/60' : 'text-white/60'}`}>
                  {category.subtitle}
                </p>
              </div>
              {category.id !== 'signout' && (
                <ChevronRight className="w-5 h-5 text-white/40" />
              )}
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">
      {/* Header */}
      <div className="glass-card-dark p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          {activeSection && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveSection(null)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-white rotate-180" />
            </motion.button>
          )}
          <div>
            <h1 className="text-xl font-bold text-white">
              {activeSection ? 
                settingsCategories.find(cat => cat.id === activeSection)?.title : 
                'Settings'
              }
            </h1>
            {!activeSection && (
              <p className="text-white/60 text-sm">Manage your app preferences</p>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        <AnimatePresence mode="wait">
          {activeSection === 'profile' ? 
            renderProfileSection() : 
            renderMainSettings()
          }
        </AnimatePresence>
      </div>
    </div>
  )
}
