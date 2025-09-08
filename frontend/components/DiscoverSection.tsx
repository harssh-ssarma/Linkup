'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, TrendingUp, Users, Hash, MapPin, Filter, Play } from 'lucide-react'
import Image from 'next/image'

interface TrendingItem {
  id: string
  type: 'hashtag' | 'location' | 'user' | 'reel'
  title: string
  subtitle: string
  image?: string
  count?: number
  isVerified?: boolean
}

export default function DiscoverSection() {
  const [activeTab, setActiveTab] = useState<'trending' | 'hashtags' | 'places' | 'people'>('trending')
  const [searchQuery, setSearchQuery] = useState('')

  const trendingData: Record<string, TrendingItem[]> = {
    trending: [
      {
        id: '1',
        type: 'hashtag',
        title: '#TechTrends2024',
        subtitle: '1.2M posts',
        count: 1200000
      },
      {
        id: '2',
        type: 'user',
        title: 'Tech Innovator',
        subtitle: '@techinnovator • 890K followers',
        image: 'https://ui-avatars.com/api/?name=Tech+Innovator&background=4F46E5&color=fff',
        isVerified: true
      },
      {
        id: '3',
        type: 'reel',
        title: 'AI Revolution',
        subtitle: '2.3M views',
        image: 'https://picsum.photos/300/400?random=1'
      },
      {
        id: '4',
        type: 'location',
        title: 'Silicon Valley',
        subtitle: '567K posts',
        image: 'https://picsum.photos/300/200?random=2'
      }
    ],
    hashtags: [
      {
        id: 'h1',
        type: 'hashtag',
        title: '#AI',
        subtitle: '5.2M posts',
        count: 5200000
      },
      {
        id: 'h2',
        type: 'hashtag',
        title: '#Technology',
        subtitle: '3.8M posts',
        count: 3800000
      },
      {
        id: 'h3',
        type: 'hashtag',
        title: '#Innovation',
        subtitle: '2.1M posts',
        count: 2100000
      }
    ],
    places: [
      {
        id: 'p1',
        type: 'location',
        title: 'New York City',
        subtitle: '12.5M posts',
        image: 'https://picsum.photos/300/200?random=3'
      },
      {
        id: 'p2',
        type: 'location',
        title: 'San Francisco',
        subtitle: '8.9M posts',
        image: 'https://picsum.photos/300/200?random=4'
      }
    ],
    people: [
      {
        id: 'u1',
        type: 'user',
        title: 'Sarah Johnson',
        subtitle: '@sarahj • 1.2M followers',
        image: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=059669&color=fff',
        isVerified: true
      },
      {
        id: 'u2',
        type: 'user',
        title: 'Mike Chen',
        subtitle: '@mikechen • 890K followers',
        image: 'https://ui-avatars.com/api/?name=Mike+Chen&background=DC2626&color=fff',
        isVerified: false
      }
    ]
  }

  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count.toString()
  }

  const currentData = trendingData[activeTab] || []
  const filteredData = currentData.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="glass-effect border-b border-white/20 p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-white">Discover</h1>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Filter size={20} />
          </motion.button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
          <input
            type="text"
            placeholder="Search hashtags, places, people..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        {/* Discover Tabs */}
        <div className="flex space-x-1 bg-white/5 rounded-lg p-1">
          {[
            { id: 'trending', label: 'Trending', icon: TrendingUp },
            { id: 'hashtags', label: 'Hashtags', icon: Hash },
            { id: 'places', label: 'Places', icon: MapPin },
            { id: 'people', label: 'People', icon: Users }
          ].map((tab) => {
            const isActive = activeTab === tab.id
            const Icon = tab.icon
            
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
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

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {filteredData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-white/60 p-8">
            <Search size={48} className="mb-4 text-white/30" />
            <h3 className="text-lg font-semibold mb-2">No results found</h3>
            <p className="text-sm text-center">
              {searchQuery 
                ? `No results for "${searchQuery}"`
                : `No ${activeTab} available right now`
              }
            </p>
          </div>
        ) : (
          <div className="p-4">
            {activeTab === 'trending' ? (
              /* Trending Grid Layout */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredData.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    className="glass-effect border border-white/20 rounded-2xl overflow-hidden cursor-pointer group"
                  >
                    {item.image && (
                      <div className="relative aspect-video bg-gradient-to-br from-purple-900/20 to-blue-900/20">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {item.type === 'reel' && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center">
                              <Play className="text-white ml-1" size={20} />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-white truncate">{item.title}</h3>
                        {item.isVerified && (
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-white/60">{item.subtitle}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              /* List Layout for other tabs */
              <div className="space-y-3">
                {filteredData.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                    className="glass-effect border border-white/20 rounded-xl p-4 cursor-pointer group"
                  >
                    <div className="flex items-center space-x-4">
                      {/* Icon/Image */}
                      <div className="flex-shrink-0">
                        {item.image ? (
                          <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/20">
                            <Image
                              src={item.image}
                              alt={item.title}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                            {item.type === 'hashtag' ? (
                              <Hash className="text-white" size={20} />
                            ) : item.type === 'location' ? (
                              <MapPin className="text-white" size={20} />
                            ) : (
                              <Users className="text-white" size={20} />
                            )}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-white truncate">{item.title}</h3>
                          {item.isVerified && (
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-white/60 truncate">{item.subtitle}</p>
                      </div>

                      {/* Action */}
                      <div className="flex-shrink-0">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-500/30 transition-colors"
                        >
                          {item.type === 'user' ? 'Follow' : 'View'}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}