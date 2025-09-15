import React, { useContext, useState } from 'react'
import { DataContext } from '../App'
import StreamCard from '../components/StreamCard'

const StreamsPage = () => {
  const { streams, setAppData } = useContext(DataContext)
  const [filter, setFilter] = useState('all') // 'all', 'joined', 'available'

  const handleJoinStream = (streamId) => {
    setAppData(prev => ({
      ...prev,
      streams: prev.streams.map(stream =>
        stream.id === streamId
          ? { ...stream, isJoined: true, memberCount: stream.memberCount + 1 }
          : stream
      )
    }))
  }

  const handleLeaveStream = (streamId) => {
    setAppData(prev => ({
      ...prev,
      streams: prev.streams.map(stream =>
        stream.id === streamId
          ? { ...stream, isJoined: false, memberCount: Math.max(1, stream.memberCount - 1) }
          : stream
      )
    }))
  }

  const filteredStreams = streams.filter(stream => {
    if (filter === 'joined') return stream.isJoined
    if (filter === 'available') return !stream.isJoined
    return true
  })

  const joinedCount = streams.filter(s => s.isJoined).length

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold text-text-primary mb-4 flex items-center justify-center">
            <span className="text-4xl mr-4">🌊</span>
            Streams
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Discover and join topic-based communities where like-minded souls gather 
            to share insights, ask questions, and grow together.
          </p>
        </div>

        {/* Stats & Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-6 text-sm text-text-secondary">
            <span className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>{joinedCount} streams joined</span>
            </span>
            <span className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <span>{streams.length - joinedCount} available to explore</span>
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                filter === 'all'
                  ? 'bg-primary text-white shadow-gentle'
                  : 'text-text-secondary hover:text-primary hover:bg-primary/5'
              }`}
            >
              All Streams
            </button>
            <button
              onClick={() => setFilter('joined')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                filter === 'joined'
                  ? 'bg-primary text-white shadow-gentle'
                  : 'text-text-secondary hover:text-primary hover:bg-primary/5'
              }`}
            >
              Joined
            </button>
            <button
              onClick={() => setFilter('available')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                filter === 'available'
                  ? 'bg-primary text-white shadow-gentle'
                  : 'text-text-secondary hover:text-primary hover:bg-primary/5'
              }`}
            >
              Explore
            </button>
          </div>
        </div>

        {/* Streams Grid */}
        {filteredStreams.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center text-4xl mb-6">
              {filter === 'joined' ? '🌊' : filter === 'available' ? '🔍' : '📡'}
            </div>
            <h3 className="font-display text-xl font-semibold text-text-primary mb-2">
              {filter === 'joined' && 'No Streams Joined Yet'}
              {filter === 'available' && 'All Streams Joined!'}
              {filter === 'all' && 'No Streams Available'}
            </h3>
            <p className="text-text-secondary max-w-md mx-auto">
              {filter === 'joined' && 'Explore available streams and join communities that resonate with you.'}
              {filter === 'available' && 'You\'ve joined all available streams! Check back later for new communities.'}
              {filter === 'all' && 'New streams are being created. Check back soon for new communities to join.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStreams.map((stream) => (
              <StreamCard
                key={stream.id}
                stream={stream}
                onJoin={handleJoinStream}
                onLeave={handleLeaveStream}
              />
            ))}
          </div>
        )}

        {/* Community Guidelines */}
        <div className="mt-16 bg-primary/5 rounded-2xl p-8 border border-primary/20">
          <div className="text-center">
            <h3 className="font-display text-xl font-semibold text-text-primary mb-4">
              Community Guidelines
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-text-secondary">
              <div className="space-y-2">
                <div className="text-2xl">🤝</div>
                <h4 className="font-medium text-text-primary">Respect & Kindness</h4>
                <p>Treat all community members with dignity and compassion.</p>
              </div>
              <div className="space-y-2">
                <div className="text-2xl">💭</div>
                <h4 className="font-medium text-text-primary">Thoughtful Sharing</h4>
                <p>Share content that adds value and promotes positive discussion.</p>
              </div>
              <div className="space-y-2">
                <div className="text-2xl">🌱</div>
                <h4 className="font-medium text-text-primary">Growth Mindset</h4>
                <p>Embrace learning, be open to different perspectives, and help others grow.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StreamsPage