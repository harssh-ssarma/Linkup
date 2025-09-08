'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BottomNavigation from '@/components/BottomNavigation'
import ChatSection from '@/components/ChatSection'
import FeedSection from '@/components/FeedSection'
import CreateSection from '@/components/CreateSection'
import DiscoverSection from '@/components/DiscoverSection'
import ProfileSection from '@/components/ProfileSection'
import AuthModal from '@/components/AuthModal'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'chats' | 'feed' | 'create' | 'discover' | 'profile'>('chats')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(true)

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'chats':
        return <ChatSection />
      case 'feed':
        return <FeedSection />
      case 'create':
        return <CreateSection />
      case 'discover':
        return <DiscoverSection />
      case 'profile':
        return <ProfileSection />
      default:
        return <ChatSection />
    }
  }

  if (!isAuthenticated) {
    return (
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onAuthenticated={() => {
          setIsAuthenticated(true)
          setShowAuthModal(false)
        }}
      />
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {renderActiveSection()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
    </div>
  )
}