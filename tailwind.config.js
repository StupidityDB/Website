/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        blurple: {
          DEFAULT: '#5865F2',
          dark: '#4752C4',
          darker: '#3C45A5',
        },
        surface: {
          0: '#111214',
          1: '#1e1f22',
          2: '#2b2d31',
          3: '#313338',
          4: '#383a40',
          5: '#4e5058',
        },
      },
      fontFamily: {
        sans: ['gg sans', 'system-ui', 'sans-serif'],
      },
      transitionProperty: {
        'bg': 'background-color',
      },
      keyframes: {
        'dialog-in': {
          '0%': { opacity: '0', transform: 'scale(0.96) translateY(8px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'dialog-in': 'dialog-in 0.18s ease-out',
        'fade-in': 'fade-in 0.15s ease-out',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}
