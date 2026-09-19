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
          red: '#B91C1C',
          redHover: '#991B1B',
          redLight: '#FEF2F2',
          redDark: '#7F1D1D',
          black: '#0F172A',
          cardDark: '#1E293B',
          grayBorder: '#E2E8F0',
          cream: '#FAFBFD',
          gold: '#B45309',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        heading: ['"Outfit"', 'sans-serif'],
        serif: ['"Outfit"', 'system-ui', 'sans-serif'], // Redirige cualquier font-serif a Outfit moderna
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'soft-xs': '0 1px 2px 0 rgba(15, 23, 42, 0.03)',
        'soft': '0 2px 8px -2px rgba(15, 23, 42, 0.04), 0 8px 16px -4px rgba(15, 23, 42, 0.03)',
        'soft-md': '0 4px 12px -2px rgba(15, 23, 42, 0.05), 0 12px 24px -4px rgba(15, 23, 42, 0.04)',
        'soft-lg': '0 8px 24px -4px rgba(15, 23, 42, 0.06), 0 20px 32px -8px rgba(15, 23, 42, 0.04)',
        'glow-red': '0 0 20px -3px rgba(185, 28, 28, 0.15)',
      },
    },
  },
  plugins: [],
}
