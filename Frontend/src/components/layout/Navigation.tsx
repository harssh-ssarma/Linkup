'use client'

import { motion } from 'framer-motion'
import { MessageCircle, Home, Plus, Phone, User, Menu, X, Sun, Moon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { useNavigation } from '@/context/NavigationContext'
import { useTheme } from '@/context/ThemeContext'

const TABS = [
  { id: 'chats', icon: MessageCircle, label: 'Chats', href: '/chats', badge: 3 },
  { id: 'feed', icon: Home, label: 'Feed', href: '/feed' },
  { id: 'calls', icon: Phone, label: 'Calls', href: '/calls', badge: 2 },
  { id: 'profile', icon: User, label: 'Profile', href: '/profile' },
]

export default function Navigation() {
  const pathname = usePathname()
  const { isSidebarExpanded, setIsSidebarExpanded, showMobileNavigation } = useNavigation()
  const { theme, toggleTheme } = useTheme()

  const activeTab = pathname === '/' ? 'chats' : pathname.slice(1) || 'chats'
  const isDark = theme === 'dark'
  const ThemeIcon = isDark ? Sun : Moon
  const themeLabel = isDark ? 'Light mode' : 'Dark mode'

  return (
    <>
      <motion.nav
        role="navigation"
        aria-label="Primary navigation"
        className="fixed left-0 top-0 bottom-0 z-40 hidden flex-col overflow-hidden nav-premium md:flex"
        initial={false}
        animate={{ width: isSidebarExpanded ? 256 : 64 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className={`flex items-center px-4 py-4 ${isSidebarExpanded ? 'justify-between' : 'justify-center'}`}>
          <motion.div
            className="flex items-center space-x-3 overflow-hidden"
            initial={false}
            animate={{ opacity: isSidebarExpanded ? 1 : 0, x: isSidebarExpanded ? 0 : -20, width: isSidebarExpanded ? 'auto' : 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="relative h-9 w-9 flex-shrink-0">
              <Image src="/linkup.png" alt="Linkup logo" fill className="rounded-xl object-cover" />
            </div>
            <motion.span
              className="text-lg font-semibold text-secondary"
              initial={false}
              animate={{ opacity: isSidebarExpanded ? 1 : 0, scale: isSidebarExpanded ? 1 : 0.85 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              Linkup
            </motion.span>
          </motion.div>

          <motion.button
            type="button"
            onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
            className={`rounded-2xl border border-subtle bg-surface-soft text-muted transition-all duration-200 hover:text-foreground ${
              isSidebarExpanded ? 'p-2' : 'fixed left-4 top-4 z-50 p-2'
            }`}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            aria-label={isSidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isSidebarExpanded ? <X size={18} /> : <Menu size={18} />}
          </motion.button>
        </div>

        <div className="flex-1 space-y-3 px-2 py-4">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id
            const Icon = tab.icon

            return (
              <Link key={tab.id} href={tab.href} className="block">
                <button
                  type="button"
                  aria-label={tab.label}
                  className={`group relative flex items-center overflow-hidden transition-colors focus:outline-none focus:ring-0 focus:border-0 ${
                    isSidebarExpanded ? 'w-full justify-start px-4 py-3' : 'mx-auto h-12 w-12 justify-center'
                  } ${isActive ? 'text-[var(--accent-strong)]' : 'text-muted hover:text-foreground'}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className={`relative flex items-center justify-center rounded-xl p-2 ${
                    isActive ? 'bg-[var(--accent-subtle)]' : 'hover:bg-surface-strong'
                  }`}>
                    <Icon size={20} />
                    {tab.badge && (
                      <div className="absolute -top-1 -right-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[var(--accent)] px-1 text-xs font-semibold text-inverse shadow-soft">
                        {tab.badge > 99 ? '99+' : tab.badge}
                      </div>
                    )}
                  </div>

                  {isSidebarExpanded && (
                    <span className="ml-3 overflow-hidden whitespace-nowrap font-medium">
                      {tab.label}
                    </span>
                  )}
                </button>
              </Link>
            )
          })}
        </div>


      </motion.nav>

      {showMobileNavigation && (
        <nav
          role="navigation"
          aria-label="Bottom navigation"
          className="fixed bottom-0 left-0 right-0 z-50 h-20 nav-bottom pb-[env(safe-area-inset-bottom)] md:hidden"
        >
          <div className="flex h-full items-center justify-between gap-2 px-3 py-3">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id
              const Icon = tab.icon

              return (
                <Link key={tab.id} href={tab.href} className="flex-1">
                  <button
                    type="button"
                    className={`relative flex w-full flex-col items-center justify-center space-y-1 py-2 transition-colors focus:outline-none focus:ring-0 focus:border-0 ${
                      isActive ? 'text-[var(--accent-strong)]' : 'text-muted hover:text-foreground'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                    aria-label={tab.label}
                  >
                    <div className={`relative rounded-xl p-2 ${
                      isActive ? 'bg-[var(--accent-subtle)]' : 'hover:bg-surface-strong'
                    }`}>
                      <Icon size={22} />
                      {tab.badge && (
                        <div className="absolute -top-1 -right-1 flex h-4 min-w-[1.15rem] items-center justify-center rounded-full bg-[var(--accent)] px-1 text-[10px] font-semibold text-inverse shadow-soft">
                          {tab.badge > 99 ? '99+' : tab.badge}
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-medium">{tab.label}</span>
                  </button>
                </Link>
              )
            })}


          </div>
        </nav>
      )}
    </>
  )
}
