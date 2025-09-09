'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, MessageCircle, Bookmark, MoreHorizontal, Camera, Plus, Users, Lock, Globe } from 'lucide-react'
import StoriesBar from './StoriesBar'

export default function FeedSection() {
  const [feedTab, setFeedTab] = useState<'all' | 'family' | 'friends'>('all')
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: {
        name: 'Sunita Mummy',
        avatar: 'SM',
        relation: 'family'
      },
      content: 'Beautiful sunset from our garden today! The flowers are blooming so nicely 🌅🌸',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500',
      likes: 12,
      comments: 3,
      timestamp: '2 hours ago',
      liked: false,
      visibility: 'family'
    },
    {
      id: 2,
      user: {
        name: 'Rajesh Papa',
        avatar: 'RP',
        relation: 'family'
      },
      content: 'Just finished fixing the bike! Ready for our family ride this weekend 🚴‍♂️',
      likes: 8,
      comments: 2,
      timestamp: '4 hours ago',
      liked: true,
      visibility: 'family'
    },
    {
      id: 3,
      user: {
        name: 'Priya Didi',
        avatar: 'PD',
        relation: 'family'
      },
      content: 'Made cookies for everyone! Come get them while they\'re warm 🍪',
      image: 'https://images.unsplash.com/photo-1551782450-17144efb9c50?w=500',
      likes: 15,
      comments: 5,
      timestamp: '6 hours ago',
      liked: false,
      visibility: 'family'
    },
    {
      id: 4,
      user: {
        name: 'Kavya Best Friend',
        avatar: 'KB',
        relation: 'friend'
      },
      content: 'Great day at the park with the kids! They loved the new playground 🎠',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500',
      likes: 23,
      comments: 7,
      timestamp: '8 hours ago',
      liked: true,
      visibility: 'friends'
    }
  ])

  const feedTabs = [
    { id: 'all', label: 'All Posts', icon: Globe },
    { id: 'family', label: 'Family', icon: Users },
    { id: 'friends', label: 'Friends', icon: Heart },
  ]

  const filteredPosts = posts.filter(post => {
    if (feedTab === 'all') return true
    if (feedTab === 'family') return post.user.relation === 'family'
    if (feedTab === 'friends') return post.user.relation === 'friend'
    return true
  })

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ))
  }

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'family': return <Users size={14} className="text-green-400" title="Family Only" />
      case 'friends': return <Heart size={14} className="text-blue-400" title="Friends Only" />
      default: return <Globe size={14} className="text-white/40" title="All Contacts" />
    }
  }

  return (
    <div className="h-full bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900/10 overflow-y-auto">
      {/* Header */}
      <div className="glass-card border-b border-white/10 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-white">Family Feed</h1>
          <div className="flex space-x-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 hover:from-purple-500/30 hover:to-pink-500/30 transition-colors"
              title="Take Photo"
            >
              <Camera size={18} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-blue-400 hover:from-blue-500/30 hover:to-purple-600/30 transition-colors"
              title="Create Post"
            >
              <Plus size={18} />
            </motion.button>
          </div>
        </div>
        
        {/* Feed Tabs */}
        <div className="flex space-x-1 bg-white/5 rounded-lg p-1">
          {feedTabs.map((tab) => {
            const isActive = feedTab === tab.id
            const Icon = tab.icon
            
            return (
              <motion.button
                key={tab.id}
                onClick={() => setFeedTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-500/30 text-blue-300' 
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
                whileTap={{ scale: 0.98 }}
              >
                <Icon size={16} />
                <span className="text-sm font-medium hidden sm:block">{tab.label}</span>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Stories Bar */}
      <StoriesBar />

      {/* Posts */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {filteredPosts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 rounded-xl"
          >
            {/* Post Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {post.user.avatar}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-white">{post.user.name}</h3>
                    {getVisibilityIcon(post.visibility)}
                  </div>
                  <p className="text-sm text-white/60">{post.timestamp}</p>
                </div>
              </div>
              <button className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10">
                <MoreHorizontal size={18} />
              </button>
            </div>

            {/* Post Content */}
            <p className="text-white mb-4 leading-relaxed">{post.content}</p>

            {/* Post Image */}
            {post.image && (
              <div className="mb-4 rounded-xl overflow-hidden">
                <img 
                  src={post.image} 
                  alt="Post content"
                  className="w-full h-64 object-cover"
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center space-x-6">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center space-x-2 ${post.liked ? 'text-red-400' : 'text-white/60 hover:text-white'}`}
                >
                  <Heart size={20} className={post.liked ? 'fill-current' : ''} />
                  <span className="text-sm font-medium">{post.likes}</span>
                </motion.button>
                
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 text-white/60 hover:text-white"
                >
                  <MessageCircle size={20} />
                  <span className="text-sm font-medium">{post.comments}</span>
                </motion.button>
              </div>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="text-white/60 hover:text-white"
                title="Save Post"
              >
                <Bookmark size={20} />
              </motion.button>
            </div>
          </motion.div>
        ))}
        
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart size={24} className="text-white/40" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No posts yet</h3>
            <p className="text-white/60 mb-4">
              {feedTab === 'family' ? 'No family posts to show' : 
               feedTab === 'friends' ? 'No friend posts to show' : 
               'No posts to show'}
            </p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-semibold"
            >
              Create First Post
            </motion.button>
          </div>
        )}
      </div>
    </div>
  )
}