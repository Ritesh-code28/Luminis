import React from 'react'
import { mockData } from '../data/mockData'

const BloomSelector = ({ selectedBloom, onBloomSelect, className = "" }) => {
  const { avatarStyles } = mockData

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="font-display text-lg font-semibold text-text-primary">Choose Your Bloom</h3>
      <p className="text-text-secondary text-sm">Your bloom represents your digital essence and personality.</p>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {avatarStyles.map((style) => (
          <button
            key={style.id}
            onClick={() => onBloomSelect(style)}
            className={`group p-4 rounded-2xl border-2 transition-all duration-200 hover:shadow-gentle ${
              selectedBloom?.id === style.id
                ? 'border-primary bg-primary/5 shadow-soft'
                : 'border-muted hover:border-primary/50 bg-surface'
            }`}
          >
            <div className="text-center">
              <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-200">
                {style.emoji}
              </div>
              <h4 className="font-medium text-text-primary text-sm mb-1">
                {style.name}
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                {style.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      {selectedBloom && (
        <div className="mt-6 p-4 bg-primary/5 rounded-2xl border border-primary/20">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{selectedBloom.emoji}</div>
            <div>
              <h4 className="font-medium text-text-primary">
                Selected: {selectedBloom.name}
              </h4>
              <p className="text-sm text-text-secondary">
                {selectedBloom.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BloomSelector