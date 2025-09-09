'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus, MoreVertical, Phone, Video, Users, Radio, Settings } from 'lucide-react'
import ChatList from './ChatList'
import ChatWindow from './ChatWindow'
import NewChatModal from './NewChatModal'

export default function ChatSection() {
  const [activeChat, setActiveChat] = useState<string | null>(null)
  const [chatTab, setChatTab] = useState<'personal' | 'groups' | 'channels'>('personal')
  const [showNewChat, setShowNewChat] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const chatTabs = [
    { id: 'personal', label: 'Personal', icon: Phone },
    { id: 'groups', label: 'Groups', icon: Users },
    { id: 'channels', label: 'Channels', icon: Radio },
  ]

  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div className="w-80 glass-effect border-r border-white/20 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-white">Chats</h1>
            <div className="flex space-x-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNewChat(true)}
                className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
              >
                <Plus size={20} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Settings size={20} />
              </motion.button>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          {/* Chat Tabs */}
          <div className="flex space-x-1 bg-white/5 rounded-lg p-1">
            {chatTabs.map((tab) => {
              const isActive = chatTab === tab.id
              const Icon = tab.icon
              
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setChatTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-500/30 text-blue-300' 
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon size={16} />
                  <span className="text-sm font-medium">{tab.label}</span>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-hidden">
          <ChatList 
            activeChat={activeChat}
            onChatSelect={setActiveChat}
            chatType={chatTab}
            searchQuery={searchQuery}
          />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1">
        {activeChat ? (
          <ChatWindow chatId={activeChat} />
        ) : (
          <div className="h-full flex items-center justify-center">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center text-white/60"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center">
                <Phone size={40} className="text-white/40" />
              </div>
              <h2 className="text-2xl font-semibold mb-2 text-white">Select a Chat</h2>
              <p className="text-white/60 mb-6">Choose a conversation to start messaging</p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNewChat(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-semibold shadow-lg"
              >
                Start New Chat
              </motion.button>
            </motion.div>
          </div>
        )}
      </div>

      {/* New Chat Modal */}
      <NewChatModal 
        isOpen={showNewChat}
        onClose={() => setShowNewChat(false)}
        onChatCreated={(chatId) => {
          setActiveChat(chatId)
          setShowNewChat(false)
        }}
      />
    </div>
  )
}