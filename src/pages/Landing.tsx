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
  const fullLetter = `Dear Student,

We are pleased to inform you that you have been accepted at Hogwarts School of Witchcraft and Wizardry.

Please find enclosed a list of all necessary books and equipment.

Term begins on September 1st.

Yours sincerely,
Minerva McGonagall
Deputy Headmistress`;

  useEffect(() => {
    if (phase === "rain") {
      const t = setTimeout(() => setPhase("owl"), 4000);
      return () => clearTimeout(t);
    }
    if (phase === "owl") {
      const t = setTimeout(() => setPhase("seal"), 3000);
      return () => clearTimeout(t);
    }
  }, [phase]);

  useEffect(() => {
    if (phase !== "letter") return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setLetterText(fullLetter.slice(0, i));
      if (i >= fullLetter.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [phase, fullLetter]);

  const handleSealClick = useCallback(() => setPhase("letter"), []);
  const handleBeginJourney = useCallback(() => {
    setPhase("boat");
    setTimeout(() => setPhase("approach"), 4000);
    setTimeout(() => setPhase("doors"), 7000);
    setTimeout(() => { setPhase("done"); navigate("/hub"); }, 10000);
  }, [navigate]);

  const rainIntensity = phase === "rain" || phase === "owl" || phase === "seal" ? 70 : phase === "letter" ? 30 : 0;

  return (
    <div className="relative min-h-screen bg-abyss overflow-hidden">
      <Stars count={120} />
      <Rain intensity={rainIntensity} />
      <Fog layers={4} />
      <Lightning />

      {/* Castle silhouette */}
      <div className="absolute inset-0 flex items-end justify-center">
        <svg viewBox="0 0 800 350" className="w-full max-w-5xl h-auto opacity-20"
          style={{ filter: "drop-shadow(0 0 30px rgba(212,175,55,0.05))" }}>
          <rect x="200" y="160" width="400" height="190" fill="#0D1117" />
          <rect x="150" y="100" width="60" height="250" fill="#0D1117" />
          <rect x="590" y="100" width="60" height="250" fill="#0D1117" />
          <rect x="350" y="60" width="100" height="290" fill="#0D1117" />
          <polygon points="150,100 180,50 210,100" fill="#0D1117" />
          <polygon points="590,100 620,50 650,100" fill="#0D1117" />
          <polygon points="350,60 400,10 450,60" fill="#0D1117" />
          {[220,260,300,340,380,420,460,500,540].map((x) => (
            <rect key={x} x={x} y="180" width="12" height="20" rx="6" fill="#D4AF3710" />
          ))}
          <rect x="375" y="300" width="50" height="50" rx="25" fill="#1a1510" stroke="#D4AF3710" strokeWidth="1" />
        </svg>
      </div>

      <div className="absolute inset-0 bg-vignette-deep pointer-events-none" />

      {/* === RAIN + OWL PHASES === */}
      <AnimatePresence>
        {(phase === "rain" || phase === "owl" || phase === "seal") && (
          <motion.div className="absolute inset-0 z-20" exit={{ opacity: 0 }} transition={{ duration: 1.5 }}>
            {phase === "owl" || phase === "seal" ? (
              <motion.div className="absolute z-30"
                initial={{ x: "-8vw", y: "28vh", opacity: 0 }}
                animate={{ x: "48vw", y: "42vh", opacity: 1 }}
                transition={{ duration: 2.5, ease: "easeInOut" }}>
                <div className="text-2xl opacity-40">🦉</div>
              </motion.div>
            ) : null}
            {phase === "seal" && (
              <motion.div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-40"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 1.2, ease: "easeOut" }}>
                <button onClick={handleSealClick}
                  className="relative w-20 h-20 rounded-full border border-parchment/15 flex items-center justify-center hover:border-parchment/25 transition-all duration-700 group"
                  style={{ background: "radial-gradient(circle, rgba(232,220,196,0.06), transparent)" }}>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-burgundy/60 to-burgundy-dark/60 flex items-center justify-center"
                    style={{ boxShadow: "0 0 16px rgba(94,27,36,0.25)" }}>
                    <span className="font-heading text-gold/60 text-xs">H</span>
                  </div>
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-display text-moonlight/30">
                    Touch the seal
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
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}>
            <motion.div className="relative max-w-lg w-full"
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}>
              <div className="h-4 bg-gradient-to-b from-wood-light/30 to-wood/20 rounded-t-xl border-b border-brass/10 flex items-center justify-center">
                <div className="w-16 h-0.5 bg-brass/15 rounded-full" />
              </div>
              <div className="bg-gradient-to-b from-parchment/8 via-parchment/5 to-parchment/7 border-x border-parchment/10 px-8 py-8 min-h-[300px]">
                <div className="text-center mb-5">
                  <svg viewBox="0 0 60 70" className="w-10 h-12 mx-auto mb-2 opacity-30">
                    <path d="M30 3 L55 18 L55 42 Q55 60 30 68 Q5 60 5 42 L5 18 Z" fill="none" stroke="#D4AF37" strokeWidth="0.8" />
                    <rect x="25" y="22" width="10" height="18" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.4" />
                    <polygon points="25,22 30,14 35,22" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.4" />
                  </svg>
                  <div className="font-heading text-xs text-gold/40 tracking-[0.2em]">HOGWARTS</div>
                  <div className="font-display text-[9px] text-moonlight/20 tracking-wider">SCHOOL of WITCHCRAFT and WIZARDRY</div>
                </div>
                <div className="font-parchment text-parchment/55 text-sm leading-relaxed whitespace-pre-wrap">
                  {letterText}
                  <span className="inline-block w-px h-3.5 bg-gold/30 ml-0.5" style={{ animation: "pulseGlow 2s ease-in-out infinite" }} />
                </div>
                <div className="text-center mt-5">
                  <div className="inline-block w-8 h-8 rounded-full bg-gradient-to-br from-burgundy/70 to-burgundy-dark/70 flex items-center justify-center"
                    style={{ boxShadow: "0 0 12px rgba(94,27,36,0.25)" }}>
                    <span className="text-gold/50 text-[8px] font-heading">H</span>
                  </div>
                </div>
              </div>
              <div className="h-4 bg-gradient-to-t from-wood-light/30 to-wood/20 rounded-b-xl border-t border-brass/10" />
            </motion.div>
            <AnimatePresence>
              {letterText.length >= fullLetter.length && (
                <motion.div className="absolute bottom-14 left-1/2 -translate-x-1/2"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}>
                  <button onClick={handleBeginJourney}
                    className="group relative px-7 py-2.5 bg-gradient-to-b from-wood-light/60 to-wood/60 border border-brass/30 rounded-lg text-parchment/80 font-heading text-xs tracking-[0.2em] hover:brightness-110 transition-all duration-700 shadow-wood">
                    <span className="relative z-10">BEGIN YOUR JOURNEY</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === BOAT + APPROACH + DOORS === */}
      <AnimatePresence>
        {(phase === "boat" || phase === "approach" || phase === "doors") && (
          <motion.div className="absolute inset-0 z-20"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }}>
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-ink-deep to-transparent" />
            <motion.div className="absolute bottom-[30%] left-0 right-0 h-px bg-moonlight/[0.06]"
              animate={{ scaleX: [1, 1.01, 1], opacity: [0.2, 0.08, 0.2] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />
            {/* Boat */}
            <motion.div className="absolute bottom-[32%] left-1/2 -translate-x-1/2"
              initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 3, ease: "easeOut" }}>
              <div className="relative">
                <div className="w-12 h-3 bg-wood/40 rounded-b-full" />
                <motion.div className="absolute -top-5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
                  style={{ background: "rgba(212,175,55,0.25)", boxShadow: "0 0 8px 2px rgba(212,175,55,0.15)" }}
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
              </div>
            </motion.div>
            {phase === "approach" && (
              <motion.div className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2, ease: "easeOut" }}>
                <div className="text-center">
                  <h2 className="font-heading text-2xl md:text-4xl text-gold/40 tracking-[0.15em] mb-2"
                    style={{ textShadow: "0 0 20px rgba(212,175,55,0.1)" }}>HOGWARTS</h2>
                  <p className="font-display text-sm text-moonlight/20">Your new home awaits</p>
                </div>
              </motion.div>
            )}
            {phase === "doors" && (
              <motion.div className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
                <div className="relative w-32 h-52">
                  <motion.div className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-r from-wood/80 to-wood-dark/80 border-r border-brass/15 rounded-l"
                    style={{ transformOrigin: "left center" }}
                    initial={{ rotateY: 0 }} animate={{ rotateY: -80 }}
                    transition={{ duration: 3, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}>
                    <div className="absolute right-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-brass/35" />
                  </motion.div>
                  <motion.div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-wood/80 to-wood-dark/80 border-l border-brass/15 rounded-r"
                    style={{ transformOrigin: "right center" }}
                    initial={{ rotateY: 0 }} animate={{ rotateY: 80 }}
                    transition={{ duration: 3, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}>
                    <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-brass/35" />
                  </motion.div>
                  <motion.div className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0 }} animate={{ opacity: 0.15 }} transition={{ delay: 1.5, duration: 1.5 }}>
                    <div className="w-full h-full" style={{ background: "radial-gradient(circle, rgba(212,175,55,0.2), transparent)" }} />
                  </motion.div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Periodic owl */}
      <motion.div className="absolute z-10 text-xl opacity-15"
        initial={{ x: "-8vw", y: "16vh" }}
        animate={{ x: "108vw", y: "6vh" }}
        transition={{ duration: 18, delay: 12, repeat: Infinity, repeatDelay: 35, ease: "linear" }}>🦉</motion.div>
    </div>
  );
}
