'use client'

import { useState } from 'react'
import { Search, X, Settings, Shield } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface UniversalSearchProps {
  isOpen: boolean
  onClose: () => void
  onOpenSearch?: () => void
  onOpenPrivacySettings?: () => void
}

export default function UniversalSearch({ isOpen, onClose, onOpenSearch, onOpenPrivacySettings }: UniversalSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState('all')

  const searchTypes = [
    { id: 'all', label: 'All' },
    { id: 'messages', label: 'Messages' },
    { id: 'contacts', label: 'Contacts' },
    { id: 'posts', label: 'Posts' },
    { id: 'media', label: 'Media' }
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700">
              {/* Search Header */}
              <div className="flex items-center p-4 border-b border-gray-200 dark:border-slate-700">
                <Search className="text-gray-400 mr-3" size={20} />
                <input
                  type="text"
                  placeholder="Search everything..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={onClose}
                  className="ml-3 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Search Type Filters */}
              <div className="flex items-center space-x-2 p-4 border-b border-gray-200 dark:border-slate-700">
                {searchTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSearchType(type.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      searchType === type.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>

              {/* Search Results */}
              <div className="p-4 max-h-96 overflow-y-auto">
                {searchQuery ? (
                  <div className="space-y-4">
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No results found for "{searchQuery}"
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      Type to start searching...
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-slate-700">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={onOpenSearch}
                    className="flex items-center space-x-2 text-blue-500 hover:text-blue-600 text-sm font-medium"
                  >
                    <Search size={16} />
                    <span>Advanced Search</span>
                  </button>
                  <button
                    onClick={onOpenPrivacySettings}
                    className="flex items-center space-x-2 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 text-sm font-medium"
                  >
                    <Shield size={16} />
                    <span>Privacy Settings</span>
                  </button>
                </div>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 text-xs rounded">
                  ESC
                </kbd>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
