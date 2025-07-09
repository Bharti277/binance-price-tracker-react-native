/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#ccc",
        light: {
          100: "#f0f0f0",
          200: "#e0e0e0",
          300: "#d0d0d0",
        },
        dark: {
          100: "#333",
          200: "#444",
          300: "#555",
        },
      },
    },
  },
  plugins: [],
};
