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
        buttonblue: '#162368',
        buttongreen: '#16681E',
        cardstock: '#F5F3EE',
        tan: '#CCB98E',
        gunmetal: '#03254E',
        porcelain: '#E9EFF3',
        pearl: '#E6DCC7',
        parchment: '#EFEBD1',
        rust: '#D87731',
        skyblue: '#227FEC',
        skybluelight: '#227FEC30',
        gray: '#DFE0DF',
      },
      fontFamily: {
        sans: ['Montserrat', ...defaultTheme.fontFamily.sans],
      },
      fontWeight: {
        bold: '1000',
      },
      screens: {
        laptop: '1300px',
      },
    },
  },
  plugins: [],
}
