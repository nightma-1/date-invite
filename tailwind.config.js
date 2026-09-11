/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Poppins"', 'sans-serif'],
        body: ['"Nunito"', 'sans-serif'],
      },
      colors: {
        blush: {
          50: '#fff5f8',
          100: '#ffe4ec',
          200: '#ffd0e0',
          300: '#ffb3cd',
          400: '#ff85ab',
          500: '#ff5c8a',
          600: '#f13d70',
          700: '#cf2d5b',
        },
        lilac: {
          100: '#f1e7ff',
          200: '#e0c3fc',
          300: '#c9a3f5',
          400: '#ab7ce8',
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'pop-in': 'popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '50%': { transform: 'translateY(-18px) translateX(6px)' },
        },
        popIn: {
          '0%': { opacity: 0, transform: 'scale(0.85) translateY(10px)' },
          '100%': { opacity: 1, transform: 'scale(1) translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
