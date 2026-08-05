import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ApproachPhase =
  | "black"
  | "rain-stone"
  | "lake"
  | "castle-silhouette"
  | "approaching"
  | "gates"
  | "courtyard"
  | "doors"
  | "opening"
  | "entering"
  | "done";

const PHASE_DURATIONS: Record<ApproachPhase, number> = {
  "black": 3000,
  "rain-stone": 9000,
  "lake": 9000,
  "castle-silhouette": 9000,
  "approaching": 10000,
  "gates": 8000,
  "courtyard": 8000,
  "doors": 8000,
  "opening": 7000,
  "entering": 5000,
  "done": 999999,
};

const PHASES: ApproachPhase[] = [
  "black", "rain-stone", "lake", "castle-silhouette", "approaching",
  "gates", "courtyard", "doors", "opening", "entering", "done"
];

const raindrops = Array.from({ length: 100 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 3,
  duration: 1.8 + Math.random() * 1.2,
  opacity: 0.04 + Math.random() * 0.06,
  length: 15 + Math.random() * 25,
}));

interface LandingProps {
  onComplete: () => void;
}

export function Landing({ onComplete }: LandingProps) {
  const [phase, setPhase] = useState<ApproachPhase>("black");
  const [showSkip, setShowSkip] = useState(false);
  const phaseIndex = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (phase === "done") {
      onComplete();
      return;
    }
    timerRef.current = setTimeout(() => {
      if (phaseIndex.current < PHASES.length - 1) {
        phaseIndex.current++;
        setPhase(PHASES[phaseIndex.current]);
      }
    }, PHASE_DURATIONS[phase]);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [phase, onComplete]);

  useEffect(() => {
    const t = setTimeout(() => setShowSkip(true), 4000);
    return () => clearTimeout(t);
  }, []);

  const skipToEnd = () => {
    setPhase("done");
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden" style={{ backgroundColor: "#050404" }}>
      {/* Skip */}
      {showSkip && phase !== "done" && (
        <motion.button
          className="absolute top-6 right-6 z-50 cursor-pointer"
          onClick={skipToEnd}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          <span className="font-cinzel text-[10px] tracking-[0.2em]" style={{ color: "rgba(80,75,68,0.2)" }}>
            Skip
          </span>
        </motion.button>
      )}

      {/* ===== BLACK ===== */}
      <AnimatePresence>
        {phase === "black" && (
          <motion.div className="absolute inset-0" exit={{ opacity: 0 }} transition={{ duration: 2 }}>
            <div className="absolute inset-0" style={{ backgroundColor: "#050404" }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== RAIN ON STONE ===== */}
      {/* Close-up of rain hitting ancient stone. Water drips. Lightning in distance. */}
      <AnimatePresence>
        {phase === "rain-stone" && (
          <motion.div className="absolute inset-0" exit={{ opacity: 0 }} transition={{ duration: 2.5 }}>
            <div className="absolute inset-0" style={{
              background: "linear-gradient(180deg, #080706, #0C0B09, #080706)",
            }} />

            {/* Stone surface texture — close-up */}
            <div className="absolute inset-0" style={{
              backgroundImage: `
                repeating-linear-gradient(90deg, transparent, transparent 80px, rgba(0,0,0,0.015) 80px, rgba(0,0,0,0.015) 81px),
                repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(0,0,0,0.01) 50px, rgba(0,0,0,0.01) 51px)
              `,
            }} />

            {/* Rain streaks */}
            {raindrops.slice(0, 60).map((drop) => (
              <motion.div
                key={drop.id}
                className="absolute"
                style={{
                  left: `${drop.x}%`,
                  width: 1,
                  height: drop.length,
                  background: `linear-gradient(180deg, transparent, rgba(138,154,170,${drop.opacity}), transparent)`,
                }}
                initial={{ top: "-5%", opacity: 0 }}
                animate={{ top: "105%", opacity: [0, drop.opacity, drop.opacity, 0] }}
                transition={{ duration: drop.duration, repeat: Infinity, delay: drop.delay, ease: "linear" }}
              />
            ))}

            {/* Water dripping on stone — small splash effects */}
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={`splash-${i}`}
                className="absolute rounded-full"
                style={{
                  left: `${15 + i * 10}%`,
                  bottom: `${20 + Math.random() * 15}%`,
                  width: 2,
                  height: 2,
                  backgroundColor: "rgba(138,154,170,0.06)",
                }}
                animate={{
                  scale: [0, 1.5, 0],
                  opacity: [0, 0.06, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 1.2,
                  ease: "easeOut",
                }}
              />
            ))}

            {/* Lightning flash */}
            <motion.div
              className="absolute inset-0"
              style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(180,190,210,0.03), transparent 60%)" }}
              animate={{ opacity: [0, 0, 0, 0.06, 0, 0.03, 0, 0, 0, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== THE LAKE ===== */}
      {/* Wide shot. Castle across the lake. Fog on water. Distant warm lights. */}
      <AnimatePresence>
        {phase === "lake" && (
          <motion.div className="absolute inset-0" exit={{ opacity: 0 }} transition={{ duration: 2.5 }}>
            <div className="absolute inset-0" style={{
              background: "linear-gradient(180deg, #050404, #080706, #0A0908)",
            }} />

            {/* Water surface */}
            <div className="absolute bottom-0 left-0 right-0 h-[45%]" style={{
              background: "linear-gradient(180deg, rgba(20,25,30,0.1), rgba(14,13,11,0.06))",
            }} />

            {/* Water reflections — horizontal shimmer */}
            {[42, 40, 38, 36, 34].map((y, i) => (
              <motion.div
                key={i}
                className="absolute left-0 right-0 h-[1px]"
                style={{ top: `${y}%`, backgroundColor: `rgba(138,154,170,${0.012 - i * 0.002})` }}
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.7 }}
              />
            ))}

            {/* Fog on water */}
            <motion.div
              className="absolute bottom-[30%] left-0 right-0 h-[25%]"
              style={{
                background: "linear-gradient(0deg, rgba(40,38,36,0.06), transparent)",
              }}
              animate={{ x: ["-3%", "3%", "-3%"] }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            />

            {/* Castle silhouette — across the lake */}
            <motion.div
              className="absolute bottom-[45%] left-1/2 -translate-x-1/2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.08 }}
              transition={{ duration: 4, delay: 1 }}
            >
              <div className="flex gap-px items-end">
                {/* Left wing */}
                <div className="w-[3px] h-8 rounded-t-sm" style={{ backgroundColor: "rgba(40,38,36,0.3)" }} />
                <div className="w-2 h-5 rounded-t-sm" style={{ backgroundColor: "rgba(40,38,36,0.25)" }} />
                <div className="w-[3px] h-14 rounded-t-full" style={{ backgroundColor: "rgba(40,38,36,0.35)" }} />
                <div className="w-3 h-8" style={{ backgroundColor: "rgba(40,38,36,0.2)" }} />
                <div className="w-[2px] h-10 rounded-t-full" style={{ backgroundColor: "rgba(40,38,36,0.3)" }} />
                <div className="w-4 h-6" style={{ backgroundColor: "rgba(40,38,36,0.15)" }} />
                {/* Central towers — tallest */}
                <div className="w-[3px] h-18 rounded-t-full" style={{ backgroundColor: "rgba(40,38,36,0.4)" }} />
                <div className="w-5 h-10" style={{ backgroundColor: "rgba(40,38,36,0.12)" }} />
                <div className="w-[3px] h-22 rounded-t-full" style={{ backgroundColor: "rgba(40,38,36,0.45)" }} />
                <div className="w-4 h-12" style={{ backgroundColor: "rgba(40,38,36,0.12)" }} />
                <div className="w-[3px] h-16 rounded-t-full" style={{ backgroundColor: "rgba(40,38,36,0.35)" }} />
                {/* Right wing */}
                <div className="w-3 h-8" style={{ backgroundColor: "rgba(40,38,36,0.15)" }} />
                <div className="w-[3px] h-12 rounded-t-full" style={{ backgroundColor: "rgba(40,38,36,0.3)" }} />
                <div className="w-2 h-6" style={{ backgroundColor: "rgba(40,38,36,0.2)" }} />
                <div className="w-[3px] h-8 rounded-t-full" style={{ backgroundColor: "rgba(40,38,36,0.25)" }} />
              </div>
            </motion.div>

            {/* Warm window lights in castle — tiny golden dots */}
            {[
              { x: 44, y: 43 }, { x: 47, y: 42 }, { x: 50, y: 41 },
              { x: 53, y: 42 }, { x: 56, y: 43 }, { x: 49, y: 39 },
              { x: 51, y: 39 },
            ].map((pos, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${pos.x}%`,
                  bottom: `${pos.y}%`,
                  width: 2,
                  height: 1.5,
                  backgroundColor: "rgba(255,213,79,0.1)",
                  boxShadow: "0 0 4px rgba(255,213,79,0.05)",
                }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
              />
            ))}

            {/* Rain continuing */}
            {raindrops.slice(0, 40).map((drop) => (
              <motion.div
                key={drop.id}
                className="absolute"
                style={{
                  left: `${drop.x}%`,
                  width: 1,
                  height: drop.length * 0.7,
                  background: `linear-gradient(180deg, transparent, rgba(138,154,170,${drop.opacity * 0.5}), transparent)`,
                }}
                initial={{ top: "-5%", opacity: 0 }}
                animate={{ top: "105%", opacity: [0, drop.opacity * 0.5, 0] }}
                transition={{ duration: drop.duration, repeat: Infinity, delay: drop.delay, ease: "linear" }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== CASTLE SILHOUETTE — Lightning reveals details ===== */}
      <AnimatePresence>
        {phase === "castle-silhouette" && (
          <motion.div className="absolute inset-0" exit={{ opacity: 0 }} transition={{ duration: 2.5 }}>
            <div className="absolute inset-0" style={{
              background: "linear-gradient(180deg, #040303, #060504, #080706)",
            }} />

            {/* Moon */}
            <motion.div
              className="absolute"
              style={{
                top: "12%",
                right: "22%",
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(200,210,230,0.05), rgba(200,210,230,0.015) 50%, transparent 70%)",
                boxShadow: "0 0 100px rgba(200,210,230,0.02)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 3 }}
            />

            {/* Stars */}
            {Array.from({ length: 25 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${5 + Math.random() * 90}%`,
                  top: `${3 + Math.random() * 35}%`,
                  width: 0.5 + Math.random() * 1,
                  height: 0.5 + Math.random() * 1,
                  backgroundColor: `rgba(200,210,230,${0.06 + Math.random() * 0.1})`,
                }}
                animate={{ opacity: [0.06, 0.12, 0.06] }}
                transition={{ duration: 4 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 5 }}
              />
            ))}

            {/* Castle — closer, more detail */}
            <motion.div
              className="absolute bottom-[30%] left-1/2 -translate-x-1/2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.12 }}
              transition={{ duration: 3 }}
            >
              <div className="flex gap-0 items-end">
                {/* Detailed castle silhouette */}
                <div className="w-[4px] h-12 rounded-t-sm" style={{ backgroundColor: "rgba(35,32,30,0.35)" }} />
                <div className="w-3 h-8 rounded-t-sm" style={{ backgroundColor: "rgba(35,32,30,0.3)" }} />
                <div className="w-[4px] h-20 rounded-t-full" style={{ backgroundColor: "rgba(35,32,30,0.4)" }} />
                <div className="w-4 h-14" style={{ backgroundColor: "rgba(35,32,30,0.2)" }} />
                <div className="w-[3px] h-12 rounded-t-full" style={{ backgroundColor: "rgba(35,32,30,0.35)" }} />
                <div className="w-5 h-8" style={{ backgroundColor: "rgba(35,32,30,0.15)" }} />
                <div className="w-[4px] h-28 rounded-t-full" style={{ backgroundColor: "rgba(35,32,30,0.5)" }} />
                <div className="w-6 h-14" style={{ backgroundColor: "rgba(35,32,30,0.12)" }} />
                <div className="w-[4px] h-32 rounded-t-full" style={{ backgroundColor: "rgba(35,32,30,0.55)" }} />
                <div className="w-5 h-16" style={{ backgroundColor: "rgba(35,32,30,0.12)" }} />
                <div className="w-[4px] h-24 rounded-t-full" style={{ backgroundColor: "rgba(35,32,30,0.45)" }} />
                <div className="w-4 h-10" style={{ backgroundColor: "rgba(35,32,30,0.15)" }} />
                <div className="w-[3px] h-16 rounded-t-full" style={{ backgroundColor: "rgba(35,32,30,0.35)" }} />
                <div className="w-3 h-8" style={{ backgroundColor: "rgba(35,32,30,0.2)" }} />
                <div className="w-[4px] h-12 rounded-t-full" style={{ backgroundColor: "rgba(35,32,30,0.3)" }} />
              </div>
            </motion.div>

            {/* Lightning — illuminates castle briefly */}
            <motion.div
              className="absolute inset-0"
              style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(180,190,210,0.04), transparent 50%)" }}
              animate={{ opacity: [0, 0, 0, 0.1, 0, 0.05, 0, 0, 0, 0, 0, 0] }}
              transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
            />

            {/* Rain */}
            {raindrops.slice(0, 30).map((drop) => (
              <motion.div
                key={drop.id}
                className="absolute"
                style={{
                  left: `${drop.x}%`,
                  width: 1,
                  height: drop.length * 0.5,
                  background: `linear-gradient(180deg, transparent, rgba(138,154,170,${drop.opacity * 0.3}), transparent)`,
                }}
                initial={{ top: "-5%", opacity: 0 }}
                animate={{ top: "105%", opacity: [0, drop.opacity * 0.3, 0] }}
                transition={{ duration: drop.duration, repeat: Infinity, delay: drop.delay, ease: "linear" }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== APPROACHING — Walking toward the castle ===== */}
      <AnimatePresence>
        {phase === "approaching" && (
          <motion.div className="absolute inset-0" exit={{ opacity: 0 }} transition={{ duration: 2.5 }}>
            <div className="absolute inset-0" style={{
              background: "linear-gradient(180deg, #040303, #080706, #0C0B09)",
            }} />

            {/* Stone walls rising on sides — we're walking through a passage */}
            <motion.div
              className="absolute top-0 bottom-0 left-0"
              style={{ width: "18%", background: "linear-gradient(90deg, rgba(35,32,30,0.2), transparent)" }}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              transition={{ duration: 8, ease: "easeOut" }}
            />
            <motion.div
              className="absolute top-0 bottom-0 right-0"
              style={{ width: "18%", background: "linear-gradient(270deg, rgba(35,32,30,0.2), transparent)" }}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              transition={{ duration: 8, ease: "easeOut" }}
            />

            {/* Stone texture on walls */}
            <div className="absolute inset-0" style={{
              backgroundImage: `
                repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(0,0,0,0.01) 60px, rgba(0,0,0,0.01) 61px),
                repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(0,0,0,0.008) 40px, rgba(0,0,0,0.008) 41px)
              `,
            }} />

            {/* Castle ahead — growing larger as we approach */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.15 }}
              transition={{ duration: 10, ease: "easeOut" }}
            >
              {/* Gothic arch entrance */}
              <div className="relative" style={{ width: 200, height: 300 }}>
                {/* Left tower */}
                <div className="absolute bottom-0 left-0 w-8 h-full" style={{ backgroundColor: "rgba(40,38,36,0.2)", borderRight: "1px solid rgba(50,46,42,0.05)" }} />
                {/* Right tower */}
                <div className="absolute bottom-0 right-0 w-8 h-full" style={{ backgroundColor: "rgba(40,38,36,0.2)", borderLeft: "1px solid rgba(50,46,42,0.05)" }} />
                {/* Pointed arch */}
                <div className="absolute top-0 left-8 right-8" style={{
                  height: 150,
                  borderRadius: "100px 100px 0 0",
                  border: "2px solid rgba(50,46,42,0.08)",
                  borderBottom: "none",
                }} />
                {/* Inner darkness */}
                <div className="absolute top-[60px] left-[40px] right-[40px] bottom-0" style={{
                  borderRadius: "60px 60px 0 0",
                  background: "linear-gradient(180deg, rgba(5,4,4,0.3), rgba(5,4,4,0.6))",
                }} />
                {/* Warm glow from within */}
                <motion.div
                  className="absolute top-[80px] left-[50px] right-[50px] bottom-0"
                  style={{
                    borderRadius: "50px 50px 0 0",
                    background: "radial-gradient(ellipse at 50% 30%, rgba(255,213,79,0.04), transparent 70%)",
                  }}
                  animate={{ opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </motion.div>

            {/* Ground — cobblestones */}
            <div className="absolute bottom-0 left-0 right-0 h-[20%]" style={{
              background: "linear-gradient(0deg, rgba(30,28,26,0.1), transparent)",
            }} />

            {/* Rain easing */}
            {raindrops.slice(0, 20).map((drop) => (
              <motion.div
                key={drop.id}
                className="absolute"
                style={{
                  left: `${drop.x}%`,
                  width: 1,
                  height: drop.length * 0.4,
                  background: `linear-gradient(180deg, transparent, rgba(138,154,170,${drop.opacity * 0.2}), transparent)`,
                }}
                initial={{ top: "-5%", opacity: 0 }}
                animate={{ top: "105%", opacity: [0, drop.opacity * 0.2, 0] }}
                transition={{ duration: drop.duration, repeat: Infinity, delay: drop.delay, ease: "linear" }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== GATES — Iron gates, ivy walls ===== */}
      <AnimatePresence>
        {phase === "gates" && (
          <motion.div className="absolute inset-0 flex items-center justify-center" exit={{ opacity: 0 }} transition={{ duration: 2.5 }}>
            <div className="absolute inset-0" style={{
              background: "linear-gradient(180deg, #050404, #0A0908, #0C0B09)",
            }} />

            {/* Stone gateposts */}
            <motion.div
              className="absolute left-[15%] top-[10%] bottom-[15%] w-[6%]"
              style={{ backgroundColor: "rgba(40,38,36,0.15)" }}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 3, ease: "easeOut" }}
            >
              {/* Ivy */}
              <div className="absolute top-[10%] left-0 w-full h-[30%]" style={{
                background: "linear-gradient(180deg, rgba(31,58,42,0.08), transparent)",
              }} />
            </motion.div>

            <motion.div
              className="absolute right-[15%] top-[10%] bottom-[15%] w-[6%]"
              style={{ backgroundColor: "rgba(40,38,36,0.15)" }}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 3, ease: "easeOut" }}
            >
              <div className="absolute top-[10%] right-0 w-full h-[30%]" style={{
                background: "linear-gradient(180deg, rgba(31,58,42,0.08), transparent)",
              }} />
            </motion.div>

            {/* Iron gate bars */}
            <motion.div
              className="relative flex gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.12 }}
              transition={{ duration: 3, delay: 1 }}
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="w-[2px] h-40" style={{
                  backgroundColor: "rgba(74,74,74,0.25)",
                  borderRadius: "1px 1px 0 0",
                }} />
              ))}
              {/* Horizontal bar */}
              <div className="absolute top-[20%] left-0 right-0 h-[2px]" style={{ backgroundColor: "rgba(74,74,74,0.2)" }} />
              <div className="absolute top-[60%] left-0 right-0 h-[2px]" style={{ backgroundColor: "rgba(74,74,74,0.15)" }} />
            </motion.div>

            {/* Path through gates — warm light ahead */}
            <motion.div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[30%] h-[40%]"
              style={{
                background: "radial-gradient(ellipse at 50% 0%, rgba(255,213,79,0.03), transparent 70%)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 4, delay: 2 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== COURTYARD — Open space, fountain, rain lessening ===== */}
      <AnimatePresence>
        {phase === "courtyard" && (
          <motion.div className="absolute inset-0" exit={{ opacity: 0 }} transition={{ duration: 2.5 }}>
            <div className="absolute inset-0" style={{
              background: "linear-gradient(180deg, #060504, #0A0908, #0C0B09)",
            }} />

            {/* Castle walls surrounding courtyard */}
            {[
              { side: "left", w: "20%", bg: "linear-gradient(90deg, rgba(35,32,30,0.18), transparent)" },
              { side: "right", w: "20%", bg: "linear-gradient(270deg, rgba(35,32,30,0.18), transparent)" },
              { side: "top", h: "25%", bg: "linear-gradient(180deg, rgba(35,32,30,0.15), transparent)" },
            ].map((wall, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  ...(wall.side === "left" ? { top: 0, bottom: 0, left: 0, width: wall.w, background: wall.bg } : {}),
                  ...(wall.side === "right" ? { top: 0, bottom: 0, right: 0, width: wall.w, background: wall.bg } : {}),
                  ...(wall.side === "top" ? { top: 0, left: 0, right: 0, height: wall.h, background: wall.bg } : {}),
                }}
              />
            ))}

            {/* Central fountain — simple stone structure */}
            <motion.div
              className="absolute bottom-[25%] left-1/2 -translate-x-1/2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.1, y: 0 }}
              transition={{ duration: 3, delay: 1 }}
            >
              {/* Basin */}
              <div className="relative" style={{ width: 80, height: 40 }}>
                <div className="absolute bottom-0 left-0 right-0 h-5 rounded-b-full" style={{ backgroundColor: "rgba(50,46,42,0.2)" }} />
                {/* Water surface */}
                <motion.div
                  className="absolute bottom-1 left-[10%] right-[10%] h-[3px] rounded-full"
                  style={{ backgroundColor: "rgba(138,154,170,0.04)" }}
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* Central spout */}
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[2px] h-8" style={{ backgroundColor: "rgba(50,46,42,0.15)" }} />
              </div>
            </motion.div>

            {/* Rain lessening — fewer drops */}
            {raindrops.slice(0, 15).map((drop) => (
              <motion.div
                key={drop.id}
                className="absolute"
                style={{
                  left: `${drop.x}%`,
                  width: 1,
                  height: drop.length * 0.3,
                  background: `linear-gradient(180deg, transparent, rgba(138,154,170,${drop.opacity * 0.15}), transparent)`,
                }}
                initial={{ top: "-5%", opacity: 0 }}
                animate={{ top: "105%", opacity: [0, drop.opacity * 0.15, 0] }}
                transition={{ duration: drop.duration, repeat: Infinity, delay: drop.delay, ease: "linear" }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== DOORS — Great oak doors, brass handles ===== */}
      <AnimatePresence>
        {phase === "doors" && (
          <motion.div className="absolute inset-0 flex items-center justify-center" exit={{ opacity: 0 }} transition={{ duration: 2.5 }}>
            <div className="absolute inset-0" style={{
              background: "linear-gradient(180deg, #080706, #0C0B09, #0E0D0B)",
            }} />

            {/* Door frame — stone arch */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 3, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Stone arch frame */}
              <div className="absolute -inset-4 rounded-t-[60px]" style={{
                border: "4px solid rgba(40,38,36,0.1)",
                borderBottom: "none",
              }} />

              {/* Left door */}
              <div className="relative inline-block" style={{ width: 90, height: 200 }}>
                <div
                  className="absolute inset-0 rounded-t-[45px] overflow-hidden"
                  style={{
                    background: "linear-gradient(180deg, rgba(61,43,31,0.2), rgba(42,29,20,0.3))",
                    border: "1px solid rgba(90,60,40,0.08)",
                    borderRight: "0.5px solid rgba(90,60,40,0.04)",
                  }}
                >
                  {/* Wood grain */}
                  <div className="absolute inset-0" style={{
                    backgroundImage: "repeating-linear-gradient(87deg, transparent, transparent 3px, rgba(0,0,0,0.02) 3px, rgba(0,0,0,0.02) 5px)",
                  }} />
                  {/* Panel */}
                  <div className="absolute inset-3" style={{ border: "0.5px solid rgba(90,60,40,0.04)" }} />
                  {/* Iron studs */}
                  {[20, 40, 60, 80].map((y) => (
                    <div key={y} className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full" style={{
                      top: `${y}%`,
                      backgroundColor: "rgba(74,74,74,0.1)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
                    }} />
                  ))}
                  {/* Handle — brass */}
                  <div className="absolute top-1/2 right-3 w-2.5 h-6 rounded-full" style={{
                    background: "linear-gradient(135deg, rgba(184,134,11,0.12), rgba(139,105,20,0.08))",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                  }} />
                </div>
              </div>

              {/* Right door */}
              <div className="relative inline-block" style={{ width: 90, height: 200 }}>
                <div
                  className="absolute inset-0 rounded-t-[45px] overflow-hidden"
                  style={{
                    background: "linear-gradient(180deg, rgba(61,43,31,0.2), rgba(42,29,20,0.3))",
                    border: "1px solid rgba(90,60,40,0.08)",
                    borderLeft: "0.5px solid rgba(90,60,40,0.04)",
                  }}
                >
                  <div className="absolute inset-0" style={{
                    backgroundImage: "repeating-linear-gradient(87deg, transparent, transparent 3px, rgba(0,0,0,0.02) 3px, rgba(0,0,0,0.02) 5px)",
                  }} />
                  <div className="absolute inset-3" style={{ border: "0.5px solid rgba(90,60,40,0.04)" }} />
                  {[20, 40, 60, 80].map((y) => (
                    <div key={y} className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full" style={{
                      top: `${y}%`,
                      backgroundColor: "rgba(74,74,74,0.1)",
                    }} />
                  ))}
                  <div className="absolute top-1/2 left-3 w-2.5 h-6 rounded-full" style={{
                    background: "linear-gradient(135deg, rgba(184,134,11,0.12), rgba(139,105,20,0.08))",
                  }} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== OPENING — Doors swing open, warm light ===== */}
      <AnimatePresence>
        {phase === "opening" && (
          <motion.div className="absolute inset-0 flex items-center justify-center" exit={{ opacity: 0 }} transition={{ duration: 2 }}>
            <div className="absolute inset-0" style={{
              background: "linear-gradient(180deg, #080706, #0C0B09, #0E0D0B)",
            }} />

            {/* Stone arch frame */}
            <div className="absolute -inset-4 rounded-t-[60px]" style={{
              border: "4px solid rgba(40,38,36,0.08)",
              borderBottom: "none",
              pointerEvents: "none",
              zIndex: 10,
            }} />

            {/* Left door — opening */}
            <motion.div
              className="absolute top-[10%] left-[20%] w-[15%] h-[80%] origin-left overflow-hidden"
              style={{
                background: "linear-gradient(180deg, rgba(61,43,31,0.18), rgba(42,29,20,0.25))",
                borderRight: "1px solid rgba(90,60,40,0.06)",
                borderRadius: "30px 0 0 0",
              }}
              initial={{ rotateY: 0 }}
              animate={{ rotateY: -70 }}
              transition={{ duration: 3.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="absolute inset-0" style={{
                backgroundImage: "repeating-linear-gradient(87deg, transparent, transparent 3px, rgba(0,0,0,0.015) 3px, rgba(0,0,0,0.015) 5px)",
              }} />
              <div className="absolute inset-3" style={{ border: "0.5px solid rgba(90,60,40,0.03)" }} />
            </motion.div>

            {/* Right door — opening */}
            <motion.div
              className="absolute top-[10%] right-[20%] w-[15%] h-[80%] origin-right overflow-hidden"
              style={{
                background: "linear-gradient(180deg, rgba(61,43,31,0.18), rgba(42,29,20,0.25))",
                borderLeft: "1px solid rgba(90,60,40,0.06)",
                borderRadius: "0 30px 0 0",
              }}
              initial={{ rotateY: 0 }}
              animate={{ rotateY: 70 }}
              transition={{ duration: 3.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="absolute inset-0" style={{
                backgroundImage: "repeating-linear-gradient(87deg, transparent, transparent 3px, rgba(0,0,0,0.015) 3px, rgba(0,0,0,0.015) 5px)",
              }} />
              <div className="absolute inset-3" style={{ border: "0.5px solid rgba(90,60,40,0.03)" }} />
            </motion.div>

            {/* Warm light spilling through */}
            <motion.div
              className="absolute inset-0 z-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, delay: 1.5 }}
            >
              <div className="absolute inset-0" style={{
                background: "radial-gradient(ellipse at 50% 50%, rgba(255,213,79,0.06), transparent 55%)",
              }} />
            </motion.div>

            {/* Rain stopping — outside visible through opening doors */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0.3 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 4, delay: 1 }}
            >
              {raindrops.slice(0, 10).map((drop) => (
                <div
                  key={drop.id}
                  className="absolute"
                  style={{
                    left: `${drop.x}%`,
                    width: 1,
                    height: drop.length * 0.3,
                    background: `linear-gradient(180deg, transparent, rgba(138,154,170,${drop.opacity * 0.1}), transparent)`,
                    top: `${Math.random() * 100}%`,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== ENTERING — Walking through into candlelight ===== */}
      <AnimatePresence>
        {phase === "entering" && (
          <motion.div className="absolute inset-0" exit={{ opacity: 0 }} transition={{ duration: 1.5 }}>
            <div className="absolute inset-0" style={{
              background: "linear-gradient(180deg, #0A0908, #0E0D0B, #0C0B09)",
            }} />

            {/* Stone floor approaching */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-[40%]"
              style={{ background: "linear-gradient(0deg, rgba(25,23,21,0.15), transparent)" }}
              initial={{ y: "20%" }}
              animate={{ y: 0 }}
              transition={{ duration: 4, ease: "easeOut" }}
            />

            {/* Candlelight ahead — warm glow growing */}
            <motion.div
              className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[60%] h-[50%]"
              style={{
                background: "radial-gradient(ellipse at 50% 30%, rgba(255,213,79,0.05), transparent 60%)",
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 3, ease: "easeOut" }}
            />

            {/* Distant floating candle glows */}
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${25 + i * 7}%`,
                  top: `${15 + Math.random() * 20}%`,
                  width: 30 + Math.random() * 20,
                  height: 30 + Math.random() * 20,
                  background: `radial-gradient(circle, rgba(255,213,79,${0.01 + Math.random() * 0.01}), transparent 70%)`,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2, delay: 1 + i * 0.3 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
