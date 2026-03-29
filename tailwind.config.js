/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: This must include the "./" and cover the app folder
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};