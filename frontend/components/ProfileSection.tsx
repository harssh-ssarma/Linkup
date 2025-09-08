'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings, 
  Edit3, 
  Camera, 
  Grid, 
  Bookmark, 
  Tag, 
  MoreHorizontal,
  MapPin,
  Link as LinkIcon,
  Calendar,
  Shield,
  Bell,
  Moon,
  Globe,
  Lock,
  Eye,
  Phone
} from 'lucide-react'
import Image from 'next/image'
import SettingsModal from './SettingsModal'

interface UserProfile {
  id: string
  name: string
  username: string
  bio: string
  avatar: string
  coverImage: string
  stats: {
    posts: number
    followers: number
    following: number
  }
  location: string
  website: string
  joinDate: string
  isVerified: boolean
}

export default function ProfileSection() {
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'tagged'>('posts')
  const [showSettings, setShowSettings] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  
  const [profile, setProfile] = useState<UserProfile>({
    id: '1',
    name: 'John Doe',
    username: 'johndoe',
    bio: '🚀 Full Stack Developer | 📱 Mobile App Enthusiast | 🌍 Travel Lover\nBuilding the future, one line of code at a time ✨',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=4F46E5&color=fff&size=200',
    coverImage: 'https://picsum.photos/800/300?random=cover',
    stats: {
      posts: 127,
      followers: 1234,
      following: 567
    },
    location: 'San Francisco, CA',
    website: 'johndoe.dev',
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
      <div className="glass-effect border-b border-white/20 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Profile</h1>
          <div className="flex space-x-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowEditProfile(true)}
              className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
            >
              <Edit3 size={20} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Settings size={20} />
            </motion.button>
          </div>
        </div>
      </div>

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
            <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-slate-900 bg-slate-900">
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
              className="absolute bottom-2 right-2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg"
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
            <p className="text-white/60">@{profile.username}</p>
          </div>

          {/* Stats */}
          <div className="flex space-x-8 mb-6">
            {[
              { label: 'Posts', value: formatCount(profile.stats.posts) },
              { label: 'Followers', value: formatCount(profile.stats.followers) },
              { label: 'Following', value: formatCount(profile.stats.following) }
            ].map((stat) => (
              <motion.div
                key={stat.label}
                whileTap={{ scale: 0.95 }}
                className="text-center cursor-pointer"
              >
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </motion.div>
            ))}
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

          {/* Action Buttons */}
          <div className="flex space-x-3 mb-6">
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-semibold"
            >
              Edit Profile
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white font-semibold"
            >
              Share Profile
            </motion.button>
          </div>

          {/* Content Tabs */}
          <div className="flex space-x-1 bg-white/5 rounded-lg p-1 mb-6">
            {[
              { id: 'posts', label: 'Posts', icon: Grid },
              { id: 'saved', label: 'Saved', icon: Bookmark },
              { id: 'tagged', label: 'Tagged', icon: Tag }
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

          {/* Content Grid */}
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
                  src={`https://picsum.photos/300/300?random=${index + 10}`}
                  alt={`Post ${index + 1}`}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  )
}