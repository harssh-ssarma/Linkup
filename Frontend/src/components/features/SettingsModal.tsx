'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { auth } from '@/lib/firebase'
import { signOut } from 'firebase/auth'
import { 
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
  Star,
  HelpCircle,
  Smartphone,
  Radio,
  Archive,
  Users,
  Mail,
  Heart,
  Info,
  QrCode,
  Share,
  RotateCcw,
  Scan
} from 'lucide-react'
import Header from '@/components/layout/Header'
import { useNavigation } from '@/context/NavigationContext'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  onSignOut?: () => void
  initialSection?: SettingsSection
}

type SettingsSection = 
  | 'main' 
  | 'account' 
  | 'privacy' 
  | 'notifications' 
  | 'storage' 
  | 'help'

export default function SettingsModal({ isOpen, onClose, onSignOut, initialSection = 'main' }: SettingsModalProps) {
  const [currentSection, setCurrentSection] = useState<SettingsSection>('main')
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)
  const [qrCodeMode, setQRCodeMode] = useState<'my-code' | 'scan-code'>('my-code')
  const { setShowMobileNavigation } = useNavigation()
  
  // Hide mobile navigation when settings is open
  useEffect(() => {
    if (isOpen) {
      setShowMobileNavigation(false)
    } else {
      setShowMobileNavigation(true)
    }
    
    // Cleanup function to restore navigation when component unmounts
    return () => {
      setShowMobileNavigation(true)
    }
  }, [isOpen, setShowMobileNavigation])
  
  const [settings, setSettings] = useState({
    // Privacy Settings
    lastSeen: 'everyone',
    profilePhoto: 'everyone',
    about: 'everyone',
    status: 'contacts',
    readReceipts: true,
    onlineStatus: true,
    
    // Notification Settings
    messageNotifications: true,
    groupNotifications: true,
    callNotifications: true,
    soundEnabled: true,
    vibrationEnabled: true,
    
    // App Settings
    darkMode: true,
    language: 'English',
    autoDownload: 'wifi',
    fontSize: 'medium'
  })

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await signOut(auth)
      if (onSignOut) {
        onSignOut()
      }
      onClose()
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      setIsSigningOut(false)
    }
  }

  const handleDeleteAccount = async () => {
    // This would typically involve backend API call
    console.log('Delete account requested')
    setShowDeleteConfirm(false)
    // After successful deletion, sign out
    handleSignOut()
  }

  const handleQRCodeAction = (action: string) => {
    switch(action) {
      case 'my-code':
        setQRCodeMode('my-code')
        setShowQRCode(true)
        break
      case 'scan-code':
        setQRCodeMode('scan-code') 
        setShowQRCode(true)
        break
      case 'share':
        console.log('Share QR code')
        break
      case 'reset':
        console.log('Reset QR code')
        break
      default:
        console.log('QR action:', action)
    }
  }

  const getHeaderMenuItems = () => {
    if (showQRCode) {
      return [
        { icon: Share, label: 'Share', action: () => handleQRCodeAction('share') },
        { icon: RotateCcw, label: 'Reset QR Code', action: () => handleQRCodeAction('reset') }
      ]
    }

    // Default settings menu items with QR code options
    return [
      { icon: QrCode, label: 'My Code', action: () => handleQRCodeAction('my-code') },
      { icon: Scan, label: 'Scan Code', action: () => handleQRCodeAction('scan-code') },
      { icon: RotateCcw, label: 'Reset QR Code', action: () => handleQRCodeAction('reset') },
      { icon: Share, label: 'Share QR Code', action: () => handleQRCodeAction('share') }
    ]
  }

  const goBack = () => {
    if (showQRCode) {
      setShowQRCode(false)
    } else if (currentSection === 'main') {
      onClose()
    } else {
      setCurrentSection('main')
    }
  }

  const mainSettingsItems = [
    {
      id: 'account',
      title: 'Account',
      subtitle: 'Security notifications, change number',
      icon: User,
      action: () => setCurrentSection('account')
    },
    {
      id: 'privacy',
      title: 'Privacy',
      subtitle: 'Block contacts, disappearing messages',
      icon: Lock,
      action: () => setCurrentSection('privacy')
    },
    {
      id: 'avatar',
      title: 'Avatar',
      subtitle: 'Create, edit, profile photo',
      icon: Camera,
      action: () => console.log('Avatar settings')
    },
    {
      id: 'chats',
      title: 'Chats',
      subtitle: 'Theme, wallpapers, chat history',
      icon: MessageSquare,
      action: () => console.log('Chat settings')
    },
    {
      id: 'notifications',
      title: 'Notifications',
      subtitle: 'Message, group & call tones',
      icon: Bell,
      action: () => setCurrentSection('notifications')
    },
    {
      id: 'storage',
      title: 'Storage and data',
      subtitle: 'Network usage, auto-download',
      icon: Download,
      action: () => setCurrentSection('storage')
    },
    {
      id: 'app-language',
      title: 'App language',
      subtitle: 'English (device\'s language)',
      icon: Globe,
      action: () => console.log('Language settings')
    },
    {
      id: 'help',
      title: 'Help',
      subtitle: 'Help centre, contact us, privacy policy',
      icon: HelpCircle,
      action: () => setCurrentSection('help')
    },
    {
      id: 'invite',
      title: 'Invite a friend',
      subtitle: '',
      icon: Heart,
      action: () => console.log('Invite friend')
    }
  ]

  const accountItems = [
    {
      id: 'email-address',
      title: 'Email Address',
      subtitle: '',
      icon: Mail,
      action: () => console.log('Email Address')
    },
    {
      id: 'two-step',
      title: 'Two-step verification',
      subtitle: 'Disabled',
      icon: Lock,
      action: () => console.log('Two-step verification')
    },
    {
      id: 'change-number',
      title: 'Change number',
      subtitle: '',
      icon: Phone,
      action: () => console.log('Change number')
    },
    {
      id: 'request-info',
      title: 'Request account info',
      subtitle: '',
      icon: Info,
      action: () => console.log('Request info')
    },
    {
      id: 'add-account',
      title: 'Add account',
      subtitle: '',
      icon: User,
      action: () => console.log('Add account')
    },
    {
      id: 'delete-account',
      title: 'Delete my account',
      subtitle: '',
      icon: Trash2,
      action: () => setShowDeleteConfirm(true),
      danger: true
    }
  ]

  const privacyItems = [
    {
      id: 'last-seen',
      title: 'Last seen and online',
      subtitle: settings.lastSeen,
      icon: Eye,
      action: () => console.log('Last seen settings')
    },
    {
      id: 'profile-photo',
      title: 'Profile photo',
      subtitle: settings.profilePhoto,
      icon: Camera,
      action: () => console.log('Profile photo privacy')
    },
    {
      id: 'about',
      title: 'About',
      subtitle: settings.about,
      icon: Info,
      action: () => console.log('About privacy')
    },
    {
      id: 'status',
      title: 'Status',
      subtitle: settings.status,
      icon: Radio,
      action: () => console.log('Status privacy')
    },
    {
      id: 'read-receipts',
      title: 'Read receipts',
      subtitle: settings.readReceipts ? 'On' : 'Off',
      icon: Check,
      action: () => setSettings(prev => ({ ...prev, readReceipts: !prev.readReceipts }))
    },
    {
      id: 'groups',
      title: 'Groups',
      subtitle: 'Everyone',
      icon: Users,
      action: () => console.log('Groups privacy')
    },
    {
      id: 'live-location',
      title: 'Live location',
      subtitle: 'None',
      icon: Globe,
      action: () => console.log('Live location')
    },
    {
      id: 'blocked',
      title: 'Blocked contacts',
      subtitle: 'None',
      icon: Lock,
      action: () => console.log('Blocked contacts')
    },
    {
      id: 'disappearing',
      title: 'Disappearing messages',
      subtitle: 'Off',
      icon: MessageSquare,
      action: () => console.log('Disappearing messages')
    }
  ]

  const notificationItems = [
    {
      id: 'conversation-tones',
      title: 'Conversation tones',
      subtitle: 'Play sounds for incoming and outgoing messages',
      icon: Bell,
      toggle: settings.messageNotifications,
      action: () => setSettings(prev => ({ ...prev, messageNotifications: !prev.messageNotifications }))
    },
    {
      id: 'messages',
      title: 'Messages',
      subtitle: 'Default',
      icon: MessageSquare,
      action: () => console.log('Message notifications')
    },
    {
      id: 'groups',
      title: 'Groups',
      subtitle: 'Default',
      icon: Users,
      action: () => console.log('Group notifications')
    },
    {
      id: 'calls',
      title: 'Calls',
      subtitle: 'Default',
      icon: Phone,
      action: () => console.log('Call notifications')
    },
    {
      id: 'high-priority',
      title: 'High priority notifications',
      subtitle: 'Show previews of notifications at the top of the screen',
      icon: Star,
      toggle: settings.soundEnabled,
      action: () => setSettings(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))
    },
    {
      id: 'reaction-notifications',
      title: 'Reaction notifications',
      subtitle: 'Show notifications when contacts react to your messages',
      icon: Heart,
      toggle: settings.vibrationEnabled,
      action: () => setSettings(prev => ({ ...prev, vibrationEnabled: !prev.vibrationEnabled }))
    }
  ]

  const storageItems = [
    {
      id: 'manage-storage',
      title: 'Manage storage',
      subtitle: '2.5 GB',
      icon: Download,
      action: () => console.log('Manage storage')
    },
    {
      id: 'network-usage',
      title: 'Network usage',
      subtitle: '142 MB sent • 1.2 GB received',
      icon: Globe,
      action: () => console.log('Network usage')
    },
    {
      id: 'use-less-data',
      title: 'Use less data for calls',
      subtitle: 'Never',
      icon: Phone,
      action: () => console.log('Use less data')
    },
    {
      id: 'auto-download-media',
      title: 'Media auto-download',
      subtitle: '',
      icon: Download,
      action: () => console.log('Auto download media')
    },
    {
      id: 'when-using-mobile',
      title: 'When using mobile data',
      subtitle: 'Photos',
      icon: Smartphone,
      action: () => console.log('Mobile data settings')
    },
    {
      id: 'when-connected-wifi',
      title: 'When connected on Wi-Fi',
      subtitle: 'All media',
      icon: Radio,
      action: () => console.log('WiFi settings')
    },
    {
      id: 'when-roaming',
      title: 'When roaming',
      subtitle: 'No media',
      icon: Globe,
      action: () => console.log('Roaming settings')
    }
  ]

  const helpItems = [
    {
      id: 'help-centre',
      title: 'Help centre',
      subtitle: '',
      icon: HelpCircle,
      action: () => console.log('Help centre')
    },
    {
      id: 'contact-us',
      title: 'Contact us',
      subtitle: 'Questions? Need help?',
      icon: MessageSquare,
      action: () => console.log('Contact us')
    },
    {
      id: 'terms-privacy',
      title: 'Terms and Privacy Policy',
      subtitle: '',
      icon: Shield,
      action: () => console.log('Terms and privacy')
    },
    {
      id: 'app-info',
      title: 'App info',
      subtitle: '',
      icon: Info,
      action: () => console.log('App info')
    }
  ]

  const renderSettingItem = (item: any) => (
    <motion.button
      key={item.id}
      onClick={item.action}
      className={`w-full flex items-center justify-between p-4 hover:bg-indigo-500/10 transition-colors ${
        item.danger ? 'text-red-400' : 'text-white'
      } border-b border-white/5 last:border-b-0`}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center space-x-4">
        <div className={`p-2 rounded-lg ${item.danger ? 'bg-red-500/20' : 'bg-indigo-500/20'}`}>
          <item.icon size={18} className={item.danger ? 'text-red-400' : 'text-indigo-300'} />
        </div>
        <div className="text-left">
          <p className={`font-medium ${item.danger ? 'text-red-400' : 'text-white'}`}>
            {item.title}
          </p>
          {item.subtitle && (
            <p className="text-sm text-white/60 mt-0.5">{item.subtitle}</p>
          )}
        </div>
      </div>
      {item.toggle !== undefined ? (
        <div className={`w-12 h-6 rounded-full transition-colors ${
          item.toggle ? 'bg-indigo-500' : 'bg-white/20'
        }`}>
          <div className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 mt-0.5 ${
            item.toggle ? 'translate-x-6' : 'translate-x-0.5'
          }`} />
        </div>
      ) : (
        <ChevronRight size={16} className="text-indigo-300/60" />
      )}
    </motion.button>
  )

  const renderQRCodeSection = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      {qrCodeMode === 'my-code' ? (
        <div className="text-center">
          <div className="w-64 h-64 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-2xl">
            <div className="w-56 h-56 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <QrCode size={200} className="text-white" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">My QR Code</h3>
          <p className="text-indigo-200/80 text-center max-w-xs">
            Show this code to others to add you as a contact or share your profile
          </p>
        </div>
      ) : (
        <div className="text-center">
          <div className="w-64 h-64 border-2 border-dashed border-indigo-400 rounded-2xl flex items-center justify-center mb-6">
            <div className="text-center">
              <Scan size={80} className="text-indigo-400 mx-auto mb-4" />
              <p className="text-indigo-200">Position QR code within frame</p>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Scan QR Code</h3>
          <p className="text-indigo-200/80 text-center max-w-xs">
            Scan a QR code to add contact or join a group
          </p>
        </div>
      )}
    </div>
  )

  const renderSection = () => {
    switch (currentSection) {
      case 'main':
        return (
          <div className="flex-1 overflow-y-auto">
            {/* Settings Items */}
            <div className="py-2">
              {mainSettingsItems.map(renderSettingItem)}
            </div>
          </div>
        )

      case 'account':
        return (
          <div className="flex-1 overflow-y-auto">
            <div className="py-2">
              {accountItems.map(renderSettingItem)}
            </div>
          </div>
        )

      case 'privacy':
        return (
          <div className="flex-1 overflow-y-auto">
            <div className="py-2">
              {privacyItems.map(renderSettingItem)}
            </div>
            <div className="p-4 text-center text-indigo-200/70 text-sm border-t border-indigo-500/20 bg-gradient-to-r from-indigo-500/5 to-purple-500/5">
              Changes to your privacy settings won't affect messages you've already sent.
            </div>
          </div>
        )

      case 'notifications':
        return (
          <div className="flex-1 overflow-y-auto">
            <div className="py-2">
              {notificationItems.map(renderSettingItem)}
            </div>
          </div>
        )

      case 'storage':
        return (
          <div className="flex-1 overflow-y-auto">
            <div className="py-2">
              {storageItems.map(renderSettingItem)}
            </div>
          </div>
        )

      case 'help':
        return (
          <div className="flex-1 overflow-y-auto">
            <div className="py-2">
              {helpItems.map(renderSettingItem)}
            </div>
            <div className="p-4 text-center text-indigo-200/70 text-sm border-t border-indigo-500/20 bg-gradient-to-r from-indigo-500/5 to-purple-500/5">
              Linkup v2.25.9.11{'\n'}
              Made with ❤️ by Linkup Team
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50"
            onClick={() => !showQRCode && currentSection === 'main' && onClose()}
          />

          {/* Settings Modal */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <Header 
              tabTitle={
                showQRCode ? (qrCodeMode === 'my-code' ? 'My Code' : 'Scan Code') :
                currentSection === 'main' ? 'Settings' :
                currentSection === 'account' ? 'Account' :
                currentSection === 'privacy' ? 'Privacy' :
                currentSection === 'notifications' ? 'Notifications' :
                currentSection === 'storage' ? 'Storage and data' :
                currentSection === 'help' ? 'Help' : 'Settings'
              }
              showBackButton={true}
              onBackClick={goBack}
              menuItems={getHeaderMenuItems()}
            />

            {/* Content */}
            {showQRCode ? renderQRCodeSection() : renderSection()}

            {/* Delete Account Confirmation */}
            <AnimatePresence>
              {showDeleteConfirm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/80 flex items-center justify-center z-60 p-4"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 rounded-2xl p-6 w-full max-w-md border border-indigo-500/30 shadow-2xl"
                  >
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Trash2 size={32} className="text-red-400" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Delete Account</h3>
                      <p className="text-indigo-200/80 leading-relaxed">
                        Are you sure you want to delete your account? This action cannot be undone.
                        All your messages, media, and data will be permanently deleted.
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1 py-3 rounded-xl bg-indigo-500/20 text-white font-medium hover:bg-indigo-500/30 transition-colors border border-indigo-500/30"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDeleteAccount}
                        className="flex-1 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors shadow-lg"
                      >
                        Delete Account
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}