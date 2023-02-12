/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gunmetal: '#212D3B',
        pearl: '#E6DCC7',
        parchment: '#EFEBD1',
        rust: '#D87731',
      },
    },
  },
  plugins: [],
}
