import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../App'
import BloomSelector from '../components/BloomSelector'
import ColorPaletteSelector from '../components/ColorPaletteSelector'

const BloomCustomizationPage = () => {
  const { currentUser, login } = useContext(UserContext)
  const [selectedBloom, setSelectedBloom] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const navigate = useNavigate()

  const handleSave = () => {
    if (selectedBloom && selectedColor) {
      // Update user with selected bloom and color
      const updatedUser = {
        ...currentUser,
        bloom: selectedBloom.emoji,
        bloomStyle: selectedBloom.id,
        colorPalette: selectedColor.id
      }
      
      login(updatedUser)
      navigate('/world-chat')
    }
  }

  const canSave = selectedBloom && selectedColor

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold text-text-primary mb-4">
            Customize Your Bloom
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Your bloom represents your digital essence. Choose the style and colors 
            that resonate with your inner self and reflect your peaceful energy.
          </p>
        </div>

        {/* Customization Sections */}
        <div className="space-y-12">
          {/* Bloom Selection */}
          <div className="card">
            <BloomSelector
              selectedBloom={selectedBloom}
              onBloomSelect={setSelectedBloom}
            />
          </div>

          {/* Color Selection */}
          <div className="card">
            <ColorPaletteSelector
              selectedColor={selectedColor}
              onColorSelect={setSelectedColor}
            />
          </div>

          {/* Preview Section */}
          {(selectedBloom || selectedColor) && (
            <div className="card">
              <h3 className="font-display text-lg font-semibold text-text-primary mb-4">
                Preview Your Bloom
              </h3>
              
              <div className="flex items-center space-x-6 p-6 bg-gradient-to-r from-background to-surface rounded-2xl border border-muted">
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center text-3xl shadow-gentle"
                  style={{ 
                    backgroundColor: selectedColor ? `${selectedColor.color}20` : '#f3f4f6',
                    borderColor: selectedColor?.color || '#d1d5db',
                    borderWidth: '2px'
                  }}
                >
                  {selectedBloom?.emoji || '🌸'}
                </div>
                
                <div className="flex-1">
                  <h4 className="font-display text-xl font-semibold text-text-primary mb-1">
                    {currentUser?.name || 'Your Name'}
                  </h4>
                  <p className="text-text-secondary text-sm mb-2">
                    {selectedBloom ? `${selectedBloom.name} Bloom` : 'Select your bloom style'}
                  </p>
                  <p className="text-text-secondary text-sm">
                    {selectedColor ? `${selectedColor.name} Palette` : 'Choose your color palette'}
                  </p>
                </div>
                
                {selectedColor && (
                  <div 
                    className="w-16 h-16 rounded-2xl shadow-gentle"
                    style={{ backgroundColor: selectedColor.color }}
                  ></div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-12 pt-8 border-t border-muted">
          <button
            onClick={() => navigate('/world-chat')}
            className="btn-outline"
          >
            Skip for Now
          </button>
          
          <button
            onClick={handleSave}
            disabled={!canSave}
            className={`btn-primary ${
              !canSave ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-soft'
            }`}
          >
            Save & Continue
          </button>
        </div>

        {/* Helper Text */}
        <div className="text-center mt-6">
          <p className="text-sm text-text-secondary">
            Don't worry! You can always change your bloom and colors later in your Oasis.
          </p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="fixed top-20 right-10 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none"></div>
      <div className="fixed bottom-20 left-10 w-32 h-32 bg-secondary/5 rounded-full blur-2xl pointer-events-none"></div>
    </div>
  )
}

export default BloomCustomizationPage