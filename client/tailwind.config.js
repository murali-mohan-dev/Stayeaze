/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0B132B',       // Deep rich navy
          navy: '#1C2541',       // Navy blue
          gold: '#C5A059',       // Premium champagne gold
          'gold-light': '#E6CA85',
          'gold-dark': '#9A7B38',
          cream: '#FAF7F2',      // Warm luxury background
          sand: '#F3EFE6',       // Warm beige card background
          accent: '#10B981',     // Emerald accent
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 10px 30px -5px rgba(28, 37, 65, 0.08), 0 4px 6px -2px rgba(28, 37, 65, 0.04)',
        'luxury-hover': '0 20px 40px -10px rgba(28, 37, 65, 0.15), 0 8px 12px -4px rgba(28, 37, 65, 0.06)',
        'gold-glow': '0 0 25px rgba(197, 160, 89, 0.35)',
      }
    },
  },
  plugins: [],
}
