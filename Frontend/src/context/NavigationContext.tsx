'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface NavigationContextType {
  isSidebarExpanded: boolean
  setIsSidebarExpanded: (expanded: boolean) => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false)

  return (
    <NavigationContext.Provider value={{ isSidebarExpanded, setIsSidebarExpanded }}>
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
