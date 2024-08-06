/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors:{
        primary:"#000000",
        secondary:"#BD6A33",
        fieldfill:"#1C1C1C"
      }
    },
  },
  plugins: [],
}

