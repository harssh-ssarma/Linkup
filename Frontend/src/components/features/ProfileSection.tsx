'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Camera, Grid3x3, Film, Edit3, Settings, LogOut } from 'lucide-react'
import Header from '@/components/layout/Header'
import EditProfile from './EditProfile'
import SettingsModal from './SettingsModal'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

const profileData = {
  name: 'Aarav Singh',
  username: '@aarav.design',
  bio: 'Hey, I am using Linkup',
  coverPhoto: 'https://picsum.photos/1200/400',
  profilePhoto: 'https://picsum.photos/400/400',
  postsCount: 42,
  storiesCount: 18
}

const posts = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  image: `https://picsum.photos/400/400?random=${i + 1}`,
  type: i % 4 === 0 ? 'video' : 'image'
}))

const stories = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  image: `https://picsum.photos/400/400?random=${i + 20}`
}))

export default function ProfileSection() {
  const [activeTab, setActiveTab] = useState<'posts' | 'stories'>('posts')
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const { logout } = useAuth()
  const router = useRouter()

  const handleSignOut = () => {
    logout()
    router.push('/')
  }

  const menuItems = [
    { icon: Edit3, label: 'Edit Profile', action: () => setShowEditProfile(true) },
    { icon: Settings, label: 'Settings', action: () => setShowSettings(true) },
    { icon: LogOut, label: 'Sign Out', action: handleSignOut }
  ]

  return (
    <div className="base-gradient flex h-full flex-col">
      <Header 
        title="Profile"
        showBackButton={false}
        showSearchButton={false}
        menuItems={menuItems}
      />

      <div className="flex-1 overflow-y-auto pb-20 md:pb-0">
        {/* Cover Photo */}
        <div className="relative h-32 overflow-hidden rounded-b-3xl border-b border-subtle shadow-soft sm:h-40 md:h-48">
          <Image
            src={profileData.coverPhoto}
            alt="Cover"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/10 to-black/0 dark:from-black/55 dark:via-black/35" />
          <button
            type="button"
            aria-label="Edit cover photo"
            className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full border border-subtle bg-surface-soft text-muted shadow-soft backdrop-blur transition-colors hover:bg-surface-strong hover:text-foreground"
          >
            <Camera size={18} />
          </button>
        </div>

        {/* Profile Info */}
        <div className="px-4 sm:px-6">
          <div className="relative -mt-12 sm:-mt-16">
            <div className="relative inline-block">
              <Image
                src={profileData.profilePhoto}
                alt={profileData.name}
                width={128}
                height={128}
                className="h-24 w-24 rounded-full border-4 border-[color:var(--surface)] object-cover shadow-soft sm:h-32 sm:w-32"
              />
              <button
                type="button"
                aria-label="Edit profile photo"
                className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border border-transparent bg-[color:var(--accent)] text-inverse shadow-soft transition-colors hover:bg-[color:var(--accent-strong)]"
              >
                <Camera size={16} />
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <h1 className="text-xl font-bold text-foreground sm:text-2xl">{profileData.name}</h1>
            <p className="text-sm text-muted sm:text-base">{profileData.username}</p>
            <p className="text-sm text-muted sm:text-base">{profileData.bio}</p>
          </div>

          {/* Stats */}
          <div className="mt-4 flex gap-6 border-b border-subtle py-4">
            <div className="text-center">
              <p className="text-xl font-bold text-foreground sm:text-2xl">{profileData.postsCount}</p>
              <p className="text-xs text-muted sm:text-sm">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-foreground sm:text-2xl">{profileData.storiesCount}</p>
              <p className="text-xs text-muted sm:text-sm">Stories</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-4 flex border-b border-subtle">
            <button
              type="button"
              onClick={() => setActiveTab('posts')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                activeTab === 'posts'
                  ? 'border-b-2 border-[color:var(--accent)] text-foreground'
                  : 'text-muted hover:text-foreground hover:bg-surface-soft/60'
              }`}
            >
              <Grid3x3 size={20} />
              <span>Posts</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('stories')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                activeTab === 'stories'
                  ? 'border-b-2 border-[color:var(--accent)] text-foreground'
                  : 'text-muted hover:text-foreground hover:bg-surface-soft/60'
              }`}
            >
              <Film size={20} />
              <span>Stories</span>
            </button>
          </div>

          {/* Content Grid */}
          <div className="mt-4 grid grid-cols-3 gap-1 pb-4 sm:gap-2">
            {activeTab === 'posts' ? (
              posts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative aspect-square cursor-pointer overflow-hidden rounded-lg border border-subtle bg-surface-soft transition hover:bg-surface-strong hover:shadow-soft"
                >
                  <Image
                    src={post.image}
                    alt={`Post ${post.id}`}
                    fill
                    sizes="(max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    className="object-cover"
                  />
                  {post.type === 'video' && (
                    <div className="absolute top-2 right-2">
                      <Film size={16} className="text-[color:var(--accent)] drop-shadow-lg" />
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              stories.map((story) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative aspect-square cursor-pointer overflow-hidden rounded-lg border border-subtle bg-surface-soft transition hover:bg-surface-strong hover:shadow-soft"
                >
                  <Image
                    src={story.image}
                    alt={`Story ${story.id}`}
                    fill
                    sizes="(max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    className="object-cover"
                  />
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      <EditProfile isOpen={showEditProfile} onClose={() => setShowEditProfile(false)} />
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} onSignOut={handleSignOut} />
    </div>
  )
}
