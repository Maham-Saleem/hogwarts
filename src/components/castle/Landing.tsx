import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAmbientAudio } from "@/hooks/useAmbientAudio";

type ApproachPhase =
  | "black"
  | "candle"
  | "rain-window"
  | "lake"
  | "castle-reveal"
  | "owl-flyby"
  | "approaching"
  | "gates"
  | "courtyard"
  | "doors"
  | "opening"
  | "great-hall"
  | "done";

const PHASE_DURATIONS: Record<ApproachPhase, number> = {
  "black": 2500,
  "candle": 5000,
  "rain-window": 7000,
  "lake": 7000,
  "castle-reveal": 7000,
  "owl-flyby": 5000,
  "approaching": 7000,
  "gates": 6000,
  "courtyard": 6000,
  "doors": 5000,
  "opening": 5000,
  "great-hall": 6000,
  "done": 999999,
};

const PHASES: ApproachPhase[] = [
  "black", "candle", "rain-window", "lake", "castle-reveal", "owl-flyby",
  "approaching", "gates", "courtyard", "doors", "opening", "great-hall", "done"
];

const raindrops = Array.from({ length: 140 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 2.5,
  duration: 1.2 + Math.random() * 0.8,
  opacity: 0.2 + Math.random() * 0.35,
  length: 25 + Math.random() * 50,
}));

const stars = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  x: 3 + Math.random() * 94,
  y: 2 + Math.random() * 40,
  size: 0.8 + Math.random() * 2,
  opacity: 0.2 + Math.random() * 0.4,
  twinkle: 3 + Math.random() * 6,
}));

interface LandingProps {
  onComplete: () => void;
}

