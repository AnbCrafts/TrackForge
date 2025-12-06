/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      colors: {
        bgPrimary: "#0A0A0C",
        bgSecondary: "#0D0F14",
        bgCard: "#111318",

        neonBlue: "#00E5FF",
        neonBlueBright: "#1AFFFF",
        neonBlueSoft: "#0BD7F2",

        textPrimary: "#E6F7FF",
        textSecondary: "#A3B8C2",
        textMuted: "#6C7A85",

        borderColor: "#24272E",
      },
    },
  },
  plugins: [],
}
