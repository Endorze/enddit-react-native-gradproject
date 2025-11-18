/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        primaryDark: "#1d4ed8",
        background: "#020617",
        card: "#0f172a",
        text: "#e5e7eb",
        muted: "#64748b",
      },
    },
  },
  plugins: [],
};
