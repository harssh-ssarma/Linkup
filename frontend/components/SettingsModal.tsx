'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  User, 
  Shield, 
  Bell, 
  Moon, 
  Globe, 
  Lock, 
  Eye, 
  Phone,
  MessageSquare,
  Camera,
  Mic,
  Download,
  Trash2,
  LogOut,
  ChevronRight,
  Check,
  Settings,
  HelpCircle,
  Info,
  Heart,
  Smartphone,
  Wifi,
  Database
} from 'lucide-react'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [settings, setSettings] = useState({
    // Privacy Settings
    lastSeen: 'everyone',
    profilePhoto: 'everyone',
    about: 'everyone',
    status: 'contacts',
    readReceipts: true,
    
    // Notification Settings
    messageNotifications: true,
    groupNotifications: true,
    callNotifications: true,
    emailNotifications: false,
    
    // App Settings
    darkMode: true,
    language: 'en',
    autoDownload: 'wifi',
    
    // Security Settings
    twoFactor: false,
    fingerprint: true,
    screenLock: false
  })

  const privacyOptions = [
    { value: 'everyone', label: 'Everyone' },
    { value: 'contacts', label: 'My Contacts' },
    { value: 'nobody', label: 'Nobody' }
  ]

  const settingsSections = [
    {
      id: 'account',
      title: 'Account',
      icon: User,
      color: 'text-emerald-400',
      items: [
        { id: 'profile', title: 'Edit Profile', subtitle: 'Name, bio, avatar' },
        { id: 'phone', title: 'Phone Number', subtitle: '+1 (555) 123-4567' },
        { id: 'username', title: 'Username', subtitle: '@johndoe' },
      ]
    },
    {
      id: 'privacy',
      title: 'Privacy',
      icon: Shield,
      color: 'text-blue-400',
      items: [
        { id: 'lastSeen', title: 'Last Seen & Online', subtitle: settings.lastSeen },
        { id: 'profilePhoto', title: 'Profile Photo', subtitle: settings.profilePhoto },
        { id: 'about', title: 'About', subtitle: settings.about },
        { id: 'status', title: 'Status', subtitle: settings.status },
        { id: 'readReceipts', title: 'Read Receipts', subtitle: settings.readReceipts ? 'On' : 'Off' },
        { id: 'groups', title: 'Groups', subtitle: 'Who can add me' },
        { id: 'liveLocation', title: 'Live Location', subtitle: 'None' },
        { id: 'blockedContacts', title: 'Blocked Contacts', subtitle: '0 contacts' },
      ]
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      color: 'text-yellow-400',
      items: [
        { id: 'messageNotifications', title: 'Messages', subtitle: settings.messageNotifications ? 'On' : 'Off' },
        { id: 'groupNotifications', title: 'Groups', subtitle: settings.groupNotifications ? 'On' : 'Off' },
        { id: 'callNotifications', title: 'Calls', subtitle: settings.callNotifications ? 'On' : 'Off' },
        { id: 'emailNotifications', title: 'Email', subtitle: settings.emailNotifications ? 'On' : 'Off' },
      ]
    },
    {
      id: 'storage',
      title: 'Storage and Data',
      icon: Database,
      color: 'text-purple-400',
      items: [
        { id: 'storageUsage', title: 'Storage Usage', subtitle: '2.1 GB used' },
        { id: 'networkUsage', title: 'Network Usage', subtitle: 'View data usage' },
        { id: 'autoDownload', title: 'Media Auto-Download', subtitle: 'Wi-Fi only' },
        { id: 'downloadLocation', title: 'Download Location', subtitle: 'Internal Storage' },
      ]
    },
    {
      id: 'security',
      title: 'Security',
      icon: Lock,
      color: 'text-red-400',
      items: [
        { id: 'twoFactor', title: 'Two-Step Verification', subtitle: settings.twoFactor ? 'Enabled' : 'Disabled' },
        { id: 'changeNumber', title: 'Change Number', subtitle: 'Change your phone number' },
        { id: 'requestInfo', title: 'Request Account Info', subtitle: 'Download your data' },
        { id: 'deleteAccount', title: 'Delete My Account', subtitle: 'Delete your account' },
      ]
    },
    {
      id: 'chats',
      title: 'Chats',
      icon: MessageSquare,
      color: 'text-green-400',
      items: [
        { id: 'chatBackup', title: 'Chat Backup', subtitle: 'Last backup: Never' },
        { id: 'chatHistory', title: 'Chat History', subtitle: 'Export chat history' },
        { id: 'wallpaper', title: 'Wallpaper', subtitle: 'Change chat wallpaper' },
        { id: 'fontSize', title: 'Font Size', subtitle: 'Medium' },
      ]
    },
    {
      id: 'help',
      title: 'Help',
      icon: HelpCircle,
      color: 'text-cyan-400',
      items: [
        { id: 'faq', title: 'FAQ', subtitle: 'Frequently asked questions' },
        { id: 'contact', title: 'Contact Us', subtitle: 'Get help and support' },
        { id: 'terms', title: 'Terms and Privacy Policy', subtitle: 'View our policies' },
        { id: 'appInfo', title: 'App Info', subtitle: 'Version 2.23.24.76' },
      ]
    }
  ]

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      onClose()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const renderPrivacySettings = (settingKey: string) => (
    <div className="space-y-3">
      {privacyOptions.map((option) => (
        <motion.button
          key={option.value}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSettingChange(settingKey, option.value)}
          className={`w-full flex items-center justify-between p-4 rounded-2xl transition-colors ${
            settings[settingKey as keyof typeof settings] === option.value
              ? 'bg-emerald-500/20 border border-emerald-500/30'
              : 'bg-gray-800/50 hover:bg-gray-700/50'
          }`}
        >
          <span className="text-white font-medium">{option.label}</span>
          {settings[settingKey as keyof typeof settings] === option.value && (
            <Check size={20} className="text-emerald-400" />
          )}
        </motion.button>
      ))}
    </div>
  )

  const renderToggleSetting = (settingKey: string) => (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={() => handleSettingChange(settingKey, !settings[settingKey as keyof typeof settings])}
      className={`w-full flex items-center justify-between p-4 rounded-2xl transition-colors ${
        settings[settingKey as keyof typeof settings]
          ? 'bg-emerald-500/20 border border-emerald-500/30'
          : 'bg-gray-800/50 hover:bg-gray-700/50'
      }`}
    >
      <span className="text-white font-medium">
        {settings[settingKey as keyof typeof settings] ? 'Enabled' : 'Disabled'}
      </span>
      <div className={`w-12 h-6 rounded-full transition-colors ${
        settings[settingKey as keyof typeof settings] ? 'bg-emerald-500' : 'bg-gray-600'
      }`}>
        <div className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-transform ${
          settings[settingKey as keyof typeof settings] ? 'translate-x-6' : 'translate-x-0.5'
        }`} />
      </div>
    </motion.button>
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/90 backdrop-blur-xl">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-4xl mx-4 h-[90vh] sm:h-[85vh]"
      >
        <div className="bg-gray-800/95 backdrop-blur-xl rounded-3xl border border-gray-700/50 h-full flex flex-col sm:flex-row shadow-2xl">
          {/* Sidebar */}
          <div className="w-full sm:w-80 border-b sm:border-b-0 sm:border-r border-gray-700/50 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-700/50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Settings</h2>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
                >
                  <X size={20} />
                </motion.button>
              </div>
            </div>

            {/* Settings Sections */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {settingsSections.map((section) => {
                  const Icon = section.icon
                  return (
                    <motion.button
                      key={section.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 p-4 rounded-2xl transition-all ${
                        activeSection === section.id
                          ? 'bg-emerald-500/20 border border-emerald-500/30'
                          : 'hover:bg-gray-700/30'
                      }`}
                    >
                      <Icon size={20} className={section.color} />
                      <span className="text-white font-medium flex-1 text-left">{section.title}</span>
                      <ChevronRight size={16} className="text-gray-400" />
                    </motion.button>
                  )
                })}
              </div>

              {/* Sign Out */}
              <div className="mt-8 pt-6 border-t border-gray-700/50">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSignOut}
                  className="w-full flex items-center space-x-3 p-4 rounded-2xl text-red-400 hover:bg-red-500/10 transition-colors border border-red-500/20"
                >
                  <LogOut size={20} />
                  <span className="font-medium">Sign Out</span>
                </motion.button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col min-h-0">
            {activeSection ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex-1 overflow-y-auto"
                >
                  {/* Section Header */}
                  <div className="p-6 border-b border-gray-700/50">
                    <h3 className="text-lg font-semibold text-white">
                      {settingsSections.find(s => s.id === activeSection)?.title}
                    </h3>
                  </div>

                  {/* Section Content */}
                  <div className="p-6">
                    {activeSection === 'privacy' && (
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-white font-medium mb-3">Last Seen & Online</h4>
                          <p className="text-gray-400 text-sm mb-4">Who can see when you were last online</p>
                          {renderPrivacySettings('lastSeen')}
                        </div>
                        <div>
                          <h4 className="text-white font-medium mb-3">Profile Photo</h4>
                          <p className="text-gray-400 text-sm mb-4">Who can see your profile photo</p>
                          {renderPrivacySettings('profilePhoto')}
                        </div>
                        <div>
                          <h4 className="text-white font-medium mb-3">Read Receipts</h4>
                          <p className="text-gray-400 text-sm mb-4">If turned off, you won't send or receive read receipts</p>
                          {renderToggleSetting('readReceipts')}
                        </div>
                      </div>
                    )}

                    {activeSection === 'notifications' && (
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-white font-medium mb-3">Message Notifications</h4>
                          <p className="text-gray-400 text-sm mb-4">Receive notifications for new messages</p>
                          {renderToggleSetting('messageNotifications')}
                        </div>
                        <div>
                          <h4 className="text-white font-medium mb-3">Group Notifications</h4>
                          <p className="text-gray-400 text-sm mb-4">Receive notifications for group messages</p>
                          {renderToggleSetting('groupNotifications')}
                        </div>
                        <div>
                          <h4 className="text-white font-medium mb-3">Call Notifications</h4>
                          <p className="text-gray-400 text-sm mb-4">Receive notifications for incoming calls</p>
                          {renderToggleSetting('callNotifications')}
                        </div>
                      </div>
                    )}

                    {activeSection === 'security' && (
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-white font-medium mb-3">Two-Step Verification</h4>
                          <p className="text-gray-400 text-sm mb-4">Add an extra layer of security to your account</p>
                          {renderToggleSetting('twoFactor')}
                        </div>
                        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl">
                          <h4 className="text-yellow-400 font-medium mb-2">Security Notice</h4>
                          <p className="text-yellow-400/80 text-sm">
                            Enable two-step verification to secure your account with an additional PIN.
                          </p>
                        </div>
                      </div>
                    )}

                    {(activeSection === 'account' || activeSection === 'storage' || activeSection === 'chats' || activeSection === 'help') && (
                      <div className="space-y-4">
                        {settingsSections.find(s => s.id === activeSection)?.items.map((item) => (
                          <div key={item.id} className="p-4 bg-gray-800/50 rounded-2xl hover:bg-gray-700/50 transition-colors">
                            <h4 className="text-white font-medium mb-1">{item.title}</h4>
                            <p className="text-gray-400 text-sm">{item.subtitle}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <Settings size={48} className="mx-auto mb-4 text-gray-600" />
                  <h3 className="text-lg font-semibold mb-2 text-white">Settings</h3>
                  <p className="text-sm">Select a category to configure your preferences</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}