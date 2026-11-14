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
          dark: '#14143A',
          hover: '#2E3180',
          primary: '#14143A',
          accent: '#6E76E0',
          accentHover: '#5C64D4',
          tint: '#F2F3FC',
          canvas: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E5E7EB',
          subtle: '#64748B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        montserrat: ['Montserrat', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(20, 20, 58, 0.04), 0 1px 2px -1px rgba(20, 20, 58, 0.04)',
        'card': '0 4px 16px -2px rgba(20, 20, 58, 0.05), 0 2px 6px -2px rgba(20, 20, 58, 0.03)',
        'elevated': '0 10px 25px -5px rgba(20, 20, 58, 0.08), 0 8px 10px -6px rgba(20, 20, 58, 0.04)',
      }
    },
  },
  plugins: [],
}
