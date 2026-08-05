import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { LandingPhase } from "@/types";

const PHASES: LandingPhase[] = ["rain", "owl", "seal", "letter", "boat", "approach", "doors", "done"];
const PHASE_DURATION = 3200;

const raindrops = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 2,
  duration: 1.5 + Math.random() * 1,
  opacity: 0.08 + Math.random() * 0.1,
  length: 10 + Math.random() * 15,
}));

const stoneBlocks = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x: 5 + (i % 4) * 25,
  y: 10 + Math.floor(i / 4) * 30,
  w: 20 + Math.random() * 8,
  h: 15 + Math.random() * 10,
  shade: 0.02 + Math.random() * 0.03,
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
      }, 35);
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
    const t = setTimeout(() => setShowSkip(true), 2000);
    return () => clearTimeout(t);
  }, []);

  const skipToEnd = () => {
    setIsExiting(true);
    setTimeout(() => navigate("/hub"), 800);
  };

  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(() => navigate("/hub"), 1200);
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
            transition={{ duration: 1 }}
          >
            <span className="font-cinzel text-[10px] tracking-wider" style={{ color: "rgba(100,95,88,0.25)" }}>
              Skip
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* === RAIN PHASE - Looking out through a rain-streaked window === */}
      <AnimatePresence>
        {phase === "rain" && (
          <motion.div className="absolute inset-0" exit={{ opacity: 0 }} transition={{ duration: 2 }}>
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #0E0D0B, #12110E, #0E0D0B)" }} />

            {/* Stone window frame */}
            <div className="absolute inset-[8%] rounded-sm" style={{ border: "3px solid rgba(58,54,50,0.15)" }}>
              {/* Window panes */}
              <div className="absolute left-1/2 top-0 bottom-0 w-[2px]" style={{ backgroundColor: "rgba(58,54,50,0.12)" }} />
              <div className="absolute top-1/2 left-0 right-0 h-[2px]" style={{ backgroundColor: "rgba(58,54,50,0.12)" }} />
            </div>

            {/* Rain on glass */}
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
                initial={{ top: "-3%", opacity: 0 }}
                animate={{ top: "103%", opacity: [0, drop.opacity, 0] }}
                transition={{ duration: drop.duration, repeat: Infinity, delay: drop.delay, ease: "linear" }}
              />
            ))}

            {/* Wet glass effect */}
            <div
              className="absolute inset-[8%]"
              style={{
                background: "radial-gradient(ellipse at 50% 50%, rgba(138,154,170,0.01), transparent 70%)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* === OWL PHASE - Silhouette against moonlit sky === */}
      <AnimatePresence>
        {phase === "owl" && (
          <motion.div className="absolute inset-0" exit={{ opacity: 0 }} transition={{ duration: 1.5 }}>
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #0A0908, #0E0D0B, #0A0908)" }} />

            {/* Moon */}
            <motion.div
              className="absolute top-[15%] right-[20%] w-16 h-16 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(200,210,230,0.08), rgba(200,210,230,0.03) 50%, transparent 70%)",
                boxShadow: "0 0 60px rgba(200,210,230,0.04)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2 }}
            />

            {/* Stars */}
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${10 + Math.random() * 80}%`,
                  top: `${5 + Math.random() * 40}%`,
                  width: 0.5 + Math.random() * 1,
                  height: 0.5 + Math.random() * 1,
                  backgroundColor: `rgba(200,210,230,${0.1 + Math.random() * 0.15})`,
                }}
                animate={{ opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 5 }}
              />
            ))}

            {/* Owl silhouette */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              initial={{ opacity: 0, x: -80, y: 20 }}
              animate={{ opacity: 0.6, x: 0, y: 0 }}
              transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Simple owl shape using CSS */}
              <div className="relative" style={{ width: 40, height: 50 }}>
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-12 rounded-t-full"
                  style={{ backgroundColor: "rgba(60,55,48,0.4)" }}
                />
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full"
                  style={{ backgroundColor: "rgba(60,55,48,0.4)" }}
                />
                {/* Ear tufts */}
                <div
                  className="absolute top-0 left-[20%] w-0 h-0"
                  style={{ borderLeft: "4px solid transparent", borderRight: "4px solid transparent", borderBottom: "8px solid rgba(60,55,48,0.35)" }}
                />
                <div
                  className="absolute top-0 right-[20%] w-0 h-0"
                  style={{ borderLeft: "4px solid transparent", borderRight: "4px solid transparent", borderBottom: "8px solid rgba(60,55,48,0.35)" }}
                />
              </div>
            </motion.div>

            <motion.p
              className="absolute bottom-[30%] left-1/2 -translate-x-1/2 font-cormorant text-sm tracking-widest"
              style={{ color: "rgba(100,95,88,0.2)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
            >
              A messenger arrives
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === SEAL PHASE - Wax seal pressing into parchment === */}
      <AnimatePresence>
        {phase === "seal" && (
          <motion.div className="absolute inset-0 flex items-center justify-center" exit={{ opacity: 0 }} transition={{ duration: 1.5 }}>
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #0E0D0B, #12110E, #0E0D0B)" }} />

            {/* Wax seal */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 1.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center"
                style={{
                  background: "radial-gradient(circle at 40% 35%, rgba(122,37,48,0.5), rgba(94,27,36,0.7), rgba(74,21,32,0.8))",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -2px 4px rgba(0,0,0,0.3)",
                  border: "1px solid rgba(94,27,36,0.2)",
                }}
              >
                {/* Embossed crest */}
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center"
                  style={{
                    border: "1px solid rgba(212,175,55,0.15)",
                    background: "radial-gradient(circle, rgba(212,175,55,0.05), transparent)",
                  }}
                >
                  <span className="font-cinzel text-lg sm:text-xl" style={{ color: "rgba(212,175,55,0.25)" }}>H</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === LETTER PHASE - Parchment with handwritten text === */}
      <AnimatePresence>
        {phase === "letter" && (
          <motion.div className="absolute inset-0 flex items-center justify-center" exit={{ opacity: 0 }} transition={{ duration: 1.5 }}>
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #0E0D0B, #12110E, #0E0D0B)" }} />

            <motion.div
              className="relative w-[85vw] sm:w-[400px] max-h-[70vh] overflow-hidden rounded-sm"
              style={{
                background: "linear-gradient(135deg, rgba(232,220,196,0.05), rgba(232,220,196,0.02))",
                border: "1px solid rgba(139,105,20,0.1)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.4), inset 0 0 40px rgba(139,105,20,0.02)",
              }}
              initial={{ opacity: 0, y: 20, scaleY: 0 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Parchment texture */}
              <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.005) 2px, rgba(0,0,0,0.005) 3px)",
                }}
              />

              <div className="relative p-6 sm:p-10">
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="w-12 h-[1px] mx-auto mb-4" style={{ backgroundColor: "rgba(139,105,20,0.12)" }} />
                  <p className="font-cinzel text-[10px] sm:text-xs tracking-[0.4em] uppercase" style={{ color: "rgba(184,134,11,0.35)" }}>
                    Hogwarts School
                  </p>
                  <p className="font-cinzel text-[9px] sm:text-[10px] tracking-[0.3em] uppercase mt-0.5" style={{ color: "rgba(184,134,11,0.2)" }}>
                    of Witchcraft and Wizardry
                  </p>
                </div>

                {/* Letter body */}
                <div className="font-cormorant text-sm sm:text-base leading-relaxed whitespace-pre-line min-h-[180px]" style={{ color: "rgba(120,110,90,0.4)" }}>
                  {letterText}
                  <motion.span
                    className="inline-block w-[1.5px] h-4 ml-0.5 align-middle"
                    style={{ backgroundColor: "rgba(120,110,90,0.3)" }}
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === BOAT PHASE - Crossing the lake, castle silhouette === */}
      <AnimatePresence>
        {phase === "boat" && (
          <motion.div className="absolute inset-0" exit={{ opacity: 0 }} transition={{ duration: 1.5 }}>
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #080706, #0A0908, #0E0D0B)" }} />

            {/* Water */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-[40%]"
              style={{
                background: "linear-gradient(180deg, rgba(30,35,40,0.15), rgba(14,13,11,0.1))",
              }}
              animate={{ opacity: [0.5, 0.6, 0.5] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Water reflections */}
            <div className="absolute bottom-[35%] left-0 right-0 h-[1px]" style={{ backgroundColor: "rgba(138,154,170,0.03)" }} />
            <div className="absolute bottom-[30%] left-0 right-0 h-[1px]" style={{ backgroundColor: "rgba(138,154,170,0.02)" }} />

            {/* Castle silhouette */}
            <motion.div
              className="absolute bottom-[38%] left-1/2 -translate-x-1/2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.12, y: 0 }}
              transition={{ duration: 3, ease: "easeOut" }}
            >
              <div className="flex gap-0.5 items-end">
                {/* Towers and walls - Gothic silhouette */}
                <div className="w-1 h-12 rounded-t-sm" style={{ backgroundColor: "rgba(40,38,36,0.3)" }} />
                <div className="w-3 h-8 rounded-t-sm" style={{ backgroundColor: "rgba(40,38,36,0.25)" }} />
                <div className="w-1 h-20 rounded-t-full" style={{ backgroundColor: "rgba(40,38,36,0.35)" }} />
                <div className="w-4 h-14" style={{ backgroundColor: "rgba(40,38,36,0.2)" }} />
                <div className="w-1.5 h-24 rounded-t-full" style={{ backgroundColor: "rgba(40,38,36,0.4)" }} />
                <div className="w-6 h-10" style={{ backgroundColor: "rgba(40,38,36,0.2)" }} />
                <div className="w-1 h-16 rounded-t-full" style={{ backgroundColor: "rgba(40,38,36,0.3)" }} />
                <div className="w-2 h-8" style={{ backgroundColor: "rgba(40,38,36,0.2)" }} />
                <div className="w-1 h-10 rounded-t-full" style={{ backgroundColor: "rgba(40,38,36,0.25)" }} />
              </div>
            </motion.div>

            {/* Boat */}
            <motion.div
              className="absolute bottom-[36%] left-1/2 -translate-x-1/2"
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 0.4, x: 0, y: [0, -2, 0] }}
              transition={{
                opacity: { duration: 1.5 },
                x: { duration: 2.5, ease: "easeOut" },
                y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              {/* Simple boat shape */}
              <div className="relative" style={{ width: 24, height: 8 }}>
                <div
                  className="absolute bottom-0 w-full h-3 rounded-b-full"
                  style={{ backgroundColor: "rgba(61,43,31,0.4)" }}
                />
                <div
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[1px] h-5"
                  style={{ backgroundColor: "rgba(61,43,31,0.3)" }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === APPROACH PHASE - Castle walls rising === */}
      <AnimatePresence>
        {phase === "approach" && (
          <motion.div className="absolute inset-0" exit={{ opacity: 0 }} transition={{ duration: 1.5 }}>
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #080706, #0E0D0B, #12110E)" }} />

            {/* Castle walls - stone blocks */}
            <div className="absolute inset-0">
              {stoneBlocks.map((block) => (
                <motion.div
                  key={block.id}
                  className="absolute"
                  style={{
                    left: `${block.x}%`,
                    top: `${block.y}%`,
                    width: `${block.w}%`,
                    height: `${block.h}%`,
                    backgroundColor: `rgba(58,54,50,${block.shade})`,
                    border: "0.5px solid rgba(58,54,50,0.03)",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 2, delay: block.id * 0.15 }}
                />
              ))}
            </div>

            {/* Central archway */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 0.2, scale: 1 }}
              transition={{ duration: 3, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Gothic arch */}
              <div className="relative" style={{ width: 120, height: 180 }}>
                {/* Arch shape using border radius */}
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2"
                  style={{
                    width: 80,
                    height: 160,
                    borderRadius: "40px 40px 0 0",
                    border: "2px solid rgba(90,85,80,0.12)",
                    borderBottom: "none",
                  }}
                />
                {/* Inner arch */}
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2"
                  style={{
                    width: 60,
                    height: 140,
                    borderRadius: "30px 30px 0 0",
                    background: "linear-gradient(180deg, rgba(14,13,11,0.3), rgba(14,13,11,0.6))",
                  }}
                />
              </div>
            </motion.div>

            <motion.p
              className="absolute bottom-[25%] left-1/2 -translate-x-1/2 font-cormorant text-sm tracking-widest"
              style={{ color: "rgba(100,95,88,0.15)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1.5 }}
            >
              The castle awaits
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === DOORS PHASE - Great doors opening === */}
      <AnimatePresence>
        {phase === "doors" && (
          <motion.div className="absolute inset-0 flex items-center justify-center" exit={{ opacity: 0 }} transition={{ duration: 2 }}>
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #0E0D0B, #12110E, #0E0D0B)" }} />

            {/* Door frames */}
            <div className="relative flex items-center justify-center gap-1">
              {/* Left door */}
              <motion.div
                className="relative overflow-hidden"
                style={{
                  width: 60,
                  height: 160,
                  background: "linear-gradient(180deg, rgba(61,43,31,0.15), rgba(42,29,20,0.2))",
                  border: "1px solid rgba(90,60,40,0.1)",
                  borderRadius: "30px 30px 0 0",
                }}
                initial={{ x: 0 }}
                animate={{ x: "-110%", opacity: [1, 1, 0] }}
                transition={{ duration: 3, delay: 1, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Door panel details */}
                <div className="absolute inset-2" style={{ border: "0.5px solid rgba(90,60,40,0.06)" }} />
                {/* Handle */}
                <div className="absolute top-1/2 right-3 w-2 h-4 rounded-full" style={{ backgroundColor: "rgba(184,134,11,0.12)" }} />
              </motion.div>

              {/* Right door */}
              <motion.div
                className="relative overflow-hidden"
                style={{
                  width: 60,
                  height: 160,
                  background: "linear-gradient(180deg, rgba(61,43,31,0.15), rgba(42,29,20,0.2))",
                  border: "1px solid rgba(90,60,40,0.1)",
                  borderRadius: "30px 30px 0 0",
                }}
                initial={{ x: 0 }}
                animate={{ x: "110%", opacity: [1, 1, 0] }}
                transition={{ duration: 3, delay: 1, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="absolute inset-2" style={{ border: "0.5px solid rgba(90,60,40,0.06)" }} />
                <div className="absolute top-1/2 left-3 w-2 h-4 rounded-full" style={{ backgroundColor: "rgba(184,134,11,0.12)" }} />
              </motion.div>
            </div>

            {/* Light spill from inside */}
            <motion.div
              className="absolute inset-0 z-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.08, 0] }}
              transition={{ duration: 4, delay: 1.5, ease: "easeInOut" }}
            >
              <div
                className="absolute inset-0"
                style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(255,213,79,0.08), transparent 60%)" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === ENTER BUTTON === */}
      <AnimatePresence>
        {(phase === "doors" || phase === "done") && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 2.5, duration: 1.5 }}
          >
            <motion.button
              className="relative px-8 py-3 rounded-sm cursor-pointer group"
              style={{
                background: "linear-gradient(180deg, rgba(61,43,31,0.15), rgba(42,29,20,0.2))",
                border: "1px solid rgba(139,105,20,0.12)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
              }}
              onClick={handleEnter}
              whileHover={{
                boxShadow: "0 4px 20px rgba(0,0,0,0.4), inset 0 0 20px rgba(212,175,55,0.03)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="font-cinzel text-[10px] sm:text-xs tracking-[0.3em] uppercase" style={{ color: "rgba(184,134,11,0.4)" }}>
                Enter the Castle
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === FADE TO BLACK === */}
      <AnimatePresence>
        {isExiting && (
          <motion.div
            className="absolute inset-0 z-[100]"
            style={{ backgroundColor: "#0E0D0B" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
