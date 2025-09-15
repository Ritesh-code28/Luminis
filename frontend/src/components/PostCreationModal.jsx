import React, { useState, useEffect } from 'react'

const PostCreationModal = ({ isOpen, onClose, onPost }) => {
  const [formData, setFormData] = useState({
    title: '',
    body: ''
  })

  useEffect(() => {
    if (!isOpen) {
      setFormData({ title: '', body: '' })
    }
  }, [isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.title.trim() && formData.body.trim()) {
      console.log('New blog post:', formData)
      // In a real app, this would be passed to onPost callback
      if (onPost) {
        onPost(formData)
      }
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="modal-content animate-slide-up max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-semibold text-text-primary">Create New Post</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors duration-200 p-2 hover:bg-muted rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-text-primary mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input-field"
              placeholder="Give your post a meaningful title..."
              required
            />
          </div>

          <div>
            <label htmlFor="body" className="block text-sm font-medium text-text-primary mb-2">
              Content
            </label>
            <textarea
              id="body"
              name="body"
              value={formData.body}
              onChange={handleChange}
              rows={8}
              className="input-field resize-none"
              placeholder="Share your thoughts, experiences, or wisdom..."
              required
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-muted">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-text-secondary hover:text-text-primary transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.title.trim() || !formData.body.trim()}
              className={`btn-primary ${
                !formData.title.trim() || !formData.body.trim()
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:shadow-soft'
              }`}
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PostCreationModal