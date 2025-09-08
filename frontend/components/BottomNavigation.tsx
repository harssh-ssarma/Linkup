'use client'

import { motion } from 'framer-motion'
import { MessageCircle, Home, Plus, Search, User, Phone, Video } from 'lucide-react'

interface BottomNavigationProps {
  activeTab: 'chats' | 'feed' | 'create' | 'discover' | 'profile'
  onTabChange: (tab: 'chats' | 'feed' | 'create' | 'discover' | 'profile') => void
}

export default function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: 'chats', icon: MessageCircle, label: 'Chats', color: 'from-blue-500 to-cyan-500' },
    { id: 'feed', icon: Home, label: 'Feed', color: 'from-purple-500 to-pink-500' },
    { id: 'create', icon: Plus, label: 'Create', color: 'from-green-500 to-emerald-500' },
    { id: 'discover', icon: Search, label: 'Discover', color: 'from-orange-500 to-red-500' },
    { id: 'profile', icon: User, label: 'Profile', color: 'from-indigo-500 to-purple-500' },
  ]

  return (
    <div className="glass-effect border-t border-white/20 px-4 py-2">
      <div className="flex justify-around items-center">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          const Icon = tab.icon
          
          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id as any)}
              className="relative flex flex-col items-center p-3 rounded-xl transition-all duration-200"
              whileTap={{ scale: 0.95 }}
            >
              {/* Active Background */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className={`absolute inset-0 bg-gradient-to-r ${tab.color} rounded-xl opacity-20`}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              {/* Icon */}
              <div className={`relative z-10 ${isActive ? 'text-white' : 'text-white/60'}`}>
                <Icon size={24} />
              </div>
              
              {/* Label */}
              <span className={`text-xs mt-1 ${isActive ? 'text-white font-semibold' : 'text-white/60'}`}>
                {tab.label}
              </span>
              
              {/* Active Indicator */}
              {isActive && (
                <motion.div
                  className={`absolute -top-1 w-8 h-1 bg-gradient-to-r ${tab.color} rounded-full`}
                  layoutId="activeIndicator"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              {/* Notification Badge for Chats */}
              {tab.id === 'chats' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                >
                  <span className="text-xs text-white font-bold">3</span>
                </motion.div>
              )}
            </motion.button>
          )
        })}
      </div>
      
      {/* Quick Action Buttons */}
      <div className="flex justify-center space-x-4 mt-2 pt-2 border-t border-white/10">
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 rounded-full text-green-400 hover:bg-green-500/30 transition-colors"
        >
          <Phone size={16} />
          <span className="text-sm">Call</span>
        </motion.button>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 rounded-full text-blue-400 hover:bg-blue-500/30 transition-colors"
        >
          <Video size={16} />
          <span className="text-sm">Video</span>
        </motion.button>
      </div>
    </div>
  )
}