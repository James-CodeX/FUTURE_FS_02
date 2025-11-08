import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5fbff',
          100: '#e6f2ff',
          200: '#cce6ff',
          300: '#99ccff',
          400: '#4da6ff',
          500: '#1e90ff',
          600: '#166fe6',
          700: '#0f52b3',
          800: '#0a3a80',
          900: '#04254d'
        }
      }
    }
  },
  plugins: []
};
export default config;
