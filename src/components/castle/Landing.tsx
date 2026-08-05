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
  "black": 4000,
  "rain-stone": 10000,
  "lake": 10000,
  "castle-silhouette": 10000,
  "approaching": 12000,
  "gates": 9000,
  "courtyard": 9000,
  "doors": 9000,
  "opening": 8000,
  "entering": 6000,
  "done": 999999,
};

const PHASES: ApproachPhase[] = [
  "black", "rain-stone", "lake", "castle-silhouette", "approaching",
  "gates", "courtyard", "doors", "opening", "entering", "done"
];

const raindrops = Array.from({ length: 120 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 3,
  duration: 1.5 + Math.random() * 1,
  opacity: 0.15 + Math.random() * 0.2,
  length: 20 + Math.random() * 40,
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
    const t = setTimeout(() => setShowSkip(true), 5000);
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
          className="absolute top-6 right-6 z-50 cursor-pointer px-3 py-1.5 rounded-sm"
          style={{
            background: "linear-gradient(135deg, rgba(25,23,21,0.4), rgba(18,16,14,0.5))",
            border: "1px solid rgba(55,50,45,0.15)",
          }}
          onClick={skipToEnd}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          whileHover={{ borderColor: "rgba(80,75,68,0.3)" }}
        >
          <span className="font-cinzel text-[10px] tracking-[0.2em] text-engraved">
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
      <AnimatePresence>
        {phase === "rain-stone" && (
          <motion.div className="absolute inset-0" exit={{ opacity: 0 }} transition={{ duration: 2.5 }}>
            <div className="absolute inset-0" style={{
              background: "linear-gradient(180deg, #0A0908, #100F0D, #0A0908)",
            }} />

            {/* Stone surface texture — close-up */}
            <div className="absolute inset-0" style={{
              backgroundImage: `
                repeating-linear-gradient(90deg, transparent, transparent 80px, rgba(0,0,0,0.04) 80px, rgba(0,0,0,0.04) 81px),
                repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(0,0,0,0.03) 50px, rgba(0,0,0,0.03) 51px)
              `,
            }} />

            {/* Rain streaks */}
            {raindrops.slice(0, 70).map((drop) => (
              <motion.div
                key={drop.id}
                className="absolute"
                style={{
                  left: `${drop.x}%`,
                  width: 1.5,
                  height: drop.length,
                  background: `linear-gradient(180deg, transparent, rgba(160,175,195,${drop.opacity}), transparent)`,
                }}
                initial={{ top: "-5%", opacity: 0 }}
                animate={{ top: "105%", opacity: [0, drop.opacity, drop.opacity, 0] }}
                transition={{ duration: drop.duration, repeat: Infinity, delay: drop.delay, ease: "linear" }}
              />
            ))}

            {/* Water dripping on stone — splash effects */}
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={`splash-${i}`}
                className="absolute rounded-full"
                style={{
                  left: `${10 + i * 7}%`,
                  bottom: `${15 + Math.random() * 20}%`,
                  width: 3,
                  height: 3,
                  backgroundColor: "rgba(160,175,195,0.15)",
                }}
                animate={{
                  scale: [0, 2, 0],
                  opacity: [0, 0.15, 0],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.9,
                  ease: "easeOut",
                }}
              />
            ))}

            {/* Lightning flash — brighter */}
            <motion.div
              className="absolute inset-0"
              style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(200,210,235,0.08), transparent 55%)" }}
              animate={{ opacity: [0, 0, 0, 0.15, 0, 0.08, 0, 0, 0, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== THE LAKE ===== */}
      <AnimatePresence>
        {phase === "lake" && (
          <motion.div className="absolute inset-0" exit={{ opacity: 0 }} transition={{ duration: 2.5 }}>
            <div className="absolute inset-0" style={{
              background: "linear-gradient(180deg, #060505, #0C0B09, #0E0D0B)",
            }} />

            {/* Water surface — deeper */}
            <div className="absolute bottom-0 left-0 right-0 h-[45%]" style={{
              background: "linear-gradient(180deg, rgba(25,30,40,0.2), rgba(14,13,11,0.15))",
            }} />

            {/* Water reflections — visible shimmer */}
            {[42, 40, 38, 36, 34, 32].map((y, i) => (
              <motion.div
                key={i}
                className="absolute left-0 right-0 h-[1.5px]"
                style={{ top: `${y}%`, backgroundColor: `rgba(160,175,195,${0.06 - i * 0.008})` }}
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.7 }}
              />
            ))}

            {/* Fog on water — more visible */}
            <motion.div
              className="absolute bottom-[25%] left-0 right-0 h-[30%]"
              style={{
                background: "linear-gradient(0deg, rgba(60,58,56,0.12), transparent)",
              }}
              animate={{ x: ["-5%", "5%", "-5%"] }}
              transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
            />

            {/* Castle silhouette — across the lake, more visible */}
            <motion.div
              className="absolute bottom-[45%] left-1/2 -translate-x-1/2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.25 }}
              transition={{ duration: 4, delay: 1 }}
            >
              <div className="flex gap-px items-end">
                {/* Left wing */}
                <div className="w-[4px] h-10 rounded-t-sm" style={{ backgroundColor: "rgba(50,48,45,0.5)" }} />
                <div className="w-2.5 h-7 rounded-t-sm" style={{ backgroundColor: "rgba(50,48,45,0.4)" }} />
                <div className="w-[4px] h-18 rounded-t-full" style={{ backgroundColor: "rgba(50,48,45,0.55)" }} />
                <div className="w-4 h-10" style={{ backgroundColor: "rgba(50,48,45,0.3)" }} />
                <div className="w-[3px] h-14 rounded-t-full" style={{ backgroundColor: "rgba(50,48,45,0.45)" }} />
                <div className="w-5 h-8" style={{ backgroundColor: "rgba(50,48,45,0.25)" }} />
                {/* Central towers — tallest */}
                <div className="w-[4px] h-24 rounded-t-full" style={{ backgroundColor: "rgba(50,48,45,0.6)" }} />
                <div className="w-6 h-14" style={{ backgroundColor: "rgba(50,48,45,0.2)" }} />
                <div className="w-[5px] h-30 rounded-t-full" style={{ backgroundColor: "rgba(50,48,45,0.7)" }} />
                <div className="w-5 h-16" style={{ backgroundColor: "rgba(50,48,45,0.2)" }} />
                <div className="w-[4px] h-20 rounded-t-full" style={{ backgroundColor: "rgba(50,48,45,0.55)" }} />
                {/* Right wing */}
                <div className="w-4 h-10" style={{ backgroundColor: "rgba(50,48,45,0.25)" }} />
                <div className="w-[4px] h-16 rounded-t-full" style={{ backgroundColor: "rgba(50,48,45,0.45)" }} />
                <div className="w-3 h-8" style={{ backgroundColor: "rgba(50,48,45,0.3)" }} />
                <div className="w-[4px] h-10 rounded-t-full" style={{ backgroundColor: "rgba(50,48,45,0.4)" }} />
              </div>
            </motion.div>

            {/* Warm window lights in castle — brighter golden dots */}
            {[
              { x: 44, y: 43 }, { x: 47, y: 42 }, { x: 50, y: 41 },
              { x: 53, y: 42 }, { x: 56, y: 43 }, { x: 49, y: 39 },
              { x: 51, y: 39 }, { x: 46, y: 40 }, { x: 54, y: 40 },
            ].map((pos, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${pos.x}%`,
                  bottom: `${pos.y}%`,
                  width: 3,
                  height: 2.5,
                  backgroundColor: "rgba(255,213,79,0.3)",
                  boxShadow: "0 0 8px rgba(255,213,79,0.15), 0 0 16px rgba(255,213,79,0.06)",
                }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
              />
            ))}

            {/* Rain continuing — visible */}
            {raindrops.slice(0, 50).map((drop) => (
              <motion.div
                key={drop.id}
                className="absolute"
                style={{
                  left: `${drop.x}%`,
                  width: 1,
                  height: drop.length * 0.7,
                  background: `linear-gradient(180deg, transparent, rgba(160,175,195,${drop.opacity * 0.6}), transparent)`,
                }}
                initial={{ top: "-5%", opacity: 0 }}
                animate={{ top: "105%", opacity: [0, drop.opacity * 0.6, 0] }}
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
              background: "linear-gradient(180deg, #050404, #080706, #0A0908)",
            }} />

            {/* Moon — brighter */}
            <motion.div
              className="absolute"
              style={{
                top: "12%",
                right: "22%",
                width: 140,
                height: 140,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(210,220,240,0.12), rgba(210,220,240,0.04) 45%, transparent 65%)",
                boxShadow: "0 0 120px rgba(210,220,240,0.06), 0 0 200px rgba(210,220,240,0.03)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 3 }}
            />

            {/* Stars — more visible */}
            {Array.from({ length: 35 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${5 + Math.random() * 90}%`,
                  top: `${3 + Math.random() * 35}%`,
                  width: 0.8 + Math.random() * 1.5,
                  height: 0.8 + Math.random() * 1.5,
                  backgroundColor: `rgba(210,220,240,${0.15 + Math.random() * 0.2})`,
                }}
                animate={{ opacity: [0.15, 0.3, 0.15] }}
                transition={{ duration: 4 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 5 }}
              />
            ))}

            {/* Castle — more visible, more detail */}
            <motion.div
              className="absolute bottom-[30%] left-1/2 -translate-x-1/2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.35 }}
              transition={{ duration: 3 }}
            >
              <div className="flex gap-0 items-end">
                <div className="w-[5px] h-16 rounded-t-sm" style={{ backgroundColor: "rgba(45,42,40,0.5)" }} />
                <div className="w-4 h-10 rounded-t-sm" style={{ backgroundColor: "rgba(45,42,40,0.45)" }} />
                <div className="w-[5px] h-26 rounded-t-full" style={{ backgroundColor: "rgba(45,42,40,0.55)" }} />
                <div className="w-5 h-18" style={{ backgroundColor: "rgba(45,42,40,0.3)" }} />
                <div className="w-[4px] h-16 rounded-t-full" style={{ backgroundColor: "rgba(45,42,40,0.5)" }} />
                <div className="w-6 h-10" style={{ backgroundColor: "rgba(45,42,40,0.25)" }} />
                <div className="w-[5px] h-36 rounded-t-full" style={{ backgroundColor: "rgba(45,42,40,0.65)" }} />
                <div className="w-7 h-18" style={{ backgroundColor: "rgba(45,42,40,0.2)" }} />
                <div className="w-[6px] h-44 rounded-t-full" style={{ backgroundColor: "rgba(45,42,40,0.75)" }} />
                <div className="w-6 h-20" style={{ backgroundColor: "rgba(45,42,40,0.2)" }} />
                <div className="w-[5px] h-32 rounded-t-full" style={{ backgroundColor: "rgba(45,42,40,0.6)" }} />
                <div className="w-5 h-14" style={{ backgroundColor: "rgba(45,42,40,0.25)" }} />
                <div className="w-[4px] h-20 rounded-t-full" style={{ backgroundColor: "rgba(45,42,40,0.5)" }} />
                <div className="w-4 h-10" style={{ backgroundColor: "rgba(45,42,40,0.3)" }} />
                <div className="w-[5px] h-16 rounded-t-full" style={{ backgroundColor: "rgba(45,42,40,0.45)" }} />
              </div>
            </motion.div>

            {/* Lightning — dramatic illumination */}
            <motion.div
              className="absolute inset-0"
              style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(200,210,235,0.1), transparent 45%)" }}
              animate={{ opacity: [0, 0, 0, 0.25, 0, 0.12, 0, 0, 0, 0, 0, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            />

            {/* Rain */}
            {raindrops.slice(0, 35).map((drop) => (
              <motion.div
                key={drop.id}
                className="absolute"
                style={{
                  left: `${drop.x}%`,
                  width: 1,
                  height: drop.length * 0.6,
                  background: `linear-gradient(180deg, transparent, rgba(160,175,195,${drop.opacity * 0.4}), transparent)`,
                }}
                initial={{ top: "-5%", opacity: 0 }}
                animate={{ top: "105%", opacity: [0, drop.opacity * 0.4, 0] }}
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
              background: "linear-gradient(180deg, #050404, #0A0908, #0E0D0B)",
            }} />

            {/* Stone walls rising on sides — more visible */}
            <motion.div
              className="absolute top-0 bottom-0 left-0"
              style={{ width: "22%", background: "linear-gradient(90deg, rgba(45,42,40,0.4), transparent)" }}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              transition={{ duration: 8, ease: "easeOut" }}
            />
            <motion.div
              className="absolute top-0 bottom-0 right-0"
              style={{ width: "22%", background: "linear-gradient(270deg, rgba(45,42,40,0.4), transparent)" }}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              transition={{ duration: 8, ease: "easeOut" }}
            />

            {/* Stone texture on walls */}
            <div className="absolute inset-0" style={{
              backgroundImage: `
                repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(0,0,0,0.03) 60px, rgba(0,0,0,0.03) 61px),
                repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(0,0,0,0.02) 40px, rgba(0,0,0,0.02) 41px)
              `,
            }} />

            {/* Castle ahead — growing larger, more visible */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.4 }}
              transition={{ duration: 10, ease: "easeOut" }}
            >
              {/* Gothic arch entrance */}
              <div className="relative" style={{ width: 240, height: 360 }}>
                {/* Left tower */}
                <div className="absolute bottom-0 left-0 w-10 h-full" style={{ backgroundColor: "rgba(50,48,45,0.35)", borderRight: "1px solid rgba(60,56,52,0.1)" }} />
                {/* Right tower */}
                <div className="absolute bottom-0 right-0 w-10 h-full" style={{ backgroundColor: "rgba(50,48,45,0.35)", borderLeft: "1px solid rgba(60,56,52,0.1)" }} />
                {/* Pointed arch */}
                <div className="absolute top-0 left-10 right-10" style={{
                  height: 180,
                  borderRadius: "120px 120px 0 0",
                  border: "3px solid rgba(60,56,52,0.15)",
                  borderBottom: "none",
                }} />
                {/* Inner darkness */}
                <div className="absolute top-[70px] left-[50px] right-[50px] bottom-0" style={{
                  borderRadius: "70px 70px 0 0",
                  background: "linear-gradient(180deg, rgba(5,4,4,0.5), rgba(5,4,4,0.8))",
                }} />
                {/* Warm glow from within — brighter */}
                <motion.div
                  className="absolute top-[90px] left-[60px] right-[60px] bottom-0"
                  style={{
                    borderRadius: "60px 60px 0 0",
                    background: "radial-gradient(ellipse at 50% 30%, rgba(255,213,79,0.12), transparent 65%)",
                  }}
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </motion.div>

            {/* Ground — cobblestones */}
            <div className="absolute bottom-0 left-0 right-0 h-[25%]" style={{
              background: "linear-gradient(0deg, rgba(35,32,30,0.2), transparent)",
            }} />

            {/* Rain easing */}
            {raindrops.slice(0, 25).map((drop) => (
              <motion.div
                key={drop.id}
                className="absolute"
                style={{
                  left: `${drop.x}%`,
                  width: 1,
                  height: drop.length * 0.5,
                  background: `linear-gradient(180deg, transparent, rgba(160,175,195,${drop.opacity * 0.3}), transparent)`,
                }}
                initial={{ top: "-5%", opacity: 0 }}
                animate={{ top: "105%", opacity: [0, drop.opacity * 0.3, 0] }}
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
              background: "linear-gradient(180deg, #060505, #0C0B09, #0E0D0B)",
            }} />

            {/* Stone gateposts — more visible */}
            <motion.div
              className="absolute left-[12%] top-[8%] bottom-[12%] w-[8%]"
              style={{ backgroundColor: "rgba(50,48,45,0.35)" }}
              initial={{ x: -60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 3, ease: "easeOut" }}
            >
              {/* Ivy */}
              <div className="absolute top-[8%] left-0 w-full h-[35%]" style={{
                background: "linear-gradient(180deg, rgba(40,70,50,0.18), transparent)",
              }} />
            </motion.div>

            <motion.div
              className="absolute right-[12%] top-[8%] bottom-[12%] w-[8%]"
              style={{ backgroundColor: "rgba(50,48,45,0.35)" }}
              initial={{ x: 60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 3, ease: "easeOut" }}
            >
              <div className="absolute top-[8%] right-0 w-full h-[35%]" style={{
                background: "linear-gradient(180deg, rgba(40,70,50,0.18), transparent)",
              }} />
            </motion.div>

            {/* Iron gate bars — more visible */}
            <motion.div
              className="relative flex gap-3.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ duration: 3, delay: 1 }}
            >
              {Array.from({ length: 14 }).map((_, i) => (
                <div key={i} className="w-[2.5px] h-48" style={{
                  backgroundColor: "rgba(90,90,90,0.4)",
                  borderRadius: "1px 1px 0 0",
                }} />
              ))}
              {/* Horizontal bars */}
              <div className="absolute top-[18%] left-0 right-0 h-[2.5px]" style={{ backgroundColor: "rgba(90,90,90,0.35)" }} />
              <div className="absolute top-[55%] left-0 right-0 h-[2.5px]" style={{ backgroundColor: "rgba(90,90,90,0.25)" }} />
            </motion.div>

            {/* Path through gates — warm light ahead */}
            <motion.div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[35%] h-[45%]"
              style={{
                background: "radial-gradient(ellipse at 50% 0%, rgba(255,213,79,0.08), transparent 65%)",
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
              background: "linear-gradient(180deg, #070605, #0C0B09, #0E0D0B)",
            }} />

            {/* Castle walls surrounding courtyard — more visible */}
            {[
              { side: "left", w: "22%", bg: "linear-gradient(90deg, rgba(45,42,40,0.35), transparent)" },
              { side: "right", w: "22%", bg: "linear-gradient(270deg, rgba(45,42,40,0.35), transparent)" },
              { side: "top", h: "28%", bg: "linear-gradient(180deg, rgba(45,42,40,0.3), transparent)" },
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

            {/* Central fountain — more visible */}
            <motion.div
              className="absolute bottom-[22%] left-1/2 -translate-x-1/2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.25, y: 0 }}
              transition={{ duration: 3, delay: 1 }}
            >
              {/* Basin */}
              <div className="relative" style={{ width: 100, height: 50 }}>
                <div className="absolute bottom-0 left-0 right-0 h-6 rounded-b-full" style={{ backgroundColor: "rgba(60,56,52,0.35)" }} />
                {/* Water surface */}
                <motion.div
                  className="absolute bottom-1.5 left-[10%] right-[10%] h-[4px] rounded-full"
                  style={{ backgroundColor: "rgba(160,175,195,0.1)" }}
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* Central spout */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[3px] h-10" style={{ backgroundColor: "rgba(60,56,52,0.3)" }} />
              </div>
            </motion.div>

            {/* Rain lessening — fewer drops */}
            {raindrops.slice(0, 18).map((drop) => (
              <motion.div
                key={drop.id}
                className="absolute"
                style={{
                  left: `${drop.x}%`,
                  width: 1,
                  height: drop.length * 0.35,
                  background: `linear-gradient(180deg, transparent, rgba(160,175,195,${drop.opacity * 0.2}), transparent)`,
                }}
                initial={{ top: "-5%", opacity: 0 }}
                animate={{ top: "105%", opacity: [0, drop.opacity * 0.2, 0] }}
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
              background: "linear-gradient(180deg, #0A0908, #0E0D0B, #100F0D)",
            }} />

            {/* Door frame — stone arch */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 3, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Stone arch frame — more visible */}
              <div className="absolute -inset-6 rounded-t-[70px]" style={{
                border: "5px solid rgba(50,48,45,0.2)",
                borderBottom: "none",
              }} />

              {/* Left door */}
              <div className="relative inline-block" style={{ width: 110, height: 240 }}>
                <div
                  className="absolute inset-0 rounded-t-[55px] overflow-hidden"
                  style={{
                    background: "linear-gradient(180deg, rgba(80,56,40,0.35), rgba(55,38,28,0.45))",
                    border: "1.5px solid rgba(100,70,50,0.15)",
                    borderRight: "0.75px solid rgba(100,70,50,0.08)",
                  }}
                >
                  {/* Wood grain */}
                  <div className="absolute inset-0" style={{
                    backgroundImage: "repeating-linear-gradient(87deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 6px)",
                  }} />
                  {/* Panel */}
                  <div className="absolute inset-4" style={{ border: "1px solid rgba(100,70,50,0.08)" }} />
                  {/* Iron studs */}
                  {[20, 40, 60, 80].map((y) => (
                    <div key={y} className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full" style={{
                      top: `${y}%`,
                      backgroundColor: "rgba(90,90,90,0.2)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
                    }} />
                  ))}
                  {/* Handle — brass, brighter */}
                  <div className="absolute top-1/2 right-4 w-3 h-8 rounded-full" style={{
                    background: "linear-gradient(135deg, rgba(212,175,55,0.25), rgba(184,134,11,0.18))",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
                  }} />
                </div>
              </div>

              {/* Right door */}
              <div className="relative inline-block" style={{ width: 110, height: 240 }}>
                <div
                  className="absolute inset-0 rounded-t-[55px] overflow-hidden"
                  style={{
                    background: "linear-gradient(180deg, rgba(80,56,40,0.35), rgba(55,38,28,0.45))",
                    border: "1.5px solid rgba(100,70,50,0.15)",
                    borderLeft: "0.75px solid rgba(100,70,50,0.08)",
                  }}
                >
                  <div className="absolute inset-0" style={{
                    backgroundImage: "repeating-linear-gradient(87deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 6px)",
                  }} />
                  <div className="absolute inset-4" style={{ border: "1px solid rgba(100,70,50,0.08)" }} />
                  {[20, 40, 60, 80].map((y) => (
                    <div key={y} className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full" style={{
                      top: `${y}%`,
                      backgroundColor: "rgba(90,90,90,0.2)",
                    }} />
                  ))}
                  <div className="absolute top-1/2 left-4 w-3 h-8 rounded-full" style={{
                    background: "linear-gradient(135deg, rgba(212,175,55,0.25), rgba(184,134,11,0.18))",
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
              background: "linear-gradient(180deg, #0A0908, #0E0D0B, #100F0D)",
            }} />

            {/* Stone arch frame */}
            <div className="absolute -inset-6 rounded-t-[70px]" style={{
              border: "5px solid rgba(50,48,45,0.15)",
              borderBottom: "none",
              pointerEvents: "none",
              zIndex: 10,
            }} />

            {/* Left door — opening */}
            <motion.div
              className="absolute top-[8%] left-[18%] w-[16%] h-[84%] origin-left overflow-hidden"
              style={{
                background: "linear-gradient(180deg, rgba(80,56,40,0.3), rgba(55,38,28,0.4))",
                borderRight: "1.5px solid rgba(100,70,50,0.12)",
                borderRadius: "35px 0 0 0",
              }}
              initial={{ rotateY: 0 }}
              animate={{ rotateY: -70 }}
              transition={{ duration: 3.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="absolute inset-0" style={{
                backgroundImage: "repeating-linear-gradient(87deg, transparent, transparent 3px, rgba(0,0,0,0.03) 3px, rgba(0,0,0,0.03) 6px)",
              }} />
              <div className="absolute inset-4" style={{ border: "1px solid rgba(100,70,50,0.06)" }} />
            </motion.div>

            {/* Right door — opening */}
            <motion.div
              className="absolute top-[8%] right-[18%] w-[16%] h-[84%] origin-right overflow-hidden"
              style={{
                background: "linear-gradient(180deg, rgba(80,56,40,0.3), rgba(55,38,28,0.4))",
                borderLeft: "1.5px solid rgba(100,70,50,0.12)",
                borderRadius: "0 35px 0 0",
              }}
              initial={{ rotateY: 0 }}
              animate={{ rotateY: 70 }}
              transition={{ duration: 3.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="absolute inset-0" style={{
                backgroundImage: "repeating-linear-gradient(87deg, transparent, transparent 3px, rgba(0,0,0,0.03) 3px, rgba(0,0,0,0.03) 6px)",
              }} />
              <div className="absolute inset-4" style={{ border: "1px solid rgba(100,70,50,0.06)" }} />
            </motion.div>

            {/* Warm light spilling through — brighter */}
            <motion.div
              className="absolute inset-0 z-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, delay: 1.5 }}
            >
              <div className="absolute inset-0" style={{
                background: "radial-gradient(ellipse at 50% 50%, rgba(255,213,79,0.15), transparent 50%)",
              }} />
            </motion.div>

            {/* Rain stopping — outside visible through opening doors */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0.4 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 4, delay: 1 }}
            >
              {raindrops.slice(0, 12).map((drop) => (
                <div
                  key={drop.id}
                  className="absolute"
                  style={{
                    left: `${drop.x}%`,
                    width: 1,
                    height: drop.length * 0.3,
                    background: `linear-gradient(180deg, transparent, rgba(160,175,195,${drop.opacity * 0.15}), transparent)`,
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
              background: "linear-gradient(180deg, #0C0B09, #100F0D, #0E0D0B)",
            }} />

            {/* Stone floor approaching */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-[45%]"
              style={{ background: "linear-gradient(0deg, rgba(30,28,26,0.25), transparent)" }}
              initial={{ y: "20%" }}
              animate={{ y: 0 }}
              transition={{ duration: 4, ease: "easeOut" }}
            />

            {/* Candlelight ahead — warm glow growing brighter */}
            <motion.div
              className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[65%] h-[55%]"
              style={{
                background: "radial-gradient(ellipse at 50% 30%, rgba(255,213,79,0.12), transparent 55%)",
              }}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 3, ease: "easeOut" }}
            />

            {/* Distant floating candle glows — brighter */}
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${22 + i * 6}%`,
                  top: `${12 + Math.random() * 22}%`,
                  width: 35 + Math.random() * 25,
                  height: 35 + Math.random() * 25,
                  background: `radial-gradient(circle, rgba(255,213,79,${0.03 + Math.random() * 0.03}), transparent 65%)`,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2, delay: 1 + i * 0.25 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
