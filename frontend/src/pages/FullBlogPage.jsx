import React, { useContext } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { DataContext } from '../App'
import { getBlogById } from '../data/mockData'

const FullBlogPage = () => {
  const { blogId } = useParams()
  const navigate = useNavigate()
  const blog = getBlogById(blogId)

  if (!blog) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center text-4xl mb-6">
            📄
          </div>
          <h2 className="font-display text-2xl font-semibold text-text-primary mb-2">
            Blog Post Not Found
          </h2>
          <p className="text-text-secondary mb-6">
            The blog post you're looking for doesn't exist or may have been removed.
          </p>
          <Link to="/blogs" className="btn-primary">
            Browse All Posts
          </Link>
        </div>
      </div>
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-text-secondary hover:text-primary transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back</span>
          </button>
        </div>

        {/* Article Header */}
        <article className="card">
          <header className="mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <Link
                to={`/profile/${blog.authorId}`}
                className="flex-shrink-0 hover:scale-105 transition-transform duration-200"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl shadow-gentle">
                  {blog.authorAvatar}
                </div>
              </Link>
              
              <div className="flex-1">
                <Link
                  to={`/profile/${blog.authorId}`}
                  className="block font-medium text-text-primary hover:text-primary transition-colors duration-200 text-lg"
                >
                  {blog.author}
                </Link>
                <p className="text-text-secondary text-sm mb-1">
                  {blog.authorBio}
                </p>
                <div className="flex items-center space-x-4 text-sm text-text-secondary">
                  <span>{formatDate(blog.publishDate)}</span>
                  <span>•</span>
                  <span>{blog.readTime}</span>
                </div>
              </div>
            </div>

            <h1 className="font-display text-4xl lg:text-5xl font-bold text-text-primary mb-6 leading-tight">
              {blog.title}
            </h1>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-lg font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <div className="text-text-primary leading-relaxed space-y-6">
              {blog.content.split('\n\n').map((paragraph, index) => {
                // Handle different paragraph types
                if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                  return (
                    <h3 key={index} className="font-display text-xl font-semibold text-text-primary mt-8 mb-4">
                      {paragraph.replace(/\*\*/g, '')}
                    </h3>
                  )
                } else if (paragraph.match(/^\d+\./)) {
                  // Handle numbered lists
                  const listItems = paragraph.split('\n').filter(item => item.trim())
                  return (
                    <ol key={index} className="list-decimal list-inside space-y-2 ml-4">
                      {listItems.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-text-primary">
                          {item.replace(/^\d+\.\s*/, '')}
                        </li>
                      ))}
                    </ol>
                  )
                } else if (paragraph.includes('**')) {
                  // Handle bold text inline
                  const parts = paragraph.split(/(\*\*[^*]+\*\*)/g)
                  return (
                    <p key={index} className="text-lg leading-relaxed">
                      {parts.map((part, partIndex) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return (
                            <strong key={partIndex} className="font-semibold text-text-primary">
                              {part.replace(/\*\*/g, '')}
                            </strong>
                          )
                        }
                        return part
                      })}
                    </p>
                  )
                } else {
                  return (
                    <p key={index} className="text-lg leading-relaxed">
                      {paragraph}
                    </p>
                  )
                }
              })}
            </div>
          </div>

          {/* Article Footer */}
          <footer className="mt-12 pt-8 border-t border-muted">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <button className="flex items-center space-x-2 text-text-secondary hover:text-primary transition-colors duration-200">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="font-medium">{blog.likes}</span>
                </button>
                
                <button className="flex items-center space-x-2 text-text-secondary hover:text-primary transition-colors duration-200">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="font-medium">{blog.comments}</span>
                </button>
              </div>

              <div className="flex items-center space-x-3">
                <button className="p-2 text-text-secondary hover:text-primary transition-colors duration-200" title="Share">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </button>
                <button className="p-2 text-text-secondary hover:text-primary transition-colors duration-200" title="Bookmark">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
              </div>
            </div>
          </footer>
        </article>

        {/* Author Bio */}
        <div className="mt-8 card">
          <div className="flex items-start space-x-4">
            <Link
              to={`/profile/${blog.authorId}`}
              className="flex-shrink-0 hover:scale-105 transition-transform duration-200"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl shadow-gentle">
                {blog.authorAvatar}
              </div>
            </Link>
            
            <div className="flex-1">
              <Link
                to={`/profile/${blog.authorId}`}
                className="block font-display text-xl font-semibold text-text-primary hover:text-primary transition-colors duration-200 mb-2"
              >
                {blog.author}
              </Link>
              <p className="text-text-secondary leading-relaxed">
                {blog.authorBio}
              </p>
            </div>
            
            <Link
              to={`/profile/${blog.authorId}`}
              className="btn-outline"
            >
              View Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FullBlogPage