'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MoreVertical, Users, Radio, Star, Settings, Smartphone, Plus, MessageCircle } from 'lucide-react'
import Image from 'next/image'

interface ChatHeaderProps {
  onSearchToggle?: () => void
  onNewChatClick?: () => void
  searchQuery?: string
  onSearchChange?: (query: string) => void
  showSearch?: boolean
  currentTab?: string
  tabTitle?: string
  chatCount?: number
}

export default function ChatHeader({ 
  onSearchToggle, 
  onNewChatClick, 
  searchQuery = '', 
  onSearchChange,
  showSearch = false,
  currentTab = 'personal',
  tabTitle = 'Chats',
  chatCount = 0
}: ChatHeaderProps) {
  const [showMenu, setShowMenu] = useState(false)

  const menuItems = [
    { icon: MessageCircle, label: 'New Chat', action: () => onNewChatClick?.() },
    { icon: Users, label: 'New Group', action: () => console.log('New Group') },
    { icon: Radio, label: 'New Broadcast', action: () => console.log('New Broadcast') },
    { icon: Smartphone, label: 'Linked Devices', action: () => console.log('Linked Devices') },
    { icon: Star, label: 'Starred Messages', action: () => console.log('Starred Messages') },
    { icon: Settings, label: 'Settings', action: () => console.log('Settings') },
  ]

  return (
    <div className="relative">
      {/* Header Bar - Mobile First */}
      <div className="menu-gradient px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Dynamic Title with Count */}
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">{tabTitle}</h1>
              {chatCount > 0 && (
                <p className="text-xs sm:text-sm text-white/70">
                  {chatCount} {currentTab === 'personal' ? 'conversation' : currentTab.slice(0, -1)}{chatCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>

          {/* Right side - Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onSearchToggle}
              className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Search className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </motion.button>

            {/* New Chat Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onNewChatClick}
              className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              title="New Chat"
            >
              <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </motion.button>

            {/* Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <MoreVertical className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </motion.button>
          </div>
        </div>

        {/* Search Input - Expandable */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={16} />
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white/20 transition-all"
                  autoFocus
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {showMenu && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setShowMenu(false)}
            />
            
            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute right-4 sm:right-6 top-full mt-2 w-48 sm:w-52 context-menu"
            >
              {menuItems.map((item, index) => {
                const Icon = item.icon
                return (
                  <motion.button
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      item.action()
                      setShowMenu(false)
                    }}
                    className="context-menu-item"
                  >
                    <Icon className="context-menu-icon" />
                    <span className="context-menu-text">
                      {item.label}
                    </span>
                  </motion.button>
                )
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}