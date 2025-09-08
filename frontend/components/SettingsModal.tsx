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
  Check
} from 'lucide-react'

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
      items: [
        { id: 'lastSeen', title: 'Last Seen', subtitle: settings.lastSeen },
        { id: 'profilePhoto', title: 'Profile Photo', subtitle: settings.profilePhoto },
        { id: 'about', title: 'About', subtitle: settings.about },
        { id: 'status', title: 'Status', subtitle: settings.status },
        { id: 'readReceipts', title: 'Read Receipts', subtitle: settings.readReceipts ? 'On' : 'Off' },
      ]
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      items: [
        { id: 'messageNotifications', title: 'Messages', subtitle: settings.messageNotifications ? 'On' : 'Off' },
        { id: 'groupNotifications', title: 'Groups', subtitle: settings.groupNotifications ? 'On' : 'Off' },
        { id: 'callNotifications', title: 'Calls', subtitle: settings.callNotifications ? 'On' : 'Off' },
        { id: 'emailNotifications', title: 'Email', subtitle: settings.emailNotifications ? 'On' : 'Off' },
      ]
    },
    {
      id: 'security',
      title: 'Security',
      icon: Lock,
      items: [
        { id: 'twoFactor', title: 'Two-Factor Authentication', subtitle: settings.twoFactor ? 'Enabled' : 'Disabled' },
        { id: 'fingerprint', title: 'Fingerprint Lock', subtitle: settings.fingerprint ? 'On' : 'Off' },
        { id: 'screenLock', title: 'Screen Lock', subtitle: settings.screenLock ? 'On' : 'Off' },
      ]
    },
    {
      id: 'app',
      title: 'App Settings',
      icon: Globe,
      items: [
        { id: 'darkMode', title: 'Dark Mode', subtitle: settings.darkMode ? 'On' : 'Off' },
        { id: 'language', title: 'Language', subtitle: 'English' },
        { id: 'autoDownload', title: 'Auto-Download Media', subtitle: 'Wi-Fi only' },
      ]
    }
  ]

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const renderPrivacySettings = (settingKey: string) => (
    <div className="space-y-3">
      {privacyOptions.map((option) => (
        <motion.button
          key={option.value}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSettingChange(settingKey, option.value)}
          className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${
            settings[settingKey as keyof typeof settings] === option.value
              ? 'bg-blue-500/20 border border-blue-500/30'
              : 'bg-white/5 hover:bg-white/10'
          }`}
        >
          <span className="text-white">{option.label}</span>
          {settings[settingKey as keyof typeof settings] === option.value && (
            <Check size={20} className="text-blue-400" />
          )}
        </motion.button>
      ))}
    </div>
  )

  const renderToggleSetting = (settingKey: string) => (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={() => handleSettingChange(settingKey, !settings[settingKey as keyof typeof settings])}
      className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${
        settings[settingKey as keyof typeof settings]
          ? 'bg-blue-500/20 border border-blue-500/30'
          : 'bg-white/5 hover:bg-white/10'
      }`}
    >
      <span className="text-white">
        {settings[settingKey as keyof typeof settings] ? 'Enabled' : 'Disabled'}
      </span>
      <div className={`w-12 h-6 rounded-full transition-colors ${
        settings[settingKey as keyof typeof settings] ? 'bg-blue-500' : 'bg-white/20'
      }`}>
        <div className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-transform ${
          settings[settingKey as keyof typeof settings] ? 'translate-x-6' : 'translate-x-0.5'
        }`} />
      </div>
    </motion.button>
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-2xl mx-4 h-[80vh]"
      >
        <div className="glass-effect rounded-2xl border border-white/20 h-full flex">
          {/* Sidebar */}
          <div className="w-80 border-r border-white/20 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-white/20">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Settings</h2>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
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
                      className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-colors ${
                        activeSection === section.id
                          ? 'bg-blue-500/20 border border-blue-500/30'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      <Icon size={20} className="text-white/80" />
                      <span className="text-white font-medium">{section.title}</span>
                      <ChevronRight size={16} className="text-white/40 ml-auto" />
                    </motion.button>
                  )
                })}
              </div>

              {/* Danger Zone */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <h3 className="text-sm font-semibold text-white/60 mb-3">Danger Zone</h3>
                <div className="space-y-2">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center space-x-3 p-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 size={20} />
                    <span>Delete Account</span>
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center space-x-3 p-3 rounded-xl text-orange-400 hover:bg-orange-500/10 transition-colors"
                  >
                    <LogOut size={20} />
                    <span>Sign Out</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col">
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
                  <div className="p-6 border-b border-white/20">
                    <h3 className="text-lg font-semibold text-white">
                      {settingsSections.find(s => s.id === activeSection)?.title}
                    </h3>
                  </div>

                  {/* Section Content */}
                  <div className="p-6">
                    {activeSection === 'privacy' && (
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-white font-medium mb-3">Last Seen</h4>
                          {renderPrivacySettings('lastSeen')}
                        </div>
                        <div>
                          <h4 className="text-white font-medium mb-3">Profile Photo</h4>
                          {renderPrivacySettings('profilePhoto')}
                        </div>
                        <div>
                          <h4 className="text-white font-medium mb-3">About</h4>
                          {renderPrivacySettings('about')}
                        </div>
                        <div>
                          <h4 className="text-white font-medium mb-3">Read Receipts</h4>
                          {renderToggleSetting('readReceipts')}
                        </div>
                      </div>
                    )}

                    {activeSection === 'notifications' && (
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-white font-medium mb-3">Message Notifications</h4>
                          {renderToggleSetting('messageNotifications')}
                        </div>
                        <div>
                          <h4 className="text-white font-medium mb-3">Group Notifications</h4>
                          {renderToggleSetting('groupNotifications')}
                        </div>
                        <div>
                          <h4 className="text-white font-medium mb-3">Call Notifications</h4>
                          {renderToggleSetting('callNotifications')}
                        </div>
                        <div>
                          <h4 className="text-white font-medium mb-3">Email Notifications</h4>
                          {renderToggleSetting('emailNotifications')}
                        </div>
                      </div>
                    )}

                    {activeSection === 'security' && (
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-white font-medium mb-3">Two-Factor Authentication</h4>
                          {renderToggleSetting('twoFactor')}
                        </div>
                        <div>
                          <h4 className="text-white font-medium mb-3">Fingerprint Lock</h4>
                          {renderToggleSetting('fingerprint')}
                        </div>
                        <div>
                          <h4 className="text-white font-medium mb-3">Screen Lock</h4>
                          {renderToggleSetting('screenLock')}
                        </div>
                      </div>
                    )}

                    {activeSection === 'app' && (
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-white font-medium mb-3">Dark Mode</h4>
                          {renderToggleSetting('darkMode')}
                        </div>
                        <div>
                          <h4 className="text-white font-medium mb-3">Language</h4>
                          <div className="p-4 bg-white/5 rounded-xl">
                            <span className="text-white">English (US)</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeSection === 'account' && (
                      <div className="space-y-4">
                        <div className="p-4 bg-white/5 rounded-xl">
                          <h4 className="text-white font-medium mb-2">Profile Information</h4>
                          <p className="text-white/60 text-sm">Manage your profile details and personal information</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl">
                          <h4 className="text-white font-medium mb-2">Phone Number</h4>
                          <p className="text-white/60 text-sm">+1 (555) 123-4567</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl">
                          <h4 className="text-white font-medium mb-2">Username</h4>
                          <p className="text-white/60 text-sm">@johndoe</p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-white/60">
                  <Settings size={48} className="mx-auto mb-4 text-white/30" />
                  <h3 className="text-lg font-semibold mb-2">Settings</h3>
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