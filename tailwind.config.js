/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: '#fdf7f0',
          100: '#fbeee0',
          200: '#f6d5b8',
          300: '#f0b890',
          400: '#e89968',
          500: '#d2691e',
          600: '#b8571a',
          700: '#9e4616',
          800: '#8b4513',
          900: '#5d2f0c',
        },
        cream: {
          50: '#fffbf7',
          100: '#fef7ef',
          200: '#fcecd7',
          300: '#f9e1bf',
          400: '#f6d6a7',
          500: '#f3cb8f',
          600: '#dab881',
          700: '#c1a573',
          800: '#a89265',
          900: '#8f7f57',
        }
      },
      fontFamily: {
        'coffee': ['Georgia', 'serif'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'spin-slow': 'spin 3s linear infinite',
      }
    },
  },
  plugins: [],
}