/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/game/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'blood-red': '#8B0000',
        'cell-red': '#FF5555',
        'bacteria-green': '#00AA00',
        'nutrient-yellow': '#FFDD00',
        'immune-blue': '#0055AA',
      },
    },
  },
  plugins: [],
} 