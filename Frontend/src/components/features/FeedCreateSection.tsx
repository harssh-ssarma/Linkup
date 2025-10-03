'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import {
  Bookmark,
  Camera,
  Filter,
  Heart,
  Image as ImageIcon,
  MessageCircle,
  Mic,
  Play,
  Plus,
  Radio,
  Share,
  SlidersHorizontal,
  Upload,
  Video,
  X,
} from 'lucide-react'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import StoriesBar from '@/components/features/StoriesBar'
import { ContextMenuItem } from '@/components/ui/ContextMenu'

interface Story {
  id: string
  user: {
    id: string
    name: string
    avatar: string
  }
  hasNewStory: boolean
  lastUpdated: string
}

interface PostAuthor {
  id: string
  name: string
  username: string
  avatar: string
  isVerified: boolean
  source: 'self' | 'channels' | 'groups' | 'contacts'
}

interface PostContent {
  type: 'photo' | 'video'
  media: string
  caption: string
  location?: string
}

interface PostEngagement {
  likes: number
  comments: number
  shares: number
  views: number
  liked: boolean
  saved: boolean
}

interface Post {
  id: string
  author: PostAuthor
  content: PostContent
  engagement: PostEngagement
  timestamp: string
}

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'channels', label: 'Channels' },
  { id: 'groups', label: 'Groups' },
  { id: 'contacts', label: 'Contacts' },
] as const

type FeedFilter = (typeof FILTERS)[number]['id']

type ComposerMode = 'story' | 'post'

type CreateVariant = ComposerMode | 'reel' | 'live' | 'voice'

const CREATE_VARIANTS: Array<{
  id: CreateVariant
  title: string
  subtitle: string
  accent: string
  icon: LucideIcon
}> = [
  {
    id: 'post',
    title: 'Create Post',
    subtitle: 'Share photos or videos with your audience',
    accent: 'bg-[color:var(--accent-subtle)] text-[color:var(--accent-strong)]',
    icon: ImageIcon,
  },
  {
    id: 'story',
    title: 'Add Story',
    subtitle: 'Share a moment that disappears in 24 hours',
    accent: 'bg-[rgba(34,197,94,0.16)] text-[#22c55e]',
    icon: Camera,
  },
  {
    id: 'reel',
    title: 'Create Reel',
    subtitle: 'Short-form vertical video highlight',
    accent: 'bg-[rgba(249,115,22,0.16)] text-[#f97316]',
    icon: Video,
  },
  {
    id: 'live',
    title: 'Go Live',
    subtitle: 'Stream instantly to channels and groups',
    accent: 'bg-[rgba(239,68,68,0.16)] text-[#ef4444]',
    icon: Radio,
  },
  {
    id: 'voice',
    title: 'Voice Room',
    subtitle: 'Host an audio-first drop-in session',
    accent: 'bg-[rgba(14,165,233,0.16)] text-[#0ea5e9]',
    icon: Mic,
  },
]

const STORY_TRANSITION = { duration: 0.2, ease: [0.4, 0, 0.2, 1] }

