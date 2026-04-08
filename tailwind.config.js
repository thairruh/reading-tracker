/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: This must include the "./" and cover the app folder
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        'light-pink': '#FBF7F6',
        'brown': '#472A2A',
        'desk': '#FAECEC',
        'desk-shading': '#E6C4C4',
        'under-desk': '#967D80',
        'bulletin-board': '#B9A394',
        'bulletin-border': '#E0CEBA',
        'peach': '#EEDBD3',
        'btn-border': '#684D4C',

      },
    },
  },
  plugins: [],
};
