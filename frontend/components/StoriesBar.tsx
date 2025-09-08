'use client'

import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import Image from 'next/image'

interface Story {
  id: string
  user: {
    name: string
    avatar: string
  }
  hasNewStory: boolean
  isOwn?: boolean
}

export default function StoriesBar() {
  const stories: Story[] = [
    {
      id: 'own',
      user: {
        name: 'Your Story',
        avatar: 'https://ui-avatars.com/api/?name=You&background=4F46E5&color=fff'
      },
      hasNewStory: false,
      isOwn: true
    },
    {
      id: '1',
      user: {
        name: 'Alice',
        avatar: 'https://ui-avatars.com/api/?name=Alice&background=059669&color=fff'
      },
      hasNewStory: true
    },
    {
      id: '2',
      user: {
        name: 'Bob',
        avatar: 'https://ui-avatars.com/api/?name=Bob&background=DC2626&color=fff'
      },
      hasNewStory: true
    },
    {
      id: '3',
      user: {
        name: 'Carol',
        avatar: 'https://ui-avatars.com/api/?name=Carol&background=7C3AED&color=fff'
      },
      hasNewStory: false
    },
    {
      id: '4',
      user: {
        name: 'David',
        avatar: 'https://ui-avatars.com/api/?name=David&background=EA580C&color=fff'
      },
      hasNewStory: true
    }
  ]

  return (
    <div className="border-b border-white/10 p-4">
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
        {stories.map((story, index) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="flex-shrink-0 flex flex-col items-center space-y-2 cursor-pointer group"
          >
            <div className="relative">
              {/* Story Ring */}
              <div className={`w-16 h-16 rounded-full p-0.5 ${
                story.hasNewStory 
                  ? 'bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500' 
                  : 'bg-white/20'
              }`}>
                <div className="w-full h-full bg-slate-900 rounded-full p-0.5">
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <Image
                      src={story.user.avatar}
                      alt={story.user.name}
                      width={60}
                      height={60}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              
              {/* Add Story Button */}
              {story.isOwn && (
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-slate-900"
                >
                  <Plus size={12} className="text-white" />
                </motion.div>
              )}
            </div>
            
            {/* Story Name */}
            <span className="text-xs text-white/80 text-center max-w-[60px] truncate group-hover:text-white transition-colors">
              {story.user.name}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}