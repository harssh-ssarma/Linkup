'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface NavigationContextType {
  isSidebarExpanded: boolean
  setIsSidebarExpanded: (expanded: boolean) => void
  showMobileNavigation: boolean
  setShowMobileNavigation: (show: boolean) => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false)
  const [showMobileNavigation, setShowMobileNavigation] = useState(true)

  return (
    <NavigationContext.Provider value={{ 
      isSidebarExpanded, 
      setIsSidebarExpanded,
      showMobileNavigation,
      setShowMobileNavigation
    }}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}
