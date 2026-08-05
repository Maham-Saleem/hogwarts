import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { LandingPhase } from "@/types";

const PHASES: LandingPhase[] = ["rain", "owl", "seal", "letter", "boat", "approach", "doors", "done"];
const PHASE_DURATIONS: Record<LandingPhase, number> = {
  rain: 8000,
  owl: 7000,
  seal: 6000,
  letter: 10000,
  boat: 8000,
  approach: 8000,
  doors: 8000,
  done: 999999,
};

const raindrops = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 3,
  duration: 2 + Math.random() * 1.5,
  opacity: 0.06 + Math.random() * 0.08,
  length: 12 + Math.random() * 18,
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
      }, 50);
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
    }, PHASE_DURATIONS[phase]);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [phase]);

  useEffect(() => {
    const t = setTimeout(() => setShowSkip(true), 3000);
    return () => clearTimeout(t);
  }, []);

  const skipToEnd = () => {
    setIsExiting(true);
    setTimeout(() => navigate("/hub"), 1000);
  };

  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(() => navigate("/hub"), 1500);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden" style={{ backgroundColor: "#0E0D0B" }}>
      {/* Skip */}
      <AnimatePresence>
        {!isExiting && showSkip && (
          <motion.button
            className="absolute top-6 right-6 z-50 cursor-pointer"
            onClick={skipToEnd}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            <span className="font-cinzel text-[10px] tracking-wider" style={{ color: "rgba(100,95,88,0.2)" }}>
              Skip
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ===== RAIN PHASE ===== */}
      {/* Looking through a rain-streaked window at night. Stone window frame visible. */}
      <AnimatePresence>
        {phase === "rain" && (
          <motion.div className="absolute inset-0" exit={{ opacity: 0 }} transition={{ duration: 2.5 }}>
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #080706, #0C0B09, #080706)" }} />

            {/* Stone window frame — thick Gothic stone surround */}
            <div className="absolute inset-[5%] sm:inset-[8%]">
              {/* Outer stone frame */}
              <div
                className="absolute -inset-3 sm:-inset-5"
                style={{
                  border: "6px solid rgba(58,54,50,0.12)",
                  borderRadius: "4px",
                  boxShadow: "inset 0 0 30px rgba(0,0,0,0.4), 0 0 20px rgba(0,0,0,0.3)",
                }}
              />
              {/* Gothic pointed arch at top */}
              <div
                className="absolute -top-6 sm:-top-8 left-1/2 -translate-x-1/2"
                style={{
                  width: "60%",
                  height: 30,
                  borderBottom: "6px solid rgba(58,54,50,0.1)",
                  borderRadius: "0 0 50% 50%",
                }}
              />
              {/* Window mullions */}
              <div className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2" style={{ backgroundColor: "rgba(58,54,50,0.1)" }} />
              <div className="absolute top-1/2 left-0 right-0 h-[2px] -translate-y-1/2" style={{ backgroundColor: "rgba(58,54,50,0.1)" }} />

              {/* Rain streaks on glass */}
              {raindrops.map((drop) => (
                <motion.div
                  key={drop.id}
                  className="absolute"
                  style={{
                    left: `${drop.x}%`,
                    width: 1,
                    height: drop.length,
                    background: `linear-gradient(180deg, transparent, rgba(138,154,170,${drop.opacity}), transparent)`,
                  }}
                  initial={{ top: "-4%", opacity: 0 }}
                  animate={{ top: "104%", opacity: [0, drop.opacity, drop.opacity, 0] }}
                  transition={{ duration: drop.duration, repeat: Infinity, delay: drop.delay, ease: "linear" }}
                />
              ))}

              {/* Wet glass condensation */}
              <div
                className="absolute inset-0"
                style={{
                  background: "radial-gradient(ellipse at 50% 50%, rgba(138,154,170,0.008), transparent 70%)",
                }}
              />
            </div>

            {/* Caption */}
            <motion.p
              className="absolute bottom-[12%] left-1/2 -translate-x-1/2 font-cormorant text-sm tracking-[0.15em]"
              style={{ color: "rgba(100,95,88,0.15)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 2 }}
            >
              A storm draws near
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== OWL PHASE ===== */}
      {/* Night sky. Moon. Stars. Owl silhouette gliding in. */}
      <AnimatePresence>
        {phase === "owl" && (
          <motion.div className="absolute inset-0" exit={{ opacity: 0 }} transition={{ duration: 2 }}>
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #060504, #0A0908, #080706)" }} />

            {/* Moon — large, pale, low */}
            <motion.div
              className="absolute"
              style={{
                top: "20%",
                right: "18%",
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(200,210,230,0.06), rgba(200,210,230,0.02) 50%, transparent 70%)",
                boxShadow: "0 0 80px rgba(200,210,230,0.03), 0 0 160px rgba(200,210,230,0.015)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 3, ease: "easeOut" }}
            />

            {/* Stars */}
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${5 + Math.random() * 90}%`,
                  top: `${3 + Math.random() * 45}%`,
                  width: 0.5 + Math.random() * 1.2,
                  height: 0.5 + Math.random() * 1.2,
                  backgroundColor: `rgba(200,210,230,${0.08 + Math.random() * 0.12})`,
                }}
                animate={{ opacity: [0.08, 0.15, 0.08] }}
                transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 6 }}
              />
            ))}

            {/* Owl silhouette — entering from left, gliding to center */}
            <motion.div
              className="absolute"
              style={{ top: "35%", left: "50%", transform: "translate(-50%, -50%)" }}
              initial={{ opacity: 0, x: -200, y: 30 }}
              animate={{ opacity: 0.5, x: 0, y: 0 }}
              transition={{ duration: 4, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Owl body */}
              <div className="relative" style={{ width: 50, height: 60 }}>
                {/* Body */}
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-full"
                  style={{ width: 36, height: 44, backgroundColor: "rgba(50,45,38,0.35)" }}
                />
                {/* Head */}
                <div
                  className="absolute top-2 left-1/2 -translate-x-1/2 rounded-full"
                  style={{ width: 22, height: 20, backgroundColor: "rgba(50,45,38,0.35)" }}
                />
                {/* Ear tufts */}
                <div
                  className="absolute top-0"
                  style={{
                    left: "28%",
                    width: 0, height: 0,
                    borderLeft: "5px solid transparent",
                    borderRight: "5px solid transparent",
                    borderBottom: "10px solid rgba(50,45,38,0.3)",
                  }}
                />
                <div
                  className="absolute top-0"
                  style={{
                    right: "28%",
                    width: 0, height: 0,
                    borderLeft: "5px solid transparent",
                    borderRight: "5px solid transparent",
                    borderBottom: "10px solid rgba(50,45,38,0.3)",
                  }}
                />
                {/* Wings spread */}
                <motion.div
                  className="absolute top-[30%] -left-4"
                  style={{
                    width: 20,
                    height: 8,
                    backgroundColor: "rgba(50,45,38,0.25)",
                    borderRadius: "50% 0 0 50%",
                    transformOrigin: "right center",
                  }}
                  animate={{ rotate: [-5, 5, -5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute top-[30%] -right-4"
                  style={{
                    width: 20,
                    height: 8,
                    backgroundColor: "rgba(50,45,38,0.25)",
                    borderRadius: "0 50% 50% 0",
                    transformOrigin: "left center",
                  }}
                  animate={{ rotate: [5, -5, 5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* Eyes — two small dots */}
                <div className="absolute top-[28%] left-[30%] w-[3px] h-[3px] rounded-full" style={{ backgroundColor: "rgba(200,180,100,0.15)" }} />
                <div className="absolute top-[28%] right-[30%] w-[3px] h-[3px] rounded-full" style={{ backgroundColor: "rgba(200,180,100,0.15)" }} />
              </div>
            </motion.div>

            <motion.p
              className="absolute bottom-[25%] left-1/2 -translate-x-1/2 font-cormorant text-sm tracking-[0.15em]"
              style={{ color: "rgba(100,95,88,0.12)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 2 }}
            >
              A messenger arrives
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== SEAL PHASE ===== */}
      {/* Wax seal pressing into parchment. Slow, tactile. */}
      <AnimatePresence>
        {phase === "seal" && (
          <motion.div className="absolute inset-0 flex items-center justify-center" exit={{ opacity: 0 }} transition={{ duration: 2 }}>
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #0C0B09, #0E0D0B, #0C0B09)" }} />

            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 2, y: -30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Wax seal */}
              <div
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-full flex items-center justify-center"
                style={{
                  background: "radial-gradient(circle at 38% 32%, rgba(140,45,55,0.45), rgba(94,27,36,0.6), rgba(74,21,32,0.75))",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.04), inset 0 -3px 6px rgba(0,0,0,0.3)",
                  border: "1px solid rgba(94,27,36,0.15)",
                }}
              >
                {/* Embossed crest — H */}
                <div
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center"
                  style={{
                    border: "1px solid rgba(212,175,55,0.12)",
                    background: "radial-gradient(circle, rgba(212,175,55,0.04), transparent)",
                  }}
                >
                  <span className="font-cinzel text-xl sm:text-2xl font-bold" style={{ color: "rgba(212,175,55,0.2)" }}>
                    H
                  </span>
                </div>
              </div>

              {/* Wax drips */}
              <div
                className="absolute -bottom-2 left-1/3 w-3 h-5 rounded-b-full"
                style={{ backgroundColor: "rgba(94,27,36,0.3)" }}
              />
              <div
                className="absolute -bottom-1 right-[35%] w-2 h-3 rounded-b-full"
                style={{ backgroundColor: "rgba(94,27,36,0.25)" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== LETTER PHASE ===== */}
      {/* Parchment unfurling. Text writing itself. Slow, deliberate. */}
      <AnimatePresence>
        {phase === "letter" && (
          <motion.div className="absolute inset-0 flex items-center justify-center" exit={{ opacity: 0 }} transition={{ duration: 2 }}>
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #0C0B09, #0E0D0B, #0C0B09)" }} />

            <motion.div
              className="relative w-[85vw] sm:w-[420px] max-h-[72vh] overflow-hidden rounded-sm"
              style={{
                background: "linear-gradient(135deg, rgba(232,220,196,0.045), rgba(232,220,196,0.02))",
                border: "1px solid rgba(139,105,20,0.08)",
                boxShadow: "0 8px 40px rgba(0,0,0,0.5), inset 0 0 50px rgba(139,105,20,0.02)",
              }}
              initial={{ opacity: 0, scaleY: 0, originY: 0.5 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Parchment fiber texture */}
              <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.004) 2px, rgba(0,0,0,0.004) 3px)",
                }}
              />
              {/* Aged edge darkening */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  boxShadow: "inset 0 0 40px rgba(139,105,20,0.03)",
                }}
              />

              <div className="relative p-7 sm:p-10">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="w-16 h-[1px] mx-auto mb-5" style={{ backgroundColor: "rgba(139,105,20,0.1)" }} />
                  <p className="font-cinzel text-[10px] sm:text-xs tracking-[0.5em] uppercase" style={{ color: "rgba(184,134,11,0.3)" }}>
                    Hogwarts School
                  </p>
                  <p className="font-cinzel text-[9px] sm:text-[10px] tracking-[0.35em] uppercase mt-1" style={{ color: "rgba(184,134,11,0.18)" }}>
                    of Witchcraft and Wizardry
                  </p>
                </div>

                {/* Letter body — typewriter effect, slow */}
                <div className="font-cormorant text-sm sm:text-base leading-[1.8] whitespace-pre-line min-h-[200px]" style={{ color: "rgba(120,110,90,0.35)" }}>
                  {letterText}
                  <motion.span
                    className="inline-block w-[1.5px] h-4 ml-0.5 align-middle"
                    style={{ backgroundColor: "rgba(120,110,90,0.25)" }}
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== BOAT PHASE ===== */}
      {/* Crossing the Black Lake. Castle silhouette in distance. Water reflections. */}
      <AnimatePresence>
        {phase === "boat" && (
          <motion.div className="absolute inset-0" exit={{ opacity: 0 }} transition={{ duration: 2 }}>
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #050404, #080706, #0C0B09)" }} />

            {/* Water surface */}
            <div className="absolute bottom-0 left-0 right-0 h-[42%]" style={{ background: "linear-gradient(180deg, rgba(25,30,35,0.12), rgba(14,13,11,0.08))" }} />

            {/* Water reflections — horizontal lines */}
            {[38, 36, 34, 32].map((y, i) => (
              <motion.div
                key={i}
                className="absolute left-0 right-0 h-[1px]"
                style={{ top: `${y}%`, backgroundColor: `rgba(138,154,170,${0.015 - i * 0.003})` }}
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
              />
            ))}

            {/* Castle silhouette — distant, on horizon */}
            <motion.div
              className="absolute bottom-[42%] left-1/2 -translate-x-1/2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 0.1, y: 0 }}
              transition={{ duration: 4, ease: "easeOut" }}
            >
              <div className="flex gap-px items-end">
                {/* Left towers */}
                <div className="w-[3px] h-10 rounded-t-sm" style={{ backgroundColor: "rgba(40,38,36,0.25)" }} />
                <div className="w-2 h-6 rounded-t-sm" style={{ backgroundColor: "rgba(40,38,36,0.2)" }} />
                <div className="w-[3px] h-16 rounded-t-full" style={{ backgroundColor: "rgba(40,38,36,0.3)" }} />
                <div className="w-3 h-10" style={{ backgroundColor: "rgba(40,38,36,0.18)" }} />
                {/* Central tower — tallest */}
                <div className="w-[3px] h-20 rounded-t-full" style={{ backgroundColor: "rgba(40,38,36,0.35)" }} />
                <div className="w-4 h-12" style={{ backgroundColor: "rgba(40,38,36,0.15)" }} />
                {/* Right towers */}
                <div className="w-[3px] h-14 rounded-t-full" style={{ backgroundColor: "rgba(40,38,36,0.28)" }} />
                <div className="w-2 h-8" style={{ backgroundColor: "rgba(40,38,36,0.18)" }} />
                <div className="w-[3px] h-10 rounded-t-full" style={{ backgroundColor: "rgba(40,38,36,0.22)" }} />
                <div className="w-2 h-5 rounded-t-sm" style={{ backgroundColor: "rgba(40,38,36,0.18)" }} />
                <div className="w-[3px] h-8 rounded-t-full" style={{ backgroundColor: "rgba(40,38,36,0.2)" }} />
              </div>
            </motion.div>

            {/* Castle light — single warm window */}
            <motion.div
              className="absolute"
              style={{
                bottom: "48%",
                left: "50%",
                transform: "translateX(-50%)",
                width: 3,
                height: 2,
                backgroundColor: "rgba(255,213,79,0.08)",
                boxShadow: "0 0 8px rgba(255,213,79,0.04)",
              }}
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Boat — small, entering from bottom */}
            <motion.div
              className="absolute bottom-[40%] left-1/2 -translate-x-1/2"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 0.35, y: [0, -2, 0] }}
              transition={{
                opacity: { duration: 2 },
                y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              <div className="relative" style={{ width: 28, height: 10 }}>
                {/* Hull */}
                <div className="absolute bottom-0 w-full h-3 rounded-b-full" style={{ backgroundColor: "rgba(61,43,31,0.35)" }} />
                {/* Mast */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[1px] h-6" style={{ backgroundColor: "rgba(61,43,31,0.25)" }} />
              </div>
            </motion.div>

            <motion.p
              className="absolute bottom-[18%] left-1/2 -translate-x-1/2 font-cormorant text-sm tracking-[0.15em]"
              style={{ color: "rgba(100,95,88,0.1)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 2 }}
            >
              The lake is silent
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== APPROACH PHASE ===== */}
      {/* Walking toward the castle. Stone walls rising on either side. Gates ahead. */}
      <AnimatePresence>
        {phase === "approach" && (
          <motion.div className="absolute inset-0" exit={{ opacity: 0 }} transition={{ duration: 2 }}>
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #050404, #0C0B09, #0E0D0B)" }} />

            {/* Stone walls rising on sides — perspective lines */}
            <motion.div
              className="absolute top-0 bottom-0 left-0 w-[15%]"
              style={{
                background: "linear-gradient(90deg, rgba(40,38,36,0.15), transparent)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 3 }}
            />
            <motion.div
              className="absolute top-0 bottom-0 right-0 w-[15%]"
              style={{
                background: "linear-gradient(270deg, rgba(40,38,36,0.15), transparent)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 3 }}
            />

            {/* Central Gothic gate — large arch */}
            <motion.div
              className="absolute top-[15%] left-1/2 -translate-x-1/2"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 0.15, scale: 1 }}
              transition={{ duration: 4, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Main arch */}
              <div className="relative" style={{ width: 160, height: 260 }}>
                {/* Left pillar */}
                <div className="absolute bottom-0 left-0 w-5 h-full" style={{ backgroundColor: "rgba(50,46,42,0.2)", borderRight: "1px solid rgba(60,56,52,0.06)" }} />
                {/* Right pillar */}
                <div className="absolute bottom-0 right-0 w-5 h-full" style={{ backgroundColor: "rgba(50,46,42,0.2)", borderLeft: "1px solid rgba(60,56,52,0.06)" }} />
                {/* Pointed arch */}
                <div
                  className="absolute top-0 left-5 right-5"
                  style={{
                    height: 120,
                    borderRadius: "80px 80px 0 0",
                    border: "2px solid rgba(60,56,52,0.1)",
                    borderBottom: "none",
                  }}
                />
                {/* Inner dark space */}
                <div
                  className="absolute top-[50px] left-[30px] right-[30px] bottom-0"
                  style={{
                    borderRadius: "50px 50px 0 0",
                    background: "linear-gradient(180deg, rgba(8,7,6,0.4), rgba(8,7,6,0.7))",
                  }}
                />
                {/* Gate details — portcullis lines */}
                {[40, 55, 70, 85, 100].map((x) => (
                  <div key={x} className="absolute top-[60px] bottom-0 w-[1px]" style={{ left: x, backgroundColor: "rgba(60,56,52,0.04)" }} />
                ))}
              </div>
            </motion.div>

            {/* Ground — cobblestone path */}
            <div className="absolute bottom-0 left-0 right-0 h-[25%]" style={{ background: "linear-gradient(0deg, rgba(30,28,26,0.12), transparent)" }} />

            <motion.p
              className="absolute bottom-[12%] left-1/2 -translate-x-1/2 font-cormorant text-sm tracking-[0.15em]"
              style={{ color: "rgba(100,95,88,0.1)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 2 }}
            >
              The gates stand open
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== DOORS PHASE ===== */}
      {/* Great doors opening inward. Warm light spilling out. */}
      <AnimatePresence>
        {phase === "doors" && (
          <motion.div className="absolute inset-0 flex items-center justify-center" exit={{ opacity: 0 }} transition={{ duration: 2.5 }}>
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #0C0B09, #0E0D0B, #0C0B09)" }} />

            {/* Door frame — stone arch */}
            <div className="relative" style={{ width: 140, height: 220 }}>
              {/* Left door */}
              <motion.div
                className="absolute top-0 left-0 w-1/2 h-full origin-left overflow-hidden"
                style={{
                  background: "linear-gradient(180deg, rgba(61,43,31,0.18), rgba(42,29,20,0.25))",
                  borderRight: "1px solid rgba(90,60,40,0.08)",
                  borderTop: "1px solid rgba(90,60,40,0.08)",
                  borderRadius: "40px 0 0 0",
                }}
                initial={{ rotateY: 0 }}
                animate={{ rotateY: -75 }}
                transition={{ duration: 3, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Panel detail */}
                <div className="absolute inset-3" style={{ border: "0.5px solid rgba(90,60,40,0.04)" }} />
                {/* Handle */}
                <div className="absolute top-1/2 right-3 w-2 h-5 rounded-full" style={{ backgroundColor: "rgba(184,134,11,0.1)" }} />
                {/* Iron studs */}
                <div className="absolute top-[20%] left-1/2 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "rgba(74,74,74,0.1)" }} />
                <div className="absolute top-[40%] left-1/2 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "rgba(74,74,74,0.1)" }} />
                <div className="absolute top-[60%] left-1/2 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "rgba(74,74,74,0.1)" }} />
              </motion.div>

              {/* Right door */}
              <motion.div
                className="absolute top-0 right-0 w-1/2 h-full origin-right overflow-hidden"
                style={{
                  background: "linear-gradient(180deg, rgba(61,43,31,0.18), rgba(42,29,20,0.25))",
                  borderLeft: "1px solid rgba(90,60,40,0.08)",
                  borderTop: "1px solid rgba(90,60,40,0.08)",
                  borderRadius: "0 40px 0 0",
                }}
                initial={{ rotateY: 0 }}
                animate={{ rotateY: 75 }}
                transition={{ duration: 3, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="absolute inset-3" style={{ border: "0.5px solid rgba(90,60,40,0.04)" }} />
                <div className="absolute top-1/2 left-3 w-2 h-5 rounded-full" style={{ backgroundColor: "rgba(184,134,11,0.1)" }} />
                <div className="absolute top-[20%] left-1/2 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "rgba(74,74,74,0.1)" }} />
                <div className="absolute top-[40%] left-1/2 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "rgba(74,74,74,0.1)" }} />
                <div className="absolute top-[60%] left-1/2 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "rgba(74,74,74,0.1)" }} />
              </motion.div>

              {/* Warm light from inside — spilling through opening doors */}
              <motion.div
                className="absolute inset-0 z-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2, delay: 1.5 }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background: "radial-gradient(ellipse at 50% 50%, rgba(255,213,79,0.06), transparent 60%)",
                  }}
                />
              </motion.div>

              {/* Stone arch frame */}
              <div
                className="absolute -inset-2 rounded-t-[50px]"
                style={{
                  border: "3px solid rgba(58,54,50,0.08)",
                  borderBottom: "none",
                  pointerEvents: "none",
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== ENTER BUTTON ===== */}
      <AnimatePresence>
        {(phase === "doors" || phase === "done") && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 3.5, duration: 2 }}
          >
            <motion.button
              className="relative px-10 py-3.5 rounded-sm cursor-pointer group"
              style={{
                background: "linear-gradient(180deg, rgba(61,43,31,0.12), rgba(42,29,20,0.18))",
                border: "1px solid rgba(139,105,20,0.1)",
                boxShadow: "0 2px 16px rgba(0,0,0,0.3)",
              }}
              onClick={handleEnter}
              whileHover={{
                boxShadow: "0 4px 24px rgba(0,0,0,0.4), inset 0 0 25px rgba(212,175,55,0.025)",
                borderColor: "rgba(139,105,20,0.15)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="font-cinzel text-[10px] sm:text-xs tracking-[0.35em] uppercase" style={{ color: "rgba(184,134,11,0.35)" }}>
                Enter the Castle
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== FADE TO BLACK ===== */}
      <AnimatePresence>
        {isExiting && (
          <motion.div
            className="absolute inset-0 z-[100]"
            style={{ backgroundColor: "#0E0D0B" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
