'use client'

import { useState, useEffect } from 'react'
import { Search, Menu, X, MessageCircle, Home, Plus, Phone, Settings, Sun, Moon, Volume2, VolumeX } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface GlobalLayoutProps {
  children: React.ReactNode
  activeTab: string
  onTabChange: (tab: string) => void
  onOpenSearch?: () => void
  onOpenPrivacySettings?: () => void
}

export default function GlobalLayout({ children, activeTab, onTabChange }: GlobalLayoutProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [fontSize, setFontSize] = useState('medium')
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)

  const navigationItems = [
    { id: 'messages', label: 'Messages', icon: MessageCircle, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { id: 'feed', label: 'Feed', icon: Home, color: 'text-green-500', bgColor: 'bg-green-500/10' },
    { id: 'create', label: 'Create', icon: Plus, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
    { id: 'calls', label: 'Calls', icon: Phone, color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'text-gray-500', bgColor: 'bg-gray-500/10' }
  ]

  useEffect(() => {
    document.documentElement.className = `font-size-${fontSize}`
  }, [fontSize])

  return (
    <div className={`h-screen flex flex-col transition-smooth ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
    }`}>
      {/* Top Header with Global Search */}
      <header className={`glass-card border-b px-4 py-4 flex items-center justify-between ${
        isDarkMode ? 'border-white/10' : 'border-gray-200'
      }`}>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className={`lg:hidden touch-target rounded-xl transition-smooth ${
              isDarkMode 
                ? 'text-white/70 hover:text-white hover:bg-white/10' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            aria-label="Toggle menu"
          >
            {showMobileMenu ? <X size={22} /> : <Menu size={22} />}
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <h1 className={`text-xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Linkup</h1>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-lg mx-6">
          <div className="relative">
            <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
              isDarkMode ? 'text-white/40' : 'text-gray-400'
            }`} size={20} />
            <input
              type="text"
              placeholder="Search messages, contacts, posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-2xl border-2 transition-smooth focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                isDarkMode 
                  ? 'bg-white/10 border-white/20 text-white placeholder-white/50 focus:bg-white/15' 
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-300'
              }`}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`touch-target rounded-xl transition-smooth ${
              isDarkMode 
                ? 'text-white/70 hover:text-white hover:bg-white/10' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            aria-label={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`touch-target rounded-xl transition-smooth ${
              isDarkMode 
                ? 'text-white/70 hover:text-white hover:bg-white/10' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar Navigation */}
        <nav className={`hidden lg:flex w-72 glass-card border-r flex-col p-6 ${
          isDarkMode ? 'border-white/10' : 'border-gray-200'
        }`}>
          <div className="space-y-3">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <motion.button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl transition-smooth touch-target-comfortable ${
                    isActive
                      ? `${item.bgColor} ${item.color} border-2 border-current/20 shadow-lg`
                      : isDarkMode
                        ? 'text-white/70 hover:text-white hover:bg-white/10'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <div className={`p-2 rounded-xl ${
                    isActive ? 'bg-current/10' : isDarkMode ? 'bg-white/10' : 'bg-gray-100'
                  }`}>
                    <Icon size={20} />
                  </div>
                  <span className="font-semibold text-lg">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="ml-auto w-2 h-2 bg-current rounded-full"
                    />
                  )}
                </motion.button>
              )
            })}
          </div>
          
          {/* Font Size Controls */}
          <div className={`mt-8 p-4 rounded-2xl ${
            isDarkMode ? 'bg-white/5' : 'bg-gray-50'
          }`}>
            <h3 className={`text-sm font-semibold mb-3 ${
              isDarkMode ? 'text-white/80' : 'text-gray-700'
            }`}>Text Size</h3>
            <div className="flex space-x-2">
              {['small', 'medium', 'large', 'xl-large'].map((size) => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-smooth ${
                    fontSize === size
                      ? 'bg-blue-500 text-white'
                      : isDarkMode
                        ? 'bg-white/10 text-white/70 hover:bg-white/20'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {size === 'xl-large' ? 'XL' : size.charAt(0).toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setShowMobileMenu(false)}
            >
              <motion.nav
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                className={`w-80 h-full glass-card border-r p-6 ${
                  isDarkMode ? 'border-white/10' : 'border-gray-200'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="space-y-3 mt-20">
                  {navigationItems.map((item) => {
                    const Icon = item.icon
                    const isActive = activeTab === item.id
                    return (
                      <motion.button
                        key={item.id}
                        onClick={() => {
                          onTabChange(item.id)
                          setShowMobileMenu(false)
                        }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl transition-smooth touch-target-comfortable ${
                          isActive
                            ? `${item.bgColor} ${item.color} border-2 border-current/20`
                            : isDarkMode
                              ? 'text-white/70 hover:text-white hover:bg-white/10'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        <div className={`p-2 rounded-xl ${
                          isActive ? 'bg-current/10' : isDarkMode ? 'bg-white/10' : 'bg-gray-100'
                        }`}>
                          <Icon size={22} />
                        </div>
                        <span className="font-semibold text-lg">{item.label}</span>
                      </motion.button>
                    )
                  })}
                </div>
              </motion.nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className={`lg:hidden glass-card border-t px-3 py-3 ${
        isDarkMode ? 'border-white/10' : 'border-gray-200'
      }`}>
        <div className="flex justify-around">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <motion.button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col items-center space-y-1 px-4 py-3 rounded-2xl transition-smooth touch-target ${
                  isActive
                    ? `${item.color} ${item.bgColor}`
                    : isDarkMode
                      ? 'text-white/60 hover:text-white hover:bg-white/10'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={22} />
                <span className="text-xs font-semibold">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="mobileActiveTab"
                    className="w-1 h-1 bg-current rounded-full"
                  />
                )}
              </motion.button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}