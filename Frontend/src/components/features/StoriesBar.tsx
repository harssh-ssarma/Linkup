'use client'

import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import Image from 'next/image'

export interface Story {
  id: string
  user: {
    name: string
    avatar: string
  }
  hasNewStory: boolean
  isOwn?: boolean
  lastUpdated?: string
}

interface StoriesBarProps {
  stories?: Story[]
  onStorySelect?: (story: Story, index: number) => void
}

const DEFAULT_STORIES: Story[] = [
  {
    id: 'own',
    user: {
      name: 'Your Story',
      avatar: 'https://ui-avatars.com/api/?name=You&background=4F46E5&color=fff',
    },
    hasNewStory: false,
    isOwn: true,
    lastUpdated: 'Just now',
  },
  {
    id: '1',
    user: {
      name: 'Priya',
      avatar: 'https://ui-avatars.com/api/?name=Priya&background=059669&color=fff',
    },
    hasNewStory: true,
    lastUpdated: '12m ago',
  },
  {
    id: '2',
    user: {
      name: 'Rahul',
      avatar: 'https://ui-avatars.com/api/?name=Rahul&background=DC2626&color=fff',
    },
    hasNewStory: true,
    lastUpdated: '33m ago',
  },
  {
    id: '3',
    user: {
      name: 'Kavya',
      avatar: 'https://ui-avatars.com/api/?name=Kavya&background=7C3AED&color=fff',
    },
    hasNewStory: false,
    lastUpdated: '1h ago',
  },
  {
    id: '4',
    user: {
      name: 'Arjun',
      avatar: 'https://ui-avatars.com/api/?name=Arjun&background=EA580C&color=fff',
    },
    hasNewStory: true,
    lastUpdated: '3h ago',
  },
]

export default function StoriesBar({ stories = DEFAULT_STORIES, onStorySelect }: StoriesBarProps) {
  return (
    <div className="p-4">
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
        {stories.map((story, index) => (
          <motion.button
            key={story.id}
            type="button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            className="group flex flex-shrink-0 flex-col items-center space-y-2 focus:outline-none"
            onClick={() => onStorySelect?.(story, index)}
          >
            <div className="relative">
              <div
                className={`h-16 w-16 rounded-full p-0.5 transition-all ${
                  story.hasNewStory
                    ? 'bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500 shadow-lg'
                    : 'bg-gradient-to-br from-[var(--border-subtle)] to-[var(--border-strong)]'
                }`}
              >
                <div className="h-full w-full rounded-full bg-[var(--surface)] p-0.5">
                  <div className="h-full w-full overflow-hidden rounded-full">
                    <Image
                      src={story.user.avatar}
                      alt={story.user.name}
                      width={60}
                      height={60}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {story.isOwn && (
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[var(--surface)] bg-[var(--accent)] shadow-md"
                >
                  <Plus size={12} className="text-white" />
                </motion.div>
              )}
            </div>

            <span className="max-w-[60px] truncate text-center text-xs font-medium text-muted transition-colors group-hover:text-foreground">
              {story.user.name}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}