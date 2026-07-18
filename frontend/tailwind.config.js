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
        }
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

