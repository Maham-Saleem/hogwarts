import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Rain } from "@/components/ambient/Rain";
import { Fog } from "@/components/ambient/Fog";
import { Lightning } from "@/components/ambient/Lightning";
import { Stars } from "@/components/ambient/Stars";

type Phase = "rain" | "owl" | "seal" | "letter" | "boat" | "approach" | "doors" | "done";

export function Landing() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("rain");
  const [letterText, setLetterText] = useState("");
  const fullLetter = `Dear Student,\n\nWe are pleased to inform you that you have been accepted at Hogwarts School of Witchcraft and Wizardry.\n\nPlease find enclosed a list of all necessary books and equipment.\n\nTerm begins on September 1st.\n\nYours sincerely,\nMinerva McGonagall\nDeputy Headmistress`;

  // Auto-progress through phases
  useEffect(() => {
    if (phase === "rain") {
      const t = setTimeout(() => setPhase("owl"), 3000);
      return () => clearTimeout(t);
    }
    if (phase === "owl") {
      const t = setTimeout(() => setPhase("seal"), 2200);
      return () => clearTimeout(t);
    }
  }, [phase]);

  // Typewriter for letter
  useEffect(() => {
    if (phase !== "letter") return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setLetterText(fullLetter.slice(0, i));
      if (i >= fullLetter.length) clearInterval(interval);
    }, 25);
    return () => clearInterval(interval);
  }, [phase, fullLetter]);

  const handleSealClick = useCallback(() => setPhase("letter"), []);
  const handleBeginJourney = useCallback(() => {
    setPhase("boat");
    setTimeout(() => setPhase("approach"), 3000);
    setTimeout(() => setPhase("doors"), 5500);
    setTimeout(() => { setPhase("done"); navigate("/hub"); }, 7500);
  }, [navigate]);

  return (
    <div className="relative min-h-screen bg-abyss overflow-hidden">
      {/* Always-on background effects */}
      <Stars count={180} />
      <Rain intensity={phase === "rain" || phase === "owl" || phase === "seal" ? 100 : phase === "letter" ? 40 : 0} />
      <Fog layers={5} />
      <Lightning />

      {/* Castle silhouette */}
      <div className="absolute inset-0 flex items-end justify-center">
        <svg viewBox="0 0 800 350" className="w-full max-w-5xl h-auto opacity-25"
          style={{ filter: "drop-shadow(0 0 40px rgba(212,175,55,0.08))" }}>
          <rect x="200" y="160" width="400" height="190" fill="#0D1117" />
          <rect x="150" y="100" width="60" height="250" fill="#0D1117" />
          <rect x="590" y="100" width="60" height="250" fill="#0D1117" />
          <rect x="350" y="60" width="100" height="290" fill="#0D1117" />
          <polygon points="150,100 180,50 210,100" fill="#0D1117" />
          <polygon points="590,100 620,50 650,100" fill="#0D1117" />
          <polygon points="350,60 400,10 450,60" fill="#0D1117" />
          {[220,260,300,340,380,420,460,500,540].map((x) => (
            <rect key={x} x={x} y="180" width="12" height="20" rx="6" fill="#D4AF3715" />
          ))}
          {[240,280,320,360,400,440,480,520].map((x) => (
            <rect key={x} x={x} y="240" width="10" height="16" rx="5" fill="#D4AF3710" />
          ))}
          <rect x="375" y="300" width="50" height="50" rx="25" fill="#1a1510" stroke="#D4AF3715" strokeWidth="1" />
        </svg>
      </div>

      {/* Lake shimmer */}
      <div className="absolute bottom-0 left-0 right-0 h-16 opacity-15"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(74,158,255,0.04))" }} />

      {/* Vignette */}
      <div className="absolute inset-0 bg-vignette-deep pointer-events-none" />

      {/* === OWL PHASE === */}
      <AnimatePresence>
        {(phase === "rain" || phase === "owl" || phase === "seal") && (
          <motion.div className="absolute inset-0 z-20" exit={{ opacity: 0 }} transition={{ duration: 1 }}>
            {/* Owl flying across */}
            {(phase === "owl" || phase === "seal") && (
              <motion.div className="absolute z-30"
                initial={{ x: "-10vw", y: "30vh" }}
                animate={{ x: "50vw", y: "45vh" }}
                transition={{ duration: 2, ease: "easeInOut" }}>
                <div className="text-4xl">🦉</div>
              </motion.div>
            )}
            {/* Letter */}
            {phase === "seal" && (
              <motion.div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-40"
                initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}>
                <button onClick={handleSealClick}
                  className="relative w-28 h-28 rounded-full bg-gradient-to-br from-parchment/15 to-parchment/5 border border-parchment/20 flex items-center justify-center hover:scale-105 transition-transform group">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-burgundy/30 to-burgundy-dark/30 m-2 flex items-center justify-center">
                    <span className="font-heading text-gold text-lg">✉</span>
                  </div>
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-display text-moonlight/40">
                    Click the seal
                  </div>
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* === LETTER PHASE === */}
      <AnimatePresence>
        {phase === "letter" && (
          <motion.div className="absolute inset-0 z-20 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
            <motion.div className="relative max-w-lg w-full"
              initial={{ scale: 0.3, rotateX: 90, opacity: 0 }}
              animate={{ scale: 1, rotateX: 0, opacity: 1 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}>
              {/* Scroll top */}
              <div className="h-5 bg-gradient-to-b from-wood-light/50 to-wood/30 rounded-t-xl border-b border-brass/15 flex items-center justify-center">
                <div className="w-20 h-1 bg-brass/25 rounded-full" />
              </div>
              {/* Letter body */}
              <div className="bg-gradient-to-b from-parchment/10 via-parchment/8 to-parchment/6 border-x border-parchment/12 px-8 py-8 min-h-[320px]">
                {/* Hogwarts crest */}
                <div className="text-center mb-6">
                  <div className="inline-block">
                    <svg viewBox="0 0 60 70" className="w-12 h-14 mx-auto mb-2 opacity-40">
                      <path d="M30 3 L55 18 L55 42 Q55 60 30 68 Q5 60 5 42 L5 18 Z" fill="none" stroke="#D4AF37" strokeWidth="1" />
                      <path d="M30 10 L48 20 L48 40 Q48 55 30 62 Q12 55 12 40 L12 20 Z" fill="rgba(212,175,55,0.05)" stroke="#D4AF37" strokeWidth="0.5" />
                      <rect x="25" y="22" width="10" height="18" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.5" />
                      <polygon points="25,22 30,14 35,22" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.5" />
                    </svg>
                    <div className="font-heading text-sm text-gold/60 tracking-[0.2em]">HOGWARTS</div>
                    <div className="font-display text-[10px] text-moonlight/30 tracking-wider">SCHOOL of WITCHCRAFT and WIZARDRY</div>
                  </div>
                </div>
                {/* Letter text */}
                <div className="font-parchment text-parchment/70 text-sm leading-relaxed whitespace-pre-wrap">
                  {letterText}
                  <span className="inline-block w-px h-4 bg-gold/50 ml-0.5 animate-pulse" />
                </div>
                {/* Wax seal at bottom */}
                <div className="text-center mt-6">
                  <div className="inline-block w-10 h-10 rounded-full bg-gradient-to-br from-burgundy to-burgundy-dark flex items-center justify-center shadow-glow-fire">
                    <span className="text-gold text-xs font-heading">H</span>
                  </div>
                </div>
              </div>
              {/* Scroll bottom */}
              <div className="h-5 bg-gradient-to-t from-wood-light/50 to-wood/30 rounded-b-xl border-t border-brass/15" />
            </motion.div>
            {/* Begin Journey button */}
            <AnimatePresence>
              {letterText.length >= fullLetter.length && (
                <motion.div className="absolute bottom-16 left-1/2 -translate-x-1/2"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                  <button onClick={handleBeginJourney}
                    className="group relative px-8 py-3 bg-gradient-to-b from-wood-light/80 to-wood/80 border border-brass/40 rounded-xl text-parchment font-heading text-sm tracking-[0.2em] hover:from-wood-polish/30 transition-all duration-500 overflow-hidden shadow-wood">
                    <span className="relative z-10">BEGIN YOUR JOURNEY</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/10 to-transparent animate-shimmer" style={{ backgroundSize: "200% 100%" }} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === BOAT RIDE === */}
      <AnimatePresence>
        {(phase === "boat" || phase === "approach" || phase === "doors") && (
          <motion.div className="absolute inset-0 z-20"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Dark lake surface */}
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-ink-deep to-transparent" />
            {/* Water ripples */}
            <motion.div className="absolute bottom-[30%] left-0 right-0 h-px bg-moonlight/10"
              animate={{ scaleX: [1, 1.02, 1], opacity: [0.3, 0.1, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }} />
            {/* Boat */}
            <motion.div className="absolute bottom-[32%] left-1/2 -translate-x-1/2"
              initial={{ y: 20, scale: 0.9 }} animate={{ y: 0, scale: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}>
              <div className="relative">
                <div className="w-16 h-4 bg-wood/60 rounded-b-full border-b border-wood-polish/30" />
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-px h-6 bg-wood-polish/30" />
                {/* Lantern */}
                <motion.div className="absolute -top-8 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gold/40"
                  animate={{ boxShadow: ["0 0 8px 2px rgba(212,175,55,0.2)", "0 0 16px 4px rgba(212,175,55,0.4)", "0 0 8px 2px rgba(212,175,55,0.2)"] }}
                  transition={{ duration: 2, repeat: Infinity }} />
              </div>
            </motion.div>
            {/* Castle approaching */}
            {phase === "approach" && (
              <motion.div className="absolute inset-0 flex items-center justify-center"
                initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 2.5, ease: "easeOut" }}>
                <div className="text-center">
                  <h2 className="font-heading text-2xl md:text-4xl text-gold/60 tracking-[0.2em] mb-2"
                    style={{ textShadow: "0 0 30px rgba(212,175,55,0.2)" }}>HOGWARTS</h2>
                  <p className="font-display text-sm text-moonlight/30">Your new home awaits</p>
                </div>
              </motion.div>
            )}
            {/* Doors opening */}
            {phase === "doors" && (
              <motion.div className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
                <div className="relative w-40 h-64">
                  {/* Left door */}
                  <motion.div className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-r from-wood to-wood-dark border-r border-brass/20 rounded-l-lg"
                    style={{ transformOrigin: "left center" }}
                    initial={{ rotateY: 0 }} animate={{ rotateY: -85 }}
                    transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-brass/50" />
                  </motion.div>
                  {/* Right door */}
                  <motion.div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-wood to-wood-dark border-l border-brass/20 rounded-r-lg"
                    style={{ transformOrigin: "right center" }}
                    initial={{ rotateY: 0 }} animate={{ rotateY: 85 }}
                    transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}>
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-brass/50" />
                  </motion.div>
                  {/* Light through the doors */}
                  <motion.div className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 1 }}>
                    <div className="w-full h-full bg-gradient-radial-gold opacity-30" />
                  </motion.div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Owl flying periodically */}
      <motion.div className="absolute z-10 text-2xl opacity-30"
        initial={{ x: "-10vw", y: "18vh" }}
        animate={{ x: "110vw", y: "8vh" }}
        transition={{ duration: 14, delay: 8, repeat: Infinity, repeatDelay: 25, ease: "linear" }}>🦉</motion.div>
    </div>
  );
}
