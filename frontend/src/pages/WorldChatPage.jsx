import React, { useState, useContext, useEffect, useRef } from 'react'
import { UserContext } from '../App'
import ChatInput from '../components/ChatInput'
import ChatMessage from '../components/ChatMessage'

const WorldChatPage = () => {
  const { currentUser } = useContext(UserContext)
  const [messages, setMessages] = useState([])
  const [onlineUsers] = useState([]) // No hardcoded users as requested
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (messageText) => {
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

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="flex-shrink-0 bg-surface border-b border-muted px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold text-text-primary flex items-center">
              <span className="text-2xl mr-3">🌍</span>
              World Chat
            </h1>
            <p className="text-text-secondary text-sm mt-1">
              Connect with peaceful souls from around the globe
            </p>
          </div>
          
          <div className="text-right">
            <div className="flex items-center space-x-2 text-text-secondary text-sm">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse-gentle"></div>
              <span>Live conversation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-4xl mb-6">
                💬
              </div>
              <h3 className="font-display text-xl font-semibold text-text-primary mb-2">
                Start the Conversation
              </h3>
              <p className="text-text-secondary max-w-md mx-auto leading-relaxed">
                Be the first to share a thought, ask a question, or spread some kindness. 
                Your message could brighten someone's day.
              </p>
            </div>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>

      {/* Chat Input */}
      <div className="flex-shrink-0 bg-surface border-t border-muted px-6 py-4">
        <ChatInput
          onSendMessage={handleSendMessage}
          placeholder="Share something peaceful with the world..."
        />
      </div>

      {/* Guidelines Banner */}
      <div className="flex-shrink-0 bg-primary/5 border-t border-primary/20 px-6 py-3">
        <div className="flex items-center justify-center space-x-6 text-sm text-text-secondary">
          <span className="flex items-center space-x-2">
            <span>🕊️</span>
            <span>Be kind</span>
          </span>
          <span className="flex items-center space-x-2">
            <span>🌱</span>
            <span>Stay mindful</span>
          </span>
          <span className="flex items-center space-x-2">
            <span>💚</span>
            <span>Spread positivity</span>
          </span>
        </div>
      </div>
    </div>
  )
}

export default WorldChatPage