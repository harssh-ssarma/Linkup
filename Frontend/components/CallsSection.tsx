'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Video, PhoneCall, PhoneMissed, PhoneIncoming, PhoneOutgoing, Search, Plus, Users, Clock, X } from 'lucide-react'

interface Call {
  id: string
  contact: {
    name: string
    avatar: string
    relation: 'family' | 'friend'
  }
  type: 'voice' | 'video'
  direction: 'incoming' | 'outgoing' | 'missed'
  duration?: string
  timestamp: string
  isGroup?: boolean
  participants?: number
}

export default function CallsSection() {
  const [activeTab, setActiveTab] = useState<'all' | 'missed'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewCallModal, setShowNewCallModal] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)

  const calls: Call[] = [
    {
      id: '1',
      contact: { name: 'Sunita Mummy', avatar: 'SM', relation: 'family' },
      type: 'video',
      direction: 'incoming',
      duration: '12:34',
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      contact: { name: 'Rajesh Papa', avatar: 'RP', relation: 'family' },
      type: 'voice',
      direction: 'outgoing',
      duration: '5:42',
      timestamp: '4 hours ago'
    },
    {
      id: '3',
      contact: { name: 'Priya Didi', avatar: 'PD', relation: 'family' },
      type: 'video',
      direction: 'missed',
      timestamp: '6 hours ago'
    },
    {
      id: '4',
      contact: { name: 'Family Group', avatar: 'FG', relation: 'family' },
      type: 'video',
      direction: 'outgoing',
      duration: '25:18',
      timestamp: '1 day ago',
      isGroup: true,
      participants: 4
    },
    {
      id: '5',
      contact: { name: 'Kavya Best Friend', avatar: 'KB', relation: 'friend' },
      type: 'voice',
      direction: 'incoming',
      duration: '18:22',
      timestamp: '2 days ago'
    },
    {
      id: '6',
      contact: { name: 'Nani Ji', avatar: 'NJ', relation: 'family' },
      type: 'video',
      direction: 'missed',
      timestamp: '3 days ago'
    }
  ]

  const filteredCalls = calls.filter(call => {
    const matchesSearch = call.contact.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = activeTab === 'all' || (activeTab === 'missed' && call.direction === 'missed')
    return matchesSearch && matchesTab
  })

  const getCallIcon = (call: Call) => {
    if (call.direction === 'missed') {
      return <PhoneMissed size={16} className="text-red-400" />
    }
    if (call.direction === 'incoming') {
      return <PhoneIncoming size={16} className="text-green-400" />
    }
    return <PhoneOutgoing size={16} className="text-blue-400" />
  }

  const getCallTypeIcon = (type: 'voice' | 'video') => {
    return type === 'video' ? 
      <Video size={16} className="text-white/60" /> : 
      <Phone size={16} className="text-white/60" />
  }

  const handleCall = (contact: any, type: 'voice' | 'video') => {
    // Handle call initiation
    console.log(`Starting ${type} call with ${contact.name}`)
  }

  return (
    <div className={`h-full overflow-hidden flex flex-col relative ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900' 
        : 'bg-gradient-to-br from-blue-50/50 to-purple-50/50'
    }`}>
      {/* Header */}
      <div className={`glass-card border-b p-6 ${
        isDarkMode ? 'border-white/10' : 'border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className={`text-2xl font-bold mb-1 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Calls</h1>
            <p className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>Stay connected with family</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={16} />
          <input
            type="text"
            placeholder="Search calls..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
          />
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white/5 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md transition-all ${
              activeTab === 'all'
                ? 'bg-blue-500/30 text-blue-300'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <PhoneCall size={16} />
            <span className="text-sm font-medium">All Calls</span>
          </button>
          <button
            onClick={() => setActiveTab('missed')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md transition-all ${
              activeTab === 'missed'
                ? 'bg-red-500/30 text-red-300'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <PhoneMissed size={16} />
            <span className="text-sm font-medium">Missed</span>
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-white/10">
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-3 p-3 bg-green-500/20 rounded-xl border border-green-500/30 text-green-300 hover:bg-green-500/30 transition-colors"
          >
            <Phone size={20} />
            <span className="font-medium">Voice Call</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-3 p-3 bg-blue-500/20 rounded-xl border border-blue-500/30 text-blue-300 hover:bg-blue-500/30 transition-colors"
          >
            <Video size={20} />
            <span className="font-medium">Video Call</span>
          </motion.button>
        </div>
      </div>

      {/* Call History */}
      <div className="flex-1 overflow-y-auto">
        {filteredCalls.length > 0 ? (
          <div className="p-4 space-y-3">
            {filteredCalls.map((call) => (
              <motion.div
                key={call.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-4 rounded-xl hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {call.contact.avatar}
                      </div>
                      {call.isGroup && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <Users size={10} className="text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-white">{call.contact.name}</h3>
                        {call.isGroup && (
                          <span className="text-xs text-white/60">({call.participants} participants)</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-white/60">
                        {getCallIcon(call)}
                        {getCallTypeIcon(call.type)}
                        <span>{call.timestamp}</span>
                        {call.duration && (
                          <>
                            <span>•</span>
                            <div className="flex items-center space-x-1">
                              <Clock size={12} />
                              <span>{call.duration}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCall(call.contact, 'voice')}
                      className="p-2 rounded-full bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                      title="Voice Call"
                    >
                      <Phone size={16} />
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCall(call.contact, 'video')}
                      className="p-2 rounded-full bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                      title="Video Call"
                    >
                      <Video size={16} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <PhoneCall size={24} className="text-white/40" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {activeTab === 'missed' ? 'No missed calls' : 'No calls yet'}
              </h3>
              <p className="text-white/60 mb-6">
                {activeTab === 'missed' 
                  ? 'You haven\'t missed any calls recently' 
                  : 'Start connecting with your family and friends'}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white font-semibold flex items-center space-x-2"
                >
                  <Phone size={18} />
                  <span>Make Voice Call</span>
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-semibold flex items-center space-x-2"
                >
                  <Video size={18} />
                  <span>Start Video Call</span>
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Floating Action Button */}
      <motion.button
        onClick={() => setShowNewCallModal(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-24 lg:bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-2xl flex items-center justify-center text-white z-40"
      >
        <Plus size={24} />
      </motion.button>

      {/* New Call Modal */}
      <AnimatePresence>
        {showNewCallModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowNewCallModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-md rounded-3xl p-8 ${
                isDarkMode ? 'bg-gray-900 border border-white/20' : 'bg-white'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className={`text-2xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>New Call</h2>
                <button
                  onClick={() => setShowNewCallModal(false)}
                  className={`touch-target rounded-2xl ${
                    isDarkMode ? 'text-white/60 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="w-full flex items-center space-x-4 p-6 bg-green-500/10 rounded-2xl border-2 border-green-500/20 text-green-600 hover:bg-green-500/20 transition-all"
                >
                  <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center">
                    <Phone size={24} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-lg">Voice Call</h3>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>Start an audio call</p>
                  </div>
                </motion.button>
                
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="w-full flex items-center space-x-4 p-6 bg-blue-500/10 rounded-2xl border-2 border-blue-500/20 text-blue-600 hover:bg-blue-500/20 transition-all"
                >
                  <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                    <Video size={24} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-lg">Video Call</h3>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>Start a video call</p>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}