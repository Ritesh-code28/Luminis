import React from 'react'
import AuthForm from '../components/AuthForm'

const AuthPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-peaceful mb-6">
            E
          </div>
          <h1 className="font-display text-3xl font-bold text-text-primary mb-2">
            Welcome to Echo
          </h1>
          <p className="text-text-secondary">
            Your journey to mindful digital connection begins here
          </p>
        </div>

        {/* Auth Form */}
        <AuthForm />

        {/* Additional Info */}
        <div className="text-center text-sm text-text-secondary">
          <p className="mb-4">
            By joining Echo, you agree to our community guidelines of respect, 
            kindness, and mindful interaction.
          </p>
          <div className="flex items-center justify-center space-x-6 text-xs">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>Community Guidelines</span>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="fixed top-10 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-10 right-10 w-40 h-40 bg-secondary/5 rounded-full blur-3xl pointer-events-none"></div>
    </div>
  )
}

export default AuthPage