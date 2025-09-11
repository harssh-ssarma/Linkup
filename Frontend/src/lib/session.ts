'use client'

// Session management utilities
export class SessionManager {
  private static readonly SESSION_KEY = 'linkup_session'
  private static readonly SESSION_TIMEOUT = 24 * 60 * 60 * 1000 // 24 hours

  // Set session with timestamp
  static setSession(userId: string) {
    if (typeof window === 'undefined') return
    
    const sessionData = {
      userId,
      timestamp: Date.now(),
      started: true
    }
    
    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData))
    sessionStorage.setItem('session_started', 'true')
  }

  // Check if session is valid
  static isSessionValid(): boolean {
    if (typeof window === 'undefined') return false
    
    const sessionData = sessionStorage.getItem(this.SESSION_KEY)
    if (!sessionData) return false
    
    try {
      const parsed = JSON.parse(sessionData)
      const now = Date.now()
      
      // Check if session has expired
      if (now - parsed.timestamp > this.SESSION_TIMEOUT) {
        this.clearSession()
        return false
      }
      
      return true
    } catch {
      this.clearSession()
      return false
    }
  }

  // Clear all session data
  static clearSession() {
    if (typeof window === 'undefined') return
    
    // Clear session storage
    sessionStorage.removeItem(this.SESSION_KEY)
    sessionStorage.removeItem('session_started')
    sessionStorage.removeItem('current_user')
    
    // Clear local storage
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    localStorage.removeItem('emailForSignIn')
    localStorage.removeItem('userDisplayName')
  }

  // Get session info
  static getSession() {
    if (typeof window === 'undefined') return null
    
    const sessionData = sessionStorage.getItem(this.SESSION_KEY)
    if (!sessionData) return null
    
    try {
      return JSON.parse(sessionData)
    } catch {
      return null
    }
  }

  // Check if this is a fresh start (no session exists)
  static isFreshStart(): boolean {
    return !this.isSessionValid()
  }
}