import React from 'react'
import { mockData } from '../data/mockData'

const ColorPaletteSelector = ({ selectedColor, onColorSelect, className = "" }) => {
  const { colorPalettes } = mockData

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="font-display text-lg font-semibold text-text-primary">Choose Your Palette</h3>
      <p className="text-text-secondary text-sm">Select a color that resonates with your inner harmony.</p>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {colorPalettes.map((palette) => (
          <button
            key={palette.id}
            onClick={() => onColorSelect(palette)}
            className={`group p-4 rounded-2xl border-2 transition-all duration-200 hover:shadow-gentle ${
              selectedColor?.id === palette.id
                ? 'border-primary bg-primary/5 shadow-soft'
                : 'border-muted hover:border-primary/50 bg-surface'
            }`}
          >
            <div className="text-center">
              <div 
                className="w-12 h-12 mx-auto rounded-full mb-3 shadow-gentle group-hover:scale-110 transition-transform duration-200"
                style={{ backgroundColor: palette.color }}
              ></div>
              <h4 className="font-medium text-text-primary text-sm mb-1">
                {palette.name}
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                {palette.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      {selectedColor && (
        <div className="mt-6 p-4 bg-primary/5 rounded-2xl border border-primary/20">
          <div className="flex items-center space-x-3">
            <div 
              className="w-8 h-8 rounded-full shadow-gentle"
              style={{ backgroundColor: selectedColor.color }}
            ></div>
            <div>
              <h4 className="font-medium text-text-primary">
                Selected: {selectedColor.name}
              </h4>
              <p className="text-sm text-text-secondary">
                {selectedColor.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ColorPaletteSelector