'use client'

import { useState, useEffect, useRef, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

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
import type { LucideIcon } from 'lucide-react'
import Header from '@/components/layout/Header'
import { useNavigation } from '@/context/NavigationContext'
import { useAuth } from '@/context/AuthContext'

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
  | 'avatar'
  | 'chats'
  | 'language'
  | 'invite'

interface SettingItem {
  id: string
  title: string
  subtitle?: string
  icon: LucideIcon
  action: () => void
  toggle?: boolean
  danger?: boolean
  trailing?: ReactNode
}

export default function SettingsModal({ isOpen, onClose, onSignOut, initialSection = 'main' }: SettingsModalProps) {
  const [currentSection, setCurrentSection] = useState<SettingsSection>('main')
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)
  const [qrCodeMode, setQRCodeMode] = useState<'my-code' | 'scan-code'>('my-code')
  const { setShowMobileNavigation, isSidebarExpanded } = useNavigation()
  const { logout } = useAuth()
  const router = useRouter()
  const [isDesktop, setIsDesktop] = useState(false)
  const [copyFeedback, setCopyFeedback] = useState<'copied' | 'failed' | null>(null)
  const copyFeedbackTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inviteLink = 'https://linkup.app/invite'
  const inviteMessage = `Hey! I'm on Linkup – the next-gen messaging app. Join me here: ${inviteLink}`
  const desktopNavWidth = isSidebarExpanded ? 256 : 64
  
  // Hide mobile navigation when settings is open (mobile only)
  useEffect(() => {
    const isMobile = window.innerWidth < 768
    if (isOpen && isMobile) {
      setShowMobileNavigation(false)
    } else if (!isOpen) {
      setShowMobileNavigation(true)
    }
    
    // Cleanup function to restore navigation when component unmounts
    return () => {
      setShowMobileNavigation(true)
    }
  }, [isOpen, setShowMobileNavigation])

  useEffect(() => {
    if (isOpen) {
      setCurrentSection(initialSection)
      setShowQRCode(false)
    }
  }, [initialSection, isOpen])

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

  useEffect(() => {
    const timeoutId = copyFeedbackTimeout.current

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
        if (copyFeedbackTimeout.current === timeoutId) {
          copyFeedbackTimeout.current = null
        }
      }
    }
  }, [copyFeedback])
  
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

  const handleSignOut = () => {
    setIsSigningOut(true)
    try {
      logout()
      onSignOut?.()
      onClose()
      router.push('/')
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

  const startCopyFeedbackTimer = () => {
    if (copyFeedbackTimeout.current) {
      clearTimeout(copyFeedbackTimeout.current)
    }

    copyFeedbackTimeout.current = setTimeout(() => {
      setCopyFeedback(null)
      copyFeedbackTimeout.current = null
    }, 2000)
  }

  const handleCopyInviteLink = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(inviteLink)
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = inviteLink
        textArea.setAttribute('readonly', '')
        textArea.style.position = 'absolute'
        textArea.style.left = '-9999px'
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
      }

      setCopyFeedback('copied')
    } catch (error) {
      console.error('Failed to copy invite link:', error)
      setCopyFeedback('failed')
    } finally {
      startCopyFeedbackTimer()
    }
  }

  const openShareWindow = (url: string) => {
    if (typeof window === 'undefined') return
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleShareToWhatsApp = () => {
    openShareWindow(`https://wa.me/?text=${encodeURIComponent(inviteMessage)}`)
  }

  const handleShareViaSMS = () => {
    openShareWindow(`sms:?&body=${encodeURIComponent(inviteMessage)}`)
  }

  const handleShareViaEmail = () => {
    if (typeof window === 'undefined') return
    const subject = 'Join me on Linkup'
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(inviteMessage)}`
  }

  const handleShowInviteQRCode = () => {
    setQRCodeMode('my-code')
    setShowQRCode(true)
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
      action: () => setCurrentSection('avatar')
    },
    {
      id: 'chats',
      title: 'Chats',
      subtitle: 'Theme, wallpapers, chat history',
      icon: MessageSquare,
      action: () => setCurrentSection('chats')
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
      action: () => setCurrentSection('language')
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
      subtitle: 'Share Linkup with friends',
      icon: Heart,
      action: () => setCurrentSection('invite')
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

  const avatarItems = [
    {
      id: 'create-avatar',
      title: 'Create avatar',
      subtitle: 'Design your own avatar',
      icon: Camera,
      action: () => console.log('Create avatar')
    },
    {
      id: 'edit-avatar',
      title: 'Edit avatar',
      subtitle: 'Customize your current avatar',
      icon: User,
      action: () => console.log('Edit avatar')
    },
    {
      id: 'profile-photo',
      title: 'Profile photo',
      subtitle: 'Upload or change profile picture',
      icon: Camera,
      action: () => console.log('Profile photo')
    }
  ]

  const chatItems = [
    {
      id: 'theme',
      title: 'Theme',
      subtitle: 'Light, Dark, System default',
      icon: Moon,
      action: () => console.log('Theme')
    },
    {
      id: 'wallpaper',
      title: 'Wallpaper',
      subtitle: 'Change chat background',
      icon: Camera,
      action: () => console.log('Wallpaper')
    },
    {
      id: 'chat-history',
      title: 'Chat history',
      subtitle: 'Export, clear, backup',
      icon: Archive,
      action: () => console.log('Chat history')
    },
    {
      id: 'font-size',
      title: 'Font size',
      subtitle: 'Small, Medium, Large',
      icon: MessageSquare,
      action: () => console.log('Font size')
    }
  ]

  const languageItems = [
    {
      id: 'english',
      title: 'English',
      subtitle: '',
      icon: Globe,
      action: () => setSettings(prev => ({ ...prev, language: 'English' }))
    },
    {
      id: 'hindi',
      title: 'हिन्दी',
      subtitle: 'Hindi',
      icon: Globe,
      action: () => setSettings(prev => ({ ...prev, language: 'Hindi' }))
    },
    {
      id: 'spanish',
      title: 'Español',
      subtitle: 'Spanish',
      icon: Globe,
      action: () => setSettings(prev => ({ ...prev, language: 'Spanish' }))
    },
    {
      id: 'french',
      title: 'Français',
      subtitle: 'French',
      icon: Globe,
      action: () => setSettings(prev => ({ ...prev, language: 'French' }))
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

  const inviteItems = [
    {
      id: 'copy-link',
      title: 'Copy invite link',
      subtitle: copyFeedback === 'copied' ? 'Link copied!' : copyFeedback === 'failed' ? 'Failed to copy' : inviteLink,
      icon: Share,
      action: handleCopyInviteLink
    },
    {
      id: 'share-whatsapp',
      title: 'Share via WhatsApp',
      subtitle: 'Invite friends on WhatsApp',
      icon: MessageSquare,
      action: handleShareToWhatsApp
    },
    {
      id: 'share-sms',
      title: 'Share via SMS',
      subtitle: 'Send invite via text message',
      icon: MessageSquare,
      action: handleShareViaSMS
    },
    {
      id: 'share-email',
      title: 'Share via Email',
      subtitle: 'Send invite via email',
      icon: Mail,
      action: handleShareViaEmail
    },
    {
      id: 'show-qr',
      title: 'Show QR Code',
      subtitle: 'Share your QR code',
      icon: QrCode,
      action: handleShowInviteQRCode
    }
  ]

  const renderSettingItem = (item: any) => (
    <button
      key={item.id}
      onClick={item.action}
      className="flex w-full items-center justify-between rounded-2xl border border-subtle bg-surface-soft p-4 text-foreground shadow-soft hover:bg-surface-strong"
    >
      <div className="flex items-center space-x-4">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
            item.danger
              ? 'border-[var(--danger)] bg-[rgba(220,38,38,0.15)] text-[var(--danger)]'
              : 'border-subtle bg-surface text-[var(--accent)]'
          }`}
        >
          <item.icon size={18} className={item.danger ? 'text-[var(--danger)]' : 'text-[var(--accent)]'} />
        </div>
        <div className="text-left">
          <p className={`font-medium ${item.danger ? 'text-[var(--danger)]' : 'text-foreground'}`}>
            {item.title}
          </p>
          {item.subtitle && <p className="mt-0.5 text-sm text-muted">{item.subtitle}</p>}
        </div>
      </div>
      {item.toggle !== undefined ? (
        <div
          className={`flex h-6 w-12 items-center rounded-full border transition-colors ${
            item.toggle ? 'border-transparent bg-[var(--accent)]' : 'border-subtle bg-surface'
          }`}
        >
          <div
            className={`h-5 w-5 rounded-full bg-surface shadow-soft transition-transform duration-200 ${
              item.toggle ? 'translate-x-6' : 'translate-x-0.5'
            }`}
          />
        </div>
      ) : (
        <ChevronRight size={16} className="text-muted" />
      )}
    </button>
  )

  const renderQRCodeSection = () => (
    <div className="flex flex-1 flex-col items-center justify-center p-8">
      {qrCodeMode === 'my-code' ? (
        <div className="text-center">
          <div className="mb-6 flex h-64 w-64 items-center justify-center rounded-2xl border border-subtle bg-surface shadow-deep">
            <div className="glass-card flex h-56 w-56 items-center justify-center rounded-xl">
              <QrCode size={200} className="text-[var(--accent-strong)]" />
            </div>
          </div>
          <h3 className="mb-2 text-xl font-semibold text-foreground">My QR Code</h3>
          <p className="max-w-xs text-center text-muted">
            Show this code to others to add you as a contact or share your profile
          </p>
        </div>
      ) : (
        <div className="text-center">
          <div className="mb-6 flex h-64 w-64 items-center justify-center rounded-2xl border-2 border-dashed border-[var(--accent)]/50">
            <div className="text-center">
              <Scan size={80} className="mx-auto mb-4 text-[var(--accent)]" />
              <p className="text-muted">Position QR code within frame</p>
            </div>
          </div>
          <h3 className="mb-2 text-xl font-semibold text-foreground">Scan QR Code</h3>
          <p className="max-w-xs text-center text-muted">
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
            <div className="border-t border-subtle bg-surface-soft p-4 text-center text-sm text-muted">
              Changes to your privacy settings will not affect messages you have already sent.
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

      case 'avatar':
        return (
          <div className="flex-1 overflow-y-auto">
            <div className="py-2">
              {avatarItems.map(renderSettingItem)}
            </div>
          </div>
        )

      case 'chats':
        return (
          <div className="flex-1 overflow-y-auto">
            <div className="py-2">
              {chatItems.map(renderSettingItem)}
            </div>
          </div>
        )

      case 'language':
        return (
          <div className="flex-1 overflow-y-auto">
            <div className="py-2">
              {languageItems.map(renderSettingItem)}
            </div>
          </div>
        )

      case 'help':
        return (
          <div className="flex-1 overflow-y-auto">
            <div className="py-2">
              {helpItems.map(renderSettingItem)}
            </div>
            <div className="border-t border-subtle bg-surface-soft p-4 text-center text-sm text-muted">
              Linkup v2.25.9.11{'\n'}
              Made with ❤️ by Linkup Team
            </div>
          </div>
        )

      case 'invite':
        return (
          <div className="flex-1 overflow-y-auto">
            <div className="py-2">
              {inviteItems.map(renderSettingItem)}
            </div>
            <div className="mt-4 rounded-2xl border border-subtle bg-surface-soft p-6 text-center">
              <Heart className="mx-auto mb-3 text-[var(--accent)]" size={40} />
              <h3 className="mb-2 text-lg font-semibold text-foreground">Invite Friends to Linkup</h3>
              <p className="mb-4 text-sm text-muted">
                Share Linkup with your friends and family. The more people join, the better the experience!
              </p>
              <div className="rounded-xl bg-surface p-3 text-left">
                <p className="text-xs font-medium text-muted mb-1">Your invite message:</p>
                <p className="text-sm text-foreground break-words">{inviteMessage}</p>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
      isOpen && (
        <>
          {/* Backdrop - only on mobile */}
          <div
            className="fixed inset-0 z-40 bg-[rgba(15,23,42,0.65)] backdrop-blur-sm md:hidden"
            onClick={() => !showQRCode && currentSection === 'main' && onClose()}
          />

          {/* Desktop backdrop - only for area to the right of navigation */}
          <div
            className={`hidden md:block fixed top-0 bottom-0 right-0 z-40 bg-[rgba(15,23,42,0.4)] transition-all duration-300 ${
              isDesktop ? (isSidebarExpanded ? 'left-64' : 'left-16') : 'left-0'
            }`}
            onClick={() => !showQRCode && currentSection === 'main' && onClose()}
          />

          {/* Settings Modal */}
          <div
            className={`fixed inset-0 z-50 flex bg-surface shadow-deep md:flex-row md:inset-auto md:right-0 md:top-0 md:bottom-0 transition-all duration-300 ${
              isDesktop ? (isSidebarExpanded ? 'md:left-64' : 'md:left-16') : ''
            }`}
          >
            {/* Left Sidebar - Settings List (Desktop) */}
            <div className={`${
              currentSection === 'main' ? 'flex' : 'hidden md:flex'
            } w-full md:w-80 lg:w-96 flex-col border-r border-subtle`}>
              <Header 
                tabTitle="Settings"
                showBackButton={true}
                onBackClick={onClose}
                menuItems={getHeaderMenuItems()}
              />
              <div className="flex-1 overflow-y-auto p-4">
                {mainSettingsItems.map(renderSettingItem)}
              </div>
            </div>

            {/* Right Panel - Settings Details */}
            <div className={`${
              currentSection === 'main' ? 'hidden md:flex' : 'flex'
            } flex-1 flex-col`}>
              {currentSection !== 'main' && (
                <Header 
                  tabTitle={
                    showQRCode ? (qrCodeMode === 'my-code' ? 'My Code' : 'Scan Code') :
                    currentSection === 'account' ? 'Account' :
                    currentSection === 'privacy' ? 'Privacy' :
                    currentSection === 'notifications' ? 'Notifications' :
                    currentSection === 'storage' ? 'Storage and data' :
                    currentSection === 'avatar' ? 'Avatar' :
                    currentSection === 'chats' ? 'Chats' :
                    currentSection === 'language' ? 'App language' :
                    currentSection === 'help' ? 'Help' : 'Settings'
                  }
                  showBackButton={true}
                  onBackClick={goBack}
                  menuItems={[]}
                />
              )}
              <div className="flex-1 overflow-y-auto p-4">
                {showQRCode ? renderQRCodeSection() : (
                  currentSection !== 'main' ? renderSection() : (
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center text-muted">
                        <Settings size={64} className="mx-auto mb-4 opacity-50" />
                        <p>Select a setting to view details</p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Delete Account Confirmation */}
              {showDeleteConfirm && (
                <div
                  className="fixed inset-0 z-60 flex items-center justify-center bg-[rgba(8,15,30,0.75)] p-4"
                >
                  <div
                    className="glass-effect w-full max-w-md rounded-2xl border border-subtle bg-surface p-6 shadow-deep"
                  >
                    <div className="mb-6 text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[var(--danger)] bg-[rgba(220,38,38,0.12)]">
                        <Trash2 size={32} className="text-[var(--danger)]" />
                      </div>
                      <h3 className="mb-2 text-xl font-bold text-foreground">Delete Account</h3>
                      <p className="leading-relaxed text-muted">
                        Are you sure you want to delete your account? This action cannot be undone.
                        All your messages, media, and data will be permanently deleted.
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1 rounded-xl border border-subtle bg-surface-soft py-3 font-medium text-foreground transition-colors hover:bg-surface-strong"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDeleteAccount}
                        className="flex-1 rounded-xl border border-[var(--danger)] bg-[rgba(220,38,38,0.14)] py-3 font-medium text-[var(--danger)] shadow-soft transition-colors hover:bg-[rgba(220,38,38,0.2)]"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}
          </div>
        </>
      )
  )
}