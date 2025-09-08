'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Mail, Eye, EyeOff, ArrowRight, Shield, Smartphone, ChevronDown, Clock } from 'lucide-react'
import { apiService } from '@/lib/api'

interface Country {
  code: string
  name: string
  flag: string
  dialCode: string
}

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onAuthenticated: () => void
}

export default function AuthModal({ isOpen, onClose, onAuthenticated }: AuthModalProps) {
  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone')
  const [selectedCountry, setSelectedCountry] = useState<Country>({
    code: 'IN',
    name: 'India',
    flag: '🇮🇳',
    dialCode: '+91'
  })
  const [showCountryPicker, setShowCountryPicker] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [otpTimer, setOtpTimer] = useState(0)
  const [canResend, setCanResend] = useState(false)
  const [error, setError] = useState('')

  const countries: Country[] = [
    { code: 'IN', name: 'India', flag: '🇮🇳', dialCode: '+91' },
    { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1' }, 
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦', dialCode: '+1' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺', dialCode: '+61' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪', dialCode: '+49' },
    { code: 'FR', name: 'France', flag: '🇫🇷', dialCode: '+33' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵', dialCode: '+81' },
    { code: 'BR', name: 'Brazil', flag: '🇧🇷', dialCode: '+55' },
    { code: 'MX', name: 'Mexico', flag: '🇲🇽', dialCode: '+52' },
  ]

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

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    const fullPhoneNumber = selectedCountry.dialCode + phoneNumber
    const response = await apiService.sendOTP(fullPhoneNumber, selectedCountry.code)
    
    if (response.error) {
      setError(response.error)
    } else {
      setStep('otp')
      setOtpTimer(30) // 30 seconds timer
      setCanResend(false)
    }
    
    setIsLoading(false)
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    const otpCode = otp.join('')
    if (otpCode.length !== 6) {
      setError('Please enter complete OTP')
      setIsLoading(false)
      return
    }

    const fullPhoneNumber = selectedCountry.dialCode + phoneNumber
    const response = await apiService.verifyOTP(fullPhoneNumber, otpCode)
    
    if (response.error) {
      setError(response.error)
      setOtp(['', '', '', '', '', '']) // Clear OTP on error
    } else if (response.data) {
      if ((response.data as any).is_new_user) {
        setStep('profile')
      } else {
        onAuthenticated()
      }
    }
    
    setIsLoading(false)
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    const fullPhoneNumber = selectedCountry.dialCode + phoneNumber
    const response = await apiService.completeProfile(fullPhoneNumber, fullName, email)
    
    if (response.error) {
      setError(response.error)
    } else {
      onAuthenticated()
    }
    
    setIsLoading(false)
  }

  const handleResendOtp = async () => {
    if (!canResend) return
    
    setIsLoading(true)
    const fullPhoneNumber = selectedCountry.dialCode + phoneNumber
    const response = await apiService.sendOTP(fullPhoneNumber, selectedCountry.code)
    
    if (response.error) {
      setError('Failed to resend OTP')
    } else {
      setOtpTimer(30)
      setCanResend(false)
      setOtp(['', '', '', '', '', ''])
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
        className="w-full max-w-md mx-4"
      >
        <div className="glass-effect rounded-2xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
            >
              <Smartphone className="text-white" size={32} />
            </motion.div>
            <h1 className="text-2xl font-bold text-white mb-2">Welcome to Linkup</h1>
            <p className="text-white/60">Connect, Share, and Chat with AI-powered features</p>
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
            {step === 'phone' && (
              <motion.form
                key="phone"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                onSubmit={handlePhoneSubmit}
                className="space-y-6"
              >
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  
                  {/* Country Picker */}
                  <div className="relative mb-3">
                    <button
                      type="button"
                      onClick={() => setShowCountryPicker(!showCountryPicker)}
                      className="w-full flex items-center justify-between p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white hover:bg-white/15 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{selectedCountry.flag}</span>
                        <span className="font-medium">{selectedCountry.name}</span>
                        <span className="text-white/60">{selectedCountry.dialCode}</span>
                      </div>
                      <ChevronDown size={20} className="text-white/60" />
                    </button>
                    
                    {/* Country Dropdown */}
                    {showCountryPicker && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-white/20 rounded-xl shadow-xl z-10 max-h-60 overflow-y-auto"
                      >
                        {countries.map((country) => (
                          <button
                            key={country.code}
                            type="button"
                            onClick={() => {
                              setSelectedCountry(country)
                              setShowCountryPicker(false)
                            }}
                            className="w-full flex items-center space-x-3 p-3 hover:bg-white/10 transition-colors text-left"
                          >
                            <span className="text-xl">{country.flag}</span>
                            <span className="text-white font-medium flex-1">{country.name}</span>
                            <span className="text-white/60">{country.dialCode}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>

                  {/* Phone Input */}
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                      <span className="text-white/60">{selectedCountry.dialCode}</span>
                      <div className="w-px h-6 bg-white/20"></div>
                    </div>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter phone number"
                      className="w-full pl-20 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-white/60 text-sm">
                  <Shield size={16} />
                  <span>We'll send you a verification code via SMS</span>
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading || phoneNumber.length < 10}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-semibold flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Send Code</span>
                      <ArrowRight size={20} />
                    </>
                  )}
                </motion.button>
              </motion.form>
            )}

            {step === 'otp' && (
              <motion.form
                key="otp"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                onSubmit={handleOtpSubmit}
                className="space-y-6"
              >
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Verification Code
                  </label>
                  <div className="flex space-x-3 justify-center">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white text-center text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        maxLength={1}
                      />
                    ))}
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-white/60 text-sm mb-2">
                    Code sent to {selectedCountry.dialCode} {phoneNumber}
                  </p>
                  
                  {/* Timer and Resend */}
                  <div className="flex items-center justify-center space-x-2">
                    {otpTimer > 0 ? (
                      <>
                        <Clock size={16} className="text-white/40" />
                        <span className="text-white/60 text-sm">
                          Resend in {otpTimer}s
                        </span>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isLoading}
                        className="text-blue-400 text-sm hover:underline disabled:opacity-50"
                      >
                        Resend code
                      </button>
                    )}
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading || otp.join('').length !== 6}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-semibold flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Verify</span>
                      <ArrowRight size={20} />
                    </>
                  )}
                </motion.button>
              </motion.form>
            )}

            {step === 'profile' && (
              <motion.form
                key="profile"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                onSubmit={handleProfileSubmit}
                className="space-y-6"
              >
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Email (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading || !fullName.trim()}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-semibold flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Get Started</span>
                      <ArrowRight size={20} />
                    </>
                  )}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Features */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="text-white/60">
                <div className="text-2xl mb-1">🔒</div>
                <div className="text-xs">End-to-End Encrypted</div>
              </div>
              <div className="text-white/60">
                <div className="text-2xl mb-1">🤖</div>
                <div className="text-xs">AI-Powered Features</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}