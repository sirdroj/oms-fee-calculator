/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        lexend: ['Lexend', 'system-ui'],
      },
      fontWeight: {
        '100': 100,
        '200': 200,
        '300': 300,
        '400': 400,
        '500': 500,
        '600': 600,
        '700': 700,
        '800': 800,
        '900': 900,
      },
    },
  },
  plugins: [],
  corePlugins: {
    appearance: false, // Disable appearance utility
  },
}

