/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#8B5CF6",
          hover: "#7C3AED",
          soft: "#A703E7",
        },
        surface: {
          light: "#FFFFFF",
          dark: "#0B071E",
          "dark-elevated": "#181330",
          "dark-hover": "#1A1534",
        },
        bg: {
          light: "#F8FAFC",
          dark: "#030712",
        },
        text: {
          light: "#111827",
          dark: "#F9FAFB",
        },
      },
      fontFamily: {
        sans: ['"Open Sans"', "sans-serif"],
        title: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
