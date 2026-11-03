/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Inter"', 'sans-serif'],
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
        inter: ['"Inter"', 'sans-serif'],
      },
      colors: {
        obsidian: '#0B0F17',      // Primary Canvas
        slateCard: '#1E293B',     // Elevated Slate Surface / Cards
        saharaGold: '#E69D2B',    // Brand Accent Gold
        saharaGoldLight: '#F6C467',
        crispWhite: '#FFFFFF',    // Crisp White
        slateGray: '#94A3B8',     // Muted Gray / Badges
        softSlateBg: '#EBF1F8',   // Light Slate Card Tint
        softLavenderBg: '#EEF2FA' // Light Lavender Tint
      }
    },
  },
  plugins: [],
}

