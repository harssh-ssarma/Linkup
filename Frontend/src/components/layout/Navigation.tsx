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
                <motion.button
                  type="button"
                  aria-label={tab.label}
                  className={`group relative flex items-center overflow-hidden rounded-2xl border border-transparent transition-all focus:outline-none focus:ring-0 focus:border-0 ${
                    isSidebarExpanded ? 'w-full justify-start px-4 py-3' : 'mx-auto h-12 w-12 justify-center'
                  } ${isActive ? 'bg-[var(--accent-subtle)] text-[var(--accent-strong)] shadow-soft' : 'text-muted hover:bg-surface-strong/80 hover:text-foreground'}`}
                  aria-current={isActive ? 'page' : undefined}
                  whileTap={{ scale: 0.96 }}
                  whileHover={isSidebarExpanded ? { scale: 1.02 } : undefined}
                >
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-active-indicator"
                      className={`absolute bg-[var(--accent)] shadow-soft ${
                        isSidebarExpanded
                          ? 'left-2 top-1/2 h-10 w-1.5 -translate-y-1/2 rounded-full'
                          : 'bottom-1 left-1/2 h-1 w-6 -translate-x-1/2 rounded-full'
                      }`}
                    />
                  )}

                  <div className="relative flex items-center justify-center">
                    <Icon size={20} className="transition-colors" />
                    {tab.badge && (
                      <div className="absolute -top-2 -right-2 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[var(--accent)] px-1 text-xs font-semibold text-inverse shadow-soft">
                        {tab.badge > 99 ? '99+' : tab.badge}
                      </div>
                    )}
                  </div>

                  <motion.span
                    className="ml-3 overflow-hidden whitespace-nowrap font-medium"
                    initial={false}
                    animate={{ opacity: isSidebarExpanded ? 1 : 0, width: isSidebarExpanded ? 'auto' : 0, marginLeft: isSidebarExpanded ? 12 : 0 }}
                    transition={{
                      duration: 0.25,
                      ease: [0.4, 0, 0.2, 1],
                      opacity: { duration: isSidebarExpanded ? 0.3 : 0.1, delay: isSidebarExpanded ? 0.1 : 0 },
                    }}
                  >
                    {tab.label}
                  </motion.span>
                </motion.button>
              </Link>
            )
          })}
        </div>

        <div className="mt-auto space-y-3 px-3 pb-6">
          <Link href="/create" className="block">
            <motion.div
              whileTap={{ scale: 0.95 }}
              whileHover={isSidebarExpanded ? { scale: 1.02 } : undefined}
              className={`group flex items-center overflow-hidden rounded-2xl border border-[var(--accent)]/25 bg-[var(--accent-subtle)] text-[var(--accent-strong)] shadow-soft transition-all ${
                isSidebarExpanded ? 'justify-between px-4 py-3' : 'mx-auto h-12 w-12 justify-center'
              }`}
            >
              <div className="flex items-center gap-3">
                <Plus size={18} />
                {isSidebarExpanded && <span className="text-sm font-semibold">New Chat</span>}
              </div>
              {isSidebarExpanded && <span className="text-xs font-medium text-[var(--accent)]/80">Ctrl+N</span>}
              <span className="sr-only">Start a new chat</span>
            </motion.div>
          </Link>

          {/* <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className={`flex items-center gap-3 rounded-2xl border border-subtle bg-surface-soft px-3 py-2 text-muted transition-all hover:border-[var(--accent)]/35 hover:bg-[var(--accent-subtle)] hover:text-foreground ${
              isSidebarExpanded ? 'justify-between' : 'mx-auto h-12 w-12 justify-center'
            }`}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            <ThemeIcon size={18} className="text-[var(--accent)]" />
            {isSidebarExpanded ? (
              <div className="flex flex-col text-left">
                <span className="text-sm font-semibold text-foreground">{themeLabel}</span>
                <span className="text-xs text-muted">Tap to toggle</span>
              </div>
            ) : (
              <span className="sr-only">{themeLabel}</span>
            )}
            {isSidebarExpanded && (
              <motion.span
                layoutId="theme-toggle-indicator"
                className="ml-auto h-2 w-2 rounded-full bg-[var(--accent)] shadow-soft"
              />
            )}
          </motion.button> */}
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
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.94 }}
                    className={`relative flex w-full flex-col items-center justify-center space-y-1 rounded-2xl py-2 transition-all focus:outline-none focus:ring-0 focus:border-0 ${
                      isActive
                        ? 'bg-[var(--accent-subtle)] text-[var(--accent-strong)] shadow-soft'
                        : 'text-muted hover:bg-surface-strong/70 hover:text-foreground'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                    aria-label={tab.label}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="mobile-active-indicator"
                        className="absolute inset-x-6 -top-1 h-1 rounded-full bg-[var(--accent)]"
                      />
                    )}
                    <div className="relative">
                      <Icon size={22} />
                      {tab.badge && (
                        <div className="absolute -top-2 -right-2 flex h-4 min-w-[1.15rem] items-center justify-center rounded-full bg-[var(--accent)] px-1 text-[10px] font-semibold text-inverse shadow-soft">
                          {tab.badge > 99 ? '99+' : tab.badge}
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-medium text-muted">{tab.label}</span>
                  </motion.button>
                </Link>
              )
            })}

            {/* <motion.button
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={toggleTheme}
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-subtle bg-surface-soft text-muted transition-all hover:border-[var(--accent)]/35 hover:bg-[var(--accent-subtle)] hover:text-foreground"
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              <ThemeIcon size={18} className="text-[var(--accent)]" />
              <span className="sr-only">{themeLabel}</span>
            </motion.button> */}
          </div>
        </nav>
      )}
    </>
  )
}
