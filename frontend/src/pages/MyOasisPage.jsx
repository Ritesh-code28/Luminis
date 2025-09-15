import React, { useContext, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { UserContext, DataContext } from '../App'
import { getBlogsByAuthor } from '../data/mockData'
import BloomSelector from '../components/BloomSelector'
import ColorPaletteSelector from '../components/ColorPaletteSelector'

const MyOasisPage = () => {
  const { userId } = useParams()
  const { currentUser, login } = useContext(UserContext)
  const { blogs } = useContext(DataContext)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedBloom, setSelectedBloom] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)

  // Determine if viewing own profile or another user's profile
  const isOwnProfile = !userId || userId === currentUser?.id
  const profileUser = isOwnProfile ? currentUser : null // For demo, we only have current user data

  const userBlogs = getBlogsByAuthor(profileUser?.id || '')

  const handleSaveCustomization = () => {
    if (selectedBloom || selectedColor) {
      const updatedUser = {
        ...currentUser,
        ...(selectedBloom && { bloom: selectedBloom.emoji, bloomStyle: selectedBloom.id }),
        ...(selectedColor && { colorPalette: selectedColor.id })
      }
      login(updatedUser)
    }
    setIsEditing(false)
    setSelectedBloom(null)
    setSelectedColor(null)
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center text-4xl mb-6">
            👤
          </div>
          <h2 className="font-display text-2xl font-semibold text-text-primary mb-2">
            Profile Not Found
          </h2>
          <p className="text-text-secondary mb-6">
            The profile you're looking for doesn't exist.
          </p>
          <Link to="/world-chat" className="btn-primary">
            Return to World Chat
          </Link>
        </div>
      </div>
    )
  }

  const joinDate = new Date(profileUser.joinDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="card mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-6 sm:space-y-0 sm:space-x-6">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-4xl shadow-peaceful">
                {profileUser.bloom || '🌸'}
              </div>
            </div>
            
            <div className="flex-1">
              <h1 className="font-display text-3xl font-bold text-text-primary mb-2">
                {profileUser.name}
              </h1>
              <p className="text-text-secondary mb-4">
                Member since {joinDate}
              </p>
              
              <div className="flex items-center space-x-6 text-sm text-text-secondary">
                <span className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>{profileUser.friendsCount || 0} friends</span>
                </span>
                <span className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <span>{userBlogs.length} posts</span>
                </span>
              </div>
            </div>

            {isOwnProfile && (
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="btn-outline"
                >
                  {isEditing ? 'Cancel' : 'Customize Bloom'}
                </button>
                {isEditing && (
                  <button
                    onClick={handleSaveCustomization}
                    className="btn-primary"
                  >
                    Save Changes
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Customization Section (Only visible when editing) */}
        {isEditing && (
          <div className="space-y-8 mb-8">
            <div className="card">
              <BloomSelector
                selectedBloom={selectedBloom}
                onBloomSelect={setSelectedBloom}
              />
            </div>
            
            <div className="card">
              <ColorPaletteSelector
                selectedColor={selectedColor}
                onColorSelect={setSelectedColor}
              />
            </div>
          </div>
        )}

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Posts */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-semibold text-text-primary">
                  Recent Posts
                </h2>
                {isOwnProfile && (
                  <Link to="/blogs" className="text-primary hover:text-secondary text-sm font-medium">
                    Write a post →
                  </Link>
                )}
              </div>

              {userBlogs.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center text-2xl mb-4">
                    ✍️
                  </div>
                  <h3 className="font-medium text-text-primary mb-2">
                    {isOwnProfile ? 'No posts yet' : 'No posts to show'}
                  </h3>
                  <p className="text-text-secondary text-sm">
                    {isOwnProfile 
                      ? 'Share your first thoughts and experiences with the community.'
                      : 'This user hasn\'t shared any posts yet.'
                    }
                  </p>
                  {isOwnProfile && (
                    <Link to="/blogs" className="btn-primary mt-4">
                      Write Your First Post
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {userBlogs.slice(0, 3).map((blog) => (
                    <Link
                      key={blog.id}
                      to={`/blogs/${blog.id}`}
                      className="block p-4 border border-muted rounded-2xl hover:shadow-gentle transition-all duration-200 hover:border-primary/20"
                    >
                      <h3 className="font-medium text-text-primary mb-2 hover:text-primary transition-colors duration-200">
                        {blog.title}
                      </h3>
                      <p className="text-text-secondary text-sm mb-3 line-clamp-2">
                        {blog.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-text-secondary">
                        <span>{new Date(blog.publishDate).toLocaleDateString()}</span>
                        <span>{blog.likes} likes</span>
                      </div>
                    </Link>
                  ))}
                  
                  {userBlogs.length > 3 && (
                    <Link
                      to="/blogs"
                      className="block text-center text-primary hover:text-secondary font-medium text-sm py-2"
                    >
                      View all posts ({userBlogs.length})
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="card">
              <h3 className="font-display text-lg font-semibold text-text-primary mb-4">
                {isOwnProfile ? 'Your Journey' : 'Journey Stats'}
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary text-sm">Posts written</span>
                  <span className="font-medium text-text-primary">{userBlogs.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary text-sm">Friends connected</span>
                  <span className="font-medium text-text-primary">{profileUser.friendsCount || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary text-sm">Total likes received</span>
                  <span className="font-medium text-text-primary">
                    {userBlogs.reduce((sum, blog) => sum + blog.likes, 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Favorite Quote */}
            <div className="card">
              <h3 className="font-display text-lg font-semibold text-text-primary mb-4">
                Daily Inspiration
              </h3>
              <blockquote className="text-text-secondary italic text-sm leading-relaxed">
                "In the depths of silence, we find the songs of our soul."
                <cite className="block mt-2 text-xs text-text-secondary/70 not-italic">— Ocean Wisdom</cite>
              </blockquote>
            </div>

            {/* Quick Actions */}
            {isOwnProfile && (
              <div className="card">
                <h3 className="font-display text-lg font-semibold text-text-primary mb-4">
                  Quick Actions
                </h3>
                
                <div className="space-y-3">
                  <Link to="/blogs" className="block w-full btn-outline text-center">
                    Write a Post
                  </Link>
                  <Link to="/streams" className="block w-full btn-outline text-center">
                    Explore Streams
                  </Link>
                  <Link to="/customize-bloom" className="block w-full btn-outline text-center">
                    Customize Bloom
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyOasisPage