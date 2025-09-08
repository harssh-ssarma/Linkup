'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bot, Sparkles, MessageSquare, Languages, Brain, Zap } from 'lucide-react'

export default function AIAssistant() {
  const [activeFeature, setActiveFeature] = useState<string | null>(null)

  const aiFeatures = [
    {
      id: 'chat',
      icon: MessageSquare,
      title: 'AI Chat',
      description: 'Chat with GPT-4 powered assistant',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'translate',
      icon: Languages,
      title: 'Smart Translate',
      description: 'Instant message translation',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'smart-reply',
      icon: Zap,
      title: 'Smart Replies',
      description: 'AI-generated response suggestions',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'sentiment',
      icon: Brain,
      title: 'Sentiment Analysis',
      description: 'Understand message emotions',
      color: 'from-orange-500 to-red-500'
    }
  ]

  return (
    <div className="p-4 space-y-4">
      {/* AI Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <Bot className="text-white" size={32} />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">AI Assistant</h2>
        <p className="text-white/60 text-sm">Powered by advanced AI models</p>
      </motion.div>

      {/* AI Features */}
      <div className="space-y-3">
        {aiFeatures.map((feature, index) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setActiveFeature(activeFeature === feature.id ? null : feature.id)}
            className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
              activeFeature === feature.id
                ? 'bg-white/20 scale-105'
                : 'bg-white/10 hover:bg-white/15'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center`}>
                <feature.icon className="text-white" size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white">{feature.title}</h3>
                <p className="text-sm text-white/60">{feature.description}</p>
              </div>
            </div>

            {/* Feature Details */}
            {activeFeature === feature.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-white/20"
              >
                {feature.id === 'chat' && (
                  <div className="space-y-2">
                    <button className="w-full p-2 bg-blue-500/20 text-blue-300 rounded-lg text-sm hover:bg-blue-500/30 transition-colors">
                      Start AI Conversation
                    </button>
                    <p className="text-xs text-white/50">Chat with GPT-4 for help, advice, or just conversation</p>
                  </div>
                )}
                
                {feature.id === 'translate' && (
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <button className="flex-1 p-2 bg-green-500/20 text-green-300 rounded-lg text-xs hover:bg-green-500/30 transition-colors">
                        Auto-detect
                      </button>
                      <button className="flex-1 p-2 bg-green-500/20 text-green-300 rounded-lg text-xs hover:bg-green-500/30 transition-colors">
                        Spanish
                      </button>
                    </div>
                    <p className="text-xs text-white/50">Translate messages in real-time</p>
                  </div>
                )}
                
                {feature.id === 'smart-reply' && (
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <button className="w-full p-2 bg-purple-500/20 text-purple-300 rounded-lg text-xs hover:bg-purple-500/30 transition-colors text-left">
                        "That sounds great!"
                      </button>
                      <button className="w-full p-2 bg-purple-500/20 text-purple-300 rounded-lg text-xs hover:bg-purple-500/30 transition-colors text-left">
                        "I agree with you"
                      </button>
                      <button className="w-full p-2 bg-purple-500/20 text-purple-300 rounded-lg text-xs hover:bg-purple-500/30 transition-colors text-left">
                        "Tell me more"
                      </button>
                    </div>
                    <p className="text-xs text-white/50">AI-generated contextual replies</p>
                  </div>
                )}
                
                {feature.id === 'sentiment' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/70">Current mood:</span>
                      <span className="text-sm text-green-400">😊 Positive</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full w-3/4"></div>
                    </div>
                    <p className="text-xs text-white/50">Real-time emotion analysis</p>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* AI Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30"
      >
        <div className="flex items-center space-x-2 mb-3">
          <Sparkles className="text-purple-400" size={16} />
          <span className="text-sm font-semibold text-white">AI Usage Today</span>
        </div>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div>
            <div className="text-lg font-bold text-white">24</div>
            <div className="text-xs text-white/60">Messages</div>
          </div>
          <div>
            <div className="text-lg font-bold text-white">8</div>
            <div className="text-xs text-white/60">Translations</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}