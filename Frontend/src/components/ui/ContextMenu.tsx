'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

export interface ContextMenuItem {
  icon: LucideIcon
  label: string
  action: () => void
  destructive?: boolean
}

interface ContextMenuProps {
  isOpen: boolean
  onClose: () => void
  items: ContextMenuItem[]
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  className?: string
}

export default function ContextMenu({
  isOpen,
  onClose,
  items,
  position = 'top-right',
  className = ''
}: ContextMenuProps) {
  const positionClasses = {
    'top-right': 'right-0 top-full mt-1',
    'top-left': 'left-0 top-full mt-1',
    'bottom-right': 'right-0 bottom-full mb-1',
    'bottom-left': 'left-0 bottom-full mb-1'
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          
          {/* Menu */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 300,
              duration: 0.2 
            }}
            className={`absolute ${positionClasses[position]} context-menu ${className}`}
            style={{ zIndex: 9999 }}
          >
            {items.map((item, index) => {
              const Icon = item.icon
              
              return (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    item.action()
                    onClose()
                  }}
                  className={`context-menu-item ${item.destructive ? 'destructive' : ''}`}
                >
                  <Icon className="context-menu-icon" />
                  <span className="context-menu-text">
                    {item.label}
                  </span>
                </motion.button>
              )
            })}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Hook for easier context menu usage
export function useContextMenu() {
  const [isOpen, setIsOpen] = useState(false)
  
  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)
  const toggle = () => setIsOpen(!isOpen)
  
  return { isOpen, open, close, toggle }
}
