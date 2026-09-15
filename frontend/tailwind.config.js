/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Urbanist", "sans-serif"],
      },
      colors: {
        primary: "#ff9324",
      },
    },
  },
  plugins: [],
};
