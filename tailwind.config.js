/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        space: {
          black: "#000000", // true space black
          surface: "#050505", // subtle UI surfaces
          border: "#0a0a0a", // barely-visible borders
          text: "#e5e7eb", // primary text
          muted: "#9ca3af", // secondary text
          accent: "#22d3ee", // cyan glow
        },
      },
      fontFamily: {
        sans: ["system-ui", "ui-sans-serif", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
