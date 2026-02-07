/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#7C5CFF",
        secondary: "#FF4FD8",
        dark: "#0B0B2A",
        glass: "rgba(255,255,255,0.06)",
      },
      backdropBlur: {
        xl: "20px",
      },
    },
  },
  plugins: [],
}
