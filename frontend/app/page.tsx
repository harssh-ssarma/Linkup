'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged, User, isSignInWithEmailLink } from 'firebase/auth'
import BottomNavigation from '@/components/BottomNavigation'
import ChatSection from '@/components/ChatSection'
import FeedSection from '@/components/FeedSection'
import CreateSection from '@/components/CreateSection'
import CallSection from '@/components/CallSection'
import ProfileSection from '@/components/ProfileSection'
import SettingsSection from '@/components/SettingsSection'
import AuthModal from '@/components/AuthModal'

export default function Home() {
  const [showAuthModal, setShowAuthModal] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEmailLink, setIsEmailLink] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('chats')

  // Check for development bypass in URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const devMode = urlParams.get('dev')
      
      if (devMode === 'true') {
        // Development bypass - skip authentication
        setIsAuthenticated(true)
        setShowAuthModal(false)
        setUser({
          uid: 'dev-user',
          email: 'dev@linkup.com',
          displayName: 'Dev User'
        } as any)
        setLoading(false)
        
        // Clean URL after bypass
        window.history.replaceState({}, document.title, window.location.pathname)
        return
      }
    }
  }, [])

  // Check if this is an email link immediately
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.get('dev') === 'true') return // Skip if in dev mode
      
      if (isSignInWithEmailLink(auth, window.location.href)) {
        setIsEmailLink(true)
        setLoading(true)
      }
    }
  }, [])

  // Monitor Firebase authentication state
  useEffect(() => {
    // Skip Firebase auth if in dev mode
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.get('dev') === 'true') return
    }

    const sessionStarted = typeof window !== 'undefined' 
      ? sessionStorage.getItem('session_started') === 'true' 
      : false
    
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && (sessionStarted || isEmailLink)) {
        setUser(firebaseUser)
        setIsAuthenticated(true)
        setShowAuthModal(false)
        
        // Mark session as started if coming from email link
        if (isEmailLink) {
          sessionStorage.setItem('session_started', 'true')
        }
        
        // Store minimal user data for the session only
        sessionStorage.setItem('current_user', JSON.stringify({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || 'User'
        }))
      } else if (!firebaseUser) {
        // User is signed out
        setUser(null)
        setIsAuthenticated(false)
        setShowAuthModal(!isEmailLink) // Don't show auth modal if processing email link
        
        // Clear all session data when user signs out
        sessionStorage.removeItem('current_user')
        sessionStorage.removeItem('session_started')
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_data')
        localStorage.removeItem('emailForSignIn')
        localStorage.removeItem('userDisplayName')
      } else {
        // Firebase user exists but no session (fresh start) and not email link
        setUser(null)
        setIsAuthenticated(false)
        setShowAuthModal(true)
        
        // Clear session data
        sessionStorage.removeItem('current_user')
        sessionStorage.removeItem('session_started')
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_data')
      }
      setLoading(false)
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [isEmailLink])

  const handleAuthenticated = () => {
    // Mark that user has actively authenticated in this session
    sessionStorage.setItem('session_started', 'true')
    // Firebase onAuthStateChanged will handle the rest automatically
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

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">
            {isEmailLink ? 'Verifying your email...' : 'Loading Linkup...'}
          </p>
        </motion.div>
      </div>
    )
  }

  // If processing email link, don't show auth modal
  if (!isAuthenticated && !isEmailLink) {
    return (
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onAuthenticated={handleAuthenticated}
      />
    )
  }

  // If email link is being processed but not authenticated yet, show loading
  if (isEmailLink && !isAuthenticated) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Verifying your email...</p>
        </motion.div>
      </div>
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