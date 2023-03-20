/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line import/no-extraneous-dependencies
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
        skyblue: '#227FEC20',
        lilac: '#D9DFFF',
        powderblue: '#E7F5FF',
      },
      fontFamily: {
        sans: ['Montserrat', ...defaultTheme.fontFamily.sans],
      },
      fontWeight: {
        bold: '1000',
      },
    },
  },
  plugins: [],
}