export default function FeedCreateSection() {
  const [activeFilter, setActiveFilter] = useState<FeedFilter>('all')
  const [stories] = useState<Story[]>(() => generateMockStories())
  const [posts, setPosts] = useState<Post[]>(() => generateMockPosts('all', 1, 6))
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [composerOpen, setComposerOpen] = useState(false)
  const [composerMode, setComposerMode] = useState<ComposerMode>('post')
  const [selectedMedia, setSelectedMedia] = useState<File[]>([])
  const [caption, setCaption] = useState('')
  const [storyViewerStory, setStoryViewerStory] = useState<Story | null>(null)
  const [storyViewerIndex, setStoryViewerIndex] = useState(0)
  const [scrollContainer, setScrollContainer] = useState<HTMLDivElement | null>(null)
  const [showStories, setShowStories] = useState(true)

  const intersectionObserver = useRef<IntersectionObserver | null>(null)
  const lastScrollY = useRef(0)
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null)

  const filteredPosts = useMemo(() => {
    if (activeFilter === 'all') return posts
    return posts.filter(post => post.author.source === activeFilter)
  }, [posts, activeFilter])

  const formatCount = (count: number) => {
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`
    if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`
    return count.toString()
  }

  const feedMenuItems: ContextMenuItem[] = [
    { icon: Filter, label: 'Feed preferences', action: () => setComposerOpen(false) },
    {
      icon: SlidersHorizontal,
      label: 'Manage filters',
      action: () => setActiveFilter(prev => (prev === 'all' ? 'channels' : 'all')),
    },
    { icon: Camera, label: 'Create story', action: () => openComposer('story') },
    { icon: ImageIcon, label: 'Create post', action: () => openComposer('post') },
  ]

  const loadMorePosts = useCallback(async () => {
    if (loading || !hasMore) return
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 800))

    const nextPage = page + 1
    const newPosts = generateMockPosts(activeFilter, nextPage, 4)
    setPosts(prev => [...prev, ...newPosts])
    setPage(nextPage)

    if (nextPage >= 5) {
      setHasMore(false)
    }

    setLoading(false)
  }, [activeFilter, hasMore, loading, page])

  const observeLastPost = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return
      if (intersectionObserver.current) intersectionObserver.current.disconnect()
      intersectionObserver.current = new IntersectionObserver(entries => {
        if (entries[0]?.isIntersecting && hasMore) {
          loadMorePosts()
        }
      })
      if (node) intersectionObserver.current.observe(node)
    },
    [hasMore, loadMorePosts, loading],
  )

  useEffect(() => {
    setPosts(generateMockPosts(activeFilter, 1, 6))
    setPage(1)
    setHasMore(true)
  }, [activeFilter])

  useEffect(() => {
    return () => {
      intersectionObserver.current?.disconnect()
    }
  }, [])

  const openComposer = (mode: ComposerMode) => {
    setComposerMode(mode)
    setComposerOpen(true)
  }

  const handleMediaSelect = (mode: ComposerMode) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = mode === 'story' ? 'image/*,video/*' : 'image/*,video/*'
    input.multiple = mode === 'post'
    input.onchange = event => {
      const files = Array.from((event.target as HTMLInputElement).files || [])
      setSelectedMedia(files)
      openComposer(mode)
    }
    input.click()
  }

  const closeComposer = () => {
    setComposerOpen(false)
    setCaption('')
    setSelectedMedia([])
  }

  const handleStorySelect = (story: Story, index: number) => {
    setStoryViewerStory(story)
    setStoryViewerIndex(index)
  }

  const handleStoryViewerClose = () => {
    setStoryViewerStory(null)
    setStoryViewerIndex(0)
  }

  const handleStoryViewerNavigate = (direction: 'prev' | 'next') => {
    if (!storyViewerStory) return
    const currentIndex = stories.findIndex(story => story.id === storyViewerStory.id)
    const nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1
    if (nextIndex < 0 || nextIndex >= stories.length) {
      handleStoryViewerClose()
    } else {
      setStoryViewerStory(stories[nextIndex])
      setStoryViewerIndex(nextIndex)
    }
  }

  const toggleLike = (postId: string) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? {
              ...post,
              engagement: {
                ...post.engagement,
                liked: !post.engagement.liked,
                likes: post.engagement.liked
                  ? post.engagement.likes - 1
                  : post.engagement.likes + 1,
              },
            }
          : post,
      ),
    )
  }

  const toggleSave = (postId: string) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? {
              ...post,
              engagement: {
                ...post.engagement,
                saved: !post.engagement.saved,
              },
            }
          : post,
      ),
    )
  }

  const onScrollContainerRef = (node: HTMLDivElement | null) => {
    if (node) {
      setScrollContainer(node)
    }
  }

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const currentScrollY = e.currentTarget.scrollTop
    const scrollDelta = currentScrollY - lastScrollY.current

    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current)
    }

    if (Math.abs(scrollDelta) > 5) {
      if (scrollDelta > 0 && currentScrollY > 100) {
        setShowStories(false)
      } else if (scrollDelta < 0) {
        setShowStories(true)
      }
    }

    scrollTimeout.current = setTimeout(() => {
      if (currentScrollY < 50) {
        setShowStories(true)
      }
    }, 150)

    lastScrollY.current = currentScrollY
  }, [])

  return (
    <div className="base-gradient relative flex h-full flex-col">
      <Header
        title="Feed"
        menuItems={feedMenuItems}
        actionButtons={[
          {
            icon: ImageIcon,
            label: 'New Post',
            action: () => handleMediaSelect('post'),
            variant: 'primary',
          },
        ]}
      />

      <div className="flex-1 overflow-hidden">
        <div className="flex h-full flex-col">
          <motion.div
            className="border-b border-subtle px-3 py-2 md:px-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ 
              opacity: showStories ? 1 : 0,
              y: showStories ? 0 : -100,
              height: showStories ? 'auto' : 0,
              paddingTop: showStories ? undefined : 0,
              paddingBottom: showStories ? undefined : 0,
            }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <StoriesBar
              stories={stories.map(story => ({
                ...story,
                user: { name: story.user.name, avatar: story.user.avatar },
              }))}
              onStorySelect={(story, index) => handleStorySelect(stories[index], index)}
            />
          </motion.div>

          <motion.div 
            className="px-3 py-3 md:px-6"
            animate={{ 
              opacity: showStories ? 1 : 0,
              y: showStories ? 0 : -50,
              height: showStories ? 'auto' : 0,
              paddingTop: showStories ? undefined : 0,
              paddingBottom: showStories ? undefined : 0,
            }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-1 space-x-1 rounded-2xl bg-surface-soft/70 p-1">
                {FILTERS.map(filter => {
                  const isActive = activeFilter === filter.id
                  return (
                    <motion.button
                      key={filter.id}
                      type="button"
                      onClick={() => setActiveFilter(filter.id)}
                      whileTap={{ scale: 0.98 }}
                      className={`nav-item flex-1 rounded-2xl px-2 py-2 text-xs font-semibold transition-all sm:text-sm md:px-4 md:py-3 ${
                        isActive
                          ? 'active glass-card-premium text-foreground shadow-soft'
                          : 'text-muted hover:bg-surface-strong/70 hover:text-foreground'
                      }`}
                      aria-pressed={isActive}
                    >
                      {filter.label}
                    </motion.button>
                  )
                })}
              </div>
            </div>
          </motion.div>

          <div ref={onScrollContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto scrollbar-hide">
            <div className="mx-auto flex w-full max-w-3xl flex-col space-y-4 px-3 pb-24 md:px-6 md:pb-12">
              {filteredPosts.map((post, index) => {
                const isLast = index === filteredPosts.length - 1
                return (
                  <motion.article
                    key={post.id}
                    ref={isLast ? observeLastPost : null}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: index * 0.04 }}
                    className="glass-effect overflow-hidden rounded-3xl"
                  >
                    <div className="flex items-center justify-between px-4 py-4">
                      <div className="flex min-w-0 items-center space-x-3">
                        <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-full ring-2 ring-[var(--accent)]/15">
                          <Image
                            src={post.author.avatar}
                            alt={post.author.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-1 text-sm font-semibold text-foreground">
                            <span className="truncate">{post.author.name}</span>
                            {post.author.isVerified && (
                              <span className="badge-soft text-[10px] text-[var(--accent-strong)]">✓</span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-muted">
                            <span>@{post.author.username}</span>
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
                    </div>

                    <div className="relative">
                      <div className="aspect-[4/5] bg-gradient-to-br from-[rgba(37,99,235,0.08)] to-[rgba(99,102,241,0.12)]">
                        <Image
                          src={post.content.media}
                          alt={post.content.caption}
                          fill
                          className="object-cover"
                        />
                        {post.content.type === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <motion.button
                              type="button"
                              whileTap={{ scale: 0.95 }}
                              className="flex h-16 w-16 items-center justify-center rounded-full border border-subtle bg-surface-soft/90 backdrop-blur"
                            >
                              <Play className="ml-1 text-[var(--accent)]" size={28} />
                            </motion.button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4 px-4 py-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <motion.button
                            type="button"
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleLike(post.id)}
                            className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
                              post.engagement.liked
                                ? 'text-red-500'
                                : 'text-muted hover:text-foreground'
                            }`}
                          >
                            <Heart size={20} className={post.engagement.liked ? 'fill-current' : ''} />
                            <span>{formatCount(post.engagement.likes)}</span>
                          </motion.button>

                          <motion.button
                            type="button"
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center space-x-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
                          >
                            <MessageCircle size={20} />
                            <span>{formatCount(post.engagement.comments)}</span>
                          </motion.button>

                          <motion.button
                            type="button"
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center space-x-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
                          >
                            <Share size={20} />
                            <span>{formatCount(post.engagement.shares)}</span>
                          </motion.button>
                        </div>

                        <motion.button
                          type="button"
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleSave(post.id)}
                          className={`transition-colors ${
                            post.engagement.saved
                              ? 'text-yellow-500'
                              : 'text-muted hover:text-foreground'
                          }`}
                        >
                          <Bookmark size={20} className={post.engagement.saved ? 'fill-current' : ''} />
                        </motion.button>
                      </div>

                      <div className="text-sm text-foreground">
                        <span className="font-semibold">@{post.author.username}</span>
                        <span className="ml-2 text-muted-foreground">{post.content.caption}</span>
                      </div>

                      <div className="flex items-center space-x-3 text-xs text-muted">
                        <span>{formatCount(post.engagement.views)} views</span>
                        <span>•</span>
                        <button className="font-medium text-[var(--accent)] transition-colors hover:text-[var(--accent-strong)]">
                          View insights
                        </button>
                      </div>
                    </div>
                  </motion.article>
                )
              })}

              {(!filteredPosts.length || loading) && (
                <div className="flex flex-col items-center gap-2 py-8 text-sm text-muted">
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: loading ? 1 : 0.6 }}
                    className="rounded-full border border-dashed border-subtle px-4 py-2"
                  >
                    {loading ? 'Loading more content…' : 'No posts yet. Try changing your filter.'}
                  </motion.span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => openComposer('post')}
        className="btn-primary fixed bottom-24 right-5 z-40 flex h-16 w-16 items-center justify-center rounded-full shadow-xl md:bottom-10 md:right-10 md:h-20 md:w-20"
        aria-label="Create content"
      >
        <Plus className="h-7 w-7 md:h-8 md:w-8" />
      </motion.button>

      <AnimatePresence>
        {composerOpen && (
          <div
            key="composer"
            onClick={closeComposer}
            className="fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-sm md:items-center md:justify-center md:p-6"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="glass-card relative w-full max-w-4xl rounded-t-3xl p-6 md:rounded-3xl md:p-8"
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground md:text-2xl">
                    {composerMode === 'story' ? 'Create Story' : 'Create Post'}
                  </h2>
                  <p className="mt-1 text-sm text-muted">Share your moment with the world</p>
                </div>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={closeComposer}
                  className="rounded-full border border-subtle bg-surface-soft p-2.5 text-muted transition-all hover:bg-surface-strong hover:text-foreground md:p-3"
                  aria-label="Close composer"
                >
                  <X size={20} />
                </motion.button>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-5">
                  <div className="rounded-2xl border-2 border-dashed border-subtle bg-surface-soft p-8 text-center transition-all hover:border-[var(--accent)]/30 hover:bg-[var(--accent-subtle)]">
                    {selectedMedia.length ? (
                      <div className="space-y-3">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent-subtle)]">
                          <Upload className="h-8 w-8 text-[var(--accent)]" />
                        </div>
                        <div>
                          <p className="text-base font-semibold text-foreground">
                            {selectedMedia.length} file{selectedMedia.length > 1 ? 's' : ''} selected
                          </p>
                          <p className="mt-1 text-sm text-muted">Ready to share with your audience</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent-subtle)]">
                          <ImageIcon className="h-8 w-8 text-[var(--accent)]" />
                        </div>
                        <div>
                          <p className="text-base font-semibold text-foreground">Add media</p>
                          <p className="mt-1 text-sm text-muted">Photos, videos, or reels</p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-2">
                          <motion.button
                            type="button"
                            whileTap={{ scale: 0.95 }}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => handleMediaSelect('post')}
                            className="chip-button"
                          >
                            <ImageIcon className="h-4 w-4" />
                            <span>Gallery</span>
                          </motion.button>
                          <motion.button
                            type="button"
                            whileTap={{ scale: 0.95 }}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => handleMediaSelect('story')}
                            className="chip-button"
                          >
                            <Camera className="h-4 w-4" />
                            <span>Camera</span>
                          </motion.button>
                          <motion.button
                            type="button"
                            whileTap={{ scale: 0.95 }}
                            whileHover={{ scale: 1.02 }}
                            className="chip-button"
                          >
                            <Video className="h-4 w-4" />
                            <span>Video</span>
                          </motion.button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-foreground">Content type</p>
                    <div className="grid gap-2">
                      {CREATE_VARIANTS.slice(0, 3).map(option => {
                        const Icon = option.icon
                        const isPrimary = option.id === composerMode
                        return (
                          <motion.button
                            key={option.id}
                            type="button"
                            whileTap={{ scale: 0.98 }}
                            whileHover={{ scale: 1.01 }}
                            onClick={() => {
                              if (option.id === 'post' || option.id === 'story') {
                                openComposer(option.id)
                              }
                            }}
                            className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all ${
                              isPrimary
                                ? 'border-[var(--accent)]/30 bg-[var(--accent-subtle)] shadow-soft'
                                : 'border-subtle bg-surface-soft hover:border-[var(--accent)]/20 hover:bg-surface-strong'
                            }`}
                          >
                            <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${option.accent}`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className={`text-sm font-semibold ${
                                isPrimary ? 'text-[var(--accent-strong)]' : 'text-foreground'
                              }`}>{option.title}</p>
                              <p className="text-xs text-muted">{option.subtitle}</p>
                            </div>
                          </motion.button>
                        )
                      })}
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-foreground">Caption</label>
                    <textarea
                      value={caption}
                      onChange={event => setCaption(event.target.value)}
                      placeholder={
                        composerMode === 'story'
                          ? 'Add a caption or overlay text for your story…'
                          : 'Write a caption, tag collaborators, or add hashtags…'
                      }
                      className="h-36 w-full resize-none rounded-xl border border-subtle bg-surface-soft px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-[var(--accent)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 md:h-40"
                    />
                    <p className="mt-2 text-xs text-muted">{caption.length} / 2200 characters</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-foreground">Settings</p>
                    <div className="space-y-2">
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.98 }}
                        className="flex w-full items-center justify-between rounded-xl border border-subtle bg-surface-soft px-4 py-3 text-sm transition-all hover:border-[var(--accent)]/20 hover:bg-surface-strong"
                      >
                        <span className="font-medium text-foreground">Audience</span>
                        <span className="text-[var(--accent)]">Everyone</span>
                      </motion.button>
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.98 }}
                        className="flex w-full items-center justify-between rounded-xl border border-subtle bg-surface-soft px-4 py-3 text-sm transition-all hover:border-[var(--accent)]/20 hover:bg-surface-strong"
                      >
                        <span className="font-medium text-foreground">Comments</span>
                        <span className="text-[var(--accent)]">Enabled</span>
                      </motion.button>
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.98 }}
                        className="flex w-full items-center justify-between rounded-xl border border-subtle bg-surface-soft px-4 py-3 text-sm transition-all hover:border-[var(--accent)]/20 hover:bg-surface-strong"
                      >
                        <span className="font-medium text-foreground">Location</span>
                        <span className="text-muted">Add location</span>
                      </motion.button>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.97 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={closeComposer}
                      className="btn-secondary flex-1"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.97 }}
                      whileHover={{ scale: 1.02 }}
                      className="btn-primary flex-1"
                    >
                      <Upload className="h-4 w-4" />
                      Share now
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {storyViewerStory && (
          <motion.div
            key="story-viewer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-sm"
          >
            <div className="relative mx-auto flex h-full w-full max-w-4xl flex-1 flex-col overflow-hidden rounded-none md:my-4 md:rounded-3xl">
              <div className="absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/60 to-transparent px-5 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-white/30 ring-2 ring-white/10">
                      <Image
                        src={storyViewerStory.user.avatar}
                        alt={storyViewerStory.user.name}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="text-white">
                      <p className="text-sm font-semibold drop-shadow-lg">{storyViewerStory.user.name}</p>
                      <p className="text-xs text-white/80 drop-shadow">{storyViewerStory.lastUpdated}</p>
                    </div>
                  </div>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={handleStoryViewerClose}
                    className="rounded-full border border-white/30 bg-white/20 p-2.5 text-white backdrop-blur-sm transition-all hover:bg-white/30"
                    aria-label="Close story"
                  >
                    <X size={20} />
                  </motion.button>
                </div>
              </div>

              <div className="relative flex flex-1 items-center justify-center">
                <button
                  type="button"
                  className="absolute left-0 top-1/2 hidden h-full w-1/4 -translate-y-1/2 bg-transparent md:block"
                  onClick={() => handleStoryViewerNavigate('prev')}
                  aria-label="Previous story"
                />
                <button
                  type="button"
                  className="absolute right-0 top-1/2 hidden h-full w-1/4 -translate-y-1/2 bg-transparent md:block"
                  onClick={() => handleStoryViewerNavigate('next')}
                  aria-label="Next story"
                />
                <div className="relative h-[80vh] w-[90vw] max-w-lg overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500/30 to-purple-500/20">
                  <Image
                    src={`https://picsum.photos/720/1280?random=${storyViewerIndex + 40}`}
                    alt={storyViewerStory.user.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function generateMockStories(): Story[] {
  const users = [
    { id: 'me', name: 'You', avatar: 'https://ui-avatars.com/api/?name=You&background=6366f1&color=fff' },
    { id: '1', name: 'Priya Sharma', avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=14b8a6&color=fff' },
    { id: '2', name: 'Rahul Kumar', avatar: 'https://ui-avatars.com/api/?name=Rahul+Kumar&background=ec4899&color=fff' },
    { id: '3', name: 'Design Club', avatar: 'https://ui-avatars.com/api/?name=Design+Club&background=f97316&color=fff' },
    { id: '4', name: 'AI Updates', avatar: 'https://ui-avatars.com/api/?name=AI+Updates&background=22c55e&color=fff' },
    { id: '5', name: 'Music Squad', avatar: 'https://ui-avatars.com/api/?name=Music+Squad&background=0ea5e9&color=fff' },
  ]

  return users.map((user, index) => ({
    id: user.id,
    user,
    hasNewStory: index !== 0,
    lastUpdated: index === 0 ? 'Just now' : `${index * 3}h ago`,
  }))
}

function generateMockPosts(filter: FeedFilter, page: number, count: number): Post[] {
  const authors: PostAuthor[] = [
    {
      id: 'self',
      name: 'You',
      username: 'you.art',
      avatar: 'https://ui-avatars.com/api/?name=You&background=6366f1&color=fff',
      isVerified: true,
      source: 'self',
    },
    {
      id: 'channels-1',
      name: 'AI Builders',
      username: 'ai.builders',
      avatar: 'https://ui-avatars.com/api/?name=AI+Builders&background=0ea5e9&color=fff',
      isVerified: true,
      source: 'channels',
    },
    {
      id: 'groups-1',
      name: 'Product Jam',
      username: 'product.jam',
      avatar: 'https://ui-avatars.com/api/?name=Product+Jam&background=22c55e&color=fff',
      isVerified: false,
      source: 'groups',
    },
    {
      id: 'contacts-1',
      name: 'Priya Sharma',
      username: 'priya.dev',
      avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=f97316&color=fff',
      isVerified: true,
      source: 'contacts',
    },
  ]

  const captions = [
    'Weekend build sprint with the team 🚀',
    'Sunset edits from last night. Can’t get over these colours!',
    'Channel AMA was electric. Rewatch up now 🔥',
    'Prototype sketches for the upcoming drop.',
    'Group jam session recaps – full video live on the channel.',
    'Shot this on the new mirrorless body. Thoughts?',
  ]

  const filteredAuthors = filter === 'all' ? authors : authors.filter(author => author.source === filter)
  const selectedAuthors = filteredAuthors.length ? filteredAuthors : authors

  return Array.from({ length: count }, (_, index) => {
    const author = selectedAuthors[(page * index + index) % selectedAuthors.length]
    return {
      id: `${author.id}-${page}-${index}`,
      author,
      content: {
        type: Math.random() > 0.7 ? 'video' : 'photo',
        media: `https://picsum.photos/seed/${author.id}-${page}-${index}/720/900`,
        caption: captions[Math.floor(Math.random() * captions.length)],
        location: Math.random() > 0.6 ? ['Mumbai', 'Bengaluru', 'Delhi', 'Remote'][Math.floor(Math.random() * 4)] : undefined,
      },
      engagement: {
        likes: Math.floor(Math.random() * 25_000) + 500,
        comments: Math.floor(Math.random() * 2_500) + 100,
        shares: Math.floor(Math.random() * 1_000) + 50,
        views: Math.floor(Math.random() * 75_000) + 2_500,
        liked: Math.random() > 0.75,
        saved: Math.random() > 0.8,
      },
      timestamp: ['Just now', '12m ago', '1h ago', '3h ago', 'Yesterday'][Math.floor(Math.random() * 5)],
    }
  })
}
