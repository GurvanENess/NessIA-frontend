/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto", "system-ui", "sans-serif"],
        coolvetica: ['"Coolvetica"', "sans-serif"],
        commissioner: ['"Commissioner"', "sans-serif"],
      },
      screens: {
        xs: "460px",
      },
    },
  },
  plugins: [],
};
