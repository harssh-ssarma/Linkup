'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal, Play, Camera, Users, Settings } from 'lucide-react'
import Image from 'next/image'
import StoriesBar from '@/components/features/StoriesBar'
import Header from '@/components/layout/Header'
import SettingsModal from '@/components/features/SettingsModal'

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
  const [feedTab, setFeedTab] = useState<'all'>('all')
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [showStoriesBar, setShowStoriesBar] = useState(true)
  const [storiesOpacity, setStoriesOpacity] = useState(1)
  const [storiesTranslateY, setStoriesTranslateY] = useState(0)
  const [lastScrollY, setLastScrollY] = useState(0)
  const observer = useRef<IntersectionObserver | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const lastPostElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMorePosts()
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, hasMore])
  
  // Custom menu items for Feed section
  const feedMenuItems = [
    { icon: Camera, label: 'Create Post', action: () => console.log('Create Post') },
    { icon: Users, label: 'Find Friends', action: () => console.log('Find Friends') },
    { icon: Settings, label: 'Feed Settings', action: () => { setSettingsSection('main'); setShowSettings(true) } },
    { icon: Settings, label: 'Privacy Settings', action: () => { setSettingsSection('privacy'); setShowSettings(true) } },
    { icon: Settings, label: 'Notification Settings', action: () => { setSettingsSection('notifications'); setShowSettings(true) } },
  ]
  
  // Generate mock posts data
  const generateMockPosts = (startId: number, count: number): Post[] => {
    const mockUsers = [
      { name: 'Priya Sharma', username: 'priya_dev', isVerified: true },
      { name: 'Rahul Kumar', username: 'rahul_tech', isVerified: false },
      { name: 'Kavya Patel', username: 'kavya_design', isVerified: true },
      { name: 'Arjun Singh', username: 'arjun_founder', isVerified: true },
      { name: 'Neha Gupta', username: 'neha_writer', isVerified: false },
      { name: 'Siddharth Roy', username: 'sid_coder', isVerified: true },
    ]

    const mockCaptions = [
      'Beautiful sunset from my terrace! What a day 🌅',
      'Breaking: New startup unicorn from Bangalore! 🤖 What do you think about this development?',
      'Coffee and code - perfect Sunday vibes ☕️💻',
      'Just finished my morning workout! Feeling energized 💪',
      'Amazing street food in Delhi! Best chaat ever 🍜',
      'New design project completed. Excited to share! 🎨',
      'Weekend getaway to Goa was absolutely fantastic 🏖️',
      'Learning something new every day! Currently diving into AI 🤖',
    ]

    return Array.from({ length: count }, (_, i) => {
      const postId = startId + i
      const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)]
      const randomCaption = mockCaptions[Math.floor(Math.random() * mockCaptions.length)]
      
      return {
        id: postId.toString(),
        user: {
          id: `u${postId}`,
          name: randomUser.name,
          username: randomUser.username,
          avatar: `https://ui-avatars.com/api/?name=${randomUser.name.replace(' ', '+')}&background=${Math.floor(Math.random()*16777215).toString(16)}&color=fff`,
          isVerified: randomUser.isVerified
        },
        content: {
          type: Math.random() > 0.7 ? 'video' : 'photo',
          media: [`https://picsum.photos/400/600?random=${postId + 100}`],
          caption: randomCaption,
          location: Math.random() > 0.5 ? ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata'][Math.floor(Math.random() * 5)] : undefined
        },
        engagement: {
          likes: Math.floor(Math.random() * 10000) + 100,
          comments: Math.floor(Math.random() * 500) + 10,
          shares: Math.floor(Math.random() * 200) + 5,
          isLiked: Math.random() > 0.7,
          isSaved: Math.random() > 0.8
        },
        timestamp: ['2m ago', '15m ago', '1h ago', '3h ago', '1d ago'][Math.floor(Math.random() * 5)]
      }
    })
  }

  const [posts, setPosts] = useState<Post[]>(() => generateMockPosts(1, 5))
  const [showSettings, setShowSettings] = useState(false)
  const [settingsSection, setSettingsSection] = useState<'main' | 'account' | 'privacy' | 'notifications' | 'storage' | 'help'>('main')

  // Load more posts function
  const loadMorePosts = useCallback(async () => {
    if (loading || !hasMore) return
    
    setLoading(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newPosts = generateMockPosts(posts.length + 1, 3)
    
    setPosts(prevPosts => [...prevPosts, ...newPosts])
    setPage(prevPage => prevPage + 1)
    
    // Simulate end of posts after 50 posts
    if (posts.length >= 47) {
      setHasMore(false)
    }
    
    setLoading(false)
  }, [loading, hasMore, posts.length])

  // Reset posts when tab changes
  useEffect(() => {
    setPosts(generateMockPosts(1, 5))
    setPage(1)
    setHasMore(true)
    setShowStoriesBar(true)
    setStoriesOpacity(1)
    setStoriesTranslateY(0)
  }, [feedTab])

  // Progressive scroll-based animation for stories bar
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return
      
      const currentScrollY = scrollContainerRef.current.scrollTop
      const maxHideDistance = 120 // Distance over which to hide completely
      
      // Calculate progressive opacity and translateY based on scroll
      if (currentScrollY <= maxHideDistance) {
        // Progressive animation zone
        const progress = Math.min(currentScrollY / maxHideDistance, 1)
        const newOpacity = Math.max(1 - progress, 0)
        const newTranslateY = -progress * 50 // Move up by 50px max
        
        setStoriesOpacity(newOpacity)
        setStoriesTranslateY(newTranslateY)
        setShowStoriesBar(newOpacity > 0.1) // Keep visible until almost fully transparent
      } else {
        // Fully hidden
        setStoriesOpacity(0)
        setStoriesTranslateY(-50)
        setShowStoriesBar(false)
      }
      
      setLastScrollY(currentScrollY)
    }

    const scrollContainer = scrollContainerRef.current
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true })
      return () => scrollContainer.removeEventListener('scroll', handleScroll)
    }
  }, [])

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
    <div className="h-full flex flex-col relative">
      {/* Header - Fixed at top with higher z-index */}
      <div className="relative z-30">
        <Header 
          tabTitle="Feed"
          currentTab={feedTab}
          menuItems={feedMenuItems}
        />
      </div>

      {/* Stories Bar with Progressive Scroll Animation */}
      <motion.div
        style={{
          opacity: storiesOpacity,
          transform: `translateY(${storiesTranslateY}px)`,
          height: storiesOpacity > 0.1 ? 'auto' : '0px',
          overflow: 'hidden',
          width: '100%',
          transition: 'height 0.1s ease-out'
        }}
        className="relative z-10"
      >
        <StoriesBar />
      </motion.div>

      {/* Posts Feed */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto scrollbar-hide"
      >
        <div className="max-w-2xl mx-auto px-4">
          {posts.map((post, index) => {
            const isLastPost = index === posts.length - 1
            
            return (
              <motion.div
                key={post.id}
                ref={isLastPost ? lastPostElementRef : null}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="glass-effect rounded-2xl mb-6 overflow-hidden"
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
            )
          })}
          
          {/* Loading Indicator */}
          {loading && (
            <div className="flex justify-center py-8">
              <div className="glass-card p-4 rounded-2xl">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span className="text-white/80 text-sm">Loading...</span>
                </div>
              </div>
            </div>
          )}
          
          {/* End of Posts */}
          {!hasMore && posts.length > 0 && (
            <div className="flex justify-center py-8">
              <div className="glass-card p-4 rounded-2xl">
                <span className="text-white/60 text-sm">You've reached the end! 🎉</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSignOut={() => {
          setShowSettings(false)
          // Handle sign out
        }}
        initialSection={settingsSection}
      />
    </div>
  )
}