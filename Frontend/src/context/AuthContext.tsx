'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const AUTH_STORAGE_KEY = 'linkup_user'
const AUTH_USERNAME = 'harssh.ssarma'
const AUTH_PASSWORD = 'harsh@123'

type AuthUser = {
  identifier: string
  signedInAt: string
}

type AuthContextValue = {
  user: AuthUser | null
  loading: boolean
  isAuthenticated: boolean
  login: (identifier: string, password: string) => Promise<AuthUser>
  logout: () => void
  error: string | null
  clearError: () => void
  credentials: {
    username: string
    password: string
  }
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const readStoredUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null

  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AuthUser

    if (!parsed?.identifier) return null
    return parsed
  } catch (error) {
    console.warn('Unable to parse stored auth user', error)
    return null
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    setUser(readStoredUser())
    setLoading(false)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== AUTH_STORAGE_KEY) return
      setUser(event.newValue ? readStoredUser() : null)
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const login = useCallback(async (identifier: string, password: string) => {
    if (typeof window === 'undefined') {
      throw new Error('Authentication is only available in the browser')
    }

    const normalizedIdentifier = identifier.trim().toLowerCase()
    const isValidIdentifier = normalizedIdentifier === AUTH_USERNAME
    const isValidPassword = password === AUTH_PASSWORD

    setError(null)

    await new Promise(resolve => setTimeout(resolve, 320))

    if (!isValidIdentifier || !isValidPassword) {
      setError('Invalid username or password')
      throw new Error('INVALID_CREDENTIALS')
    }

    const authPayload: AuthUser = {
      identifier: AUTH_USERNAME,
      signedInAt: new Date().toISOString(),
    }

    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authPayload))
    setUser(authPayload)

    return authPayload
  }, [])

  const logout = useCallback(() => {
    if (typeof window === 'undefined') return
    window.localStorage.removeItem(AUTH_STORAGE_KEY)
    setUser(null)
  }, [])

  const clearError = useCallback(() => setError(null), [])

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    logout,
    error,
    clearError,
    credentials: {
      username: '',
      password: '',
    },
  }), [user, loading, login, logout, error, clearError])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function useAuthRequired() {
  const { user, loading, isAuthenticated, login, logout, error, clearError } = useAuth()

  return {
    user,
    loading,
    login,
    logout,
    error,
    clearError,
    isAuthenticated,
    isUnauthenticated: !loading && !isAuthenticated,
  }
}

export const AUTH_CONSTANTS = {
  STORAGE_KEY: AUTH_STORAGE_KEY,
  USERNAME: AUTH_USERNAME,
  PASSWORD: AUTH_PASSWORD,
}
