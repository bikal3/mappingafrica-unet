// The slate scale reads from CSS variables (see src/index.css), so the same
// slate-* classes render the dark or the light palette depending on the theme.
const slate = (shade) => `rgb(var(--slate-${shade}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        slate: {
          50: slate(50),
          100: slate(100),
          200: slate(200),
          300: slate(300),
          400: slate(400),
          500: slate(500),
          600: slate(600),
          700: slate(700),
          800: slate(800),
          900: slate(900),
          950: slate(950),
        },
      },
    },
  },
  plugins: [],
}
