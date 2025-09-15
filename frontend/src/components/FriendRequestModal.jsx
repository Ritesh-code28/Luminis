import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../App'

const FriendRequestModal = ({ isOpen, onClose }) => {
  const { friendRequests, setFriendRequests } = useContext(UserContext)

  const handleAccept = (requestId) => {
    setFriendRequests(prev => prev.filter(req => req.id !== requestId))
    // In a real app, this would add the user to friends list
    console.log(`Accepted friend request: ${requestId}`)
  }

  const handleReject = (requestId) => {
    setFriendRequests(prev => prev.filter(req => req.id !== requestId))
    console.log(`Rejected friend request: ${requestId}`)
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now - date) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="modal-content animate-slide-up max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-semibold text-text-primary">
            Friend Requests
          </h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors duration-200 p-2 hover:bg-muted rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {friendRequests.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-text-secondary">No friend requests at the moment</p>
            </div>
          ) : (
            friendRequests.map((request) => (
              <div key={request.id} className="border border-muted rounded-2xl p-4 hover:shadow-gentle transition-all duration-200">
                <div className="flex items-start space-x-3">
                  <Link
                    to={request.from === 'finn' ? '/finn' : `/profile/${request.from}`}
                    className="flex-shrink-0 hover:scale-105 transition-transform duration-200"
                    onClick={onClose}
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-lg shadow-gentle">
                      {request.fromAvatar}
                    </div>
                  </Link>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <Link
                        to={request.from === 'finn' ? '/finn' : `/profile/${request.from}`}
                        className="font-medium text-text-primary hover:text-primary transition-colors duration-200"
                        onClick={onClose}
                      >
                        {request.fromName}
                      </Link>
                      <span className="text-xs text-text-secondary">
                        {formatTimestamp(request.timestamp)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-text-secondary mb-3 leading-relaxed">
                      {request.message}
                    </p>
                    
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleAccept(request.id)}
                        className="flex-1 bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary/90 transition-all duration-200"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        className="flex-1 bg-muted text-text-secondary px-4 py-2 rounded-xl text-sm font-medium hover:bg-accent hover:text-white transition-all duration-200"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {friendRequests.length > 0 && (
          <div className="mt-6 pt-4 border-t border-muted text-center">
            <button
              onClick={onClose}
              className="text-sm text-primary hover:text-secondary font-medium transition-colors duration-200"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default FriendRequestModal