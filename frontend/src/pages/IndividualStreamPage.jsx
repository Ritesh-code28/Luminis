import React, { useState, useContext, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { DataContext, UserContext } from '../App'
import ChatInput from '../components/ChatInput'
import ChatMessage from '../components/ChatMessage'
import { getStreamById } from '../data/mockData'

const IndividualStreamPage = () => {
  const { streamId } = useParams()
  const { currentUser } = useContext(UserContext)
  const { streams, setAppData } = useContext(DataContext)
  const [messages, setMessages] = useState([])
  const messagesEndRef = useRef(null)

  const stream = getStreamById(streamId)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleJoinStream = () => {
    setAppData(prev => ({
      ...prev,
      streams: prev.streams.map(s =>
        s.id === streamId
          ? { ...s, isJoined: true, memberCount: s.memberCount + 1 }
          : s
      )
    }))
  }

  const handleLeaveStream = () => {
    setAppData(prev => ({
      ...prev,
      streams: prev.streams.map(s =>
        s.id === streamId
          ? { ...s, isJoined: false, memberCount: Math.max(1, s.memberCount - 1) }
          : s
      )
    }))
  }

  const handleSendMessage = (messageText) => {
    if (!stream?.isJoined) return

    const newMessage = {
      id: Date.now().toString(),
      message: messageText,
      author: currentUser.name,
      authorId: currentUser.id,
      avatar: currentUser.bloom || '🌸',
      timestamp: new Date().toISOString(),
      isOwn: true
    }
    
    setMessages(prev => [...prev, newMessage])
  }

  if (!stream) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center text-4xl mb-6">
            ❓
          </div>
          <h2 className="font-display text-2xl font-semibold text-text-primary mb-2">
            Stream Not Found
          </h2>
          <p className="text-text-secondary mb-6">
            The stream you're looking for doesn't exist or may have been removed.
          </p>
          <Link to="/streams" className="btn-primary">
            Browse All Streams
          </Link>
        </div>
      </div>
    )
  }

  const currentStream = streams.find(s => s.id === streamId) || stream

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="flex-shrink-0 bg-surface border-b border-muted px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to="/streams"
              className="p-2 hover:bg-muted rounded-lg transition-colors duration-200"
            >
              <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-gentle"
              style={{ backgroundColor: `${currentStream.color}20` }}
            >
              {currentStream.emoji}
            </div>
            
            <div>
              <h1 className="font-display text-xl font-semibold text-text-primary">
                {currentStream.name}
              </h1>
              <p className="text-text-secondary text-sm">
                {currentStream.memberCount.toLocaleString()} members • Active {currentStream.recentActivity}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {currentStream.isJoined ? (
              <>
                <div className="flex items-center space-x-2 text-primary text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse-gentle"></div>
                  <span>Joined</span>
                </div>
                <button
                  onClick={handleLeaveStream}
                  className="px-4 py-2 bg-accent text-white rounded-xl text-sm font-medium hover:bg-accent/90 transition-all duration-200"
                >
                  Leave Stream
                </button>
              </>
            ) : (
              <button
                onClick={handleJoinStream}
                className="btn-primary"
              >
                Join Stream
              </button>
            )}
          </div>
        </div>

        {/* Stream Description */}
        <div className="mt-4 pt-4 border-t border-muted">
          <p className="text-text-secondary text-sm leading-relaxed">
            {currentStream.description}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {!currentStream.isJoined ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <div 
                className="w-24 h-24 mx-auto rounded-full flex items-center justify-center text-4xl mb-6 shadow-gentle"
                style={{ backgroundColor: `${currentStream.color}20` }}
              >
                {currentStream.emoji}
              </div>
              <h3 className="font-display text-xl font-semibold text-text-primary mb-2">
                Join {currentStream.name}
              </h3>
              <p className="text-text-secondary leading-relaxed mb-6">
                Join this stream to participate in conversations and connect with {currentStream.memberCount.toLocaleString()} like-minded individuals.
              </p>
              <button
                onClick={handleJoinStream}
                className="btn-primary"
              >
                Join Stream
              </button>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div 
                className="w-24 h-24 mx-auto rounded-full flex items-center justify-center text-4xl mb-6 shadow-gentle"
                style={{ backgroundColor: `${currentStream.color}20` }}
              >
                💬
              </div>
              <h3 className="font-display text-xl font-semibold text-text-primary mb-2">
                Start the Conversation
              </h3>
              <p className="text-text-secondary max-w-md mx-auto leading-relaxed">
                Be the first to share your thoughts in {currentStream.name}. 
                Your message could spark meaningful discussions.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message.message}
                author={message.author}
                authorId={message.authorId}
                avatar={message.avatar}
                timestamp={message.timestamp}
                isOwn={message.isOwn}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Chat Input */}
      {currentStream.isJoined && (
        <div className="flex-shrink-0 bg-surface border-t border-muted px-6 py-4">
          <ChatInput
            onSendMessage={handleSendMessage}
            placeholder={`Share your thoughts with ${currentStream.name}...`}
          />
        </div>
      )}
    </div>
  )
}

export default IndividualStreamPage