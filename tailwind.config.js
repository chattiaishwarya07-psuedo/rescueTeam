/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0A182B',
          900: '#0F223B',
          800: '#142D4E', // Primary navy
          700: '#1D3B63',
          600: '#284E7E',
          100: '#E2E9F3',
          50: '#F0F4FA',
        },
        teal: {
          brand: '#087F8C', // Teal actions
          hover: '#066974',
          light: '#E6F4F6',
          border: '#B2E0E6',
        },
        opbg: '#F5F8FC', // Background
        card: '#FFFFFF', // Cards
        secondary: '#526176', // Secondary text
        caution: {
          DEFAULT: '#B45309', // Caution / review
          bg: '#FEF3C7',
          border: '#FCD34D',
        },
        critical: {
          DEFAULT: '#B42318', // Critical hazard
          bg: '#FEE2E2',
          border: '#FCA5A5',
        },
        resolved: {
          DEFAULT: '#237A4B', // Confirmed resolution
          bg: '#DCFCE7',
          border: '#86EFAC',
        },
        testbanner: {
          DEFAULT: '#FFF0D6', // Test banner
          text: '#92400E',
          border: '#FDE68A',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Roboto Mono', 'ui-monospace', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
