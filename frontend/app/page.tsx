'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BottomNavigation from '@/components/BottomNavigation'
import ChatSection from '@/components/ChatSection'
import FeedSection from '@/components/FeedSection'
import CreateSection from '@/components/CreateSection'
import CallSection from '@/components/CallSection'
import ProfileSection from '@/components/ProfileSection'
import SettingsSection from '@/components/SettingsSection'
import EmailAuthModal from '@/components/AuthModal'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'chats' | 'feed' | 'create' | 'calls' | 'profile' | 'settings'>('chats')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(true)

  // Check for persistent login on mount
  useEffect(() => {
    const authToken = localStorage.getItem('auth_token')
    const userData = localStorage.getItem('user_data')
    
    // Check URL parameters for email verification
    const urlParams = new URLSearchParams(window.location.search)
    const verified = urlParams.get('verified')
    
    if (verified === 'true' || (authToken && userData)) {
      setIsAuthenticated(true)
      setShowAuthModal(false)
      
      // Clean up URL if came from verification
      if (verified) {
        window.history.replaceState({}, document.title, window.location.pathname)
        // Store auth data (in real app, this would come from the verification endpoint)
        localStorage.setItem('auth_token', 'verified_token')
        localStorage.setItem('user_data', JSON.stringify({ name: 'User', email: 'user@example.com', verified: true }))
      }
    }
  }, [])

  const handleAuthenticated = () => {
    setIsAuthenticated(true)
    setShowAuthModal(false)
    // Set persistent cookie/localStorage - this would be handled by your auth API
    localStorage.setItem('auth_token', 'sample_token')
    localStorage.setItem('user_data', JSON.stringify({ name: 'User', email: 'user@example.com' }))
  }

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'chats':
        return <ChatSection />
      case 'feed':
        return <FeedSection />
      case 'create':
        return <CreateSection />
      case 'calls':
        return <CallSection />
      case 'profile':
        return <ProfileSection />
      case 'settings':
        return <SettingsSection />
      default:
        return <ChatSection />
    }
  }

  if (!isAuthenticated) {
    return (
      <EmailAuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onAuthenticated={handleAuthenticated}
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