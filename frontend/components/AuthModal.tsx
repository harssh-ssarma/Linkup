'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, ArrowRight, ArrowLeft, CheckCircle, AlertCircle, Clock, RefreshCw, User, Shield } from 'lucide-react'
import { auth } from '@/lib/firebase'
import { sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, ActionCodeSettings } from 'firebase/auth'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onAuthenticated: () => void
}

export default function AuthModal({ isOpen, onClose, onAuthenticated }: AuthModalProps) {
  const [step, setStep] = useState<'signin' | 'signup' | 'verification'>('signin')
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
      let email = window.localStorage.getItem('emailForSignIn')
      if (!email) {
        email = window.prompt('Please provide your email for confirmation')
      }
      if (email) {
        signInWithEmailLink(auth, email, window.location.href)
          .then((result) => {
            if (typeof window !== 'undefined') {
              window.localStorage.removeItem('emailForSignIn')
            }
            onAuthenticated()
            onClose()
          })
          .catch((error) => {
            console.error('Error signing in with email link:', error)
            setError('Failed to verify email. Please try again.')
          })
      }
    }
  }, [onAuthenticated, onClose])

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      // Configure action code settings for email link
      const actionCodeSettings: ActionCodeSettings = {
        url: typeof window !== 'undefined' ? window.location.origin + '/?verified=true' : 'http://localhost:3000/?verified=true',
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
      setError(error.message || 'Failed to send verification email. Please try again.')
    }
    
    setIsLoading(false)
  }

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      // Configure action code settings for email link
      const actionCodeSettings: ActionCodeSettings = {
        url: typeof window !== 'undefined' ? window.location.origin + '/?verified=true' : 'http://localhost:3000/?verified=true',
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
      setError(error.message || 'Failed to create account. Please try again.')
    }
    
    setIsLoading(false)
  }

  const handleResendEmail = async () => {
    if (!canResend) return
    
    setIsLoading(true)
    setError('')
    
    try {
      const actionCodeSettings: ActionCodeSettings = {
        url: typeof window !== 'undefined' ? window.location.origin + '/?verified=true' : 'http://localhost:3000/?verified=true',
        handleCodeInApp: true,
      }
      
      await sendSignInLinkToEmail(auth, email, actionCodeSettings)
      setVerificationTimer(60)
      setCanResend(false)
    } catch (error: any) {
      console.error('Error resending email:', error)
      setError(error.message || 'Failed to resend email. Please try again.')
    }
    
    setIsLoading(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md max-h-[95vh] overflow-y-auto"
      >
        <div className="glass-effect rounded-2xl p-6 md:p-8 border border-white/20 my-4">
          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 bg-gradient-to-br from-blue-500/20 to-purple-600/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20"
            >
              <Mail className="w-8 h-8 md:w-10 md:h-10 text-blue-400" />
            </motion.div>
            <h1 className="text-xl md:text-2xl font-bold text-white mb-2">Welcome to LinkUp</h1>
            <p className="text-white/60 text-sm md:text-base">Connect, Share, and Chat with AI-powered features</p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {step === 'signin' && (
              <motion.form
                key="signin"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                onSubmit={handleSignInSubmit}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
                  <p className="text-white/60">Enter your email to sign in to LinkUp</p>
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading || !email}
                  whileHover={!isLoading && email ? { scale: 1.02 } : {}}
                  whileTap={!isLoading && email ? { scale: 0.98 } : {}}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Send Verification Link
                      <ArrowRight size={20} />
                    </>
                  )}
                </motion.button>

                <div className="text-center pt-2">
                  <span className="text-white/60">Don't have an account? </span>
                  <button
                    type="button"
                    onClick={() => {
                      setStep('signup')
                      setError('')
                      setEmail('')
                      setFullName('')
                    }}
                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    Sign up here
                  </button>
                </div>
              </motion.form>
            )}

            {step === 'signup' && (
              <motion.form
                key="signup"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                onSubmit={handleSignUpSubmit}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
                  <p className="text-white/60">Join LinkUp and start messaging</p>
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading || !fullName || !email}
                  whileHover={!isLoading && fullName && email ? { scale: 1.02 } : {}}
                  whileTap={!isLoading && fullName && email ? { scale: 0.98 } : {}}
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Create Account
                      <ArrowRight size={20} />
                    </>
                  )}
                </motion.button>

                <div className="text-center pt-2">
                  <span className="text-white/60">Already have an account? </span>
                  <button
                    type="button"
                    onClick={() => {
                      setStep('signin')
                      setError('')
                      setEmail('')
                      setFullName('')
                    }}
                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    Sign in here
                  </button>
                </div>
              </motion.form>
            )}

            {step === 'verification' && (
              <motion.div
                key="verification"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-4 text-center"
              >
                <div className="w-12 h-12 md:w-16 md:h-16 mx-auto bg-green-500/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-green-400" />
                </div>

                <div>
                  <h2 className="text-lg md:text-xl font-bold text-white mb-2">Check your email</h2>
                  <p className="text-white/60 text-sm mb-3">
                    We've sent a verification link to:
                  </p>
                  <p className="text-blue-400 font-medium text-sm break-all">{email}</p>
                </div>

                <div className="p-3 md:p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-blue-400 text-xs md:text-sm">
                    Click the link in your email to complete the verification process and start messaging.
                  </p>
                </div>

                <div className="space-y-2">
                  {/* Resend button with timer */}
                  <motion.button
                    onClick={handleResendEmail}
                    disabled={!canResend || isLoading}
                    whileHover={canResend ? { scale: 1.02 } : {}}
                    whileTap={canResend ? { scale: 0.98 } : {}}
                    className={`w-full py-2.5 md:py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 text-sm ${
                      canResend 
                        ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' 
                        : 'bg-white/5 text-white/40 cursor-not-allowed'
                    }`}
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : canResend ? (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        Resend Email
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4" />
                        Resend in {verificationTimer}s
                      </>
                    )}
                  </motion.button>

                  <button
                    onClick={() => {
                      setStep('signin')
                      setVerificationTimer(0)
                      setCanResend(false)
                      setError('')
                    }}
                    className="flex items-center justify-center gap-2 w-full py-2.5 md:py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors text-sm"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Sign In
                  </button>

                  <p className="text-white/50 text-xs mt-2">
                    Didn't receive the email? Check your spam folder.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Features */}
          <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-white/10">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="text-white/60">
                <div className="text-lg md:text-xl mb-1">🔒</div>
                <div className="text-xs">End-to-End Encrypted</div>
              </div>
              <div className="text-white/60">
                <div className="text-lg md:text-xl mb-1">🤖</div>
                <div className="text-xs">AI-Powered Features</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
