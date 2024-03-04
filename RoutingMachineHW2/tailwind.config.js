/** @type {import('tailwindcss').Config} */
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'custom-teal': '#71DFDE',
        'primary': '#0C1F34',
        'custom-white': '#FFFFFF',
        'custom-red': '#FF6B6B',
        'custom-gray': '#5A7D8E',
      },
    },
  },
  variants: {},
  plugins: [],
}


