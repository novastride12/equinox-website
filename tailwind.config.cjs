/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        spaceBg: "#020617", // very dark navy
        spaceCard: "#020617",
        accent: "#38bdf8",
        accentSoft: "#0ea5e9",
      },
      fontFamily: {
        sans: ["system-ui", "ui-sans-serif", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
