/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0E7F41",
        "primary-light": "#E5FFE5",
        "primary-dark": "#0a5f31",
        secondary: "#2959A6",
        "secondary-light": "#E5F0FF",
        "secondary-dark": "#0066CC",
        surface: "#F3F6FF",
        success: "#0E7F41",
        "success-light": "#E5FFE5",
        warning: "#EBC600",
        "warning-light": "#FFFACD",
        error: "#CC0000",
        "error-light": "#FFE5E5",
        info: "#0066CC",
        "info-light": "#E5F0FF",
        black: {
          DEFAULT: "#000",
          100: "#1E1E2D",
          200: "#232533",
        },
        // Semantic surface/border/text tokens — one light+dark pair each, so
        // components use bg-surface-card / border-line / text-fg instead of
        // hardcoding bg-white / border-gray-200 / text-gray-700 and needing a
        // dark: twin at every call site. Dark tiers live in style.css as CSS
        // custom properties (see the `.dark` block) since this project isn't
        // on Tailwind v4's CSS-first @theme yet.
        "surface-page": "var(--surface-page)",
        "surface-card": "var(--surface-card)",
        "surface-panel": "var(--surface-panel)",
        "surface-hover": "var(--surface-hover)",
        "surface-field": "var(--surface-field)",
        line: "var(--line)",
        "line-strong": "var(--line-strong)",
        fg: "var(--fg)",
        "fg-muted": "var(--fg-muted)",
        "fg-faint": "var(--fg-faint)",
      },
      fontFamily :{
        ithin: ["Inter-Thin", "sans-serif"],
        iextralight: ["Inter-ExtraLight", "sans-serif"],
        ilight: ["Inter-Light", "sans-serif"],
        iregular: ["Inter-Regular", "sans-serif"],
        imedium: ["Inter-Medium", "sans-serif"],
        isemibold: ["Inter-SemiBold", "sans-serif"],
        ibold: ["Inter-Bold", "sans-serif"],
        iextrabold: ["Inter-ExtraBold", "sans-serif"],
        iblack: ["Inter-Black", "sans-serif"],
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}

