'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, Grid, Bookmark, User, Camera, Edit3 } from 'lucide-react'

interface Post {
  id: string
  image: string
  likes: number
  comments: number
}

interface Story {
  id: string
  image: string
  timestamp: string
}

export default function ProfileSection() {
  const [activeTab, setActiveTab] = useState<'posts' | 'saved'>('posts')

  const userProfile = {
    name: 'Harsh Sharma',
    username: 'harsh_sharma',
    avatar: 'https://ui-avatars.com/api/?name=Harsh+Sharma&background=4F46E5&color=fff',
    bio: 'Photography enthusiast 📸 | Coffee lover ☕ | Mumbai',
    postsCount: 24,
    storiesCount: 5
  }

  const posts: Post[] = Array.from({ length: 12 }, (_, i) => ({
    id: `${i + 1}`,
    image: `/api/placeholder/300/300?random=${i}`,
    likes: Math.floor(Math.random() * 500) + 50,
    comments: Math.floor(Math.random() * 50) + 5
  }))

  const stories: Story[] = Array.from({ length: 5 }, (_, i) => ({
    id: `${i + 1}`,
    image: `/api/placeholder/100/100?random=${i + 20}`,
    timestamp: `${i + 1}h`
  }))

  return (
    <div className="h-full bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900/10 overflow-y-auto">
      {/* Header */}
      <div className="glass-card border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Profile</h1>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        >
          <Settings size={20} />
        </motion.button>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Profile Info */}
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-blue-500/30">
                <img src={userProfile.avatar} alt={userProfile.name} className="w-full h-full object-cover" />
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
              >
                <Camera size={12} className="text-white" />
              </motion.button>
            </div>
            
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">{userProfile.name}</h2>
              <p className="text-white/60">@{userProfile.username}</p>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-medium"
            >
              <Edit3 size={16} className="inline mr-2" />
              Edit
            </motion.button>
          </div>

          <p className="text-white/80 mb-4">{userProfile.bio}</p>

          <div className="flex space-x-6">
            <div className="text-center">
              <p className="text-xl font-bold text-white">{userProfile.postsCount}</p>
              <p className="text-sm text-white/60">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-white">{userProfile.storiesCount}</p>
              <p className="text-sm text-white/60">Stories</p>
            </div>
          </div>
        </div>

        {/* Story Highlights */}
        <div className="glass-card p-4 mb-6">
          <h3 className="text-white font-semibold mb-3">Story Highlights</h3>
          <div className="flex space-x-3 overflow-x-auto scrollbar-hide">
            {stories.map((story) => (
              <div key={story.id} className="flex-shrink-0 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-0.5">
                  <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center">
                    <span className="text-white/60">📷</span>
                  </div>
                </div>
                <p className="text-xs text-white/60 mt-1">{story.timestamp}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex mb-6">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 flex items-center justify-center py-3 border-b-2 transition-colors ${
              activeTab === 'posts' 
                ? 'border-blue-500 text-blue-400' 
                : 'border-white/20 text-white/60'
            }`}
          >
            <Grid size={20} className="mr-2" />
            Posts
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 flex items-center justify-center py-3 border-b-2 transition-colors ${
              activeTab === 'saved' 
                ? 'border-blue-500 text-blue-400' 
                : 'border-white/20 text-white/60'
            }`}
          >
            <Bookmark size={20} className="mr-2" />
            Saved
          </button>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-3 gap-1">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              whileTap={{ scale: 0.95 }}
              className="aspect-square bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center cursor-pointer"
            >
              <span className="text-white/60">📷</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}