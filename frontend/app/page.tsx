'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import GlobalLayout from '@/components/GlobalLayout'
import ChatSection from '@/components/ChatSection'
import FeedSection from '@/components/FeedSection'
import CreateSection from '@/components/CreateSection'
import CallsSection from '@/components/CallsSection'
import SettingsSection from '@/components/SettingsSection'
import AuthModal from '@/components/AuthModal'
import FamilyAlbumsSection from '@/components/FamilyAlbumsSection'
import UniversalSearch from '@/components/UniversalSearch'
import PrivacySettingsModal from '@/components/PrivacySettingsModal'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'messages' | 'feed' | 'create' | 'calls' | 'settings' | 'family'>('messages')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showUniversalSearch, setShowUniversalSearch] = useState(false)
  const [showPrivacySettings, setShowPrivacySettings] = useState(false)
  const [searchResults, setSearchResults] = useState(null)

  useEffect(() => {
    const currentUser = auth.currentUser
    if (currentUser) {
      setIsAuthenticated(true)
      setShowAuthModal(false)
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true)
        setShowAuthModal(false)
      } else {
        setIsAuthenticated(false)
        setShowAuthModal(true)
      }
      setIsLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'messages': return <ChatSection />
      case 'feed': return <FeedSection />
      case 'create': return <CreateSection />
      case 'calls': return <CallsSection />
      case 'settings': return <SettingsSection />
      case 'family': return <FamilyAlbumsSection />
      default: return <ChatSection />
    }
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as 'messages' | 'feed' | 'create' | 'calls' | 'settings' | 'family')
  }

  const handleSearchResults = (results: any) => {
    setSearchResults(results)
  }

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-white text-center">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onAuthenticated={() => {}}
      />
    )
  }

  return (
    <>
      <GlobalLayout 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        onOpenSearch={() => setShowUniversalSearch(true)}
        onOpenPrivacySettings={() => setShowPrivacySettings(true)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="h-full"
          >
            {renderActiveSection()}
          </motion.div>
        </AnimatePresence>
      </GlobalLayout>

      {/* Universal Search Modal */}
      <UniversalSearch
        isOpen={showUniversalSearch}
        onClose={() => setShowUniversalSearch(false)}
      />

      {/* Privacy Settings Modal */}
      <PrivacySettingsModal
        isOpen={showPrivacySettings}
        onClose={() => setShowPrivacySettings(false)}
      />
    </>
  )
}