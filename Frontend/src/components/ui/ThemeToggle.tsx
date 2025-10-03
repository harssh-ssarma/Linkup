'use client'

import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="relative h-10 w-20 rounded-full border border-subtle bg-surface-soft p-1 transition-colors hover:bg-surface-strong"
      aria-label="Toggle theme"
      type="button"
    >
      <motion.div
        className="absolute inset-1 flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--accent)] shadow-md"
        animate={{
          x: theme === 'dark' ? 40 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
      >
        {theme === 'dark' ? (
          <Moon className="h-4 w-4 text-white" />
        ) : (
          <Sun className="h-4 w-4 text-white" />
        )}
      </motion.div>
      <div className="flex h-full items-center justify-between px-2">
        <Sun className="h-4 w-4 text-muted" />
        <Moon className="h-4 w-4 text-muted" />
      </div>
    </button>
  )
}
