import React, { useContext, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { UserContext } from '../App'
import FriendRequestModal from './FriendRequestModal'

const Navbar = () => {
  const { currentUser, logout, friendRequests } = useContext(UserContext)
  const [showFriendRequests, setShowFriendRequests] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navItems = [
    { path: '/world-chat', icon: '🌍', label: 'World Chat', name: 'chat' },
    { path: '/streams', icon: '🌊', label: 'Streams', name: 'streams' },
    { path: '/blogs', icon: '📝', label: 'Blogging', name: 'blogs' },
    { path: '/oasis', icon: '🏝️', label: 'My Oasis', name: 'oasis' }
  ]

  const isActive = (path) => location.pathname === path

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-surface/95 backdrop-blur-md shadow-gentle z-40 border-b border-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/world-chat" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white font-bold text-lg group-hover:scale-105 transition-transform duration-200">
                E
              </div>
              <div className="hidden sm:block">
                <h1 className="font-display font-semibold text-xl text-text-primary">Echo</h1>
                <p className="text-xs text-text-secondary -mt-1">Calm. Connected. You</p>
              </div>
            </Link>

            {/* Navigation Items */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-3 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                    isActive(item.path)
                      ? 'bg-primary/10 text-primary'
                      : 'text-text-secondary hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="hidden sm:inline font-medium text-sm">{item.label}</span>
                </Link>
              ))}

              {/* Finn's Profile Icon */}
              <Link
                to="/finn"
                className="px-3 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 text-text-secondary hover:text-primary hover:bg-primary/5"
                title="Visit FINN's Profile"
              >
                <span className="text-lg">🐬</span>
                <span className="hidden sm:inline font-medium text-sm">FINN</span>
              </Link>

              {/* Notifications */}
              <button
                onClick={() => setShowFriendRequests(true)}
                className="relative px-3 py-2 rounded-lg transition-all duration-200 text-text-secondary hover:text-primary hover:bg-primary/5"
                title="Friend Requests"
              >
                <span className="text-lg">🔔</span>
                {friendRequests.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    {friendRequests.length}
                  </span>
                )}
              </button>

              {/* User Avatar & Menu */}
              <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-muted">
                <Link
                  to="/oasis"
                  className="flex items-center space-x-2 hover:bg-primary/5 rounded-lg px-2 py-1 transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-sm">
                    {currentUser?.bloom || '🌸'}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium text-text-primary">
                    {currentUser?.name || 'User'}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-text-secondary hover:text-accent transition-colors duration-200 p-2 hover:bg-accent/5 rounded-lg"
                  title="Logout"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Friend Request Modal */}
      <FriendRequestModal
        isOpen={showFriendRequests}
        onClose={() => setShowFriendRequests(false)}
      />
    </>
  )
}

export default Navbar