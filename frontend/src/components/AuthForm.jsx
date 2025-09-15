import React, { useState, useContext } from 'react'
import { UserContext } from '../App'
import { mockData } from '../data/mockData'

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const { login } = useContext(UserContext)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (isSignUp && !formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (isSignUp && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    // Mock authentication - in real app, this would call an API
    const userData = {
      id: Date.now().toString(),
      name: formData.name || 'Echo User',
      email: formData.email,
      bloom: mockData.avatarStyles[0].emoji, // Default bloom
      colorPalette: mockData.colorPalettes[0].id, // Default color
      joinDate: new Date().toISOString(),
      friendsCount: 0,
      postsCount: 0
    }

    login(userData)
  }

  const inputClass = (fieldName) => `
    input-field ${errors[fieldName] ? 'border-accent focus:border-accent focus:ring-accent' : ''}
  `

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="card">
        <div className="text-center mb-8">
          <h2 className="font-display text-2xl font-semibold text-text-primary mb-2">
            {isSignUp ? 'Join Echo' : 'Welcome Back'}
          </h2>
          <p className="text-text-secondary">
            {isSignUp 
              ? 'Create your peaceful digital space' 
              : 'Continue your mindful journey'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignUp && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={inputClass('name')}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="text-accent text-sm mt-1">{errors.name}</p>
              )}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={inputClass('email')}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-accent text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={inputClass('password')}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-accent text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {isSignUp && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={inputClass('confirmPassword')}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="text-accent text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full btn-primary"
          >
            {isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-text-secondary">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp)
                setFormData({ name: '', email: '', password: '', confirmPassword: '' })
                setErrors({})
              }}
              className="ml-2 text-primary hover:text-secondary font-medium transition-colors duration-200"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthForm