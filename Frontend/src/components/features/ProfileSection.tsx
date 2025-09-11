'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { auth } from '@/lib/firebase'
import { signOut } from 'firebase/auth'
import { 
  Settings, 
  Edit3, 
  Camera, 
  Grid, 
  MapPin,
  Link as LinkIcon,
  Calendar,
  LogOut,
  Heart,
  User,
  Eye
} from 'lucide-react'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import SettingsModal from '@/components/features/SettingsModal'

// Simple EditProfile component since it's missing
const EditProfile = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-md glass-premium rounded-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-white mb-4">Edit Profile</h3>
        <p className="text-white/60 text-sm mb-6">Edit profile feature coming soon!</p>
        <button
          onClick={onClose}
          className="w-full btn-primary"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  )
}

interface UserProfile {
  id: string
  name: string
  username: string
  bio: string
  avatar: string
  coverImage: string
  stats: {
    posts: number
  }
  location: string
  website: string
  joinDate: string
  isVerified: boolean
}

export default function ProfileSection() {
  const [activeTab, setActiveTab] = useState<'posts' | 'stories'>('posts')
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  
  // Show sign out confirmation
  const handleSignOutClick = () => {
    setShowSignOutConfirm(true)
  }
  
  // Custom menu items for Profile section
  const profileMenuItems = [
    { icon: Edit3, label: 'Edit Profile', action: () => setShowEditProfile(true) },
    { icon: Settings, label: 'Settings', action: () => setShowSettings(true) },
    { icon: LogOut, label: 'Sign Out', action: handleSignOutClick },
  ]

  // Actual sign out function
  const handleConfirmSignOut = async () => {
    setIsSigningOut(true)
    try {
      await signOut(auth)
      // Clear session data
      sessionStorage.removeItem('session_started')
      sessionStorage.removeItem('current_user')
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
      // Firebase onAuthStateChanged will handle the redirect to login
    } catch (error) {
      console.error('Error signing out:', error)
      setIsSigningOut(false)
    }
    setShowSignOutConfirm(false)
  }

  // Cancel sign out
  const handleCancelSignOut = () => {
    setShowSignOutConfirm(false)
  }
  
  const [profile, setProfile] = useState<UserProfile>({
    id: '1',
    name: 'Arjun Sharma',
    username: 'arjunsharma',
    bio: '🚀 Full Stack Developer | 📱 Mobile App Enthusiast | 🌍 Mumbai Explorer\nBuilding the future, one line of code at a time ✨',
    avatar: 'https://ui-avatars.com/api/?name=Arjun+Sharma&background=4F46E5&color=fff&size=200',
    coverImage: 'https://picsum.photos/800/300?random=mumbai',
    stats: {
      posts: 127
    },
    location: 'Mumbai, Maharashtra',
    website: 'arjunsharma.dev',
    joinDate: 'March 2020',
    isVerified: true
  })

  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count.toString()
  }

  const handleAvatarChange = () => {
    // Simulate file picker
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setProfile(prev => ({
            ...prev,
            avatar: e.target?.result as string
          }))
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <Header 
        tabTitle="Profile"
        currentTab={activeTab}
        menuItems={profileMenuItems}
      />

      {/* Profile Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Cover Image */}
        <div className="relative h-48 bg-gradient-to-r from-purple-900/50 to-blue-900/50">
          <Image
            src={profile.coverImage}
            alt="Cover"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Profile Info */}
        <div className="relative px-6 pb-6">
          {/* Avatar */}
          <div className="relative -mt-16 mb-4">
            <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-white/20 glass-card-premium">
              <Image
                src={profile.avatar}
                alt={profile.name}
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAvatarChange}
              className="absolute bottom-2 right-2 w-10 h-10 btn-primary rounded-full flex items-center justify-center"
            >
              <Camera size={20} className="text-white" />
            </motion.button>
          </div>

          {/* Name and Username */}
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-1">
              <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
              {profile.isVerified && (
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
              )}
            </div>
            <p className="text-white/60 mb-2">@{profile.username}</p>
            
            {/* Stats */}
            <div className="flex space-x-6">
              <div className="text-center">
                <div className="text-lg font-bold text-white">{formatCount(profile.stats.posts)}</div>
                <div className="text-xs text-white/60">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-white">24</div>
                <div className="text-xs text-white/60">Stories</div>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="mb-6">
            <p className="text-white/90 whitespace-pre-line">{profile.bio}</p>
          </div>

          {/* Additional Info */}
          <div className="space-y-2 mb-6">
            {profile.location && (
              <div className="flex items-center space-x-2 text-white/60">
                <MapPin size={16} />
                <span className="text-sm">{profile.location}</span>
              </div>
            )}
            {profile.website && (
              <div className="flex items-center space-x-2 text-white/60">
                <LinkIcon size={16} />
                <span className="text-sm text-blue-400">{profile.website}</span>
              </div>
            )}
            <div className="flex items-center space-x-2 text-white/60">
              <Calendar size={16} />
              <span className="text-sm">Joined {profile.joinDate}</span>
            </div>
          </div>

          {/* Content Tabs */}
          <div className="flex space-x-1 bg-white/5 rounded-lg p-1 mb-6">
            {[
              { id: 'posts', label: 'Posts', icon: Grid },
              { id: 'stories', label: 'Saved Stories', icon: Heart }
            ].map((tab) => {
              const isActive = activeTab === tab.id
              const Icon = tab.icon
              
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-500/30 text-blue-300' 
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{tab.label}</span>
                </motion.button>
              )
            })}
          </div>

          {/* Content Area */}
          {activeTab === 'posts' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-1">
                {Array.from({ length: 9 }).map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="aspect-square bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-lg overflow-hidden cursor-pointer group"
                  >
                    <Image
                      src={`https://picsum.photos/300/300?random=${index + 100}`}
                      alt={`Post ${index + 1}`}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'stories' && (
            <div className="space-y-4">
              {/* <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-effect rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4">My Saved Stories</h3>
                <p className="text-white/60 text-center py-8">
                  Stories you save will appear here for you to view later
                </p>
              </motion.div> */}
              
              {/* Saved Stories Grid */}
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="aspect-[9/16] bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-xl overflow-hidden cursor-pointer group relative"
                  >
                    <Image
                      src={`https://picsum.photos/180/320?random=${index + 200}`}
                      alt={`Saved Story ${index + 1}`}
                      width={180}
                      height={320}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <Heart size={16} className="text-red-400 fill-current" />
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-white text-xs font-medium truncate">
                        Saved Story {index + 1}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSignOut={handleConfirmSignOut}
        initialSection="main"
      />

      {/* Edit Profile Component */}
      <EditProfile 
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
      />

      {/* Sign Out Confirmation Modal */}
      <AnimatePresence>
        {showSignOutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleCancelSignOut}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="bg-slate-800/90 backdrop-blur-xl rounded-2xl border border-white/10 p-6 w-full max-w-sm mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LogOut className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Sign Out
                </h3>
                <p className="text-white/70 text-sm">
                  Are you sure you want to sign out? You'll need to enter your email again to sign back in.
                </p>
              </div>

              {/* Modal Actions */}
              <div className="flex space-x-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCancelSignOut}
                  className="flex-1 px-4 py-3 bg-slate-700/50 hover:bg-slate-700/70 text-white/80 hover:text-white rounded-xl transition-colors duration-200 font-medium"
                  disabled={isSigningOut}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleConfirmSignOut}
                  disabled={isSigningOut}
                  className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white rounded-xl transition-colors duration-200 font-medium flex items-center justify-center space-x-2"
                >
                  {isSigningOut ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing Out...</span>
                    </>
                  ) : (
                    <span>Sign Out</span>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
