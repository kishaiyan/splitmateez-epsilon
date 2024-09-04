/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors:{
        primary:"#212121",
        secondary:"#BD6A33",
        fieldfill:"#1C1C1C"
      }
    },
  },
  plugins: [],
}

