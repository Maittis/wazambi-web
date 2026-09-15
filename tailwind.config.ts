import type { Config } from "tailwindcss";

// Wazambi Gold — the official brand token, using the exact gold from the Wazambi logo (#FFC400)
const brandGold = {
  DEFAULT: "#FFC400",
  dark: "#E6A900",
  // Readable gold for text/icons on light backgrounds (exact #FFC400 fails contrast on white)
  deep: "#B8860B",
};

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0A1633",
          light: "#12224A",
          dark: "#060D20",
        },
        ink: {
          DEFAULT: "#101828",
          blue: "#0A1838",
        },
        electric: {
          blue: "#1E5EFF",
          dark: "#1440B8",
        },
        gold: brandGold,
        "wazambi-gold": brandGold,
        flame: {
          DEFAULT: "#FF7A00",
          dark: "#E05E00",
        },
        alert: "#FF3B30",
        paper: "#EFEFEE",
      },
      fontFamily: {
        poppins: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      screens: {
        "md995": "995px",
      },
      boxShadow: {
        card: "0 0 32px rgba(0,0,0,0.05)",
        nav: "0 8px 16px 5px rgba(0,0,0,0.1)",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.7s ease-in-out both",
      },
    },
  },
  plugins: [],
};

export default config;