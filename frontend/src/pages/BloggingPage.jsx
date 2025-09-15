import React, { useContext, useState } from 'react'
import { DataContext, UserContext } from '../App'
import BlogCard from '../components/BlogCard'
import PostCreationModal from '../components/PostCreationModal'
import { getMostLikedBlogs, getBlogsByAuthor } from '../data/mockData'

const BloggingPage = () => {
  const { blogs } = useContext(DataContext)
  const { currentUser } = useContext(UserContext)
  const [showPostModal, setShowPostModal] = useState(false)
  const [filter, setFilter] = useState('recent') // 'recent', 'most-liked', 'my-posts'

  const getFilteredBlogs = () => {
    switch (filter) {
      case 'most-liked':
        return getMostLikedBlogs()
      case 'my-posts':
        return getBlogsByAuthor(currentUser?.id || '')
      default:
        return [...blogs].sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
    }
  }

  const filteredBlogs = getFilteredBlogs()

  const handleCreatePost = (postData) => {
    console.log('Creating new post:', postData)
    // In a real app, this would add the post to the blogs array
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold text-text-primary mb-4 flex items-center justify-center">
            <span className="text-4xl mr-4">📝</span>
            Mindful Blogging
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Share your journey, insights, and wisdom through thoughtful writing. 
            Inspire others and find inspiration in the stories of fellow travelers.
          </p>
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFilter('recent')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                filter === 'recent'
                  ? 'bg-primary text-white shadow-gentle'
                  : 'text-text-secondary hover:text-primary hover:bg-primary/5'
              }`}
            >
              Recent Posts
            </button>
            <button
              onClick={() => setFilter('most-liked')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                filter === 'most-liked'
                  ? 'bg-primary text-white shadow-gentle'
                  : 'text-text-secondary hover:text-primary hover:bg-primary/5'
              }`}
            >
              Most Liked
            </button>
            <button
              onClick={() => setFilter('my-posts')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                filter === 'my-posts'
                  ? 'bg-primary text-white shadow-gentle'
                  : 'text-text-secondary hover:text-primary hover:bg-primary/5'
              }`}
            >
              My Posts
            </button>
          </div>

          <button
            onClick={() => setShowPostModal(true)}
            className="flex items-center justify-center w-12 h-12 bg-primary text-white rounded-full hover:bg-primary/90 shadow-gentle hover:shadow-soft transition-all duration-200 transform hover:scale-105"
            title="Create New Post"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* Blog Posts */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-4xl mb-6">
              {filter === 'my-posts' ? '✍️' : '📰'}
            </div>
            <h3 className="font-display text-xl font-semibold text-text-primary mb-2">
              {filter === 'my-posts' ? 'No Posts Yet' : 'No Posts Found'}
            </h3>
            <p className="text-text-secondary max-w-md mx-auto mb-6">
              {filter === 'my-posts' 
                ? 'Start your blogging journey by sharing your first thoughts and experiences.'
                : 'Check back later for new posts from the community.'
              }
            </p>
            {filter === 'my-posts' && (
              <button
                onClick={() => setShowPostModal(true)}
                className="btn-primary"
              >
                Write Your First Post
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {filteredBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}

        {/* Writing Tips */}
        <div className="mt-16 bg-secondary/5 rounded-2xl p-8 border border-secondary/20">
          <div className="text-center mb-6">
            <h3 className="font-display text-xl font-semibold text-text-primary mb-2">
              Mindful Writing Tips
            </h3>
            <p className="text-text-secondary">
              Create content that nurtures both yourself and your readers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="text-center space-y-2">
              <div className="text-2xl">🕯️</div>
              <h4 className="font-medium text-text-primary">Write with Intention</h4>
              <p className="text-text-secondary">
                Share content that comes from a place of authenticity and purpose.
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl">💭</div>
              <h4 className="font-medium text-text-primary">Be Vulnerable</h4>
              <p className="text-text-secondary">
                Honest storytelling creates deeper connections with your readers.
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl">🌱</div>
              <h4 className="font-medium text-text-primary">Inspire Growth</h4>
              <p className="text-text-secondary">
                Share insights that help others on their journey of self-discovery.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Post Creation Modal */}
      <PostCreationModal
        isOpen={showPostModal}
        onClose={() => setShowPostModal(false)}
        onPost={handleCreatePost}
      />
    </div>
  )
}

export default BloggingPage