'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MoreVertical, Users, Radio, Star, Settings, Smartphone, Plus, MessageCircle, ArrowLeft } from 'lucide-react'
import Image from 'next/image'

interface HeaderProps {
  // Navigation
  showBackButton?: boolean
  onBackClick?: () => void
  
  // Title & Content
  title?: string
  subtitle?: string
  
  // Universal Search System
  showSearchButton?: boolean
  searchPlaceholder?: string
  onSearchResults?: (query: string, results: any[]) => void
  searchData?: any[]
  searchFields?: string[]
  
  // Legacy search (for backward compatibility)
  onSearchToggle?: () => void
  searchQuery?: string
  onSearchChange?: (query: string) => void
  showSearch?: boolean
  
  // Custom Menu Items (for direct buttons like Call, Video)
  actionButtons?: Array<{
    icon: any
    label: string
    action: () => void
    variant?: 'default' | 'primary'
  }>
  
  // Dropdown menu items
  menuItems?: Array<{
    icon: any
    label: string
    action: () => void
  }>
  
  // Legacy props for backward compatibility
  tabTitle?: string
  currentTab?: string
  chatCount?: number
  onNewChatClick?: () => void
}

export default function Header({ 
  // Navigation
  showBackButton = false,
  onBackClick,
  
  // Title & Content  
  title,
  subtitle,
  
  // Universal Search System
  showSearchButton = true,
  searchPlaceholder = 'Search...',
  onSearchResults,
  searchData = [],
  searchFields = ['name'],
  
  // Legacy search (for backward compatibility)
  onSearchToggle, 
  searchQuery = '', 
  onSearchChange,
  showSearch = false,
  
  // Custom action buttons
  actionButtons = [],
  
  // Dropdown menu items
  menuItems = [],
  
  // Legacy props (for backward compatibility)
  tabTitle,
  currentTab = 'personal',
  chatCount = 0,
  onNewChatClick
}: HeaderProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [showUniversalSearch, setShowUniversalSearch] = useState(false)
  const [universalSearchQuery, setUniversalSearchQuery] = useState('')

  // Universal search function
  const handleUniversalSearch = (query: string) => {
    setUniversalSearchQuery(query)
    
    if (!query.trim()) {
      onSearchResults?.(query, [])
      return
    }

    const results = searchData.filter(item => {
      return searchFields.some(field => {
        const value = field.split('.').reduce((obj, key) => obj?.[key], item)
        return value?.toString().toLowerCase().includes(query.toLowerCase())
      })
    })
    
    onSearchResults?.(query, results)
  }

  // Handle back button - either close search or go back
  const handleBackClick = () => {
    if (showUniversalSearch) {
      // Close search mode, restore normal header
      setShowUniversalSearch(false)
      setUniversalSearchQuery('')
      onSearchResults?.('', [])
    } else {
      // Normal back action
      onBackClick?.()
    }
  }

  // Handle search button click
  const handleSearchClick = () => {
    if (onSearchToggle) {
      // Legacy search behavior
      onSearchToggle()
    } else {
      // New universal search behavior
      setShowUniversalSearch(true)
    }
  }

  // Use new props or fallback to legacy props
  const displayTitle = title || tabTitle || 'Linkup'
  const displaySubtitle = subtitle || (chatCount > 0 ? `${chatCount} ${currentTab === 'personal' ? 'conversation' : currentTab?.slice(0, -1)}${chatCount !== 1 ? 's' : ''}` : undefined)

  // Default menu items if none provided
  const defaultMenuItems = [
    { icon: MessageCircle, label: 'New Chat', action: () => onNewChatClick?.() },
    { icon: Users, label: 'New Group', action: () => console.log('New Group') },
    { icon: Radio, label: 'New Broadcast', action: () => console.log('New Broadcast') },
    { icon: Smartphone, label: 'Linked Devices', action: () => console.log('Linked Devices') },
    { icon: Star, label: 'Starred Messages', action: () => console.log('Starred Messages') },
    { icon: Settings, label: 'Settings', action: () => console.log('Settings') },
  ]

  const activeMenuItems = menuItems.length > 0 ? menuItems : defaultMenuItems

  return (
    <div className="relative">
      {/* Header Bar - Mobile First with Navigation-like Background */}
      <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 border-b border-white/20 px-4 py-3 sm:px-6 sm:py-4 shadow-lg">
        <div className="flex items-center justify-between">
          {/* Left side - Back Button + Search Bar OR Title */}
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {/* Back Button - Show if in search mode OR explicitly requested */}
            {(showUniversalSearch || showBackButton) && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleBackClick}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex-shrink-0"
              >
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </motion.button>
            )}
            
            {/* Search Input (when in search mode) OR Title */}
            {showUniversalSearch ? (
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={universalSearchQuery}
                  onChange={(e) => handleUniversalSearch(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                  autoFocus
                />
              </div>
            ) : (
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-semibold text-white truncate">{displayTitle}</h1>
                {displaySubtitle && (
                  <p className="text-xs sm:text-sm text-white/70 truncate">
                    {displaySubtitle}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Right side - Action Buttons (Hidden in search mode) */}
          {!showUniversalSearch && (
            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              {/* Search Button */}
              {(showSearchButton || onSearchToggle) && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSearchClick}
                  className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <Search className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </motion.button>
              )}

              {/* Action Buttons (Call, Video, etc.) */}
              {actionButtons.map((button, index) => {
                const Icon = button.icon
                return (
                  <motion.button
                    key={index}
                    whileTap={{ scale: 0.95 }}
                    onClick={button.action}
                    className={`p-2 sm:p-2.5 rounded-full transition-colors ${
                      button.variant === 'primary' 
                        ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                    title={button.label}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </motion.button>
                )
              })}

              {/* New Chat Button (legacy) */}
              {onNewChatClick && actionButtons.length === 0 && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onNewChatClick}
                  className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  title="New Chat"
                >
                  <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </motion.button>
              )}

              {/* Menu Button - Always show (when not in search) */}
              {(activeMenuItems.length > 0) && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <MoreVertical className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </motion.button>
              )}
            </div>
          )}
        </div>
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
              className="absolute right-4 sm:right-6 top-full mt-2 w-48 sm:w-52 menu-gradient rounded-xl shadow-2xl border border-white/20 z-50 overflow-hidden"
            >
              {activeMenuItems.map((item, index) => {
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
                    className="w-full flex items-center space-x-3 px-4 py-3 sm:px-5 sm:py-4 hover:bg-white/10 transition-colors text-left"
                  >
                    <Icon className="w-5 h-5 text-white/80" />
                    <span className="text-white font-medium text-sm sm:text-base">
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
