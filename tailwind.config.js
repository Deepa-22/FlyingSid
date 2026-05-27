/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#080808',
        surface: '#0e0e12',
        'surface-2': '#141419',
        rose: {
          fpv: '#f43f5e',
        },
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'cursive'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.2em',
        widest3: '0.35em',
      },
      keyframes: {
        grain: {
          '0%,100%': { transform: 'translate(0,0)' },
          '10%':     { transform: 'translate(-2%,-3%)' },
          '20%':     { transform: 'translate(3%,2%)' },
          '30%':     { transform: 'translate(-1%,3%)' },
          '40%':     { transform: 'translate(2%,-2%)' },
          '50%':     { transform: 'translate(-3%,1%)' },
          '60%':     { transform: 'translate(1%,-3%)' },
          '70%':     { transform: 'translate(-2%,2%)' },
          '80%':     { transform: 'translate(3%,-1%)' },
          '90%':     { transform: 'translate(-1%,-2%)' },
        },
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        grain:    'grain 0.12s steps(1) infinite',
        'fade-up': 'fade-up 0.6s ease-out forwards',
      },
    },
  },
  plugins: [],
}
