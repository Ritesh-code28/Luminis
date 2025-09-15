import React, { useState, useEffect } from 'react'

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
]

const CrowdfundingModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    need: '',
    recipientName: '',
    state: '',
    email: '',
    mobile: ''
  })
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        need: '',
        recipientName: '',
        state: '',
        email: '',
        mobile: ''
      })
      setShowSuccess(false)
    }
  }, [isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate minimum character count for need
    if (formData.need.length < 50) {
      alert('Please provide at least 50 characters describing your need.')
      return
    }

    // Show success message
    setShowSuccess(true)
    
    // Auto close after 3 seconds
    setTimeout(() => {
      onClose()
    }, 3000)
  }

  if (!isOpen) return null

  if (showSuccess) {
    return (
      <div className="modal-overlay animate-fade-in">
        <div className="modal-content animate-slide-up text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="font-display text-xl font-semibold text-text-primary mb-2">
            Request Submitted Successfully!
          </h3>
          <p className="text-text-secondary mb-4">
            Your crowdfunding request has been received. Our team will review it and get back to you soon.
          </p>
          <p className="text-sm text-text-secondary">
            This modal will close automatically...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="modal-content animate-slide-up max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl font-semibold text-text-primary">Crowdfunding Request</h2>
            <p className="text-text-secondary text-sm mt-1">Help us understand your need for financial support</p>
          </div>
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
            <label htmlFor="need" className="block text-sm font-medium text-text-primary mb-2">
              Need for Money <span className="text-accent">*</span>
            </label>
            <textarea
              id="need"
              name="need"
              value={formData.need}
              onChange={handleChange}
              rows={4}
              className="input-field resize-none"
              placeholder="Please describe your need for financial support in detail (minimum 50 characters)..."
              required
              minLength={50}
            />
            <p className="text-xs text-text-secondary mt-1">
              {formData.need.length}/50 characters minimum
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="recipientName" className="block text-sm font-medium text-text-primary mb-2">
                Recipient's Name <span className="text-accent">*</span>
              </label>
              <input
                type="text"
                id="recipientName"
                name="recipientName"
                value={formData.recipientName}
                onChange={handleChange}
                className="input-field"
                placeholder="Full name of the recipient"
                required
              />
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-text-primary mb-2">
                State from India <span className="text-accent">*</span>
              </label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select your state</option>
                {indianStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                Email <span className="text-accent">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="mobile" className="block text-sm font-medium text-text-primary mb-2">
                Mobile Number <span className="text-accent">*</span>
              </label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="input-field"
                placeholder="+91 XXXXX XXXXX"
                pattern="[+91]{3}[0-9]{10}"
                required
              />
            </div>
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
              className="btn-primary hover:shadow-soft"
            >
              Send Request
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CrowdfundingModal