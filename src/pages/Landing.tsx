import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { LandingPhase } from "@/types";

const PHASES: LandingPhase[] = ["rain", "owl", "seal", "letter", "boat", "approach", "doors", "done"];
const PHASE_DURATION = 2800;

const raindrops = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 1.5,
  duration: 0.6 + Math.random() * 0.4,
  opacity: 0.15 + Math.random() * 0.2,
}));

const stars = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 1 + Math.random() * 2,
  delay: Math.random() * 5,
}));

export default function Landing() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<LandingPhase>("rain");
  const [letterText, setLetterText] = useState("");
  const [showSkip, setShowSkip] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const phaseIndex = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const letterContent = "Dear Student,\n\nYou have been accepted to Hogwarts School of Witchcraft and Wizardry.\n\nPlease find enclosed a list of all necessary books and equipment.\n\nTerm begins on 1 September.\n\nYours sincerely,\nMinerva McGonagall";

  useEffect(() => {
    if (phase === "letter") {
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setLetterText(letterContent.slice(0, i));
        if (i >= letterContent.length) clearInterval(interval);
      }, 25);
      return () => clearInterval(interval);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "done") return;
    timerRef.current = setTimeout(() => {
      if (phaseIndex.current < PHASES.length - 1) {
        phaseIndex.current++;
        setPhase(PHASES[phaseIndex.current]);
      }
    }, PHASE_DURATION);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [phase]);

  useEffect(() => {
    const t = setTimeout(() => setShowSkip(true), 1500);
    return () => clearTimeout(t);
  }, []);

  const skipToEnd = () => {
    setIsExiting(true);
    setTimeout(() => navigate("/hub"), 600);
  };

  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(() => navigate("/hub"), 1000);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#090B10] overflow-hidden">
      <AnimatePresence>
        {!isExiting && showSkip && (
          <motion.button
            className="absolute top-5 right-5 z-50 font-cinzel text-xs text-moonlight/20 hover:text-moonlight/50 transition-colors cursor-pointer"
            onClick={skipToEnd}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6 }}
          >
            Skip
          </motion.button>
        )}
      </AnimatePresence>

      {/* === RAIN PHASE === */}
      <AnimatePresence>
        {phase === "rain" && (
          <motion.div className="absolute inset-0" exit={{ opacity: 0 }} transition={{ duration: 1.5 }}>
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#090B10] via-[#0a0d14] to-[#0d1018]" />

            {/* Rain */}
            {raindrops.map((drop) => (
              <motion.div
                key={drop.id}
                className="absolute w-[1px] bg-gradient-to-b from-transparent via-moonlight/20 to-transparent"
                style={{ left: `${drop.x}%`, height: "15px" }}
                initial={{ top: "-5%", opacity: 0 }}
                animate={{ top: "105%", opacity: [0, drop.opacity, 0] }}
                transition={{
                  duration: drop.duration,
                  repeat: Infinity,
                  delay: drop.delay,
                  ease: "linear",
                }}
              />
            ))}

            {/* Lightning flash */}
            <motion.div
              className="absolute inset-0 bg-moonlight/[0.02]"
              animate={{ opacity: [0, 0, 1, 0, 0, 0, 0.5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* === OWL PHASE === */}
      <AnimatePresence>
        {phase === "owl" && (
          <motion.div className="absolute inset-0" exit={{ opacity: 0 }} transition={{ duration: 1 }}>
            <div className="absolute inset-0 bg-gradient-to-b from-[#090B10] via-[#0a0d14] to-[#090B10]" />
            {stars.map((s) => (
              <motion.div
                key={s.id}
                className="absolute rounded-full bg-moonlight"
                style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.4, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
              />
            ))}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              initial={{ opacity: 0, scale: 0.8, x: -200 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="text-8xl sm:text-9xl" style={{ filter: "drop-shadow(0 0 30px rgba(212,175,55,0.15))" }}>
                🦉
              </div>
            </motion.div>
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 mt-24"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <p className="font-cormorant text-moonlight/40 text-sm tracking-widest uppercase">
                A messenger arrives...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === SEAL PHASE === */}
      <AnimatePresence>
        {phase === "seal" && (
          <motion.div className="absolute inset-0 flex items-center justify-center" exit={{ opacity: 0 }} transition={{ duration: 1 }}>
            <div className="absolute inset-0 bg-gradient-to-b from-[#090B10] via-[#0a0d14] to-[#090B10]" />
            <motion.div
              className="relative z-10 w-32 h-32 sm:w-40 sm:h-40 rounded-full border-2 border-gold/30 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                className="absolute inset-0 rounded-full border border-gold/10"
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0, 0.2] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="text-6xl sm:text-7xl">🦁</div>
            </motion.div>
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 mt-28"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <p className="font-cinzel text-gold/50 text-xs sm:text-sm tracking-[0.3em] uppercase">
                Hogwarts
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === LETTER PHASE === */}
      <AnimatePresence>
        {phase === "letter" && (
          <motion.div className="absolute inset-0 flex items-center justify-center" exit={{ opacity: 0 }} transition={{ duration: 1 }}>
            <div className="absolute inset-0 bg-gradient-to-b from-[#090B10] via-[#0a0d14] to-[#090B10]" />
            <motion.div
              className="relative z-10 w-[85vw] sm:w-[420px] max-h-[70vh] overflow-hidden rounded-sm border border-gold/15"
              style={{ background: "linear-gradient(135deg, rgba(232,220,196,0.04), rgba(232,220,196,0.02))" }}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="p-6 sm:p-10">
                <div className="text-center mb-6">
                  <div className="w-16 h-[1px] bg-gold/20 mx-auto mb-4" />
                  <p className="font-cinzel text-gold/60 text-[10px] sm:text-xs tracking-[0.4em] uppercase">
                    Hogwarts School
                  </p>
                  <p className="font-cinzel text-gold/40 text-[9px] sm:text-[10px] tracking-[0.3em] uppercase mt-0.5">
                    of Witchcraft and Wizardry
                  </p>
                </div>
                <div className="font-cormorant text-moonlight/50 text-sm sm:text-base leading-relaxed whitespace-pre-line min-h-[180px]">
                  {letterText}
                  <motion.span
                    className="inline-block w-[2px] h-4 bg-gold/40 ml-0.5 align-middle"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === BOAT PHASE === */}
      <AnimatePresence>
        {phase === "boat" && (
          <motion.div className="absolute inset-0" exit={{ opacity: 0 }} transition={{ duration: 1 }}>
            <div className="absolute inset-0 bg-gradient-to-b from-[#060810] via-[#0a0e18] to-[#090B10]" />
            {/* Water */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-[40%]"
              style={{ background: "linear-gradient(180deg, rgba(74,158,255,0.03), rgba(9,11,16,0.1))" }}
              animate={{ opacity: [0.5, 0.7, 0.5] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Castle silhouette */}
            <motion.div
              className="absolute bottom-[35%] left-1/2 -translate-x-1/2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 0.15, y: 0 }}
              transition={{ duration: 2, ease: "easeOut" }}
            >
              <div className="flex gap-1 items-end">
                <div className="w-3 h-16 bg-gold/20 rounded-t-sm" />
                <div className="w-6 h-24 bg-gold/15 rounded-t-sm" />
                <div className="w-2 h-32 bg-gold/20 rounded-t-sm" />
                <div className="w-8 h-20 bg-gold/15 rounded-t-sm" />
                <div className="w-3 h-40 bg-gold/25 rounded-t-sm" />
                <div className="w-5 h-28 bg-gold/15 rounded-t-sm" />
                <div className="w-2 h-20 bg-gold/20 rounded-t-sm" />
                <div className="w-6 h-12 bg-gold/15 rounded-t-sm" />
              </div>
            </motion.div>
            {/* Boat */}
            <motion.div
              className="absolute bottom-[32%] left-1/2 -translate-x-1/2 text-4xl"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 0.6, x: 0, y: [0, -4, 0] }}
              transition={{ opacity: { duration: 1 }, x: { duration: 2 }, y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
            >
              🚣
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === APPROACH PHASE === */}
      <AnimatePresence>
        {phase === "approach" && (
          <motion.div className="absolute inset-0" exit={{ opacity: 0 }} transition={{ duration: 1 }}>
            <div className="absolute inset-0 bg-gradient-to-b from-[#060810] via-[#090B10] to-[#0a0d14]" />
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="text-8xl sm:text-9xl" style={{ filter: "drop-shadow(0 0 40px rgba(212,175,55,0.1))" }}>
                🏰
              </div>
            </motion.div>
            <motion.p
              className="absolute bottom-[25%] left-1/2 -translate-x-1/2 font-cormorant text-moonlight/25 text-sm tracking-widest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
            >
              The castle awaits...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === DOORS PHASE === */}
      <AnimatePresence>
        {phase === "doors" && (
          <motion.div className="absolute inset-0 flex items-center justify-center" exit={{ opacity: 0 }} transition={{ duration: 1.5 }}>
            <div className="absolute inset-0 bg-gradient-to-b from-[#090B10] via-[#0a0d14] to-[#090B10]" />
            <div className="relative z-10 flex items-center justify-center gap-4 sm:gap-8">
              {/* Left door */}
              <motion.div
                className="w-16 sm:w-24 h-48 sm:h-72 rounded-t-xl border border-gold/15 overflow-hidden"
                style={{ background: "linear-gradient(180deg, rgba(61,43,31,0.12), rgba(9,11,16,0.15))" }}
                initial={{ x: 0 }}
                animate={{ x: "-110%", opacity: [1, 1, 0] }}
                transition={{ duration: 2.5, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full border border-gold/20" />
                </div>
              </motion.div>
              {/* Right door */}
              <motion.div
                className="w-16 sm:w-24 h-48 sm:h-72 rounded-t-xl border border-gold/15 overflow-hidden"
                style={{ background: "linear-gradient(180deg, rgba(61,43,31,0.12), rgba(9,11,16,0.15))" }}
                initial={{ x: 0 }}
                animate={{ x: "110%", opacity: [1, 1, 0] }}
                transition={{ duration: 2.5, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full border border-gold/20" />
                </div>
              </motion.div>
            </div>
            {/* Light spill */}
            <motion.div
              className="absolute inset-0 z-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.15, 0] }}
              transition={{ duration: 3, delay: 1.5, ease: "easeInOut" }}
            >
              <div className="absolute inset-0 bg-gradient-radial from-gold/20 to-transparent" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === ENTER BUTTON (visible after doors) === */}
      <AnimatePresence>
        {(phase === "doors" || phase === "done") && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 2, duration: 1 }}
          >
            <motion.button
              className="px-8 py-3 rounded-sm border border-gold/25 bg-gold/5 hover:bg-gold/10 cursor-pointer group"
              onClick={handleEnter}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="font-cinzel text-gold/70 text-xs sm:text-sm tracking-[0.3em] uppercase group-hover:text-gold transition-colors">
                Enter the Castle
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === FADE TO BLACK ON EXIT === */}
      <AnimatePresence>
        {isExiting && (
          <motion.div
            className="absolute inset-0 bg-[#090B10] z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
