const { sharedTheme } = require('@daily-apps/shared/styles/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../packages/shared/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: sharedTheme.colors,
      fontFamily: sharedTheme.fontFamily,
    },
  },
  plugins: [],
};
