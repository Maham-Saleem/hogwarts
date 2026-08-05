/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0D1117",
          900: "#0D1117",
          850: "#10151d",
          800: "#161B22",
          700: "#1c222c",
          600: "#242b36",
          500: "#2e3642",
        },
        gold: {
          DEFAULT: "#D4AF37",
          50: "#FBF6E4",
          100: "#F6ECC4",
          200: "#EDD989",
          300: "#E4C65E",
          400: "#D4AF37",
          500: "#B8962C",
          600: "#967A24",
          700: "#6E5A1B",
        },
        wine: {
          DEFAULT: "#6A1B1A",
          300: "#A63A38",
          400: "#8a2a28",
          500: "#6A1B1A",
          600: "#551615",
          700: "#411010",
        },
        emerald2: {
          DEFAULT: "#1E5631",
          200: "#3E8A5A",
          300: "#2F7A4B",
          400: "#1E5631",
          500: "#174426",
        },
        silver: {
          DEFAULT: "#C0C0C0",
          200: "#E6E6E6",
          300: "#D0D0D0",
          400: "#C0C0C0",
          500: "#A0A0A0",
        },
        beige: {
          DEFAULT: "#E8DCC4",
          100: "#F2EAD8",
          200: "#E8DCC4",
          300: "#D9C9A7",
        },
      },
      fontFamily: {
        heading: ["Cinzel", "serif"],
        display: ["Cormorant Garamond", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 24px rgba(212, 175, 55, 0.25)",
        "glow-sm": "0 0 12px rgba(212, 175, 55, 0.18)",
        "glow-wine": "0 0 24px rgba(106, 27, 26, 0.35)",
        panel: "0 20px 50px -12px rgba(0, 0, 0, 0.6)",
      },
      backgroundImage: {
        "radial-gold":
          "radial-gradient(circle at 50% 0%, rgba(212,175,55,0.12), transparent 60%)",
      },
      animation: {
        "float-slow": "float 8s ease-in-out infinite",
        "float-slower": "float 12s ease-in-out infinite",
        flicker: "flicker 3s ease-in-out infinite",
        "flicker-fast": "flicker 1.8s ease-in-out infinite",
        shimmer: "shimmer 2.2s linear infinite",
        "spin-slow": "spin 14s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0) translateX(0)" },
          "50%": { transform: "translateY(-18px) translateX(6px)" },
        },
        flicker: {
          "0%, 100%": { opacity: "1", transform: "scaleY(1)" },
          "30%": { opacity: "0.75", transform: "scaleY(0.96)" },
          "50%": { opacity: "0.9", transform: "scaleY(1.02)" },
          "70%": { opacity: "0.65", transform: "scaleY(0.97)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
      },
    },
  },
  plugins: [],
};