export function Landing({ onComplete }: LandingProps) {
  const [phase, setPhase] = useState<ApproachPhase>("black");
  const [showSkip, setShowSkip] = useState(false);
  const phaseIndex = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audio = useAmbientAudio();

  const advance = useCallback(() => {
    if (phaseIndex.current < PHASES.length - 1) {
      phaseIndex.current++;
      setPhase(PHASES[phaseIndex.current]);
    }
  }, []);

  useEffect(() => {
    if (phase === "done") {
      audio.stopAll();
      onComplete();
      return;
    }
    timerRef.current = setTimeout(advance, PHASE_DURATIONS[phase]);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [phase, advance, onComplete, audio]);

  // Start ambient sounds at appropriate phases
  useEffect(() => {
    if (phase === "candle") {
      audio.playLoop("fire");
    } else if (phase === "rain-window") {
      audio.playLoop("rain");
      audio.playLoop("wind");
    } else if (phase === "thunder" as any) {
      audio.playSound("thunder");
    } else if (phase === "owl-flyby") {
      audio.playSound("owl");
    } else if (phase === "great-hall") {
      audio.stopLoop("rain");
      audio.stopLoop("wind");
      audio.playLoop("fire");
      audio.playSound("bells");
    }
  }, [phase, audio]);

  useEffect(() => {
    const t = setTimeout(() => setShowSkip(true), 4000);
    return () => clearTimeout(t);
  }, []);

  const skipToEnd = () => {
    audio.stopAll();
    setPhase("done");
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden" style={{ backgroundColor: "#030202" }}>
      {/* Skip button */}
      {showSkip && phase !== "done" && (
        <motion.button
          className="absolute top-5 right-5 z-50 cursor-pointer px-4 py-2 rounded-sm"
          style={{
            background: "rgba(20,18,16,0.6)",
            border: "1px solid rgba(184,134,11,0.2)",
          }}
          onClick={skipToEnd}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          whileHover={{ borderColor: "rgba(184,134,11,0.4)" }}
        >
          <span className="font-cinzel text-[10px] tracking-[0.25em] text-engraved">Skip</span>
        </motion.button>
      )}

      {/* ===== BLACK ===== */}
      <AnimatePresence mode="wait">
        {phase === "black" && (
          <motion.div
            key="black"
            className="absolute inset-0"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            style={{ backgroundColor: "#030202" }}
          />
        )}

        {/* ===== CANDLE IGNITES ===== */}
        {phase === "candle" && (
          <motion.div
            key="candle"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            <div className="absolute inset-0" style={{ backgroundColor: "#050403" }} />

            {/* Warm glow expanding */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 300,
                height: 300,
                background: "radial-gradient(circle, rgba(255,180,60,0.15), rgba(255,150,30,0.06) 40%, transparent 70%)",
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 3, ease: "easeOut" }}
            />

            {/* Candle flame */}
            <motion.div
              className="absolute"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, delay: 0.5 }}
            >
              {/* Flame outer glow */}
              <div className="absolute -inset-16 rounded-full" style={{
                background: "radial-gradient(circle, rgba(255,180,60,0.12), transparent 65%)",
              }} />
              {/* Flame body */}
              <motion.div
                className="relative"
                style={{ width: 8, height: 20 }}
                animate={{ scaleY: [1, 1.1, 0.95, 1.05, 1], skewX: [-2, 2, -1, 1, -2] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="absolute inset-0 rounded-full" style={{
                  background: "linear-gradient(180deg, rgba(255,220,120,0.9), rgba(255,160,40,0.8), rgba(200,80,20,0.6))",
                  filter: "blur(1px)",
                }} />
                <div className="absolute inset-x-1 top-1 bottom-2 rounded-full" style={{
                  background: "linear-gradient(180deg, rgba(255,255,200,0.95), rgba(255,220,120,0.8))",
                  filter: "blur(0.5px)",
                }} />
              </motion.div>
              {/* Candle stick */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-2 h-12 rounded-b-sm" style={{
                background: "linear-gradient(180deg, rgba(240,220,180,0.3), rgba(200,180,140,0.2))",
              }} />
              {/* Wax drip */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-3 h-1 rounded-full" style={{
                backgroundColor: "rgba(240,220,180,0.15)",
              }} />
            </motion.div>

            {/* Quote text */}
            <motion.div
              className="absolute bottom-[18%] left-0 right-0 text-center px-8"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 2 }}
            >
              <p className="font-cormorant text-base sm:text-lg italic" style={{ color: "rgba(212,175,55,0.4)" }}>
                "Mr. Potter... our new celebrity."
              </p>
              <p className="font-cinzel text-[9px] tracking-[0.3em] mt-3" style={{ color: "rgba(140,130,115,0.25)" }}>
                — Professor McGonagall
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* ===== RAIN ON WINDOW ===== */}
        {phase === "rain-window" && (
          <motion.div
            key="rain-window"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
          >
            {/* Dark room interior */}
            <div className="absolute inset-0" style={{
              background: "linear-gradient(180deg, #0A0806, #0E0C0A, #0A0806)",
            }} />

            {/* Window frame */}
            <div className="absolute top-[8%] left-1/2 -translate-x-1/2" style={{ width: "55%", maxWidth: 500, height: "65%" }}>
              {/* Stone window frame */}
              <div className="absolute -inset-3 rounded-t-lg" style={{
                background: "linear-gradient(135deg, rgba(60,55,48,0.3), rgba(45,40,35,0.25))",
                border: "2px solid rgba(70,65,55,0.15)",
              }} />
              {/* Window glass — dark with rain */}
              <div className="absolute inset-0 rounded-t overflow-hidden" style={{
                background: "linear-gradient(180deg, #0C1520, #0E1825, #0A1018)",
              }}>
                {/* Rain on glass */}
                {raindrops.slice(0, 80).map((drop) => (
                  <motion.div
                    key={drop.id}
                    className="absolute"
                    style={{
                      left: `${drop.x}%`,
                      width: 1,
                      height: drop.length * 0.6,
                      background: `linear-gradient(180deg, transparent, rgba(140,160,185,${drop.opacity * 0.7}), transparent)`,
                    }}
                    initial={{ top: "-8%", opacity: 0 }}
                    animate={{ top: "108%", opacity: [0, drop.opacity * 0.7, 0] }}
                    transition={{ duration: drop.duration * 0.8, repeat: Infinity, delay: drop.delay, ease: "linear" }}
                  />
                ))}
                {/* Water droplets on glass */}
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div
                    key={`droplet-${i}`}
                    className="absolute rounded-full"
                    style={{
                      left: `${8 + i * 4.5}%`,
                      top: `${10 + (i % 5) * 18}%`,
                      width: 3,
                      height: 3,
                      backgroundColor: "rgba(140,160,185,0.2)",
                      boxShadow: "0 0 3px rgba(140,160,185,0.1)",
                    }}
                    animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.15, 0.3, 0.15] }}
                    transition={{ duration: 3 + i * 0.5, repeat: Infinity }}
                  />
                ))}
                {/* Distant lightning through window */}
                <motion.div
                  className="absolute inset-0"
                  style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(180,195,220,0.08), transparent 60%)" }}
                  animate={{ opacity: [0, 0, 0, 0.2, 0, 0.1, 0, 0] }}
                  transition={{ duration: 8, repeat: Infinity }}
                />
                {/* Distant castle lights through rain */}
                {[
                  { x: 40, y: 55 }, { x: 50, y: 52 }, { x: 60, y: 55 },
                ].map((pos, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                      width: 4,
                      height: 3,
                      backgroundColor: "rgba(255,200,80,0.25)",
                      boxShadow: "0 0 8px rgba(255,200,80,0.15)",
                      filter: "blur(1px)",
                    }}
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3 + i, repeat: Infinity }}
                  />
                ))}
              </div>
              {/* Window mullions */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[3px] h-full" style={{ backgroundColor: "rgba(55,50,42,0.3)" }} />
              <div className="absolute top-1/2 left-0 right-0 h-[3px] -translate-y-1/2" style={{ backgroundColor: "rgba(55,50,42,0.3)" }} />
            </div>

            {/* curtains */}
            <motion.div
              className="absolute top-[6%] left-[8%] w-[15%] h-[70%]"
              style={{
                background: "linear-gradient(90deg, rgba(80,20,20,0.12), rgba(60,15,15,0.06))",
                borderRadius: "0 0 30% 0",
              }}
              animate={{ skewX: [-1, 1, -1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute top-[6%] right-[8%] w-[15%] h-[70%]"
              style={{
                background: "linear-gradient(270deg, rgba(80,20,20,0.12), rgba(60,15,15,0.06))",
                borderRadius: "0 0 0 30%",
              }}
              animate={{ skewX: [1, -1, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Interior candle glow */}
            <div className="absolute bottom-[15%] right-[15%] w-32 h-32 rounded-full" style={{
              background: "radial-gradient(circle, rgba(255,180,60,0.06), transparent 65%)",
            }} />

            {/* Text — letter on desk */}
            <motion.div
              className="absolute bottom-[10%] left-1/2 -translate-x-1/2 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 2 }}
            >
              <p className="font-cormorant text-sm italic" style={{ color: "rgba(212,175,55,0.35)" }}>
                "You're a wizard, Harry."
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* ===== THE LAKE — Wide shot ===== */}
        {phase === "lake" && (
          <motion.div
            key="lake"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
          >
            <div className="absolute inset-0" style={{
              background: "linear-gradient(180deg, #050810, #0A1018, #0C1220, #0E1525)",
            }} />

            {/* Stars */}
            {stars.map((s) => (
              <motion.div
                key={s.id}
                className="absolute rounded-full"
                style={{
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  width: s.size,
                  height: s.size,
                  backgroundColor: `rgba(200,210,235,${s.opacity})`,
                }}
                animate={{ opacity: [s.opacity * 0.5, s.opacity, s.opacity * 0.5] }}
                transition={{ duration: s.twinkle, repeat: Infinity }}
              />
            ))}

            {/* Moon */}
            <motion.div
              className="absolute"
              style={{
                top: "10%",
                right: "20%",
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(220,225,240,0.25), rgba(200,210,230,0.08) 50%, transparent 70%)",
                boxShadow: "0 0 80px rgba(200,210,230,0.08)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 3 }}
            />

            {/* Water */}
            <div className="absolute bottom-0 left-0 right-0 h-[42%]" style={{
              background: "linear-gradient(180deg, rgba(15,25,40,0.3), rgba(10,15,25,0.2))",
            }} />
            {/* Water ripples */}
            {[44, 42, 40, 38].map((y, i) => (
              <motion.div
                key={i}
                className="absolute left-0 right-0 h-[1px]"
                style={{ top: `${y}%`, backgroundColor: `rgba(120,140,170,${0.12 - i * 0.02})` }}
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }}
              />
            ))}

            {/* Fog */}
            <motion.div
              className="absolute bottom-[28%] left-0 right-0 h-[22%]"
              style={{ background: "linear-gradient(0deg, rgba(50,55,65,0.12), transparent)" }}
              animate={{ x: ["-4%", "4%", "-4%"] }}
              transition={{ duration: 30, repeat: Infinity }}
            />

            {/* Castle silhouette — larger, more detailed */}
            <motion.div
              className="absolute bottom-[42%] left-1/2 -translate-x-1/2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ duration: 4, delay: 1 }}
            >
              <svg width="320" height="140" viewBox="0 0 320 140">
                {/* Left wing */}
                <rect x="10" y="90" width="18" height="50" fill="rgba(25,30,40,0.6)" />
                <rect x="14" y="70" width="10" height="70" rx="2" fill="rgba(25,30,40,0.7)" />
                <rect x="30" y="85" width="14" height="55" fill="rgba(25,30,40,0.5)" />
                <rect x="34" y="60" width="6" height="80" rx="1" fill="rgba(25,30,40,0.65)" />
                <rect x="48" y="80" width="20" height="60" fill="rgba(25,30,40,0.45)" />
                {/* Central towers */}
                <rect x="75" y="75" width="25" height="65" fill="rgba(25,30,40,0.5)" />
                <rect x="80" y="40" width="8" height="100" rx="2" fill="rgba(25,30,40,0.7)" />
                <rect x="105" y="70" width="30" height="70" fill="rgba(25,30,40,0.45)" />
                <rect x="115" y="20" width="10" height="120" rx="2" fill="rgba(25,30,40,0.8)" />
                <rect x="140" y="70" width="30" height="70" fill="rgba(25,30,40,0.45)" />
                <rect x="150" y="30" width="8" height="110" rx="2" fill="rgba(25,30,40,0.75)" />
                {/* Great Hall */}
                <rect x="175" y="75" width="40" height="65" fill="rgba(25,30,40,0.5)" />
                <polygon points="175,75 195,55 215,75" fill="rgba(25,30,40,0.55)" />
                {/* Right wing */}
                <rect x="220" y="80" width="20" height="60" fill="rgba(25,30,40,0.45)" />
                <rect x="225" y="55" width="8" height="85" rx="2" fill="rgba(25,30,40,0.65)" />
                <rect x="245" y="85" width="16" height="55" fill="rgba(25,30,40,0.5)" />
                <rect x="265" y="75" width="22" height="65" fill="rgba(25,30,40,0.55)" />
                <rect x="290" y="90" width="18" height="50" fill="rgba(25,30,40,0.5)" />
                <rect x="294" y="65" width="10" height="75" rx="2" fill="rgba(25,30,40,0.65)" />
              </svg>
            </motion.div>

            {/* Warm window lights */}
            {[
              { x: 38, y: 43 }, { x: 42, y: 42 }, { x: 46, y: 41 },
              { x: 50, y: 40.5 }, { x: 54, y: 41 }, { x: 58, y: 42 },
              { x: 62, y: 43 }, { x: 44, y: 38 }, { x: 56, y: 38 },
              { x: 50, y: 35 },
            ].map((pos, i) => (
              <motion.div
                key={i}
                className="absolute rounded-sm"
                style={{
                  left: `${pos.x}%`,
                  bottom: `${pos.y}%`,
                  width: 3,
                  height: 2.5,
                  backgroundColor: "rgba(255,200,80,0.5)",
                  boxShadow: "0 0 6px rgba(255,200,80,0.25), 0 0 12px rgba(255,180,60,0.1)",
                }}
                animate={{ opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}

            {/* Rain */}
            {raindrops.slice(0, 50).map((drop) => (
              <motion.div
                key={drop.id}
                className="absolute"
                style={{
                  left: `${drop.x}%`,
                  width: 1,
                  height: drop.length * 0.6,
                  background: `linear-gradient(180deg, transparent, rgba(140,160,185,${drop.opacity * 0.5}), transparent)`,
                }}
                initial={{ top: "-5%", opacity: 0 }}
                animate={{ top: "105%", opacity: [0, drop.opacity * 0.5, 0] }}
                transition={{ duration: drop.duration, repeat: Infinity, delay: drop.delay, ease: "linear" }}
              />
            ))}

            {/* Text */}
            <motion.div
              className="absolute bottom-[8%] left-0 right-0 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 2 }}
            >
              <p className="font-cormorant text-base sm:text-lg italic" style={{ color: "rgba(200,210,230,0.35)" }}>
                "Whether you come back by page or by the big screen,
              </p>
              <p className="font-cormorant text-base sm:text-lg italic mt-1" style={{ color: "rgba(200,210,230,0.35)" }}>
                Hogwarts will always be there to welcome you home."
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* ===== CASTLE REVEAL — Lightning flash ===== */}
        {phase === "castle-reveal" && (
          <motion.div
            key="castle-reveal"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
          >
            <div className="absolute inset-0" style={{
              background: "linear-gradient(180deg, #040610, #080C15, #0A0E18)",
            }} />

            {/* Stars */}
            {stars.slice(0, 30).map((s) => (
              <motion.div
                key={s.id}
                className="absolute rounded-full"
                style={{
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  width: s.size,
                  height: s.size,
                  backgroundColor: `rgba(200,210,235,${s.opacity * 0.8})`,
                }}
                animate={{ opacity: [s.opacity * 0.4, s.opacity * 0.8, s.opacity * 0.4] }}
                transition={{ duration: s.twinkle, repeat: Infinity }}
              />
            ))}

            {/* Moon — larger */}
            <motion.div
              className="absolute"
              style={{
                top: "8%",
                right: "18%",
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(225,230,245,0.3), rgba(200,210,230,0.1) 45%, transparent 65%)",
                boxShadow: "0 0 100px rgba(200,210,230,0.1)",
              }}
            />

            {/* Castle — much larger, detailed */}
            <motion.div
              className="absolute bottom-[25%] left-1/2 -translate-x-1/2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ duration: 3 }}
            >
              <svg width="500" height="220" viewBox="0 0 500 220">
                {/* Ground */}
                <ellipse cx="250" cy="220" rx="260" ry="20" fill="rgba(15,18,25,0.3)" />
                {/* Left wing */}
                <rect x="20" y="140" width="30" height="80" fill="rgba(20,25,35,0.6)" />
                <rect x="25" y="100" width="15" height="120" rx="3" fill="rgba(20,25,35,0.7)" />
                <rect x="55" y="130" width="25" height="90" fill="rgba(20,25,35,0.55)" />
                <rect x="60" y="80" width="10" height="140" rx="2" fill="rgba(20,25,35,0.65)" />
                <rect x="80" y="120" width="35" height="100" fill="rgba(20,25,35,0.5)" />
                {/* Central towers */}
                <rect x="125" y="110" width="40" height="110" fill="rgba(20,25,35,0.55)" />
                <rect x="132" y="50" width="14" height="170" rx="3" fill="rgba(20,25,35,0.75)" />
                <polygon points="132,50 139,30 146,50" fill="rgba(20,25,35,0.7)" />
                <rect x="175" y="100" width="50" height="120" fill="rgba(20,25,35,0.5)" />
                <rect x="190" y="25" width="18" height="195" rx="4" fill="rgba(20,25,35,0.85)" />
                <polygon points="190,25 199,5 208,25" fill="rgba(20,25,35,0.8)" />
                <rect x="230" y="105" width="40" height="115" fill="rgba(20,25,35,0.5)" />
                <rect x="242" y="40" width="12" height="180" rx="3" fill="rgba(20,25,35,0.75)" />
                {/* Great Hall */}
                <rect x="280" y="110" width="65" height="110" fill="rgba(20,25,35,0.55)" />
                <polygon points="280,110 312,75 345,110" fill="rgba(20,25,35,0.6)" />
                {/* Right wing */}
                <rect x="355" y="120" width="30" height="100" fill="rgba(20,25,35,0.5)" />
                <rect x="360" y="85" width="12" height="135" rx="2" fill="rgba(20,25,35,0.65)" />
                <rect x="390" y="130" width="28" height="90" fill="rgba(20,25,35,0.55)" />
                <rect x="425" y="120" width="35" height="100" fill="rgba(20,25,35,0.5)" />
                <rect x="430" y="90" width="14" height="130" rx="3" fill="rgba(20,25,35,0.65)" />
                <rect x="465" y="135" width="20" height="85" fill="rgba(20,25,35,0.5)" />
                <rect x="468" y="105" width="10" height="115" rx="2" fill="rgba(20,25,35,0.6)" />
              </svg>
            </motion.div>

            {/* Lightning flash — dramatic */}
            <motion.div
              className="absolute inset-0"
              style={{ background: "radial-gradient(ellipse at 45% 35%, rgba(200,210,235,0.15), transparent 40%)" }}
              animate={{ opacity: [0, 0, 0, 0.4, 0, 0.2, 0, 0, 0, 0] }}
              transition={{ duration: 10, repeat: Infinity }}
            />

            {/* Window lights — brighter */}
            {[
              { x: 35, y: 44 }, { x: 38, y: 43 }, { x: 41, y: 42 },
              { x: 45, y: 41 }, { x: 50, y: 40 }, { x: 55, y: 41 },
              { x: 59, y: 42 }, { x: 62, y: 43 }, { x: 65, y: 44 },
              { x: 43, y: 38 }, { x: 48, y: 37 }, { x: 53, y: 37 },
              { x: 57, y: 38 }, { x: 50, y: 33 },
            ].map((pos, i) => (
              <motion.div
                key={i}
                className="absolute rounded-sm"
                style={{
                  left: `${pos.x}%`,
                  bottom: `${pos.y}%`,
                  width: 3.5,
                  height: 3,
                  backgroundColor: "rgba(255,200,80,0.6)",
                  boxShadow: "0 0 8px rgba(255,200,80,0.3), 0 0 16px rgba(255,180,60,0.12)",
                }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3 + i * 0.3, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}

            {/* Rain lighter */}
            {raindrops.slice(0, 30).map((drop) => (
              <motion.div
                key={drop.id}
                className="absolute"
                style={{
                  left: `${drop.x}%`,
                  width: 1,
                  height: drop.length * 0.4,
                  background: `linear-gradient(180deg, transparent, rgba(140,160,185,${drop.opacity * 0.3}), transparent)`,
                }}
                initial={{ top: "-5%", opacity: 0 }}
                animate={{ top: "105%", opacity: [0, drop.opacity * 0.3, 0] }}
                transition={{ duration: drop.duration, repeat: Infinity, delay: drop.delay, ease: "linear" }}
              />
            ))}
          </motion.div>
        )}

        {/* ===== OWL FLYBY ===== */}
        {phase === "owl-flyby" && (
          <motion.div
            key="owl-flyby"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            <div className="absolute inset-0" style={{
              background: "linear-gradient(180deg, #050810, #0A1018, #0C1220)",
            }} />

            {/* Moon — larger, brighter */}
            <div
              className="absolute"
              style={{
                top: "12%",
                left: "50%",
                transform: "translateX(-50%)",
                width: 160,
                height: 160,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(230,235,250,0.35), rgba(210,220,240,0.12) 45%, transparent 65%)",
                boxShadow: "0 0 120px rgba(210,220,240,0.12)",
              }}
            />

            {/* Stars */}
            {stars.slice(0, 40).map((s) => (
              <motion.div
                key={s.id}
                className="absolute rounded-full"
                style={{
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  width: s.size,
                  height: s.size,
                  backgroundColor: `rgba(210,220,245,${s.opacity})`,
                }}
                animate={{ opacity: [s.opacity * 0.5, s.opacity, s.opacity * 0.5] }}
                transition={{ duration: s.twinkle, repeat: Infinity }}
              />
            ))}

            {/* Hedwig — owl flying across moon */}
            <motion.div
              className="absolute"
              style={{ top: "15%" }}
              initial={{ left: "-15%" }}
              animate={{ left: "115%" }}
              transition={{ duration: 5, ease: "easeInOut" }}
            >
              <svg width="80" height="40" viewBox="0 0 80 40">
                {/* Body */}
                <ellipse cx="40" cy="25" rx="12" ry="8" fill="rgba(200,195,185,0.7)" />
                {/* Head */}
                <circle cx="52" cy="20" r="6" fill="rgba(210,205,195,0.75)" />
                {/* Eyes */}
                <circle cx="54" cy="19" r="1.5" fill="rgba(20,15,5,0.9)" />
                <circle cx="54.5" cy="18.5" r="0.5" fill="rgba(255,255,200,0.8)" />
                {/* Beak */}
                <polygon points="58,20 60,21 58,22" fill="rgba(180,140,60,0.6)" />
                {/* Left wing — up */}
                <motion.path
                  d="M 35 22 Q 20 5 5 10 Q 15 18 30 22"
                  fill="rgba(190,185,175,0.6)"
                  animate={{ d: [
                    "M 35 22 Q 20 5 5 10 Q 15 18 30 22",
                    "M 35 22 Q 20 35 5 30 Q 15 22 30 22",
                    "M 35 22 Q 20 5 5 10 Q 15 18 30 22",
                  ]}}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
                {/* Right wing — up */}
                <motion.path
                  d="M 45 22 Q 60 5 75 10 Q 65 18 50 22"
                  fill="rgba(190,185,175,0.6)"
                  animate={{ d: [
                    "M 45 22 Q 60 5 75 10 Q 65 18 50 22",
                    "M 45 22 Q 60 35 75 30 Q 65 22 50 22",
                    "M 45 22 Q 60 5 75 10 Q 65 18 50 22",
                  ]}}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
                {/* Tail feathers */}
                <path d="M 28 25 L 18 28 L 20 24 L 28 23" fill="rgba(180,175,165,0.5)" />
              </svg>
            </motion.div>

            {/* Second smaller owl in distance */}
            <motion.div
              className="absolute"
              style={{ top: "25%" }}
              initial={{ left: "110%" }}
              animate={{ left: "-10%" }}
              transition={{ duration: 7, ease: "easeInOut", delay: 1 }}
            >
              <svg width="30" height="16" viewBox="0 0 80 40" style={{ opacity: 0.4 }}>
                <ellipse cx="40" cy="25" rx="12" ry="8" fill="rgba(180,175,165,0.6)" />
                <circle cx="52" cy="20" r="6" fill="rgba(190,185,175,0.65)" />
                <motion.path
                  d="M 35 22 Q 20 5 5 10 Q 15 18 30 22"
                  fill="rgba(170,165,155,0.5)"
                  animate={{ d: [
                    "M 35 22 Q 20 5 5 10 Q 15 18 30 22",
                    "M 35 22 Q 20 35 5 30 Q 15 22 30 22",
                    "M 35 22 Q 20 5 5 10 Q 15 18 30 22",
                  ]}}
                  transition={{ duration: 0.9, repeat: Infinity }}
                />
                <motion.path
                  d="M 45 22 Q 60 5 75 10 Q 65 18 50 22"
                  fill="rgba(170,165,155,0.5)"
                  animate={{ d: [
                    "M 45 22 Q 60 5 75 10 Q 65 18 50 22",
                    "M 45 22 Q 60 35 75 30 Q 65 22 50 22",
                    "M 45 22 Q 60 5 75 10 Q 65 18 50 22",
                  ]}}
                  transition={{ duration: 0.9, repeat: Infinity }}
                />
              </svg>
            </motion.div>

            {/* Castle silhouette below */}
            <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2" style={{ opacity: 0.3 }}>
              <svg width="400" height="100" viewBox="0 0 400 100">
                <rect x="30" y="50" width="15" height="50" fill="rgba(20,25,35,0.5)" />
                <rect x="50" y="40" width="25" height="60" fill="rgba(20,25,35,0.45)" />
                <rect x="80" y="30" width="10" height="70" rx="2" fill="rgba(20,25,35,0.6)" />
                <rect x="100" y="45" width="35" height="55" fill="rgba(20,25,35,0.4)" />
                <rect x="140" y="20" width="12" height="80" rx="3" fill="rgba(20,25,35,0.7)" />
                <rect x="160" y="40" width="40" height="60" fill="rgba(20,25,35,0.45)" />
                <rect x="205" y="35" width="10" height="65" rx="2" fill="rgba(20,25,35,0.6)" />
                <rect x="220" y="45" width="30" height="55" fill="rgba(20,25,35,0.4)" />
                <rect x="260" y="30" width="15" height="70" rx="3" fill="rgba(20,25,35,0.6)" />
                <rect x="280" y="50" width="25" height="50" fill="rgba(20,25,35,0.45)" />
                <rect x="310" y="40" width="12" height="60" rx="2" fill="rgba(20,25,35,0.55)" />
                <rect x="330" y="50" width="20" height="50" fill="rgba(20,25,35,0.4)" />
              </svg>
            </div>

            {/* Text */}
            <motion.div
              className="absolute bottom-[8%] left-0 right-0 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 2 }}
            >
              <p className="font-cormorant text-base italic" style={{ color: "rgba(200,210,230,0.35)" }}>
                "Hedwig's Theme"
              </p>
              <p className="font-cinzel text-[9px] tracking-[0.3em] mt-2" style={{ color: "rgba(140,130,115,0.2)" }}>
                — John Williams
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* ===== APPROACHING ===== */}
        {phase === "approaching" && (
          <motion.div
            key="approaching"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
          >
            <div className="absolute inset-0" style={{
              background: "linear-gradient(180deg, #050810, #0A1018, #0E1520)",
            }} />

            {/* Stone walls closing in */}
            <motion.div
              className="absolute top-0 bottom-0 left-0"
              style={{ width: "25%", background: "linear-gradient(90deg, rgba(40,38,35,0.5), transparent)" }}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              transition={{ duration: 7, ease: "easeOut" }}
            />
            <motion.div
              className="absolute top-0 bottom-0 right-0"
              style={{ width: "25%", background: "linear-gradient(270deg, rgba(40,38,35,0.5), transparent)" }}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              transition={{ duration: 7, ease: "easeOut" }}
            />

            {/* Stone texture */}
            <div className="absolute inset-0" style={{
              backgroundImage: `
                repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(0,0,0,0.04) 50px, rgba(0,0,0,0.04) 51px),
                repeating-linear-gradient(0deg, transparent, transparent 35px, rgba(0,0,0,0.03) 35px, rgba(0,0,0,0.03) 36px)
              `,
            }} />

            {/* Castle entrance ahead */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.6 }}
              transition={{ duration: 8, ease: "easeOut" }}
            >
              <div className="relative" style={{ width: 280, height: 420 }}>
                {/* Towers */}
                <div className="absolute bottom-0 left-0 w-12 h-full" style={{ backgroundColor: "rgba(35,38,45,0.4)", borderRight: "1px solid rgba(50,48,45,0.1)" }} />
                <div className="absolute bottom-0 right-0 w-12 h-full" style={{ backgroundColor: "rgba(35,38,45,0.4)", borderLeft: "1px solid rgba(50,48,45,0.1)" }} />
                {/* Pointed arch */}
                <div className="absolute top-0 left-12 right-12" style={{
                  height: 200,
                  borderRadius: "140px 140px 0 0",
                  border: "3px solid rgba(50,48,45,0.2)",
                  borderBottom: "none",
                }} />
                {/* Inner darkness */}
                <div className="absolute top-[80px] left-[60px] right-[60px] bottom-0" style={{
                  borderRadius: "80px 80px 0 0",
                  background: "linear-gradient(180deg, rgba(5,5,8,0.6), rgba(5,5,8,0.9))",
                }} />
                {/* Warm light from within */}
                <motion.div
                  className="absolute top-[100px] left-[70px] right-[70px] bottom-0"
                  style={{
                    borderRadius: "70px 70px 0 0",
                    background: "radial-gradient(ellipse at 50% 30%, rgba(255,180,60,0.15), transparent 60%)",
                  }}
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                {/* Torches on sides */}
                {[{ x: "8%", y: "45%" }, { x: "88%", y: "45%" }].map((pos, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{ left: pos.x, top: pos.y }}
                  >
                    <motion.div
                      className="w-3 h-5 rounded-full"
                      style={{
                        background: "radial-gradient(circle, rgba(255,160,40,0.7), rgba(255,100,20,0.3) 60%, transparent)",
                        filter: "blur(1px)",
                      }}
                      animate={{ scaleY: [1, 1.2, 0.9, 1.1, 1], opacity: [0.7, 1, 0.6, 0.9, 0.7] }}
                      transition={{ duration: 1.5 + i * 0.3, repeat: Infinity }}
                    />
                    <div className="w-[2px] h-4 mx-auto" style={{ backgroundColor: "rgba(80,60,40,0.3)" }} />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Ground */}
            <div className="absolute bottom-0 left-0 right-0 h-[25%]" style={{
              background: "linear-gradient(0deg, rgba(30,28,25,0.25), transparent)",
            }} />

            {/* Rain lighter */}
            {raindrops.slice(0, 20).map((drop) => (
              <motion.div
                key={drop.id}
                className="absolute"
                style={{
                  left: `${drop.x}%`,
                  width: 1,
                  height: drop.length * 0.35,
                  background: `linear-gradient(180deg, transparent, rgba(140,160,185,${drop.opacity * 0.2}), transparent)`,
                }}
                initial={{ top: "-5%", opacity: 0 }}
                animate={{ top: "105%", opacity: [0, drop.opacity * 0.2, 0] }}
                transition={{ duration: drop.duration, repeat: Infinity, delay: drop.delay, ease: "linear" }}
              />
            ))}
          </motion.div>
        )}

        {/* ===== GATES ===== */}
        {phase === "gates" && (
          <motion.div
            key="gates"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
          >
            <div className="absolute inset-0" style={{
              background: "linear-gradient(180deg, #060810, #0C1018, #0E1520)",
            }} />

            {/* Gateposts */}
            <motion.div
              className="absolute left-[10%] top-[5%] bottom-[10%] w-[10%]"
              style={{ backgroundColor: "rgba(45,42,38,0.45)" }}
              initial={{ x: -80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 2.5 }}
            >
              <div className="absolute top-[5%] left-0 w-full h-[40%]" style={{
                background: "linear-gradient(180deg, rgba(35,60,40,0.25), transparent)",
              }} />
              {/* Torch */}
              <motion.div
                className="absolute top-[40%] left-1/2 -translate-x-1/2"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-4 h-6 rounded-full" style={{
                  background: "radial-gradient(circle, rgba(255,160,40,0.8), rgba(255,100,20,0.3) 60%, transparent)",
                  filter: "blur(1.5px)",
                }} />
                <div className="w-[2px] h-5 mx-auto" style={{ backgroundColor: "rgba(80,60,40,0.4)" }} />
              </motion.div>
            </motion.div>

            <motion.div
              className="absolute right-[10%] top-[5%] bottom-[10%] w-[10%]"
              style={{ backgroundColor: "rgba(45,42,38,0.45)" }}
              initial={{ x: 80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 2.5 }}
            >
              <div className="absolute top-[5%] right-0 w-full h-[40%]" style={{
                background: "linear-gradient(180deg, rgba(35,60,40,0.25), transparent)",
              }} />
              <motion.div
                className="absolute top-[40%] left-1/2 -translate-x-1/2"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                <div className="w-4 h-6 rounded-full" style={{
                  background: "radial-gradient(circle, rgba(255,160,40,0.8), rgba(255,100,20,0.3) 60%, transparent)",
                  filter: "blur(1.5px)",
                }} />
                <div className="w-[2px] h-5 mx-auto" style={{ backgroundColor: "rgba(80,60,40,0.4)" }} />
              </motion.div>
            </motion.div>

            {/* Iron gate bars */}
            <motion.div
              className="relative flex gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ duration: 2.5, delay: 0.8 }}
            >
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="w-[3px] h-56" style={{
                  backgroundColor: "rgba(80,80,85,0.45)",
                  borderRadius: "2px 2px 0 0",
                }} />
              ))}
              <div className="absolute top-[16%] left-0 right-0 h-[3px]" style={{ backgroundColor: "rgba(80,80,85,0.4)" }} />
              <div className="absolute top-[50%] left-0 right-0 h-[3px]" style={{ backgroundColor: "rgba(80,80,85,0.3)" }} />
            </motion.div>

            {/* Warm light beyond gates */}
            <motion.div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40%] h-[50%]"
              style={{
                background: "radial-gradient(ellipse at 50% 0%, rgba(255,180,60,0.12), transparent 60%)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 3, delay: 1.5 }}
            />
          </motion.div>
        )}

        {/* ===== COURTYARD ===== */}
        {phase === "courtyard" && (
          <motion.div
            key="courtyard"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
          >
            <div className="absolute inset-0" style={{
              background: "linear-gradient(180deg, #070A12, #0C1018, #0E1520)",
            }} />

            {/* Castle walls */}
            <div className="absolute top-0 bottom-0 left-0 w-[25%]" style={{ background: "linear-gradient(90deg, rgba(40,38,35,0.45), transparent)" }} />
            <div className="absolute top-0 bottom-0 right-0 w-[25%]" style={{ background: "linear-gradient(270deg, rgba(40,38,35,0.45), transparent)" }} />
            <div className="absolute top-0 left-0 right-0 h-[30%]" style={{ background: "linear-gradient(180deg, rgba(40,38,35,0.35), transparent)" }} />

            {/* Fountain */}
            <motion.div
              className="absolute bottom-[20%] left-1/2 -translate-x-1/2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.4, y: 0 }}
              transition={{ duration: 2.5, delay: 0.8 }}
            >
              <div className="relative" style={{ width: 120, height: 60 }}>
                <div className="absolute bottom-0 left-0 right-0 h-7 rounded-b-full" style={{ backgroundColor: "rgba(55,52,48,0.4)" }} />
                <motion.div
                  className="absolute bottom-2 left-[8%] right-[8%] h-[5px] rounded-full"
                  style={{ backgroundColor: "rgba(120,140,170,0.15)" }}
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 3.5, repeat: Infinity }}
                />
                <div className="absolute bottom-7 left-1/2 -translate-x-1/2 w-[3px] h-12" style={{ backgroundColor: "rgba(55,52,48,0.35)" }} />
                {/* Water spray */}
                <motion.div
                  className="absolute bottom-14 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full"
                  style={{
                    background: "radial-gradient(circle, rgba(140,160,185,0.08), transparent 70%)",
                  }}
                  animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.15, 0.3, 0.15] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </div>
            </motion.div>

            {/* Rain very light */}
            {raindrops.slice(0, 12).map((drop) => (
              <motion.div
                key={drop.id}
                className="absolute"
                style={{
                  left: `${drop.x}%`,
                  width: 1,
                  height: drop.length * 0.25,
                  background: `linear-gradient(180deg, transparent, rgba(140,160,185,${drop.opacity * 0.12}), transparent)`,
                }}
                initial={{ top: "-5%", opacity: 0 }}
                animate={{ top: "105%", opacity: [0, drop.opacity * 0.12, 0] }}
                transition={{ duration: drop.duration, repeat: Infinity, delay: drop.delay, ease: "linear" }}
              />
            ))}
          </motion.div>
        )}

        {/* ===== DOORS ===== */}
        {phase === "doors" && (
          <motion.div
            key="doors"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
          >
            <div className="absolute inset-0" style={{
              background: "linear-gradient(180deg, #080A10, #0C1018, #0E1520)",
            }} />

            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 2.5 }}
            >
              {/* Stone arch */}
              <div className="absolute -inset-8 rounded-t-[80px]" style={{
                border: "6px solid rgba(50,48,42,0.25)",
                borderBottom: "none",
              }} />

              {/* Left door */}
              <div className="relative inline-block" style={{ width: 130, height: 280 }}>
                <div className="absolute inset-0 rounded-t-[65px] overflow-hidden" style={{
                  background: "linear-gradient(180deg, rgba(90,65,45,0.4), rgba(65,45,30,0.5))",
                  border: "2px solid rgba(110,80,55,0.15)",
                  borderRight: "1px solid rgba(110,80,55,0.08)",
                }}>
                  <div className="absolute inset-0" style={{
                    backgroundImage: "repeating-linear-gradient(87deg, transparent, transparent 4px, rgba(0,0,0,0.04) 4px, rgba(0,0,0,0.04) 7px)",
                  }} />
                  <div className="absolute inset-5" style={{ border: "1.5px solid rgba(110,80,55,0.1)" }} />
                  {[18, 38, 58, 78].map((y) => (
                    <div key={y} className="absolute left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full" style={{
                      top: `${y}%`,
                      backgroundColor: "rgba(100,100,105,0.25)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                    }} />
                  ))}
                  <div className="absolute top-1/2 right-5 w-3.5 h-9 rounded-full" style={{
                    background: "linear-gradient(135deg, rgba(212,175,55,0.35), rgba(184,134,11,0.25))",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
                  }} />
                </div>
              </div>

              {/* Right door */}
              <div className="relative inline-block" style={{ width: 130, height: 280 }}>
                <div className="absolute inset-0 rounded-t-[65px] overflow-hidden" style={{
                  background: "linear-gradient(180deg, rgba(90,65,45,0.4), rgba(65,45,30,0.5))",
                  border: "2px solid rgba(110,80,55,0.15)",
                  borderLeft: "1px solid rgba(110,80,55,0.08)",
                }}>
                  <div className="absolute inset-0" style={{
                    backgroundImage: "repeating-linear-gradient(87deg, transparent, transparent 4px, rgba(0,0,0,0.04) 4px, rgba(0,0,0,0.04) 7px)",
                  }} />
                  <div className="absolute inset-5" style={{ border: "1.5px solid rgba(110,80,55,0.1)" }} />
                  {[18, 38, 58, 78].map((y) => (
                    <div key={y} className="absolute left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full" style={{
                      top: `${y}%`,
                      backgroundColor: "rgba(100,100,105,0.25)",
                    }} />
                  ))}
                  <div className="absolute top-1/2 left-5 w-3.5 h-9 rounded-full" style={{
                    background: "linear-gradient(135deg, rgba(212,175,55,0.35), rgba(184,134,11,0.25))",
                  }} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ===== OPENING — Doors swing open ===== */}
        {phase === "opening" && (
          <motion.div
            key="opening"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            <div className="absolute inset-0" style={{
              background: "linear-gradient(180deg, #080A10, #0C1018, #0E1520)",
            }} />

            {/* Stone arch */}
            <div className="absolute -inset-8 rounded-t-[80px]" style={{
              border: "6px solid rgba(50,48,42,0.2)",
              borderBottom: "none",
              pointerEvents: "none",
              zIndex: 10,
            }} />

            {/* Left door opening */}
            <motion.div
              className="absolute top-[6%] left-[15%] w-[18%] h-[88%] origin-left overflow-hidden"
              style={{
                background: "linear-gradient(180deg, rgba(90,65,45,0.35), rgba(65,45,30,0.45))",
                borderRight: "1.5px solid rgba(110,80,55,0.1)",
                borderRadius: "40px 0 0 0",
              }}
              initial={{ rotateY: 0 }}
              animate={{ rotateY: -72 }}
              transition={{ duration: 3, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="absolute inset-0" style={{
                backgroundImage: "repeating-linear-gradient(87deg, transparent, transparent 4px, rgba(0,0,0,0.03) 4px, rgba(0,0,0,0.03) 7px)",
              }} />
            </motion.div>

            {/* Right door opening */}
            <motion.div
              className="absolute top-[6%] right-[15%] w-[18%] h-[88%] origin-right overflow-hidden"
              style={{
                background: "linear-gradient(180deg, rgba(90,65,45,0.35), rgba(65,45,30,0.45))",
                borderLeft: "1.5px solid rgba(110,80,55,0.1)",
                borderRadius: "0 40px 0 0",
              }}
              initial={{ rotateY: 0 }}
              animate={{ rotateY: 72 }}
              transition={{ duration: 3, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="absolute inset-0" style={{
                backgroundImage: "repeating-linear-gradient(87deg, transparent, transparent 4px, rgba(0,0,0,0.03) 4px, rgba(0,0,0,0.03) 7px)",
              }} />
            </motion.div>

            {/* Warm light flooding in */}
            <motion.div
              className="absolute inset-0 z-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, delay: 1 }}
            >
              <div className="absolute inset-0" style={{
                background: "radial-gradient(ellipse at 50% 50%, rgba(255,180,60,0.2), transparent 45%)",
              }} />
            </motion.div>
          </motion.div>
        )}

        {/* ===== GREAT HALL — Final reveal ===== */}
        {phase === "great-hall" && (
          <motion.div
            key="great-hall"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
          >
            <div className="absolute inset-0" style={{
              background: "linear-gradient(180deg, #0A0806, #100E0C, #0C0A08)",
            }} />

            {/* Vaulted ceiling */}
            <div className="absolute top-0 left-0 right-0 h-[40%]" style={{
              background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)",
            }} />
            <svg className="absolute top-0 left-0 right-0 h-[40%]" viewBox="0 0 100 50" preserveAspectRatio="none">
              <line x1="50" y1="0" x2="50" y2="50" stroke="rgba(60,55,48,0.08)" strokeWidth="0.3" />
              <line x1="10" y1="0" x2="50" y2="50" stroke="rgba(60,55,48,0.06)" strokeWidth="0.25" />
              <line x1="30" y1="0" x2="50" y2="50" stroke="rgba(60,55,48,0.06)" strokeWidth="0.25" />
              <line x1="90" y1="0" x2="50" y2="50" stroke="rgba(60,55,48,0.06)" strokeWidth="0.25" />
              <line x1="70" y1="0" x2="50" y2="50" stroke="rgba(60,55,48,0.06)" strokeWidth="0.25" />
              <line x1="0" y1="15" x2="100" y2="15" stroke="rgba(60,55,48,0.04)" strokeWidth="0.2" />
              <line x1="0" y1="30" x2="100" y2="30" stroke="rgba(60,55,48,0.03)" strokeWidth="0.15" />
            </svg>

            {/* Floating candles — warm glow */}
            {Array.from({ length: 24 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${8 + (i % 8) * 12 + (Math.random() - 0.5) * 6}%`,
                  top: `${8 + Math.floor(i / 8) * 10 + (Math.random() - 0.5) * 5}%`,
                  width: 40 + Math.random() * 30,
                  height: 40 + Math.random() * 30,
                  background: `radial-gradient(circle, rgba(255,200,80,${0.04 + Math.random() * 0.03}), transparent 65%)`,
                }}
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                  y: [0, -2, 0, 2, 0],
                }}
                transition={{
                  duration: 4 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                }}
              />
            ))}

            {/* Stained glass windows */}
            {[
              { x: "8%", w: "10%", colors: ["rgba(212,175,55,0.06)", "rgba(140,30,30,0.04)"] },
              { x: "22%", w: "8%", colors: ["rgba(140,30,30,0.05)", "rgba(30,80,50,0.03)"] },
              { x: "36%", w: "7%", colors: ["rgba(30,80,50,0.04)", "rgba(212,175,55,0.03)"] },
              { x: "57%", w: "7%", colors: ["rgba(30,80,50,0.04)", "rgba(140,30,30,0.03)"] },
              { x: "70%", w: "8%", colors: ["rgba(140,30,30,0.05)", "rgba(212,175,55,0.03)"] },
              { x: "82%", w: "10%", colors: ["rgba(212,175,55,0.06)", "rgba(140,30,30,0.04)"] },
            ].map((win, i) => (
              <motion.div
                key={i}
                className="absolute top-[5%] pointer-events-none"
                style={{
                  left: win.x,
                  width: win.w,
                  height: "50%",
                  background: `linear-gradient(180deg, ${win.colors[0]}, ${win.colors[1]}, transparent)`,
                  clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
                }}
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 10 + i * 2, repeat: Infinity, delay: i * 1.5 }}
              />
            ))}

            {/* Dining tables */}
            <div className="absolute bottom-[20%] left-[10%] right-[10%] h-[3px] rounded-full" style={{
              background: "linear-gradient(90deg, transparent, rgba(80,55,35,0.25) 20%, rgba(80,55,35,0.3) 50%, rgba(80,55,35,0.25) 80%, transparent)",
            }} />
            <div className="absolute bottom-[15%] left-[15%] right-[15%] h-[2px] rounded-full" style={{
              background: "linear-gradient(90deg, transparent, rgba(80,55,35,0.18) 25%, rgba(80,55,35,0.22) 50%, rgba(80,55,35,0.18) 75%, transparent)",
            }} />

            {/* Floor */}
            <div className="absolute bottom-0 left-0 right-0 h-[15%]" style={{
              background: "linear-gradient(0deg, rgba(20,18,15,0.3), transparent)",
            }} />

            {/* Title */}
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 2.5 }}
            >
              <motion.h1
                className="font-cinzel-decorative text-4xl sm:text-5xl lg:text-6xl font-bold text-engraved mb-3"
                style={{ textShadow: "0 0 40px rgba(184,134,11,0.1)" }}
                initial={{ opacity: 0, letterSpacing: "0.3em" }}
                animate={{ opacity: 1, letterSpacing: "0.15em" }}
                transition={{ delay: 2, duration: 3 }}
              >
                Hogwarts
              </motion.h1>
              <motion.p
                className="font-cinzel text-xs sm:text-sm tracking-[0.4em]"
                style={{ color: "rgba(184,134,11,0.3)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3, duration: 2 }}
              >
                EXPLORE THE CASTLE
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
