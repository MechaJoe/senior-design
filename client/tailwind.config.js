/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        tan: '#CCB98E',
        gunmetal: '#03254E',
        porcelain: '#E9EFF3',
        pearl: '#E6DCC7',
        parchment: '#EFEBD1',
        rust: '#D87731',
      },
      fontFamily: {
        sans: ['Montserrat', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
}
