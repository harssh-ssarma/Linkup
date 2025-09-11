'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, Video, Image as ImageIcon, Mic, Type, Users, Radio, X, Upload, Settings } from 'lucide-react'
import Header from '@/components/layout/Header'
import { ContextMenuItem } from '@/components/ui/ContextMenu'

export default function CreateSection() {
  const [activeCreate, setActiveCreate] = useState<string | null>(null)
  const [caption, setCaption] = useState('')
  const [selectedMedia, setSelectedMedia] = useState<File[]>([])

  // Custom menu items for Create section
  const createMenuItems: ContextMenuItem[] = [
    { icon: Camera, label: 'Camera Settings', action: () => console.log('Camera Settings') },
    { icon: Settings, label: 'Create Settings', action: () => console.log('Create Settings') },
  ]

  const createOptions = [
    {
      id: 'photo',
      title: 'Photo Post',
      subtitle: 'Share a photo with your followers',
      icon: ImageIcon,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'video',
      title: 'Video Post',
      subtitle: 'Upload or record a video',
      icon: Video,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'reel',
      title: 'Create Reel',
      subtitle: 'Short-form vertical video',
      icon: Camera,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'story',
      title: 'Add Story',
      subtitle: '24-hour temporary update',
      icon: Type,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'live',
      title: 'Go Live',
      subtitle: 'Stream live to your audience',
      icon: Radio,
      color: 'from-red-500 to-pink-500'
    },
    {
      id: 'voice',
      title: 'Voice Note',
      subtitle: 'Record and share audio',
      icon: Mic,
      color: 'from-indigo-500 to-purple-500'
    }
  ]

  const handleMediaSelect = (type: string) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = type === 'photo' ? 'image/*' : 'video/*'
    input.multiple = true
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || [])
      setSelectedMedia(files)
      setActiveCreate(type)
    }
    input.click()
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <Header 
        tabTitle="Create"
        menuItems={createMenuItems}
      />

      <div className="flex-1 overflow-y-auto">
        {!activeCreate ? (
          /* Create Options Grid */
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {createOptions.map((option, index) => {
                const Icon = option.icon
                return (
                  <motion.div
                    key={option.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (option.id === 'photo' || option.id === 'video') {
                        handleMediaSelect(option.id)
                      } else {
                        setActiveCreate(option.id)
                      }
                    }}
                    className="glass-card-premium cursor-pointer hover:scale-105 transition-all group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${option.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className="text-white" size={28} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">{option.title}</h3>
                        <p className="text-white/60 text-sm">{option.subtitle}</p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Quick Actions */}
            <div className="mt-8 max-w-4xl mx-auto">
              <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { id: 'camera', label: 'Camera', icon: Camera },
                  { id: 'gallery', label: 'Gallery', icon: ImageIcon },
                  { id: 'group', label: 'New Group', icon: Users },
                  { id: 'broadcast', label: 'Broadcast', icon: Radio }
                ].map((action) => {
                  const Icon = action.icon
                  return (
                    <motion.button
                      key={action.id}
                      whileTap={{ scale: 0.95 }}
                      className="btn-secondary text-sm flex flex-col items-center space-y-2"
                    >
                      <Icon size={24} className="text-white/80" />
                      <span className="text-sm text-white/80">{action.label}</span>
                    </motion.button>
                  )
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Create Post Interface */
          <div className="p-6 max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-effect border border-white/20 rounded-2xl overflow-hidden"
            >
              {/* Media Preview */}
              {selectedMedia.length > 0 && (
                <div className="aspect-square bg-gradient-to-br from-purple-900/20 to-blue-900/20 flex items-center justify-center">
                  <div className="text-center text-white/60">
                    <Upload size={48} className="mx-auto mb-4" />
                    <p>{selectedMedia.length} file(s) selected</p>
                  </div>
                </div>
              )}

              {/* Caption Input */}
              <div className="p-6">
                <div className="flex items-start space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-semibold">JD</span>
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="Write a caption..."
                      className="w-full bg-transparent text-white placeholder-white/40 resize-none focus:outline-none"
                      rows={4}
                    />
                  </div>
                </div>

                {/* Post Options */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <span className="text-white/80">Add location</span>
                    <button className="text-blue-400 text-sm">Add</button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <span className="text-white/80">Tag people</span>
                    <button className="text-blue-400 text-sm">Tag</button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <span className="text-white/80">Advanced settings</span>
                    <button className="text-blue-400 text-sm">Edit</button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white font-semibold"
                  >
                    Save Draft
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-semibold shadow-lg"
                  >
                    Share
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}