/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1B1C30',
        iris: '#5B4BFF',
        linen: '#F7F5F0',
        slate: '#71748A',
        saffron: '#EBA33B',
        'iris-tint': '#EAE7FF',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        caption: ['12px', { lineHeight: '1.25' }],
        'ui-text': ['16px', { lineHeight: '1.4' }],
        body: ['20px', { lineHeight: '1.4' }],
        subhead: ['24px', { lineHeight: '1.3' }],
        heading: ['28px', { lineHeight: '1.25' }],
        display: ['32px', { lineHeight: '1.2' }],
      },
    },
  },
  plugins: [],
}
