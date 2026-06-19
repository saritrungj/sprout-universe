/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        sprout: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
        // Sprout-tinted neutral surfaces (replaces pure white/black)
        surface: {
          DEFAULT: "#f7fdf8",
          muted: "#eef8f1",
          dark: "#0d1710",
          "dark-muted": "#141f17",
        },
        ink: {
          DEFAULT: "#1a2e1e", // near-black, sprout-tinted
          muted: "#4b6255", // body text ≥4.5:1 on surface
          subtle: "#6b8c76", // placeholders, decorative labels
        },
      },
      fontFamily: {
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: [
          "var(--font-display)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      animation: {
        bloom: "bloom 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        bloom: {
          "0%": { transform: "scale(0.85)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
