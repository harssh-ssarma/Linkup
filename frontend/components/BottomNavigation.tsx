'use client'

import { motion } from 'framer-motion'
import { MessageCircle, Home, Plus, Phone, Settings } from 'lucide-react'

interface BottomNavigationProps {
  activeTab: 'chats' | 'feed' | 'create' | 'calls' | 'settings'
  onTabChange: (tab: 'chats' | 'feed' | 'create' | 'calls' | 'settings') => void
}

export default function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: 'chats', icon: MessageCircle, label: 'Chats', color: 'from-blue-500 to-cyan-500' },
    { id: 'feed', icon: Home, label: 'Feed', color: 'from-purple-500 to-pink-500' },
    { id: 'create', icon: Plus, label: 'Create', color: 'from-green-500 to-emerald-500' },
    { id: 'calls', icon: Phone, label: 'Calls', color: 'from-orange-500 to-red-500' },
    { id: 'settings', icon: Settings, label: 'Settings', color: 'from-indigo-500 to-purple-500' },
  ]

  return (
    <nav className="glass-effect border-t border-white/20 safe-area-bottom">
      <div className="container-responsive py-2">
        <div className="flex justify-center">
          <div className="flex items-center bg-white/5 rounded-2xl p-1 backdrop-blur-xl">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id
              const Icon = tab.icon
              
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id as any)}
                  className="relative flex flex-col items-center px-4 py-2 rounded-xl transition-all duration-300 min-w-[60px]"
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
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
                  <div className={`relative z-10 transition-all duration-300 ${
                    isActive 
                      ? 'text-white drop-shadow-lg' 
                      : 'text-white/60 hover:text-white/80'
                  }`}>
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  
                  {/* Label */}
                  <span className={`text-xs mt-1 font-medium transition-all duration-300 ${
                    isActive 
                      ? 'text-white font-semibold' 
                      : 'text-white/60'
                  }`}>
                    {tab.label}
                  </span>
                  
                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      className={`absolute -top-1 w-8 h-1 bg-gradient-to-r ${tab.color} rounded-full shadow-lg`}
                      layoutId="activeIndicator"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  
                  {/* Notification Badge */}
                  {(tab.id === 'chats' || tab.id === 'calls') && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center shadow-lg ${
                        tab.id === 'chats' ? 'bg-red-500' : 'bg-emerald-500'
                      }`}
                    >
                      <span className="text-xs text-white font-bold">
                        {tab.id === 'chats' ? '3' : '2'}
                      </span>
                    </motion.div>
                  )}
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}