'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  sendSignInLinkToEmail, 
  isSignInWithEmailLink, 
  signInWithEmailLink,
  ActionCodeSettings 
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { 
  X, 
  Mail, 
  User, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  ArrowRight, 
  ArrowLeft, 
  Clock, 
  Shield 
} from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onAuthenticated: () => void
}

const AuthModal = ({ isOpen, onClose, onAuthenticated }: AuthModalProps) => {
  const [step, setStep] = useState<'signin' | 'signup' | 'verification' | 'verifying' | 'success'>('signin')
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [verificationTimer, setVerificationTimer] = useState(0)
  const [canResend, setCanResend] = useState(false)
  const [error, setError] = useState('')

  // Verification Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (verificationTimer > 0) {
      interval = setInterval(() => {
        setVerificationTimer(prev => {
          if (prev <= 1) {
            setCanResend(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [verificationTimer])

  // Check if user came from email link
  useEffect(() => {
    if (typeof window !== 'undefined' && isSignInWithEmailLink(auth, window.location.href)) {
      setStep('verifying')
      setIsLoading(true)
      
      let email = window.localStorage.getItem('emailForSignIn')
      if (!email) {
        email = window.prompt('Please provide your email for confirmation')
      }
      if (email) {
        setEmail(email)
        signInWithEmailLink(auth, email, window.location.href)
          .then((result) => {
            if (typeof window !== 'undefined') {
              window.localStorage.removeItem('emailForSignIn')
              // Store user name if it was saved during signup
              const storedName = window.localStorage.getItem('userDisplayName')
              if (storedName) {
                window.localStorage.removeItem('userDisplayName')
              }
              // Clear the URL parameters to clean up the URL
              window.history.replaceState({}, document.title, window.location.pathname)
            }
            // Mark session as started and authenticate
            sessionStorage.setItem('session_started', 'true')
            
            // Show success message briefly before closing
            setStep('success')
            setTimeout(() => {
              onAuthenticated()
              onClose()
            }, 2000)
          })
          .catch((error) => {
            console.error('Error signing in with email link:', error)
            setError('Failed to verify email. Please try again.')
            setIsLoading(false)
            setStep('signin')
          })
      } else {
        setIsLoading(false)
        setStep('signin')
      }
    }
  }, [onAuthenticated, onClose])

  // Handle Sign In
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      const actionCodeSettings: ActionCodeSettings = {
        url: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001',
        handleCodeInApp: true,
      }
      
      await sendSignInLinkToEmail(auth, email, actionCodeSettings)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('emailForSignIn', email)
      }
      setStep('verification')
      setVerificationTimer(60)
      setCanResend(false)
    } catch (error: any) {
      console.error('Error sending email link:', error)
      
      // Handle specific Firebase errors
      if (error.code === 'auth/quota-exceeded') {
        setError('Daily email limit reached. Please try again tomorrow or contact support.')
      } else if (error.code === 'auth/too-many-requests') {
        setError('Too many requests. Please wait a few minutes before trying again.')
      } else if (error.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.')
      } else {
        setError(error.message || 'Failed to send verification email. Please try again.')
      }
    }
    
    setIsLoading(false)
  }

  // Handle Sign Up
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      const actionCodeSettings: ActionCodeSettings = {
        url: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001',
        handleCodeInApp: true,
      }
      
      // Store full name in localStorage to use after email verification
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('userDisplayName', fullName)
        window.localStorage.setItem('emailForSignIn', email)
      }
      await sendSignInLinkToEmail(auth, email, actionCodeSettings)
      setStep('verification')
      setVerificationTimer(60)
      setCanResend(false)
    } catch (error: any) {
      console.error('Error sending email link:', error)
      
      // Handle specific Firebase errors
      if (error.code === 'auth/quota-exceeded') {
        setError('Daily email limit reached. Please try again tomorrow or contact support.')
      } else if (error.code === 'auth/too-many-requests') {
        setError('Too many requests. Please wait a few minutes before trying again.')
      } else if (error.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.')
      } else {
        setError(error.message || 'Failed to create account. Please try again.')
      }
    }
    
    setIsLoading(false)
  }

  // Resend Email
  const handleResendEmail = async () => {
    if (!canResend) return
    
    setIsLoading(true)
    setError('')
    
    try {
      const actionCodeSettings: ActionCodeSettings = {
        url: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001',
        handleCodeInApp: true,
      }
      
      await sendSignInLinkToEmail(auth, email, actionCodeSettings)
      setVerificationTimer(60)
      setCanResend(false)
    } catch (error: any) {
      console.error('Error resending email:', error)
      
      // Handle specific Firebase errors
      if (error.code === 'auth/quota-exceeded') {
        setError('Daily email limit reached. Please try again tomorrow or contact support.')
      } else if (error.code === 'auth/too-many-requests') {
        setError('Too many requests. Please wait a few minutes before trying again.')
      } else {
        setError(error.message || 'Failed to resend email. Please try again.')
      }
    }
    
    setIsLoading(false)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              {step === 'signin' ? (
                <Mail className="w-8 h-8 text-white" />
              ) : step === 'signup' ? (
                <User className="w-8 h-8 text-white" />
              ) : step === 'success' ? (
                <CheckCircle className="w-8 h-8 text-white" />
              ) : (
                <Mail className="w-8 h-8 text-white" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {step === 'signin' && 'Welcome Back'}
              {step === 'signup' && 'Create Account'}
              {step === 'verification' && 'Check Your Email'}
              {step === 'verifying' && 'Verifying...'}
              {step === 'success' && 'Welcome to Linkup!'}
            </h2>
            <p className="text-gray-600 text-sm">
              {step === 'signin' && 'Sign in to your account with email'}
              {step === 'signup' && 'Join Linkup to connect with friends'}
              {step === 'verification' && 'We sent you a verification link'}
              {step === 'verifying' && 'Please wait while we verify your email'}
              {step === 'success' && 'Email verified successfully! Redirecting to your chats...'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center"
            >
              <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
              <span className="text-red-700 text-sm">{error}</span>
            </motion.div>
          )}

          {/* Sign In Form */}
          {step === 'signin' && (
            <motion.form
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleSignInSubmit}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
              >
                {isLoading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Send Sign In Link
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>

              <div className="text-center">
                <span className="text-gray-600 text-sm">Don't have an account? </span>
                <button
                  type="button"
                  onClick={() => setStep('signup')}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  Create one
                </button>
              </div>
            </motion.form>
          )}

          {/* Sign Up Form */}
          {step === 'signup' && (
            <motion.form
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleSignUpSubmit}
              className="space-y-6"
            >
              <div className="flex justify-between items-center mb-4">
                <button
                  type="button"
                  onClick={() => setStep('signin')}
                  className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 mr-1" />
                  Back to Sign In
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !email || !fullName}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
              >
                {isLoading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </motion.form>
          )}

          {/* Email Verifying Step */}
          {step === 'verifying' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <RefreshCw className="w-12 h-12 text-blue-600 animate-spin" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Verifying your email...
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Welcome back! We're signing you in.
              </p>
              <div className="flex items-center justify-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </motion.div>
          )}

          {/* Success Step */}
          {step === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Email Verified Successfully!
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Welcome to Linkup! Taking you to your messages...
              </p>
              <div className="flex items-center justify-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </motion.div>
          )}

          {/* Email Verification Step */}
          {step === 'verification' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Check your email
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  We sent a verification link to:<br />
                  <strong className="text-gray-800">{email}</strong>
                </p>
                <p className="text-gray-500 text-xs mb-4">
                  Click the link in the email to complete your sign in.
                  It may take a few minutes to arrive.
                </p>
              </div>

              {/* Resend Email */}
              <div className="text-center border-t pt-6">
                {verificationTimer > 0 ? (
                  <p className="text-gray-600 text-sm flex items-center justify-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Resend available in {verificationTimer}s
                  </p>
                ) : (
                  <button
                    onClick={handleResendEmail}
                    disabled={isLoading}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm disabled:opacity-50"
                  >
                    {isLoading ? 'Sending...' : "Didn't receive it? Resend email"}
                  </button>
                )}
              </div>

              <button
                onClick={() => setStep('signin')}
                className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Back to Sign In
              </button>
            </motion.div>
          )}

          {/* Privacy Notice */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500 flex items-center justify-center">
              <Shield className="w-3 h-3 mr-1" />
              We'll never share your information with anyone
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default AuthModal
