/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'echo-sage': '#87A96B',
        'echo-lavender': '#B19CD9',
        'echo-blush': '#F4A7A7',
        'echo-mint': '#A8E6CF',
        'echo-cream': '#FFF5E6',
        'echo-silver': '#E8E8E8',
        'echo-charcoal': '#4A4A4A',
        'echo-deep-teal': '#2C5F5D',
        'primary': '#87A96B',
        'secondary': '#B19CD9',
        'accent': '#F4A7A7',
        'background': '#FFF5E6',
        'surface': '#FFFFFF',
        'muted': '#E8E8E8',
        'text-primary': '#4A4A4A',
        'text-secondary': '#2C5F5D'
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Playfair Display', 'serif']
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem'
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem'
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'gentle': '0 2px 10px rgba(0, 0, 0, 0.06)',
        'peaceful': '0 8px 40px rgba(135, 169, 107, 0.15)'
      }
    },
  },
  plugins: [],
}