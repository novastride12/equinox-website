/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // 👈 IMPORTANT
  ],
  theme: {
    extend: {
      colors: {
        // you can tweak these if you want
        spaceBg: "#020617",
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
