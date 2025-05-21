/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif']
      },
      colors: {
        primary: '#FFFFFF',
        primary_hover: '#e8f2ff',
        secondary: '#252525',
        secondary_hover: '#353535',
        tertiary: '#B0B0B0',
        link: '#00AEEF',
        link_hover: '#04759E',
        hover: '#F9FAFB',
        danger: '#cb131a',
        danger_hover: '#7F0301'
      },
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}
