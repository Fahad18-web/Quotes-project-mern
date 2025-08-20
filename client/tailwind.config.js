/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#8b5cf6', // violet-500
        surface: '#0b0f1a'
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
      },
      backgroundImage: {
        'glass-gradient': 'radial-gradient( circle at 10% 20%, rgba(120,119,198,0.15) 0%, rgba(0,0,0,0.05) 30%, rgba(120,119,198,0.2) 100% )'
      }
    }
  },
  plugins: []
}
