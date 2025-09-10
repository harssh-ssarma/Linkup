'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal, Play } from 'lucide-react'
import Image from 'next/image'
import StoriesBar from './StoriesBar'

interface Post {
  id: string
  user: {
    id: string
    name: string
    username: string
    avatar: string
    isVerified: boolean
  }
  content: {
    type: 'photo' | 'video' | 'carousel' | 'reel'
    media: string[]
    caption: string
    location?: string
  }
  engagement: {
    likes: number
    comments: number
    shares: number
    isLiked: boolean
    isSaved: boolean
  }
  timestamp: string
}

export default function FeedSection() {
  const [feedTab, setFeedTab] = useState<'all' | 'friends' | 'trending'>('all')
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      user: {
        id: 'u1',
        name: 'Priya Sharma',
        username: 'priya_sharma',
        avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=4F46E5&color=fff',
        isVerified: true
      },
      content: {
        type: 'photo',
        media: ['https://picsum.photos/400/600?random=101'],
        caption: 'Beautiful sunset at Marina Beach! 🌅 #sunset #beach #chennai',
        location: 'Marina Beach, Chennai'
      },
      engagement: {
        likes: 1234,
        comments: 89,
        shares: 23,
        isLiked: false,
        isSaved: false
      },
      timestamp: '2h ago'
    },
    {
      id: '2',
      user: {
        id: 'u2',
        name: 'Tech News India',
        username: 'technewsindia',
        avatar: 'https://ui-avatars.com/api/?name=Tech+News+India&background=1D4ED8&color=fff',
        isVerified: true
      },
      content: {
        type: 'video',
        media: ['https://picsum.photos/400/600?random=102'],
        caption: 'Breaking: New startup unicorn from Bangalore! 🤖 What do you think about this development?',
      },
      engagement: {
        likes: 5678,
        comments: 234,
        shares: 156,
        isLiked: true,
        isSaved: true
      },
      timestamp: '4h ago'
    }
  ])

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? {
            ...post,
            engagement: {
              ...post.engagement,
              isLiked: !post.engagement.isLiked,
              likes: post.engagement.isLiked 
                ? post.engagement.likes - 1 
                : post.engagement.likes + 1
            }
          }
        : post
    ))
  }

  const handleSave = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? {
            ...post,
            engagement: {
              ...post.engagement,
              isSaved: !post.engagement.isSaved
            }
          }
        : post
    ))
  }

  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count.toString()
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="glass-effect border-b border-white/20 p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-white">Feed</h1>
          <div className="flex space-x-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <MoreHorizontal size={20} />
            </motion.button>
          </div>
        </div>

        {/* Feed Tabs */}
        <div className="flex space-x-1 bg-white/5 rounded-lg p-1">
          {[
            { id: 'all', label: 'All' },
            { id: 'friends', label: 'Friends' },
            { id: 'trending', label: 'Trending' }
          ].map((tab) => {
            const isActive = feedTab === tab.id
            
            return (
              <motion.button
                key={tab.id}
                onClick={() => setFeedTab(tab.id as any)}
                className={`flex-1 py-2 px-4 rounded-md transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-500/30 text-blue-300' 
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-sm font-medium">{tab.label}</span>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Stories Bar */}
      <StoriesBar />

      {/* Posts Feed */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="glass-effect border border-white/10 rounded-2xl mb-6 overflow-hidden"
            >
              {/* Post Header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/20">
                    <Image
                      src={post.user.avatar}
                      alt={post.user.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center space-x-1">
                      <h3 className="font-semibold text-white text-sm">{post.user.name}</h3>
                      {post.user.isVerified && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-white/60">
                      <span>@{post.user.username}</span>
                      <span>•</span>
                      <span>{post.timestamp}</span>
                      {post.content.location && (
                        <>
                          <span>•</span>
                          <span>{post.content.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <MoreHorizontal size={16} />
                </motion.button>
              </div>

              {/* Post Media */}
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-purple-900/20 to-blue-900/20">
                  <Image
                    src={post.content.media[0]}
                    alt="Post content"
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                  {post.content.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="w-16 h-16 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center"
                      >
                        <Play className="text-white ml-1" size={24} />
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>

              {/* Post Actions */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center space-x-2 ${
                        post.engagement.isLiked ? 'text-red-500' : 'text-white/60 hover:text-white'
                      }`}
                    >
                      <Heart 
                        size={20} 
                        className={post.engagement.isLiked ? 'fill-current' : ''} 
                      />
                      <span className="text-sm font-medium">
                        {formatCount(post.engagement.likes)}
                      </span>
                    </motion.button>
                    
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-2 text-white/60 hover:text-white"
                    >
                      <MessageCircle size={20} />
                      <span className="text-sm font-medium">
                        {formatCount(post.engagement.comments)}
                      </span>
                    </motion.button>
                    
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-2 text-white/60 hover:text-white"
                    >
                      <Share size={20} />
                      <span className="text-sm font-medium">
                        {formatCount(post.engagement.shares)}
                      </span>
                    </motion.button>
                  </div>
                  
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSave(post.id)}
                    className={`${
                      post.engagement.isSaved ? 'text-yellow-500' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <Bookmark 
                      size={20} 
                      className={post.engagement.isSaved ? 'fill-current' : ''} 
                    />
                  </motion.button>
                </div>

                {/* Post Caption */}
                <div className="text-white/90 text-sm">
                  <span className="font-semibold">{post.user.username}</span>
                  <span className="ml-2">{post.content.caption}</span>
                </div>

                {/* View Comments */}
                {post.engagement.comments > 0 && (
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="text-white/60 text-sm mt-2 hover:text-white"
                  >
                    View all {post.engagement.comments} comments
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}