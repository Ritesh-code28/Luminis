import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// Pages
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import BloomCustomizationPage from './pages/BloomCustomizationPage'
import WorldChatPage from './pages/WorldChatPage'
import StreamsPage from './pages/StreamsPage'
import IndividualStreamPage from './pages/IndividualStreamPage'
import BloggingPage from './pages/BloggingPage'
import FullBlogPage from './pages/FullBlogPage'
import MyOasisPage from './pages/MyOasisPage'
import FinnProfilePage from './pages/FinnProfilePage'

// Components
import Navbar from './components/Navbar'

// Mock data and user context
import { mockData } from './data/mockData'

// Create a simple context for user state
export const UserContext = React.createContext()
export const DataContext = React.createContext()

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [friendRequests, setFriendRequests] = useState([])
  const [appData, setAppData] = useState(mockData)

  // Initialize with Finn's friend request
  useEffect(() => {
    setFriendRequests([
      {
        id: 'finn-request',
        from: 'finn',
        fromName: 'FINN',
        fromAvatar: '🐬',
        message: 'Hey! Would love to connect with you on Echo!',
        timestamp: new Date().toISOString()
      }
    ])
  }, [])

  // Check for saved auth state
  useEffect(() => {
    const savedUser = localStorage.getItem('echoUser')
    if (savedUser) {
      const user = JSON.parse(savedUser)
      setCurrentUser(user)
      setIsAuthenticated(true)
    }
  }, [])

  const login = (userData) => {
    setCurrentUser(userData)
    setIsAuthenticated(true)
    localStorage.setItem('echoUser', JSON.stringify(userData))
  }

  const logout = () => {
    setCurrentUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('echoUser')
  }

  const userContextValue = {
    isAuthenticated,
    currentUser,
    login,
    logout,
    friendRequests,
    setFriendRequests
  }

  const dataContextValue = {
    ...appData,
    setAppData
  }

  return (
    <UserContext.Provider value={userContextValue}>
      <DataContext.Provider value={dataContextValue}>
        <Router>
          <div className="min-h-screen bg-background">
            {isAuthenticated && <Navbar />}
            
            <main className={isAuthenticated ? 'pt-20' : ''}>
              <Routes>
                {/* Public routes */}
                <Route 
                  path="/" 
                  element={isAuthenticated ? <Navigate to="/world-chat" /> : <LandingPage />} 
                />
                <Route 
                  path="/auth" 
                  element={isAuthenticated ? <Navigate to="/world-chat" /> : <AuthPage />} 
                />
                
                {/* Protected routes */}
                <Route 
                  path="/customize-bloom" 
                  element={isAuthenticated ? <BloomCustomizationPage /> : <Navigate to="/auth" />} 
                />
                <Route 
                  path="/world-chat" 
                  element={isAuthenticated ? <WorldChatPage /> : <Navigate to="/auth" />} 
                />
                <Route 
                  path="/streams" 
                  element={isAuthenticated ? <StreamsPage /> : <Navigate to="/auth" />} 
                />
                <Route 
                  path="/streams/:streamId" 
                  element={isAuthenticated ? <IndividualStreamPage /> : <Navigate to="/auth" />} 
                />
                <Route 
                  path="/blogs" 
                  element={isAuthenticated ? <BloggingPage /> : <Navigate to="/auth" />} 
                />
                <Route 
                  path="/blogs/:blogId" 
                  element={isAuthenticated ? <FullBlogPage /> : <Navigate to="/auth" />} 
                />
                <Route 
                  path="/oasis" 
                  element={isAuthenticated ? <MyOasisPage /> : <Navigate to="/auth" />} 
                />
                <Route 
                  path="/profile/:userId" 
                  element={isAuthenticated ? <MyOasisPage /> : <Navigate to="/auth" />} 
                />
                <Route 
                  path="/finn" 
                  element={isAuthenticated ? <FinnProfilePage /> : <Navigate to="/auth" />} 
                />
                
                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </div>
        </Router>
      </DataContext.Provider>
    </UserContext.Provider>
  )
}

export default App