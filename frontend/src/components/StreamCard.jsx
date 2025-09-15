import React from 'react'
import { Link } from 'react-router-dom'

const StreamCard = ({ stream, onJoin, onLeave, className = "" }) => {
  const handleJoinToggle = (e) => {
    e.preventDefault()
    if (stream.isJoined) {
      onLeave(stream.id)
    } else {
      onJoin(stream.id)
    }
  }

  const formatMemberCount = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`
    }
    return count.toString()
  }

  return (
    <div className={`card hover:shadow-soft transition-all duration-300 group ${className}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-gentle"
              style={{ backgroundColor: `${stream.color}20` }}
            >
              {stream.emoji}
            </div>
            <div className="flex-1">
              <Link to={`/streams/${stream.id}`}>
                <h3 className="font-display text-lg font-semibold text-text-primary group-hover:text-primary transition-colors duration-200">
                  {stream.name}
                </h3>
              </Link>
              <p className="text-text-secondary text-sm">
                {formatMemberCount(stream.memberCount)} members
              </p>
            </div>
          </div>
          
          <button
            onClick={handleJoinToggle}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              stream.isJoined
                ? 'bg-muted text-text-secondary hover:bg-accent hover:text-white'
                : 'bg-primary text-white hover:bg-primary/90 shadow-gentle'
            }`}
          >
            {stream.isJoined ? 'Leave' : 'Join'}
          </button>
        </div>

        {/* Description */}
        <p className="text-text-secondary text-sm leading-relaxed">
          {stream.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-muted">
          <div className="flex items-center space-x-2 text-text-secondary">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse-gentle"></div>
            <span className="text-xs">Active {stream.recentActivity}</span>
          </div>

          <Link
            to={`/streams/${stream.id}`}
            className="text-sm text-primary hover:text-secondary font-medium transition-colors duration-200"
          >
            View Stream →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default StreamCard