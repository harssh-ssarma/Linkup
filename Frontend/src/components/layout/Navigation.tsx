'use client'

import { motion } from 'framer-motion'
import { MessageCircle, Home, Plus, Phone, Settings, User, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { useNavigation } from '@/context/NavigationContext'

export default function Navigation() {
  const pathname = usePathname()
  const { isSidebarExpanded, setIsSidebarExpanded, showMobileNavigation } = useNavigation()

  const tabs = [
    { id: 'chats', icon: MessageCircle, label: 'Chats', href: '/chats', badge: 3 },
    { id: 'feed', icon: Home, label: 'Feed', href: '/feed' },
    { id: 'create', icon: Plus, label: 'Create', href: '/create' },
    { id: 'calls', icon: Phone, label: 'Calls', href: '/calls', badge: 2 },
    { id: 'profile', icon: User, label: 'Profile', href: '/profile' },
  ]

  const getActiveTab = () => {
    if (pathname === '/') return 'chats'
    return pathname.slice(1) || 'chats'
  }

  const activeTab = getActiveTab()

  return (
    <>
      {/* Desktop Navigation - Left Sidebar */}
      <motion.nav 
        className={`hidden md:flex fixed left-0 top-0 bottom-0 nav-premium z-40 flex-col overflow-hidden`}
        initial={false}
        animate={{ 
          width: isSidebarExpanded ? 256 : 64,
        }}
        transition={{ 
          duration: 0.25, 
          ease: [0.4, 0, 0.2, 1] // WhatsApp-like easing
        }}
      >
        {/* Header with Logo and Toggle */}
        <div className={`flex items-center p-4 ${isSidebarExpanded ? 'justify-between' : 'justify-center'}`}>
          <motion.div 
            className="flex items-center space-x-3 overflow-hidden"
            initial={false}
            animate={{ 
              opacity: isSidebarExpanded ? 1 : 0,
              x: isSidebarExpanded ? 0 : -20,
              width: isSidebarExpanded ? 'auto' : 0
            }}
            transition={{ 
              duration: 0.25, 
              ease: [0.4, 0, 0.2, 1],
              opacity: { duration: isSidebarExpanded ? 0.3 : 0.1, delay: isSidebarExpanded ? 0.1 : 0 }
            }}
          >
            <div className="w-8 h-8 relative flex-shrink-0">
              <Image
                src="/echo1.png"
                alt="echo Logo"
                width={32}
                height={32}
                className="rounded-lg"
              />
            </div>
            <motion.span 
              className="text-white font-semibold text-lg whitespace-nowrap"
              initial={false}
              animate={{ 
                opacity: isSidebarExpanded ? 1 : 0,
                scale: isSidebarExpanded ? 1 : 0.8
              }}
              transition={{ 
                duration: 0.25,
                delay: isSidebarExpanded ? 0.15 : 0,
                ease: [0.4, 0, 0.2, 1]
              }}
            >
              echo
            </motion.span>
          </motion.div>
          
          <motion.button
            onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
            className={`p-2 rounded-2xl glass-card-premium text-white hover:scale-105 transition-all duration-200 ${
              isSidebarExpanded 
                ? '' 
                : 'fixed left-4 top-4 z-50'
            }`}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ rotate: isSidebarExpanded ? 0 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isSidebarExpanded ? <X size={16} /> : <Menu size={16} />}
            </motion.div>
          </motion.button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-6">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            const Icon = tab.icon
            
            return (
              <Link key={tab.id} href={tab.href} className="block mb-2 px-2">
                <button
                  className={`relative flex items-center w-full rounded-xl transition-all duration-200 focus:outline-none focus:ring-0 focus:border-0 ${
                    isSidebarExpanded ? 'px-4 py-3' : 'w-12 h-12 justify-center mx-auto'
                  } ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                  style={{ outline: 'none', border: 'none' }}
                >
                  {/* Icon */}
                  <div className="relative">
                    <Icon size={20} />
                    
                    {/* Notification Badge */}
                    {tab.badge && (
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium shadow-lg">
                        {tab.badge}
                      </div>
                    )}
                  </div>
                  
                  {/* Label (when expanded) */}
                  <motion.span 
                    className="ml-3 font-medium whitespace-nowrap overflow-hidden"
                    initial={false}
                    animate={{ 
                      opacity: isSidebarExpanded ? 1 : 0,
                      width: isSidebarExpanded ? 'auto' : 0,
                      marginLeft: isSidebarExpanded ? 12 : 0
                    }}
                    transition={{ 
                      duration: 0.25, 
                      ease: [0.4, 0, 0.2, 1],
                      opacity: { duration: isSidebarExpanded ? 0.3 : 0.1, delay: isSidebarExpanded ? 0.1 : 0 }
                    }}
                  >
                    {tab.label}
                  </motion.span>
                </button>
              </Link>
            )
          })}
        </div>
      </motion.nav>

      {/* Mobile Navigation - Bottom */}
      {showMobileNavigation && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 nav-premium z-50 h-20">
          <div className="flex items-center justify-between px-2 py-3 h-full">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id
              const Icon = tab.icon
              
              return (
                <Link key={tab.id} href={tab.href}>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className={`relative flex flex-col items-center justify-center space-y-1 transition-all duration-200 py-2 rounded-2xl flex-1 mx-1 focus:outline-none focus:ring-0 focus:border-0 ${
                      isActive 
                        ? 'text-white nav-item active' 
                        : 'text-white/60 hover:text-white nav-item'
                    }`}
                    style={{ outline: 'none', border: 'none' }}
                  >
                    {/* Icon */}
                    <div className="relative">
                      <Icon size={22} />
                      
                      {/* Notification Badge */}
                      {tab.badge && (
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium shadow-lg">
                          {tab.badge}
                        </div>
                      )}
                    </div>
                    
                    {/* Label */}
                    <span className="text-xs font-medium">
                      {tab.label}
                    </span>
                  </motion.button>
                </Link>
              )
            })}
          </div>
        </nav>
      )}
    </>
  )
}
