/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Stone - the castle itself
        stone: {
          DEFAULT: "#3A3632",
          dark: "#1E1C1A",
          deeper: "#141210",
          warm: "#4A4440",
          cool: "#3E3D3B",
          light: "#5A5550",
          pale: "#6A6560",
          granite: "#2C2A28",
          limestone: "#4A4540",
          slate: "#353330",
        },
        // Wood - furniture, doors, panels
        oak: {
          DEFAULT: "#3D2B1F",
          light: "#5C3D2E",
          dark: "#2A1D14",
          polished: "#6B4A35",
          grain: "rgba(0,0,0,0.03)",
        },
        walnut: { DEFAULT: "#4A3728", dark: "#2E221A", light: "#5C4A3A" },
        mahogany: { DEFAULT: "#4A1A1A", dark: "#3A1212", light: "#6A2A2A" },
        // Metal - hardware, fixtures
        brass: { DEFAULT: "#B8860B", dim: "#8B6914", polished: "#D4AF37", tarnished: "#7A5A10" },
        iron: { DEFAULT: "#4A4A4A", dark: "#2A2A2A", rust: "#6A3A2A" },
        copper: { DEFAULT: "#8B5A2B", patina: "#3A6A5A" },
        // Parchment & paper
        parchment: { DEFAULT: "#E8DCC4", dark: "#C9B896", light: "#F2EAD8", aged: "#D4C4A0" },
        // Leather
        leather: { DEFAULT: "#5A3A2A", dark: "#3A2A1A", light: "#7A5A4A" },
        // Fabric
        velvet: { burgundy: "#5E1B24", green: "#1F3A2A", blue: "#1A2A4A" },
        wool: { DEFAULT: "#4A4540", dark: "#3A3530" },
        // Light sources
        candlelight: { DEFAULT: "#FFD54F", warm: "#FFB300", dim: "#E6A100" },
        firelight: { DEFAULT: "#FF8F00", warm: "#FF6D00", dim: "#CC7200" },
        moonlight: { DEFAULT: "#8A9AAA", cool: "#6A7A8A", warm: "#A0A8B0" },
        sunlight: { DEFAULT: "#F5DEB3", throughGlass: "rgba(212,175,55,0.15)" },
        // Accent
        gold: { DEFAULT: "#D4AF37", dim: "#B8962C", bright: "#E8C84A", antique: "#A08520" },
        burgundy: { DEFAULT: "#5E1B24", light: "#7A2530", dark: "#4A1520" },
        forest: { DEFAULT: "#1F3A2A", light: "#2A4A3A", dark: "#152A1A" },
        // Atmosphere
        abyss: { DEFAULT: "#0E0D0B", warm: "#12100E", cool: "#0C0D0F" },
        night: { DEFAULT: "#0A0908", warm: "#0E0C0A" },
        shadow: { DEFAULT: "rgba(0,0,0,0.6)", deep: "rgba(0,0,0,0.85)" },
      },
      fontFamily: {
        cinzel: ["Cinzel", "serif"],
        decorative: ["Cinzel Decorative", "Cinzel", "serif"],
        cormorant: ["Cormorant Garamond", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        // Architectural shadows
        "arch": "inset 0 -40px 60px -20px rgba(0,0,0,0.5)",
        "arch-top": "inset 0 40px 60px -20px rgba(0,0,0,0.4)",
        "corridor": "inset 0 0 80px rgba(0,0,0,0.6)",
        // Material shadows
        "wood": "0 4px 16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
        "wood-deep": "0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.03)",
        "stone": "0 2px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.02)",
        "brass": "0 1px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
        "parchment": "0 2px 12px rgba(0,0,0,0.4), 0 0 0 1px rgba(139,105,20,0.12)",
        // Light effects (subtle)
        "candle": "0 0 20px rgba(255,213,79,0.08), 0 0 60px rgba(255,179,0,0.04)",
        "candle-strong": "0 0 30px rgba(255,213,79,0.12), 0 0 80px rgba(255,179,0,0.06)",
        "fireplace": "0 0 40px rgba(255,143,0,0.06), 0 -20px 60px rgba(255,109,0,0.04)",
        "moon": "0 0 30px rgba(138,154,170,0.06)",
        "stained-glass": "0 0 40px rgba(212,175,55,0.05)",
        // Depth
        "raised": "0 1px 3px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.2)",
        "sunk": "inset 0 2px 6px rgba(0,0,0,0.3), inset 0 0 2px rgba(0,0,0,0.2)",
      },
      backgroundImage: {
        // Architectural gradients
        "vault-dark": "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.5) 100%)",
        "vault-top": "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 40%)",
        "vault-bottom": "linear-gradient(0deg, rgba(0,0,0,0.6) 0%, transparent 35%)",
        "corridor-depth": "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.4) 100%)",
        // Material textures
        "wood-grain": "repeating-linear-gradient(87deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px)",
        "stone-texture": "repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(0,0,0,0.015) 40px, rgba(0,0,0,0.015) 41px)",
        "parchment-texture": "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.008) 3px, rgba(0,0,0,0.008) 4px)",
        // Light effects
        "candle-glow": "radial-gradient(ellipse at 50% 30%, rgba(255,213,79,0.06), transparent 60%)",
        "fireplace-glow": "radial-gradient(ellipse at 50% 100%, rgba(255,143,0,0.08), transparent 50%)",
        "moonbeam": "radial-gradient(ellipse at 30% 20%, rgba(138,154,170,0.04), transparent 40%)",
        "stained-glass-light": "radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.08), transparent 50%)",
        // Vignettes
        "vignette": "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)",
        "vignette-deep": "radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.75) 100%)",
        "vignette-top": "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 30%)",
      },
      animation: {
        // Environmental - extremely slow, almost imperceptible
        "dust-fall": "dustFall 25s linear infinite",
        "dust-drift": "dustDrift 40s ease-in-out infinite",
        "candle-flicker": "candleFlicker 6s ease-in-out infinite",
        "candle-sway": "candleSway 8s ease-in-out infinite",
        "fire-dance": "fireDance 4s ease-in-out infinite",
        "fog-drift": "fogDrift 60s linear infinite",
        "fog-drift-slow": "fogDrift 90s linear infinite",
        "shadow-creep": "shadowCreep 20s ease-in-out infinite",
        "banner-sway": "bannerSway 12s ease-in-out infinite",
        "banner-sway-slow": "bannerSway 18s ease-in-out infinite",
        "portrait-blink": "portraitBlink 12s ease-in-out infinite",
        "stair-shift": "stairShift 30s ease-in-out infinite",
        // UI transitions - cinematic
        "fade-in-slow": "fadeIn 2s ease-out forwards",
        "fade-in-up-slow": "fadeInUp 2.5s ease-out forwards",
        "curtain-open": "curtainOpen 3s ease-out forwards",
        "door-open": "doorOpen 2s ease-out forwards",
        "parchment-unfurl": "parchmentUnfurl 1.5s ease-out forwards",
      },
      keyframes: {
        dustFall: {
          "0%": { transform: "translateY(-5vh) translateX(0)", opacity: "0" },
          "5%": { opacity: "0.4" },
          "95%": { opacity: "0.4" },
          "100%": { transform: "translateY(100vh) translateX(20px)", opacity: "0" },
        },
        dustDrift: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "25%": { transform: "translate(10px, -5px)" },
          "50%": { transform: "translate(-5px, 3px)" },
          "75%": { transform: "translate(8px, 2px)" },
        },
        candleFlicker: {
          "0%, 100%": { opacity: "0.7", filter: "brightness(1)" },
          "15%": { opacity: "0.72", filter: "brightness(1.02)" },
          "30%": { opacity: "0.68", filter: "brightness(0.98)" },
          "50%": { opacity: "0.75", filter: "brightness(1.04)" },
          "70%": { opacity: "0.65", filter: "brightness(0.96)" },
          "85%": { opacity: "0.73", filter: "brightness(1.01)" },
        },
        candleSway: {
          "0%, 100%": { transform: "rotate(-0.3deg) translateX(0)" },
          "50%": { transform: "rotate(0.3deg) translateX(0.5px)" },
        },
        fireDance: {
          "0%, 100%": { transform: "scaleY(1) scaleX(1)", opacity: "0.7" },
          "25%": { transform: "scaleY(1.02) scaleX(0.98)", opacity: "0.72" },
          "50%": { transform: "scaleY(0.98) scaleX(1.02)", opacity: "0.68" },
          "75%": { transform: "scaleY(1.01) scaleX(0.99)", opacity: "0.71" },
        },
        fogDrift: {
          "0%": { transform: "translateX(-20%)" },
          "100%": { transform: "translateX(20%)" },
        },
        shadowCreep: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "0.65" },
        },
        bannerSway: {
          "0%, 100%": { transform: "rotate(-0.5deg) skewX(-0.2deg)" },
          "50%": { transform: "rotate(0.5deg) skewX(0.2deg)" },
        },
        portraitBlink: {
          "0%, 45%, 55%, 100%": { transform: "scaleY(1)" },
          "50%": { transform: "scaleY(0.05)" },
        },
        stairShift: {
          "0%, 100%": { transform: "translateX(0) rotate(0deg)" },
          "50%": { transform: "translateX(3px) rotate(0.2deg)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        curtainOpen: {
          "0%": { transform: "scaleX(1)" },
          "100%": { transform: "scaleX(0)" },
        },
        doorOpen: {
          "0%": { transform: "perspective(800px) rotateY(0deg)" },
          "100%": { transform: "perspective(800px) rotateY(-70deg)" },
        },
        parchmentUnfurl: {
          "0%": { transform: "scaleY(0)", opacity: "0" },
          "100%": { transform: "scaleY(1)", opacity: "1" },
        },
      },
      transitionDuration: {
        "600": "600ms",
        "800": "800ms",
        "1200": "1200ms",
        "2000": "2000ms",
        "3000": "3000ms",
      },
    },
  },
  plugins: [],
};
