import React from 'react'
import { Link } from 'react-router-dom'

const ChatMessage = ({ 
  message, 
  author, 
  authorId, 
  avatar, 
  timestamp, 
  isOwn = false,
  showAvatar = true,
  className = "" 
}) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now - date) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div className={`flex items-start space-x-3 ${isOwn ? 'flex-row-reverse space-x-reverse' : ''} ${className}`}>
      {showAvatar && (
        <Link
          to={authorId === 'finn' ? '/finn' : `/profile/${authorId}`}
          className="flex-shrink-0 hover:scale-105 transition-transform duration-200"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-lg shadow-gentle">
            {avatar || '👤'}
          </div>
        </Link>
      )}
      
      <div className={`flex-1 max-w-xs sm:max-w-md ${isOwn ? 'text-right' : ''}`}>
        <div className={`inline-block px-4 py-3 rounded-2xl shadow-gentle ${
          isOwn 
            ? 'bg-primary text-white rounded-br-lg' 
            : 'bg-surface border border-muted rounded-bl-lg'
        }`}>
          {!isOwn && author && (
            <Link
              to={authorId === 'finn' ? '/finn' : `/profile/${authorId}`}
              className="block text-xs font-semibold text-primary hover:text-secondary transition-colors duration-200 mb-1"
            >
              {author}
            </Link>
          )}
          <p className={`text-sm leading-relaxed whitespace-pre-wrap ${
            isOwn ? 'text-white' : 'text-text-primary'
          }`}>
            {message}
          </p>
        </div>
        
        {timestamp && (
          <p className={`text-xs text-text-secondary mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
            {formatTime(timestamp)}
          </p>
        )}
      </div>
    </div>
  )
}

export default ChatMessage