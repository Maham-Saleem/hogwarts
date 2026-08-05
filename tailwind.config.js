/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        abyss: "#090B10",
        surface: "#15181F",
        "surface-light": "#1C2029",
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
        burgundy: {
          DEFAULT: "#5E1B24",
          light: "#7A2530",
          dark: "#4A1520",
        },
        forest: {
          DEFAULT: "#1F5033",
          light: "#2A6B44",
          dark: "#163A25",
        },
        moonlight: {
          DEFAULT: "#C9CDD3",
          dim: "#8A9099",
        },
        magic: {
          blue: "#4A9EFF",
          glow: "#6BB5FF",
          dim: "#2A5A8F",
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
        "glow-blue": "0 0 24px rgba(74, 158, 255, 0.3)",
        "glow-burgundy": "0 0 24px rgba(94, 27, 36, 0.4)",
        "inner-glow": "inset 0 0 30px rgba(212, 175, 55, 0.08)",
      },
      backgroundImage: {
        "radial-gold":
          "radial-gradient(circle at 50% 0%, rgba(212,175,55,0.15), transparent 60%)",
        "radial-blue":
          "radial-gradient(circle at 50% 50%, rgba(74,158,255,0.1), transparent 60%)",
        "vignette":
          "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)",
      },
      animation: {
        "float": "float 8s ease-in-out infinite",
        "float-slow": "float 12s ease-in-out infinite",
        "float-slower": "float 16s ease-in-out infinite",
        "flicker": "flicker 3s ease-in-out infinite",
        "flicker-fast": "flicker 1.8s ease-in-out infinite",
        "pulse-glow": "pulseGlow 4s ease-in-out infinite",
        "shimmer": "shimmer 2.2s linear infinite",
        "drift": "drift 20s linear infinite",
        "sway": "sway 6s ease-in-out infinite",
        "rain-fall": "rainFall 0.8s linear infinite",
        "lightning": "lightning 8s ease-in-out infinite",
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
        pulseGlow: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        drift: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100vw)" },
        },
        sway: {
          "0%, 100%": { transform: "rotate(-2deg)" },
          "50%": { transform: "rotate(2deg)" },
        },
        rainFall: {
          "0%": { transform: "translateY(-100vh)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateY(100vh)", opacity: "0" },
        },
        lightning: {
          "0%, 100%": { opacity: "0" },
          "4%": { opacity: "0" },
          "5%": { opacity: "0.8" },
          "6%": { opacity: "0" },
          "7%": { opacity: "0.4" },
          "8%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
