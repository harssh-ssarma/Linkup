'use client'

import Navigation from '@/components/layout/Navigation'
import { useNavigation } from '@/context/NavigationContext'

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isSidebarExpanded } = useNavigation()

  return (
    <div className="flex h-full">
      {/* Navigation */}
      <Navigation />
      
      {/* Main content - Dynamic left margin based on sidebar state */}
      <main
        className={`flex-1 h-full overflow-hidden transition-all duration-300 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 ${
          isSidebarExpanded ? 'md:ml-64' : 'md:ml-16'
        }`}
      >
        {children}
      </main>
    </div>
  )
}
