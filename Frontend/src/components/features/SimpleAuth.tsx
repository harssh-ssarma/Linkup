'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

interface SimpleAuthProps {
  onAuthenticated?: (userData: { identifier: string }) => void
}

export default function SimpleAuth({ onAuthenticated }: SimpleAuthProps) {
  const { login } = useAuth()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)

    const trimmedIdentifier = identifier.trim()
    const trimmedPassword = password.trim()
    if (!trimmedIdentifier || !trimmedPassword) {
      setError('Please enter the username and password provided')
      return
    }

    setIsSubmitting(true)

    try {
      const user = await login(trimmedIdentifier, trimmedPassword)
      onAuthenticated?.({ identifier: user.identifier })
    } catch {
      setError('Invalid username or password')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="base-gradient flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="glass-card w-full rounded-2xl px-5 py-6 sm:rounded-3xl sm:px-8 sm:py-10"
        >
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[color:var(--accent-subtle)] text-[color:var(--accent-strong)] sm:mb-6 sm:h-20 sm:w-20 sm:rounded-2xl">
              <Mail className="h-7 w-7 sm:h-10 sm:w-10" />
            </div>
            <h1 className="text-xl font-semibold text-foreground sm:text-2xl md:text-3xl">Welcome to Linkup</h1>
            <p className="mt-2 max-w-sm text-xs text-muted sm:text-sm md:text-base">
              Sign in with your credentials to access the platform
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <label className="block text-left text-xs font-medium uppercase tracking-wide text-muted sm:text-sm">
                Username or Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  autoComplete="username"
                  value={identifier}
                  onChange={(event) => {
                    setIdentifier(event.target.value)
                    if (error) setError(null)
                  }}
                  placeholder="Enter username"
                  className="w-full rounded-2xl border border-subtle bg-surface px-4 py-3 text-sm font-medium text-foreground placeholder:text-muted transition focus:border-[color:var(--accent)] focus:outline-none focus:ring-2 focus:ring-[color:rgba(37,99,235,0.16)] sm:text-base"
                />
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[color:var(--accent)] sm:right-4">
                  <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-left text-xs font-medium uppercase tracking-wide text-muted sm:text-sm">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value)
                    if (error) setError(null)
                  }}
                  placeholder="Enter password"
                  className="w-full rounded-2xl border border-subtle bg-surface px-4 py-3 pr-12 text-sm font-medium text-foreground placeholder:text-muted transition focus:border-[color:var(--accent)] focus:outline-none focus:ring-2 focus:ring-[color:rgba(37,99,235,0.16)] sm:text-base"
                />
                <div className="absolute inset-y-0 right-2 sm:right-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="rounded-full p-1.5 text-muted transition hover:bg-surface-strong hover:text-foreground sm:p-2"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-[rgba(239,68,68,0.35)] bg-[rgba(239,68,68,0.12)] px-4 py-3 text-xs text-[#ef4444] sm:text-sm"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary group flex w-full items-center justify-center gap-2 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60 sm:gap-3 sm:text-base"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2 text-xs font-medium sm:text-sm">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white sm:h-4 sm:w-4" />
                  Signing in...
                </span>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 transition group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}