'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, ArrowRight, Shield, User, Clock } from 'lucide-react'
import { apiService } from '@/lib/api'
import { auth } from '@/lib/firebase'
import { 
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink
} from 'firebase/auth'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onAuthenticated: () => void
}

export default function AuthModal({ isOpen, onClose, onAuthenticated }: AuthModalProps) {
  const [step, setStep] = useState<'auth' | 'otp'>('auth')
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [emailValid, setEmailValid] = useState<boolean | null>(null)
  const [otpTimer, setOtpTimer] = useState(0)
  const [canResend, setCanResend] = useState(false)

  // Email validation function
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Check if email exists (basic domain validation)
  const checkEmailExists = async (email: string) => {
    if (!validateEmail(email)) return false
    
    // Basic domain validation
    const domain = email.split('@')[1]
    const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com']
    
    return commonDomains.includes(domain) || domain.includes('.')
  }

  // Real-time email validation
  useEffect(() => {
    const validateEmailAsync = async () => {
      if (email) {
        const isValid = validateEmail(email)
        if (isValid) {
          const exists = await checkEmailExists(email)
          setEmailValid(exists)
        } else {
          setEmailValid(false)
        }
      } else {
        setEmailValid(null)
      }
    }
    
    const timeoutId = setTimeout(validateEmailAsync, 300) // Debounce
    return () => clearTimeout(timeoutId)
  }, [email])

  // Check for email link on component mount
  useEffect(() => {
    const checkEmailLink = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        setIsLoading(true)
        let emailForSignIn = localStorage.getItem('emailForSignIn')
        
        if (!emailForSignIn) {
          const urlParams = new URLSearchParams(window.location.search)
          emailForSignIn = urlParams.get('email')
        }
        
        if (emailForSignIn) {
          try {
            console.log('🔐 Verifying email link for:', emailForSignIn)
            const result = await signInWithEmailLink(auth, emailForSignIn, window.location.href)
            const user = result.user
            
            const idToken = await user.getIdToken()
            const response = await apiService.verifyFirebaseToken(idToken)
            
            if (response.error) {
              setError(response.error)
            } else {
              console.log('✅ Email link verified successfully')
              localStorage.removeItem('emailForSignIn')
              localStorage.removeItem('nameForSignIn')
              // Clear URL parameters
              window.history.replaceState({}, document.title, window.location.pathname)
              // Firebase auth state will automatically update
            }
          } catch (error: any) {
            console.error('❌ Email link verification error:', error)
            setError('Invalid or expired email link')
          }
        }
        setIsLoading(false)
      }
    }
    
    checkEmailLink()
  }, [])

  // OTP Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => {
          if (prev <= 1) {
            setCanResend(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [otpTimer])



  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      if (!validateEmail(email)) {
        setError('Please enter a valid email address')
        setIsLoading(false)
        return
      }
      
      if (authMode === 'signup' && !fullName.trim()) {
        setError('Please enter your full name')
        setIsLoading(false)
        return
      }
      
      console.log('📧 Sending Firebase email link to:', email)
      
      const actionCodeSettings = {
        url: window.location.origin + '?email=' + email + '&name=' + encodeURIComponent(fullName),
        handleCodeInApp: true,
      }
      
      await sendSignInLinkToEmail(auth, email, actionCodeSettings)
      
      localStorage.setItem('emailForSignIn', email)
      if (fullName) {
        localStorage.setItem('nameForSignIn', fullName)
      }
      
      console.log('✅ Email link sent successfully')
      setStep('otp')
      setOtpTimer(300)
      setCanResend(false)
      
    } catch (error: any) {
      console.error('❌ Firebase email error:', error)
      setError(error.message || 'Failed to send email')
    }
    
    setIsLoading(false)
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      const otpCode = otp.join('')
      if (otpCode.length !== 6) {
        setError('Please enter complete OTP')
        setIsLoading(false)
        return
      }
      
      console.log('🔐 Verifying OTP:', otpCode)
      const response = await apiService.verifyEmailOTP(email, otpCode)
      
      if (response.error) {
        setError(response.error)
        setOtp(['', '', '', '', '', ''])
      } else {
        console.log('✅ OTP verified, calling onAuthenticated')
        onAuthenticated()
      }
    } catch (error: any) {
      console.error('❌ OTP verification error:', error)
      setError('Invalid OTP code')
      setOtp(['', '', '', '', '', ''])
    }
    
    setIsLoading(false)
  }



  const handleResendOtp = async () => {
    if (!canResend) return
    
    setIsLoading(true)
    
    try {
      const actionCodeSettings = {
        url: window.location.origin + '?email=' + email + '&name=' + encodeURIComponent(fullName),
        handleCodeInApp: true,
      }
      
      await sendSignInLinkToEmail(auth, email, actionCodeSettings)
      
      setOtpTimer(300)
      setCanResend(false)
      console.log('✅ Email link resent successfully')
      
    } catch (error: any) {
      setError('Failed to resend email')
    }
    
    setIsLoading(false)
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return
    
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }





  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-sm mx-4 sm:mx-auto"
      >
        <div className="glass-effect rounded-xl p-4 border border-white/20">
          {/* Header */}
          <div className="text-center mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-12 h-12 mx-auto mb-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
            >
              <Mail className="text-white" size={20} />
            </motion.div>
            <h1 className="text-lg font-bold text-white mb-1">Welcome to Linkup</h1>
            <p className="text-white/60 text-xs">Connect, Share, and Chat with AI</p>
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
            {step === 'auth' && (
              <motion.div
                key="auth"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-3"
              >
                {/* Auth Mode Toggle */}
                <div className="flex bg-white/10 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => setAuthMode('signin')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      authMode === 'signin'
                        ? 'bg-blue-500 text-white'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode('signup')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      authMode === 'signup'
                        ? 'bg-blue-500 text-white'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                {/* Email Form */}
                <form onSubmit={handleEmailSubmit} className="space-y-3">
                  {/* Name Input (Sign Up only) */}
                  {authMode === 'signup' && (
                    <div>
                      <label className="block text-white/80 text-xs font-medium mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={16} />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Enter your full name"
                          className="w-full pl-10 pr-4 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-blue-500/50 text-sm"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Email Input */}
                  <div>
                    <label className="block text-white/80 text-xs font-medium mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={16} />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className={`w-full pl-10 pr-4 py-2.5 bg-white/10 backdrop-blur-md border rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-blue-500/50 text-sm ${
                          emailValid === false ? 'border-red-500/50' : emailValid === true ? 'border-green-500/50' : 'border-white/20'
                        }`}
                        required
                      />
                      {emailValid === true && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400">
                          ✓
                        </div>
                      )}
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isLoading || !emailValid || (authMode === 'signup' && !fullName.trim())}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-medium flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50 text-sm"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Send OTP</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </motion.button>
                </form>

                <div className="flex items-center space-x-2 text-white/60 text-xs justify-center">
                  <Shield size={14} />
                  <span>OTP will be sent to your email</span>
                </div>
              </motion.div>
            )}



            {step === 'otp' && (
              <motion.form
                key="otp"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                onSubmit={handleOtpSubmit}
                className="space-y-3"
              >
                <div className="text-center mb-3">
                  <h2 className="text-lg font-semibold text-white mb-1">Check Your Email</h2>
                  <p className="text-white/60 text-xs">
                    Verification link sent to {email}
                  </p>
                  <p className="text-blue-400 text-xs mt-2">
                    📧 Click the link in your email to sign in
                  </p>
                </div>

                <div className="text-center py-4">
                  <div className="w-16 h-16 mx-auto mb-3 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Mail className="text-blue-400" size={24} />
                  </div>
                  <p className="text-white/60 text-xs">
                    Check your inbox and spam folder
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2">
                    {otpTimer > 0 ? (
                      <>
                        <Clock size={14} className="text-white/40" />
                        <span className="text-white/60 text-xs">
                          Resend in {otpTimer}s
                        </span>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isLoading}
                        className="text-blue-400 text-xs hover:underline disabled:opacity-50"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-white/60 text-xs mb-3">
                    Didn't receive the email?
                  </p>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isLoading || !canResend}
                    className="text-blue-400 text-sm hover:underline disabled:opacity-50"
                  >
                    {isLoading ? 'Sending...' : 'Resend Email'}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Features */}
          <div className="mt-4 pt-3 border-t border-white/10">
            <div className="flex justify-center space-x-6 text-center">
              <div className="text-white/60">
                <div className="text-sm mb-0.5">🔒</div>
                <div className="text-xs">Secure</div>
              </div>
              <div className="text-white/60">
                <div className="text-sm mb-0.5">🤖</div>
                <div className="text-xs">AI-Powered</div>
              </div>
              <div className="text-white/60">
                <div className="text-sm mb-0.5">✉️</div>
                <div className="text-xs">Email OTP</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}