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
          red: '#C62026',
          redHover: '#A8191E',
          redLight: '#FDF2F2',
          redDark: '#8B1015',
          black: '#121316',
          cardDark: '#1A1C20',
          grayBorder: '#E5E7EB',
          cream: '#FAF8F5',
          gold: '#C5A059',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        script: ['"Alex Brush"', 'cursive'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
