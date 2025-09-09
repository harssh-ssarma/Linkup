'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, Video, Image, Type, Mic, MapPin, Users, X } from 'lucide-react'

export default function CreateSection() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createType, setCreateType] = useState<'story' | 'post' | null>(null)

  const createOptions = [
    {
      id: 'story',
      title: 'Create Story',
      description: 'Share a moment that disappears in 24 hours',
      icon: Camera,
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      id: 'post',
      title: 'Create Post',
      description: 'Share a photo or video to your feed',
      icon: Image,
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      id: 'text',
      title: 'Text Post',
      description: 'Share your thoughts with text',
      icon: Type,
      gradient: 'from-emerald-500 to-blue-500'
    },
    {
      id: 'voice',
      title: 'Voice Note',
      description: 'Record and share a voice message',
      icon: Mic,
      gradient: 'from-orange-500 to-red-500'
    }
  ]

  return (
    <div className="h-full bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900/10">
      {/* Header */}
      <div className="glass-card border-b border-white/10 px-4 py-3">
        <h1 className="text-xl font-bold text-white">Create</h1>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Quick Actions */}
        <div className="glass-card p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Create</h2>
          <div className="grid grid-cols-2 gap-4">
            {createOptions.map((option) => {
              const Icon = option.icon
              return (
                <motion.button
                  key={option.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setCreateType(option.id as any)
                    setShowCreateModal(true)
                  }}
                  className={`p-4 rounded-xl bg-gradient-to-r ${option.gradient} bg-opacity-20 border border-white/20 text-left hover:scale-105 transition-transform`}
                >
                  <Icon size={24} className="text-white mb-2" />
                  <h3 className="text-white font-medium mb-1">{option.title}</h3>
                  <p className="text-white/60 text-sm">{option.description}</p>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Camera Options */}
        <div className="glass-card p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Camera</h2>
          <div className="flex space-x-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex-1 p-4 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-xl border border-white/20 text-center"
            >
              <Camera size={32} className="text-white mx-auto mb-2" />
              <p className="text-white font-medium">Photo</p>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex-1 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-white/20 text-center"
            >
              <Video size={32} className="text-white mx-auto mb-2" />
              <p className="text-white font-medium">Video</p>
            </motion.button>
          </div>
        </div>

        {/* Recent Drafts */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Drafts</h2>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Image size={24} className="text-white/60" />
            </div>
            <p className="text-white/60">No drafts yet</p>
            <p className="text-white/40 text-sm mt-1">Your saved drafts will appear here</p>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                {createType === 'story' ? 'Create Story' : 'Create Post'}
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <button className="w-full p-4 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-xl border border-white/20 text-left">
                <Camera size={20} className="inline mr-3 text-white" />
                <span className="text-white">Take Photo</span>
              </button>
              <button className="w-full p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-white/20 text-left">
                <Video size={20} className="inline mr-3 text-white" />
                <span className="text-white">Record Video</span>
              </button>
              <button className="w-full p-4 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-xl border border-white/20 text-left">
                <Image size={20} className="inline mr-3 text-white" />
                <span className="text-white">Choose from Gallery</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}