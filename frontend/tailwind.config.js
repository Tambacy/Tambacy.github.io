/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#e8dcc8',
        card: '#faf3e3',
        accent: '#c0392b',
        accent2: '#8b3a2a',
        accentGlow: '#d94f3d',
        text: '#3d2b1f',
        text2: '#6b4d3a',
        muted: '#9e7e6a',
        success: '#6a9b4c',
        warning: '#c49b3a',
        border: '#d4c4a8',
        borderStrong: '#c4ad8a',
      },
      fontFamily: {
        display: ['Bebas Neue', 'cursive'],
        body: ['Noto Sans SC', 'sans-serif'],
        mono: ['Rajdhani', 'sans-serif'],
      },
    },
  },
  plugins: [],
}