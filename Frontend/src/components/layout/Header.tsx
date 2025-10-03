'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, MoreVertical, Users, Radio, Star, Settings, Smartphone, Plus, ArrowLeft } from 'lucide-react'
import ContextMenu, { ContextMenuItem, useContextMenu } from '@/components/ui/ContextMenu'

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
  onTitleClick?: () => void
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
  onNewChatClick,
  onTitleClick
}: HeaderProps) {
  const [showUniversalSearch, setShowUniversalSearch] = useState(false)
  const [universalSearchQuery, setUniversalSearchQuery] = useState('')
  const contextMenu = useContextMenu()

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
  const defaultMenuItems: ContextMenuItem[] = [
    { icon: Users, label: 'New Group', action: () => console.log('New Group') },
    { icon: Radio, label: 'New Broadcast', action: () => console.log('New Broadcast') },
    { icon: Smartphone, label: 'Linked Devices', action: () => console.log('Linked Devices') },
    { icon: Star, label: 'Starred Messages', action: () => console.log('Starred Messages') },
    { icon: Settings, label: 'Settings', action: () => console.log('Settings') }
  ]

  // Convert menuItems to ContextMenuItem format and add search if enabled
  const contextMenuItems: ContextMenuItem[] = [
    ...(showSearchButton || onSearchToggle ? [{
      icon: Search,
      label: 'Search',
      action: handleSearchClick,
      destructive: false
    }] : []),
    ...(menuItems.length > 0
      ? menuItems.map(item => ({
          icon: item.icon,
          label: item.label,
          action: item.action,
          destructive: false
        }))
      : defaultMenuItems)
  ]

  return (
    <div className="relative">
      {/* Header Bar - Mobile First with Navigation-like Background */}
      <div className="header-premium flex min-h-[64px] items-center px-4 py-3 text-foreground sm:min-h-[72px] sm:px-6 sm:py-4">
        <div className="flex w-full items-center justify-between">
          {/* Left side - Back Button + Search Bar OR Title */}
          <div className="flex min-w-0 flex-1 items-center space-x-3">
            {(showUniversalSearch || showBackButton) && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleBackClick}
                className="flex-shrink-0 rounded-full border border-subtle bg-surface-soft p-2 text-muted transition-colors hover:bg-surface-strong hover:text-foreground"
              >
                <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </motion.button>
            )}

            {showUniversalSearch ? (
              <div className="min-w-0 flex-1">
                <input
                  type="text"
                  value={universalSearchQuery}
                  onChange={(e) => handleUniversalSearch(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="message-input w-full rounded-full px-4 py-2 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/35"
                  autoFocus
                />
              </div>
            ) : (
              <div className="min-w-0 flex-1">
                {onTitleClick ? (
                  <button
                    onClick={onTitleClick}
                    className="w-full text-left transition-opacity hover:opacity-100"
                  >
                    <h1 className="truncate text-lg font-semibold text-foreground sm:text-xl">{displayTitle}</h1>
                    {displaySubtitle && (
                      <p className="truncate text-xs text-muted sm:text-sm">
                        {displaySubtitle}
                      </p>
                    )}
                  </button>
                ) : (
                  <>
                    <h1 className="truncate text-lg font-semibold text-foreground sm:text-xl">{displayTitle}</h1>
                    {displaySubtitle && (
                      <p className="truncate text-xs text-muted sm:text-sm">
                        {displaySubtitle}
                      </p>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {!showUniversalSearch && (
            <div className="flex flex-shrink-0 items-center space-x-2 sm:space-x-3">
              {actionButtons.map((button, index) => {
                const Icon = button.icon
                const variantClasses =
                  button.variant === 'primary'
                    ? 'btn-primary text-inverse'
                    : 'border border-subtle bg-surface-soft text-muted hover:bg-surface-strong hover:text-foreground'

                return (
                  <motion.button
                    key={index}
                    whileTap={{ scale: 0.95 }}
                    onClick={button.action}
                    className={`rounded-full p-2 transition-colors sm:p-2.5 ${variantClasses}`}
                    title={button.label}
                  >
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </motion.button>
                )
              })}

              {onNewChatClick && actionButtons.length === 0 && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onNewChatClick}
                  className="rounded-full border border-subtle bg-surface-soft p-2 text-muted transition-colors hover:bg-surface-strong hover:text-foreground sm:p-2.5"
                  title="New Chat"
                >
                  <Plus className="h-5 w-5 sm:h-6 sm:w-6" />
                </motion.button>
              )}

              {contextMenuItems.length > 0 && (
                <div className="relative">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={contextMenu.toggle}
                    className="rounded-full border border-subtle bg-surface-soft p-2 text-muted transition-colors hover:bg-surface-strong hover:text-foreground sm:p-2.5"
                  >
                    <MoreVertical className="h-5 w-5 sm:h-6 sm:w-6" />
                  </motion.button>

                  <ContextMenu
                    isOpen={contextMenu.isOpen}
                    onClose={contextMenu.close}
                    items={contextMenuItems}
                    position="top-right"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
