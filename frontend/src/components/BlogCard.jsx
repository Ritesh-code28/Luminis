import React from 'react'
import { Link } from 'react-router-dom'

const BlogCard = ({ blog, className = "" }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <article className={`card hover:shadow-soft transition-all duration-300 group ${className}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Link
              to={`/profile/${blog.authorId}`}
              className="flex-shrink-0 hover:scale-105 transition-transform duration-200"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-lg shadow-gentle">
                {blog.authorAvatar}
              </div>
            </Link>
            <div>
              <Link
                to={`/profile/${blog.authorId}`}
                className="font-medium text-text-primary hover:text-primary transition-colors duration-200"
              >
                {blog.author}
              </Link>
              <p className="text-xs text-text-secondary">
                {formatDate(blog.publishDate)} • {blog.readTime}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <Link to={`/blogs/${blog.id}`} className="block group-hover:scale-[1.02] transition-transform duration-300">
            <h2 className="font-display text-xl font-semibold text-text-primary group-hover:text-primary transition-colors duration-200 line-clamp-2">
              {blog.title}
            </h2>
          </Link>
          
          <p className="text-text-secondary text-sm leading-relaxed line-clamp-3">
            {blog.excerpt}
          </p>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {blog.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-lg font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-muted">
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 text-text-secondary hover:text-primary transition-colors duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-sm font-medium">{blog.likes}</span>
            </button>
            
            <Link
              to={`/blogs/${blog.id}`}
              className="flex items-center space-x-2 text-text-secondary hover:text-primary transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-sm font-medium">{blog.comments}</span>
            </Link>
          </div>

          <Link
            to={`/blogs/${blog.id}`}
            className="text-sm text-primary hover:text-secondary font-medium transition-colors duration-200"
          >
            Read more →
          </Link>
        </div>
      </div>
    </article>
  )
}

export default BlogCard