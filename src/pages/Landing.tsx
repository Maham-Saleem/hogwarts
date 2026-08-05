import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Rain } from "@/components/ambient/Rain";
import { Fog } from "@/components/ambient/Fog";
import { Lightning } from "@/components/ambient/Lightning";
import { Stars } from "@/components/ambient/Stars";

export function Landing() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<"intro" | "text" | "entering" | "entered">("intro");
  const [showText, setShowText] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("text"), 2000);
    const t2 = setTimeout(() => setShowText(true), 2500);
    const t3 = setTimeout(() => setShowButton(true), 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const handleBeginJourney = useCallback(() => {
    setPhase("entering");
    setTimeout(() => {
      setPhase("entered");
      navigate("/hub");
    }, 2000);
  }, [navigate]);

  return (
    <div className="relative min-h-screen bg-abyss overflow-hidden">
      {/* Night sky */}
      <div className="absolute inset-0">
        <Stars count={150} />
        <Rain intensity={60} />
        <Fog layers={4} />
        <Lightning />
      </div>

      {/* Castle silhouette */}
      <div className="absolute inset-0 flex items-end justify-center">
        <svg
          viewBox="0 0 800 400"
          className="w-full max-w-5xl h-auto opacity-30"
          style={{ filter: "drop-shadow(0 0 40px rgba(212,175,55,0.1))" }}
        >
          {/* Castle body */}
          <rect x="200" y="180" width="400" height="220" fill="#0D1117" />
          {/* Towers */}
          <rect x="150" y="120" width="60" height="280" fill="#0D1117" />
          <rect x="590" y="120" width="60" height="280" fill="#0D1117" />
          <rect x="350" y="80" width="100" height="320" fill="#0D1117" />
          {/* Tower tops */}
          <polygon points="150,120 180,70 210,120" fill="#0D1117" />
          <polygon points="590,120 620,70 650,120" fill="#0D1117" />
          <polygon points="350,80 400,20 450,80" fill="#0D1117" />
          {/* Windows */}
          <rect x="220" y="200" width="15" height="25" rx="7" fill="#D4AF3720" />
          <rect x="260" y="200" width="15" height="25" rx="7" fill="#D4AF3715" />
          <rect x="300" y="200" width="15" height="25" rx="7" fill="#D4AF3720" />
          <rect x="340" y="200" width="15" height="25" rx="7" fill="#D4AF3710" />
          <rect x="380" y="200" width="15" height="25" rx="7" fill="#D4AF3718" />
          <rect x="420" y="200" width="15" height="25" rx="7" fill="#D4AF3720" />
          <rect x="460" y="200" width="15" height="25" rx="7" fill="#D4AF3715" />
          <rect x="500" y="200" width="15" height="25" rx="7" fill="#D4AF3720" />
          <rect x="540" y="200" width="15" height="25" rx="7" fill="#D4AF3710" />
          {/* Upper windows */}
          <rect x="240" y="260" width="12" height="20" rx="6" fill="#D4AF3712" />
          <rect x="280" y="260" width="12" height="20" rx="6" fill="#D4AF3718" />
          <rect x="320" y="260" width="12" height="20" rx="6" fill="#D4AF3712" />
          <rect x="360" y="260" width="12" height="20" rx="6" fill="#D4AF3715" />
          <rect x="400" y="260" width="12" height="20" rx="6" fill="#D4AF3712" />
          <rect x="440" y="260" width="12" height="20" rx="6" fill="#D4AF3718" />
          <rect x="480" y="260" width="12" height="20" rx="6" fill="#D4AF3712" />
          <rect x="520" y="260" width="12" height="20" rx="6" fill="#D4AF3715" />
          {/* Door */}
          <rect x="375" y="340" width="50" height="60" rx="25" fill="#1a1510" stroke="#D4AF3720" strokeWidth="1" />
          {/* Battlements */}
          {[200, 220, 240, 260, 280, 300, 320, 340, 360, 380, 400, 420, 440, 460, 480, 500, 520, 540, 560, 580].map((x) => (
            <rect key={x} x={x} y="170" width="10" height="15" fill="#0D1117" />
          ))}
          {/* Reflection in lake */}
          <rect x="0" y="390" width="800" height="10" fill="#090B10" opacity="0.8" />
          <line x1="0" y1="395" x2="800" y2="395" stroke="#D4AF3708" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Lake reflection shimmer */}
      <div
        className="absolute bottom-0 left-0 right-0 h-20 opacity-20"
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(74,158,255,0.05))",
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-vignette pointer-events-none" />

      {/* Text overlay */}
      <AnimatePresence>
        {phase !== "entered" && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center z-20 px-4"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Title */}
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={showText ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <motion.h1
                className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-gold tracking-[0.15em] mb-4"
                style={{ textShadow: "0 0 40px rgba(212,175,55,0.3)" }}
              >
                EXPLORE
              </motion.h1>
              <motion.h2
                className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-gold/80 tracking-[0.2em]"
                style={{ textShadow: "0 0 30px rgba(212,175,55,0.2)" }}
                initial={{ opacity: 0 }}
                animate={showText ? { opacity: 1 } : {}}
                transition={{ delay: 0.5, duration: 1 }}
              >
                HOGWARTS
              </motion.h2>
            </motion.div>

            {/* Parchment text */}
            <motion.div
              className="text-center mb-10 max-w-lg"
              initial={{ opacity: 0 }}
              animate={showText ? { opacity: 1 } : {}}
              transition={{ delay: 1, duration: 1 }}
            >
              <p className="font-display text-lg sm:text-xl md:text-2xl text-moonlight/60 italic leading-relaxed">
                "Every castle hides secrets."
              </p>
              <p className="font-display text-sm sm:text-base text-moonlight/30 mt-3">
                Will you find them all?
              </p>
            </motion.div>

            {/* Begin Journey button */}
            <AnimatePresence>
              {showButton && phase !== "entering" && (
                <motion.button
                  onClick={handleBeginJourney}
                  className="group relative px-8 py-3 md:px-10 md:py-4 bg-transparent border border-gold/40 rounded-xl text-gold font-heading text-sm md:text-base tracking-[0.25em] hover:bg-gold/10 hover:border-gold/60 transition-all duration-500 overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10">BEGIN YOUR JOURNEY</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/10 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Entering animation */}
            {phase === "entering" && (
              <motion.div
                className="absolute inset-0 bg-black z-30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Owl flying across */}
      <motion.div
        className="absolute z-10 text-2xl opacity-40"
        initial={{ x: "-10vw", y: "20vh" }}
        animate={{ x: "110vw", y: "10vh" }}
        transition={{ duration: 12, delay: 5, repeat: Infinity, repeatDelay: 20, ease: "linear" }}
      >
        🦉
      </motion.div>
    </div>
  );
}
