/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FFA500',
        secondary: '#FFD700',
        dark: {
          DEFAULT: '#0A0A0A',
          card: '#121212',
          lighter: '#1A1A1A',
        },
        gray: {
          light: '#E0E0E0',
          medium: '#9E9E9E',
          dark: '#616161',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 4s infinite',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      }
    },
  },
  plugins: [],
};