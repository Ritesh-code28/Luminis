import React, { useState } from 'react'

const ChatInput = ({ onSendMessage, placeholder = "Share your thoughts...", className = "" }) => {
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message.trim())
      setMessage('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`flex items-end space-x-3 ${className}`}>
      <div className="flex-1 relative">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="w-full px-4 py-3 border border-muted rounded-2xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-all duration-200 resize-none min-h-[50px] max-h-32 bg-surface"
          rows={1}
          style={{
            height: 'auto',
            minHeight: '50px'
          }}
          onInput={(e) => {
            e.target.style.height = 'auto'
            e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px'
          }}
        />
      </div>
      
      <button
        type="submit"
        disabled={!message.trim()}
        className={`p-3 rounded-2xl transition-all duration-200 flex items-center justify-center ${
          message.trim()
            ? 'bg-primary text-white hover:bg-primary/90 shadow-gentle hover:shadow-soft'
            : 'bg-muted text-text-secondary cursor-not-allowed'
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>
    </form>
  )
}

export default ChatInput