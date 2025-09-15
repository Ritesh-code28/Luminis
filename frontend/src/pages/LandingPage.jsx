import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import CrowdfundingModal from '../components/CrowdfundingModal'

const LandingPage = () => {
  const [showCrowdfunding, setShowCrowdfunding] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            {/* Logo and Brand */}
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center text-white font-bold text-4xl shadow-peaceful mb-6">
                E
              </div>
              <h1 className="font-display text-5xl lg:text-7xl font-bold text-text-primary mb-4">
                Echo
              </h1>
              <p className="font-display text-xl lg:text-2xl text-text-secondary mb-8">
                Calm. Connected. You
              </p>
            </div>

            {/* Hero Content */}
            <div className="max-w-3xl mx-auto mb-12">
              <h2 className="text-2xl lg:text-4xl font-display font-semibold text-text-primary mb-6 leading-relaxed">
                Your peaceful digital sanctuary awaits
              </h2>
              <p className="text-lg text-text-secondary leading-relaxed mb-8">
                Join a mindful community where authentic connections flourish. 
                Share thoughts, discover wisdom, and find your inner calm in our 
                beautifully designed digital oasis.
              </p>
              
              <Link
                to="/auth"
                className="inline-flex items-center px-8 py-4 bg-primary text-white rounded-2xl font-medium text-lg hover:bg-primary/90 shadow-peaceful hover:shadow-soft transition-all duration-300 transform hover:scale-105"
              >
                Begin Your Journey
                <svg className="ml-3 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-secondary/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-accent/10 rounded-full blur-xl"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="font-display text-3xl font-semibold text-text-primary mb-4">
              Discover Your Digital Zen
            </h3>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Experience a social platform designed for mindfulness, creativity, and genuine human connection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center text-3xl mb-4">
                🌍
              </div>
              <h4 className="font-display text-xl font-semibold text-text-primary mb-2">World Chat</h4>
              <p className="text-text-secondary text-sm leading-relaxed">
                Connect with souls worldwide in our peaceful global conversation space.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-secondary/10 rounded-2xl flex items-center justify-center text-3xl mb-4">
                🌊
              </div>
              <h4 className="font-display text-xl font-semibold text-text-primary mb-2">Streams</h4>
              <p className="text-text-secondary text-sm leading-relaxed">
                Join topic-based communities that resonate with your interests and passions.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-accent/10 rounded-2xl flex items-center justify-center text-3xl mb-4">
                📝
              </div>
              <h4 className="font-display text-xl font-semibold text-text-primary mb-2">Mindful Blogging</h4>
              <p className="text-text-secondary text-sm leading-relaxed">
                Share your journey through thoughtful posts that inspire and heal.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-echo-mint/20 rounded-2xl flex items-center justify-center text-3xl mb-4">
                🏝️
              </div>
              <h4 className="font-display text-xl font-semibold text-text-primary mb-2">Your Oasis</h4>
              <p className="text-text-secondary text-sm leading-relaxed">
                Curate your personal space with custom blooms and peaceful aesthetics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="font-display text-3xl font-semibold text-text-primary mb-8">
            Built on Mindful Values
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="text-4xl">🕊️</div>
              <h4 className="font-display text-xl font-semibold text-text-primary">Peace First</h4>
              <p className="text-text-secondary text-sm leading-relaxed">
                Every interaction is designed to promote calm and reduce digital overwhelm.
              </p>
            </div>

            <div className="space-y-4">
              <div className="text-4xl">🤝</div>
              <h4 className="font-display text-xl font-semibold text-text-primary">Authentic Connection</h4>
              <p className="text-text-secondary text-sm leading-relaxed">
                Foster genuine relationships built on understanding and empathy.
              </p>
            </div>

            <div className="space-y-4">
              <div className="text-4xl">🌱</div>
              <h4 className="font-display text-xl font-semibold text-text-primary">Personal Growth</h4>
              <p className="text-text-secondary text-sm leading-relaxed">
                Nurture your inner development through meaningful conversations and reflection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-text-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                E
              </div>
              <div>
                <h4 className="font-display text-xl font-semibold text-white">Echo</h4>
                <p className="text-white/70 text-sm">Calm. Connected. You</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-center space-x-8 text-white/70 text-sm mb-6">
              <span>Privacy</span>
              <span>Terms</span>
              <span>Community Guidelines</span>
              <button
                onClick={() => setShowCrowdfunding(true)}
                className="text-white hover:text-primary transition-colors duration-200 font-medium underline underline-offset-2"
              >
                Crowdfunding
              </button>
              <span>Support</span>
            </div>
            
            <p className="text-white/50 text-xs">
              © 2024 Echo. Made with 💚 for mindful digital living.
            </p>
          </div>
        </div>
      </footer>

      {/* Crowdfunding Modal */}
      <CrowdfundingModal
        isOpen={showCrowdfunding}
        onClose={() => setShowCrowdfunding(false)}
      />
    </div>
  )
}

export default LandingPage