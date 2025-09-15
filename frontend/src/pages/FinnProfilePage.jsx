import React from 'react'
import { Link } from 'react-router-dom'
import { mockData } from '../data/mockData'

const FinnProfilePage = () => {
  const finn = mockData.finnProfile

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="card mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-6 sm:space-y-0 sm:space-x-6">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-echo-deep-teal to-echo-mint flex items-center justify-center text-4xl shadow-peaceful">
                {finn.avatar}
              </div>
            </div>
            
            <div className="flex-1">
              <h1 className="font-display text-3xl font-bold text-text-primary mb-2">
                {finn.name}
              </h1>
              <p className="text-text-secondary mb-4 leading-relaxed">
                {finn.bio}
              </p>
              
              <div className="flex items-center space-x-6 text-sm text-text-secondary">
                <span className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>{finn.friendsCount.toLocaleString()} friends</span>
                </span>
                <span className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <span>{finn.postsCount} posts</span>
                </span>
                <span className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Member since {formatDate(finn.joinDate)}</span>
                </span>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <div className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-medium text-center">
                Echo Guide
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Posts */}
            <div className="card">
              <h2 className="font-display text-xl font-semibold text-text-primary mb-6">
                Recent Wisdom Shares
              </h2>

              <div className="space-y-6">
                {finn.recentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 border border-muted rounded-2xl hover:shadow-gentle transition-all duration-200"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-echo-deep-teal to-echo-mint flex items-center justify-center text-white text-lg">
                        {finn.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-text-primary">{finn.name}</span>
                          <span className="text-xs text-text-secondary">
                            {new Date(post.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-text-primary leading-relaxed mb-3">
                          {post.content}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-text-secondary">
                          <span className="flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span>{post.likes}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* About Section */}
            <div className="card">
              <h2 className="font-display text-xl font-semibold text-text-primary mb-6">
                About FINN
              </h2>
              
              <div className="prose prose-sm max-w-none text-text-secondary leading-relaxed">
                <p className="mb-4">
                  FINN is your friendly guide in the Echo community, always ready to help newcomers 
                  find their way and discover the peaceful connections that make this platform special. 
                  As a digital dolphin, FINN represents the playful yet wise spirit of our community.
                </p>
                
                <p className="mb-4">
                  With a deep understanding of digital mindfulness and community building, FINN helps 
                  users navigate their journey toward more meaningful online interactions. Whether you're 
                  looking for guidance on using the platform or need a friend to brighten your day, 
                  FINN is always here to help.
                </p>
                
                <p>
                  Follow FINN's updates for daily wisdom, platform tips, and gentle reminders about 
                  staying connected to what matters most in our digital lives.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Favorite Quote */}
            <div className="card">
              <h3 className="font-display text-lg font-semibold text-text-primary mb-4">
                Favorite Quote
              </h3>
              <blockquote className="text-text-secondary italic leading-relaxed">
                {finn.favoriteQuote}
              </blockquote>
            </div>

            {/* Interests */}
            <div className="card">
              <h3 className="font-display text-lg font-semibold text-text-primary mb-4">
                Interests
              </h3>
              
              <div className="space-y-2">
                {finn.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="inline-block px-3 py-1 bg-echo-deep-teal/10 text-echo-deep-teal text-sm rounded-lg font-medium mr-2 mb-2"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Echo Guide Info */}
            <div className="card">
              <h3 className="font-display text-lg font-semibold text-text-primary mb-4">
                Echo Guide
              </h3>
              
              <div className="space-y-3 text-sm text-text-secondary">
                <p>
                  ✨ Official Echo community guide
                </p>
                <p>
                  🌊 Spreading digital wellness wisdom
                </p>
                <p>
                  💙 Always here to help new friends
                </p>
                <p>
                  🐬 Swimming through the digital seas since {formatDate(finn.joinDate)}
                </p>
              </div>
            </div>

            {/* Connect Section */}
            <div className="card">
              <h3 className="font-display text-lg font-semibold text-text-primary mb-4">
                Connect with FINN
              </h3>
              
              <div className="space-y-3">
                <Link to="/world-chat" className="block w-full btn-outline text-center">
                  Chat in World Chat
                </Link>
                <Link to="/streams" className="block w-full btn-outline text-center">
                  See FINN in Streams
                </Link>
              </div>
              
              <p className="text-xs text-text-secondary mt-4 text-center">
                FINN is always active and ready to help! 🐬
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FinnProfilePage