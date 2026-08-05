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
  "black": 2000,
  "candle": 5500,
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
  const [started, setStarted] = useState(false);
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

  useEffect(() => {
    if (!started) return;
    if (phase === "candle") {
      audio.playLoop("fire");
    } else if (phase === "rain-window") {
      audio.playLoop("rain");
      audio.playLoop("wind");
    } else if (phase === "owl-flyby") {
      audio.playSound("owl");
    } else if (phase === "great-hall") {
      audio.stopLoop("rain");
      audio.stopLoop("wind");
      audio.playLoop("fire");
      audio.playSound("bells");
    }
  }, [phase, started, audio]);

  useEffect(() => {
    if (started) {
      const t = setTimeout(() => setShowSkip(true), 4000);
      return () => clearTimeout(t);
    }
  }, [started]);

  const handleStart = () => {
    audio.initAudio();
    setStarted(true);
    setPhase("candle");
  };

  const skipToEnd = () => {
    audio.stopAll();
    setPhase("done");
  };

  // Click to begin screen
  if (!started) {
    return (
      <div
        className="relative min-h-screen w-full overflow-hidden flex items-center justify-center cursor-pointer"
        style={{ backgroundColor: "#0A0806" }}
        onClick={handleStart}
      >
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(184,134,11,0.04), transparent 60%)",
        }} />
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          <motion.div
            className="w-4 h-6 mx-auto mb-6 rounded-full"
            style={{
              background: "linear-gradient(180deg, rgba(255,200,80,0.7), rgba(255,150,40,0.5), rgba(200,100,20,0.3))",
              boxShadow: "0 0 30px rgba(255,180,60,0.3), 0 0 60px rgba(255,150,40,0.15)",
            }}
            animate={{ scaleY: [1, 1.1, 0.95, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <p className="font-cinzel text-xs tracking-[0.4em] mb-3" style={{ color: "rgba(184,134,11,0.5)" }}>
            EXPLORE HOGWARTS
          </p>
          <p className="font-cormorant text-sm italic" style={{ color: "rgba(140,130,115,0.35)" }}>
            Click to enter
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden" style={{ backgroundColor: "#0A0806" }}>
      {/* Skip button */}
      {showSkip && phase !== "done" && (
        <motion.button
          className="absolute top-5 right-5 z-50 cursor-pointer px-4 py-2 rounded-sm"
          style={{
            background: "rgba(30,26,22,0.7)",
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

      <AnimatePresence mode="wait">
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
            <div className="absolute inset-0" style={{ backgroundColor: "#0A0806" }} />

            {/* Warm glow */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 400,
                height: 400,
                background: "radial-gradient(circle, rgba(255,180,60,0.18), rgba(255,150,40,0.08) 35%, transparent 65%)",
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
              <div className="absolute -inset-20 rounded-full" style={{
                background: "radial-gradient(circle, rgba(255,180,60,0.15), transparent 60%)",
              }} />
              <motion.div
                className="relative"
                style={{ width: 10, height: 24 }}
                animate={{ scaleY: [1, 1.12, 0.93, 1.06, 1], skewX: [-2, 2, -1, 1, -2] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="absolute inset-0 rounded-full" style={{
                  background: "linear-gradient(180deg, rgba(255,220,120,0.95), rgba(255,160,40,0.85), rgba(200,80,20,0.65))",
                  filter: "blur(1px)",
                }} />
                <div className="absolute inset-x-1 top-1 bottom-2 rounded-full" style={{
                  background: "linear-gradient(180deg, rgba(255,255,200,1), rgba(255,220,120,0.9))",
                  filter: "blur(0.5px)",
                }} />
              </motion.div>
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-2.5 h-14 rounded-b-sm" style={{
                background: "linear-gradient(180deg, rgba(240,220,180,0.35), rgba(200,180,140,0.25))",
              }} />
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-3.5 h-1.5 rounded-full" style={{
                backgroundColor: "rgba(240,220,180,0.2)",
              }} />
            </motion.div>

            {/* Quote */}
            <motion.div
              className="absolute bottom-[16%] left-0 right-0 text-center px-8"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 2 }}
            >
              <p className="font-cormorant text-lg sm:text-xl italic" style={{ color: "rgba(212,175,55,0.55)" }}>
                "Mr. Potter... our new celebrity."
              </p>
              <p className="font-cinzel text-[9px] tracking-[0.3em] mt-3" style={{ color: "rgba(184,134,11,0.3)" }}>
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
            <div className="absolute inset-0" style={{
              background: "linear-gradient(180deg, #0C0A07, #100E0B, #0C0A07)",
            }} />

            {/* Window frame */}
            <div className="absolute top-[6%] left-1/2 -translate-x-1/2" style={{ width: "58%", maxWidth: 520, height: "68%" }}>
              <div className="absolute -inset-4 rounded-t-lg" style={{
                background: "linear-gradient(135deg, rgba(70,60,48,0.35), rgba(55,48,38,0.3))",
                border: "2px solid rgba(80,70,55,0.2)",
              }} />
              <div className="absolute inset-0 rounded-t overflow-hidden" style={{
                background: "linear-gradient(180deg, #12100D, #15130F, #100E0B)",
              }}>
                {raindrops.slice(0, 80).map((drop) => (
                  <motion.div
                    key={drop.id}
                    className="absolute"
                    style={{
                      left: `${drop.x}%`,
                      width: 1.5,
                      height: drop.length * 0.6,
                      background: `linear-gradient(180deg, transparent, rgba(160,175,190,${drop.opacity * 0.7}), transparent)`,
                    }}
                    initial={{ top: "-8%", opacity: 0 }}
                    animate={{ top: "108%", opacity: [0, drop.opacity * 0.7, 0] }}
                    transition={{ duration: drop.duration * 0.8, repeat: Infinity, delay: drop.delay, ease: "linear" }}
                  />
                ))}
                {Array.from({ length: 25 }).map((_, i) => (
                  <motion.div
                    key={`d-${i}`}
                    className="absolute rounded-full"
                    style={{
                      left: `${6 + i * 3.8}%`,
                      top: `${8 + (i % 5) * 18}%`,
                      width: 3.5,
                      height: 3.5,
                      backgroundColor: "rgba(160,175,190,0.25)",
                      boxShadow: "0 0 4px rgba(160,175,190,0.12)",
                    }}
                    animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.15, 0.35, 0.15] }}
                    transition={{ duration: 3 + i * 0.4, repeat: Infinity }}
                  />
                ))}
                {/* Distant castle lights */}
                {[
                  { x: 40, y: 50 }, { x: 48, y: 48 }, { x: 52, y: 47 }, { x: 60, y: 50 },
                ].map((pos, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-sm"
                    style={{
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                      width: 4,
                      height: 3,
                      backgroundColor: "rgba(255,200,80,0.35)",
                      boxShadow: "0 0 10px rgba(255,200,80,0.2)",
                      filter: "blur(0.5px)",
                    }}
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 3 + i, repeat: Infinity }}
                  />
                ))}
                <motion.div
                  className="absolute inset-0"
                  style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(255,180,60,0.06), transparent 55%)" }}
                  animate={{ opacity: [0, 0, 0, 0.15, 0, 0.08, 0, 0] }}
                  transition={{ duration: 8, repeat: Infinity }}
                />
              </div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[3px] h-full" style={{ backgroundColor: "rgba(65,58,48,0.35)" }} />
              <div className="absolute top-1/2 left-0 right-0 h-[3px] -translate-y-1/2" style={{ backgroundColor: "rgba(65,58,48,0.35)" }} />
            </div>

            {/* Red velvet curtains */}
            <motion.div
              className="absolute top-[4%] left-[5%] w-[18%] h-[72%]"
              style={{
                background: "linear-gradient(90deg, rgba(120,25,25,0.18), rgba(90,18,18,0.08))",
                borderRadius: "0 0 35% 0",
              }}
              animate={{ skewX: [-1.5, 1.5, -1.5] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute top-[4%] right-[5%] w-[18%] h-[72%]"
              style={{
                background: "linear-gradient(270deg, rgba(120,25,25,0.18), rgba(90,18,18,0.08))",
                borderRadius: "0 0 0 35%",
              }}
              animate={{ skewX: [1.5, -1.5, 1.5] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Interior candle */}
            <div className="absolute bottom-[12%] right-[12%] w-40 h-40 rounded-full" style={{
              background: "radial-gradient(circle, rgba(255,180,60,0.08), transparent 60%)",
            }} />

            {/* Roots creeping along bottom */}
            <svg className="absolute bottom-0 left-0 right-0 h-[12%] opacity-20" viewBox="0 0 200 30" preserveAspectRatio="none">
              <path d="M0,25 Q20,20 40,22 T80,18 T120,22 T160,16 T200,20 L200,30 L0,30 Z" fill="rgba(40,30,20,0.6)" />
              <path d="M0,28 Q30,22 60,25 T100,20 T140,24 T180,18 T200,22 L200,30 L0,30 Z" fill="rgba(35,25,18,0.5)" />
              <path d="M10,28 Q15,15 20,28" stroke="rgba(50,35,25,0.4)" fill="none" strokeWidth="0.5" />
              <path d="M50,25 Q55,12 60,25" stroke="rgba(50,35,25,0.35)" fill="none" strokeWidth="0.4" />
              <path d="M90,22 Q95,10 100,22" stroke="rgba(50,35,25,0.3)" fill="none" strokeWidth="0.4" />
              <path d="M140,24 Q145,14 150,24" stroke="rgba(50,35,25,0.35)" fill="none" strokeWidth="0.4" />
            </svg>

            <motion.div
              className="absolute bottom-[8%] left-1/2 -translate-x-1/2 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 2 }}
            >
              <p className="font-cormorant text-base italic" style={{ color: "rgba(212,175,55,0.5)" }}>
                "You're a wizard, Harry."
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* ===== THE LAKE ===== */}
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
              background: "linear-gradient(180deg, #080604, #0C0A07, #100E0B, #12100D)",
            }} />

            {stars.map((s) => (
              <motion.div
                key={s.id}
                className="absolute rounded-full"
                style={{
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  width: s.size,
                  height: s.size,
                  backgroundColor: `rgba(220,215,200,${s.opacity})`,
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
                right: "18%",
                width: 110,
                height: 110,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(240,235,220,0.3), rgba(220,215,200,0.1) 45%, transparent 65%)",
                boxShadow: "0 0 80px rgba(220,215,200,0.1)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 3 }}
            />

            {/* Water */}
            <div className="absolute bottom-0 left-0 right-0 h-[42%]" style={{
              background: "linear-gradient(180deg, rgba(20,18,15,0.3), rgba(12,10,8,0.2))",
            }} />
            {[44, 42, 40, 38].map((y, i) => (
              <motion.div
                key={i}
                className="absolute left-0 right-0 h-[1px]"
                style={{ top: `${y}%`, backgroundColor: `rgba(160,150,130,${0.15 - i * 0.03})` }}
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }}
              />
            ))}

            <motion.div
              className="absolute bottom-[28%] left-0 right-0 h-[22%]"
              style={{ background: "linear-gradient(0deg, rgba(60,55,48,0.15), transparent)" }}
              animate={{ x: ["-4%", "4%", "-4%"] }}
              transition={{ duration: 30, repeat: Infinity }}
            />

            {/* Castle — proper architecture */}
            <motion.div
              className="absolute bottom-[42%] left-1/2 -translate-x-1/2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ duration: 4, delay: 1 }}
            >
              <svg width="360" height="160" viewBox="0 0 360 160">
                {/* Ground reflection */}
                <ellipse cx="180" cy="158" rx="180" ry="8" fill="rgba(15,13,10,0.3)" />
                {/* Left wing */}
                <rect x="15" y="105" width="22" height="55" fill="rgba(35,30,25,0.65)" />
                <polygon points="15,105 26,85 37,105" fill="rgba(35,30,25,0.6)" />
                <rect x="18" y="88" width="5" height="17" fill="rgba(45,40,32,0.5)" />
                <rect x="42" y="95" width="18" height="65" fill="rgba(35,30,25,0.55)" />
                <rect x="65" y="100" width="25" height="60" fill="rgba(35,30,25,0.5)" />
                <rect x="70" y="75" width="8" height="25" rx="1" fill="rgba(45,40,32,0.6)" />
                <polygon points="68,75 74,60 80,75" fill="rgba(45,40,32,0.55)" />
                {/* Central block */}
                <rect x="95" y="85" width="45" height="75" fill="rgba(35,30,25,0.55)" />
                <rect x="100" y="55" width="10" height="30" rx="2" fill="rgba(45,40,32,0.65)" />
                <polygon points="100,55 105,38 110,55" fill="rgba(45,40,32,0.6)" />
                {/* Main tower */}
                <rect x="148" y="75" width="35" height="85" fill="rgba(35,30,25,0.6)" />
                <rect x="155" y="25" width="14" height="50" rx="3" fill="rgba(45,40,32,0.75)" />
                <polygon points="155,25 162,5 169,25" fill="rgba(45,40,32,0.7)" />
                {/* Great Hall */}
                <rect x="188" y="80" width="55" height="80" fill="rgba(35,30,25,0.55)" />
                <polygon points="188,80 215,55 243,80" fill="rgba(35,30,25,0.6)" />
                <rect x="210" y="60" width="10" height="20" rx="2" fill="rgba(45,40,32,0.65)" />
                <polygon points="210,60 215,45 220,60" fill="rgba(45,40,32,0.6)" />
                {/* Right wing */}
                <rect x="248" y="95" width="22" height="65" fill="rgba(35,30,25,0.5)" />
                <rect x="275" y="100" width="20" height="60" fill="rgba(35,30,25,0.55)" />
                <rect x="280" y="80" width="8" height="20" rx="1" fill="rgba(45,40,32,0.6)" />
                <polygon points="278,80 284,65 290,80" fill="rgba(45,40,32,0.55)" />
                <rect x="300" y="95" width="25" height="65" fill="rgba(35,30,25,0.5)" />
                <rect x="330" y="105" width="18" height="55" fill="rgba(35,30,25,0.6)" />
                <rect x="334" y="88" width="5" height="17" fill="rgba(45,40,32,0.5)" />
                {/* Windows — warm dots */}
                {[
                  [26, 115], [26, 130], [50, 110], [50, 125],
                  [75, 105], [75, 120], [108, 95], [108, 110], [108, 125],
                  [160, 85], [160, 100], [160, 115],
                  [200, 90], [215, 88], [230, 90], [215, 105], [215, 120],
                  [260, 110], [285, 95], [285, 110],
                  [312, 105], [312, 120], [340, 115],
                ].map(([x, y], i) => (
                  <rect key={i} x={x} y={y} width="3" height="2.5" rx="0.5" fill={`rgba(255,200,80,${0.4 + (i % 3) * 0.15})`} />
                ))}
              </svg>
            </motion.div>

            {/* Window glows */}
            {[
              { x: 42, y: 43 }, { x: 45, y: 42 }, { x: 48, y: 41 },
              { x: 51, y: 40 }, { x: 54, y: 41 }, { x: 57, y: 42 },
              { x: 60, y: 43 },
            ].map((pos, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${pos.x}%`,
                  bottom: `${pos.y}%`,
                  width: 4,
                  height: 3,
                  backgroundColor: "rgba(255,200,80,0.6)",
                  boxShadow: "0 0 8px rgba(255,200,80,0.3), 0 0 16px rgba(255,180,60,0.12)",
                }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}

            {raindrops.slice(0, 50).map((drop) => (
              <motion.div
                key={drop.id}
                className="absolute"
                style={{
                  left: `${drop.x}%`,
                  width: 1,
                  height: drop.length * 0.6,
                  background: `linear-gradient(180deg, transparent, rgba(160,155,140,${drop.opacity * 0.45}), transparent)`,
                }}
                initial={{ top: "-5%", opacity: 0 }}
                animate={{ top: "105%", opacity: [0, drop.opacity * 0.45, 0] }}
                transition={{ duration: drop.duration, repeat: Infinity, delay: drop.delay, ease: "linear" }}
              />
            ))}

            <motion.div
              className="absolute bottom-[6%] left-0 right-0 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 2 }}
            >
              <p className="font-cormorant text-base sm:text-lg italic" style={{ color: "rgba(212,175,55,0.45)" }}>
                "Whether you come back by page or by the big screen,
              </p>
              <p className="font-cormorant text-base sm:text-lg italic mt-1" style={{ color: "rgba(212,175,55,0.45)" }}>
                Hogwarts will always be there to welcome you home."
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* ===== CASTLE REVEAL ===== */}
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
              background: "linear-gradient(180deg, #060504, #0A0908, #0C0B09)",
            }} />

            {stars.slice(0, 35).map((s) => (
              <motion.div
                key={s.id}
                className="absolute rounded-full"
                style={{
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  width: s.size,
                  height: s.size,
                  backgroundColor: `rgba(220,215,200,${s.opacity * 0.8})`,
                }}
                animate={{ opacity: [s.opacity * 0.4, s.opacity * 0.8, s.opacity * 0.4] }}
                transition={{ duration: s.twinkle, repeat: Infinity }}
              />
            ))}

            <motion.div
              className="absolute"
              style={{
                top: "8%",
                right: "16%",
                width: 130,
                height: 130,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(240,235,220,0.35), rgba(220,215,200,0.12) 45%, transparent 65%)",
                boxShadow: "0 0 100px rgba(220,215,200,0.12)",
              }}
            />

            {/* Castle — detailed */}
            <motion.div
              className="absolute bottom-[22%] left-1/2 -translate-x-1/2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.75 }}
              transition={{ duration: 3 }}
            >
              <svg width="550" height="250" viewBox="0 0 550 250">
                <ellipse cx="275" cy="248" rx="280" ry="12" fill="rgba(15,13,10,0.35)" />
                {/* Far left towers */}
                <rect x="8" y="155" width="16" height="95" fill="rgba(30,26,22,0.6)" />
                <rect x="10" y="130" width="5" height="25" rx="1" fill="rgba(40,35,28,0.55)" />
                <polygon points="10,130 12.5,118 15,130" fill="rgba(40,35,28,0.5)" />
                <rect x="28" y="145" width="22" height="105" fill="rgba(30,26,22,0.55)" />
                <rect x="35" y="115" width="8" height="30" rx="2" fill="rgba(40,35,28,0.6)" />
                <polygon points="35,115 39,100 43,115" fill="rgba(40,35,28,0.55)" />
                {/* Left wing */}
                <rect x="55" y="135" width="35" height="115" fill="rgba(30,26,22,0.5)" />
                <rect x="62" y="95" width="12" height="40" rx="2" fill="rgba(40,35,28,0.65)" />
                <polygon points="62,95 68,75 74,95" fill="rgba(40,35,28,0.6)" />
                <rect x="95" y="140" width="28" height="110" fill="rgba(30,26,22,0.5)" />
                <rect x="100" y="110" width="8" height="30" rx="1" fill="rgba(40,35,28,0.55)" />
                <polygon points="100,110 104,95 108,110" fill="rgba(40,35,28,0.5)" />
                {/* Left central tower */}
                <rect x="128" y="120" width="40" height="130" fill="rgba(30,26,22,0.55)" />
                <rect x="135" y="65" width="14" height="55" rx="3" fill="rgba(40,35,28,0.7)" />
                <polygon points="135,65 142,42 149,65" fill="rgba(40,35,28,0.65)" />
                {/* Central great tower */}
                <rect x="175" y="100" width="55" height="150" fill="rgba(30,26,22,0.6)" />
                <rect x="185" y="30" width="18" height="70" rx="4" fill="rgba(40,35,28,0.8)" />
                <polygon points="185,30 194,5 203,30" fill="rgba(40,35,28,0.75)" />
                <rect x="210" y="108" width="12" height="42" rx="2" fill="rgba(40,35,28,0.6)" />
                <polygon points="210,108 216,92 222,108" fill="rgba(40,35,28,0.55)" />
                {/* Great Hall */}
                <rect x="235" y="110" width="70" height="140" fill="rgba(30,26,22,0.55)" />
                <polygon points="235,110 270,75 305,110" fill="rgba(30,26,22,0.6)" />
                <rect x="265" y="80" width="10" height="30" rx="2" fill="rgba(40,35,28,0.65)" />
                <polygon points="265,80 270,60 275,80" fill="rgba(40,35,28,0.6)" />
                {/* Right central tower */}
                <rect x="310" y="115" width="42" height="135" fill="rgba(30,26,22,0.55)" />
                <rect x="318" y="60" width="14" height="55" rx="3" fill="rgba(40,35,28,0.7)" />
                <polygon points="318,60 325,38 332,60" fill="rgba(40,35,28,0.65)" />
                {/* Right wing */}
                <rect x="358" y="130" width="30" height="120" fill="rgba(30,26,22,0.5)" />
                <rect x="365" y="100" width="10" height="30" rx="2" fill="rgba(40,35,28,0.6)" />
                <polygon points="365,100 370,85 375,100" fill="rgba(40,35,28,0.55)" />
                <rect x="393" y="140" width="25" height="110" fill="rgba(30,26,22,0.5)" />
                <rect x="423" y="135" width="30" height="115" fill="rgba(30,26,22,0.55)" />
                <rect x="430" y="105" width="10" height="30" rx="2" fill="rgba(40,35,28,0.6)" />
                <polygon points="430,105 435,88 440,105" fill="rgba(40,35,28,0.55)" />
                {/* Far right */}
                <rect x="458" y="145" width="22" height="105" fill="rgba(30,26,22,0.5)" />
                <rect x="464" y="125" width="5" height="20" rx="1" fill="rgba(40,35,28,0.55)" />
                <polygon points="464,125 466.5,115 469,125" fill="rgba(40,35,28,0.5)" />
                <rect x="485" y="155" width="18" height="95" fill="rgba(30,26,22,0.6)" />
                {/* Windows */}
                {[
                  [18, 165], [18, 180], [38, 160], [38, 175],
                  [68, 150], [68, 165], [68, 180],
                  [103, 155], [103, 170],
                  [142, 135], [142, 150], [142, 165], [142, 180],
                  [190, 115], [190, 130], [190, 145], [190, 160], [190, 175],
                  [215, 120], [215, 135],
                  [250, 125], [270, 120], [290, 125],
                  [260, 145], [270, 140], [280, 145],
                  [260, 165], [270, 160], [280, 165],
                  [325, 130], [325, 145], [325, 160], [325, 175],
                  [375, 145], [375, 160],
                  [405, 155], [405, 170],
                  [437, 115], [437, 130], [437, 145],
                  [468, 160], [468, 175],
                ].map(([x, y], i) => (
                  <rect key={i} x={x} y={y} width="4" height="3" rx="0.5" fill={`rgba(255,200,80,${0.35 + (i % 4) * 0.12})`} />
                ))}
              </svg>
            </motion.div>

            {/* Lightning */}
            <motion.div
              className="absolute inset-0"
              style={{ background: "radial-gradient(ellipse at 45% 35%, rgba(220,215,200,0.08), transparent 40%)" }}
              animate={{ opacity: [0, 0, 0, 0.3, 0, 0.15, 0, 0, 0, 0] }}
              transition={{ duration: 10, repeat: Infinity }}
            />

            {/* Window glows */}
            {[
              { x: 36, y: 44 }, { x: 40, y: 43 }, { x: 44, y: 42 },
              { x: 48, y: 41 }, { x: 52, y: 40.5 }, { x: 56, y: 41 },
              { x: 60, y: 42 }, { x: 64, y: 43 }, { x: 42, y: 38 },
              { x: 46, y: 37 }, { x: 50, y: 36 }, { x: 54, y: 37 },
              { x: 58, y: 38 }, { x: 50, y: 33 },
            ].map((pos, i) => (
              <motion.div
                key={i}
                className="absolute rounded-sm"
                style={{
                  left: `${pos.x}%`,
                  bottom: `${pos.y}%`,
                  width: 4,
                  height: 3.5,
                  backgroundColor: "rgba(255,200,80,0.7)",
                  boxShadow: "0 0 10px rgba(255,200,80,0.4), 0 0 20px rgba(255,180,60,0.15)",
                }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3 + i * 0.3, repeat: Infinity, delay: i * 0.12 }}
              />
            ))}

            {raindrops.slice(0, 30).map((drop) => (
              <motion.div
                key={drop.id}
                className="absolute"
                style={{
                  left: `${drop.x}%`,
                  width: 1,
                  height: drop.length * 0.4,
                  background: `linear-gradient(180deg, transparent, rgba(160,155,140,${drop.opacity * 0.3}), transparent)`,
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
              background: "linear-gradient(180deg, #080604, #0C0A07, #0E0C09)",
            }} />

            <div
              className="absolute"
              style={{
                top: "10%",
                left: "50%",
                transform: "translateX(-50%)",
                width: 170,
                height: 170,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(245,240,225,0.4), rgba(225,220,205,0.15) 45%, transparent 65%)",
                boxShadow: "0 0 120px rgba(225,220,205,0.15)",
              }}
            />

            {stars.slice(0, 40).map((s) => (
              <motion.div
                key={s.id}
                className="absolute rounded-full"
                style={{
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  width: s.size,
                  height: s.size,
                  backgroundColor: `rgba(225,220,205,${s.opacity})`,
                }}
                animate={{ opacity: [s.opacity * 0.5, s.opacity, s.opacity * 0.5] }}
                transition={{ duration: s.twinkle, repeat: Infinity }}
              />
            ))}

            {/* Hedwig */}
            <motion.div
              className="absolute"
              style={{ top: "14%" }}
              initial={{ left: "-15%" }}
              animate={{ left: "115%" }}
              transition={{ duration: 5, ease: "easeInOut" }}
            >
              <svg width="90" height="45" viewBox="0 0 90 45">
                <ellipse cx="45" cy="28" rx="14" ry="9" fill="rgba(220,215,205,0.8)" />
                <circle cx="58" cy="23" r="7" fill="rgba(230,225,215,0.85)" />
                <circle cx="60" cy="22" r="2" fill="rgba(25,20,10,0.95)" />
                <circle cx="60.5" cy="21.5" r="0.7" fill="rgba(255,255,200,0.9)" />
                <polygon points="65,23 68,24.5 65,26" fill="rgba(200,160,70,0.7)" />
                <motion.path
                  d="M 38 25 Q 22 5 5 12 Q 18 20 33 25"
                  fill="rgba(210,205,195,0.7)"
                  animate={{ d: [
                    "M 38 25 Q 22 5 5 12 Q 18 20 33 25",
                    "M 38 25 Q 22 42 5 35 Q 18 25 33 25",
                    "M 38 25 Q 22 5 5 12 Q 18 20 33 25",
                  ]}}
                  transition={{ duration: 0.7, repeat: Infinity }}
                />
                <motion.path
                  d="M 52 25 Q 68 5 85 12 Q 72 20 57 25"
                  fill="rgba(210,205,195,0.7)"
                  animate={{ d: [
                    "M 52 25 Q 68 5 85 12 Q 72 20 57 25",
                    "M 52 25 Q 68 42 85 35 Q 72 25 57 25",
                    "M 52 25 Q 68 5 85 12 Q 72 20 57 25",
                  ]}}
                  transition={{ duration: 0.7, repeat: Infinity }}
                />
                <path d="M 31 28 L 20 31 L 22 27 L 31 26" fill="rgba(200,195,185,0.6)" />
              </svg>
            </motion.div>

            {/* Second owl */}
            <motion.div
              className="absolute"
              style={{ top: "28%" }}
              initial={{ left: "110%" }}
              animate={{ left: "-10%" }}
              transition={{ duration: 7, ease: "easeInOut", delay: 1.2 }}
            >
              <svg width="35" height="18" viewBox="0 0 90 45" style={{ opacity: 0.45 }}>
                <ellipse cx="45" cy="28" rx="14" ry="9" fill="rgba(190,185,175,0.7)" />
                <circle cx="58" cy="23" r="7" fill="rgba(200,195,185,0.75)" />
                <motion.path
                  d="M 38 25 Q 22 5 5 12 Q 18 20 33 25"
                  fill="rgba(180,175,165,0.6)"
                  animate={{ d: [
                    "M 38 25 Q 22 5 5 12 Q 18 20 33 25",
                    "M 38 25 Q 22 42 5 35 Q 18 25 33 25",
                    "M 38 25 Q 22 5 5 12 Q 18 20 33 25",
                  ]}}
                  transition={{ duration: 0.85, repeat: Infinity }}
                />
                <motion.path
                  d="M 52 25 Q 68 5 85 12 Q 72 20 57 25"
                  fill="rgba(180,175,165,0.6)"
                  animate={{ d: [
                    "M 52 25 Q 68 5 85 12 Q 72 20 57 25",
                    "M 52 25 Q 68 42 85 35 Q 72 25 57 25",
                    "M 52 25 Q 68 5 85 12 Q 72 20 57 25",
                  ]}}
                  transition={{ duration: 0.85, repeat: Infinity }}
                />
              </svg>
            </motion.div>

            {/* Castle silhouette below */}
            <div className="absolute bottom-[12%] left-1/2 -translate-x-1/2" style={{ opacity: 0.35 }}>
              <svg width="420" height="110" viewBox="0 0 420 110">
                <rect x="25" y="55" width="18" height="55" fill="rgba(30,26,22,0.6)" />
                <polygon points="25,55 34,40 43,55" fill="rgba(30,26,22,0.55)" />
                <rect x="48" y="45" width="28" height="65" fill="rgba(30,26,22,0.5)" />
                <rect x="80" y="35" width="12" height="75" rx="2" fill="rgba(40,35,28,0.65)" />
                <polygon points="80,35 86,20 92,35" fill="rgba(40,35,28,0.6)" />
                <rect x="100" y="50" width="38" height="60" fill="rgba(30,26,22,0.45)" />
                <rect x="145" y="25" width="14" height="85" rx="3" fill="rgba(40,35,28,0.7)" />
                <polygon points="145,25 152,8 159,25" fill="rgba(40,35,28,0.65)" />
                <rect x="170" y="45" width="45" height="65" fill="rgba(30,26,22,0.5)" />
                <polygon points="170,45 192,28 215,45" fill="rgba(30,26,22,0.55)" />
                <rect x="220" y="40" width="12" height="70" rx="2" fill="rgba(40,35,28,0.6)" />
                <polygon points="220,40 226,25 232,40" fill="rgba(40,35,28,0.55)" />
                <rect x="240" y="50" width="32" height="60" fill="rgba(30,26,22,0.45)" />
                <rect x="280" y="35" width="16" height="75" rx="3" fill="rgba(40,35,28,0.65)" />
                <polygon points="280,35 288,18 296,35" fill="rgba(40,35,28,0.6)" />
                <rect x="300" y="55" width="25" height="55" fill="rgba(30,26,22,0.5)" />
                <rect x="330" y="45" width="12" height="65" rx="2" fill="rgba(40,35,28,0.55)" />
                <polygon points="330,45 336,32 342,45" fill="rgba(40,35,28,0.5)" />
                <rect x="350" y="55" width="22" height="55" fill="rgba(30,26,22,0.5)" />
                <rect x="378" y="60" width="18" height="50" fill="rgba(30,26,22,0.55)" />
                {/* Windows */}
                {[[34, 65], [58, 58], [86, 45], [115, 60], [150, 35], [185, 55], [195, 55], [226, 50], [288, 45], [310, 62], [336, 55], [360, 62]].map(([x, y], i) => (
                  <rect key={i} x={x} y={y} width="3" height="2.5" rx="0.5" fill={`rgba(255,200,80,${0.3 + (i % 3) * 0.1})`} />
                ))}
              </svg>
            </div>

            <motion.div
              className="absolute bottom-[6%] left-0 right-0 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 2 }}
            >
              <p className="font-cormorant text-base italic" style={{ color: "rgba(212,175,55,0.45)" }}>
                "Hedwig's Theme"
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
              background: "linear-gradient(180deg, #080604, #0C0A07, #100E0B)",
            }} />

            <motion.div
              className="absolute top-0 bottom-0 left-0"
              style={{ width: "28%", background: "linear-gradient(90deg, rgba(50,45,38,0.55), transparent)" }}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              transition={{ duration: 7, ease: "easeOut" }}
            />
            <motion.div
              className="absolute top-0 bottom-0 right-0"
              style={{ width: "28%", background: "linear-gradient(270deg, rgba(50,45,38,0.55), transparent)" }}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              transition={{ duration: 7, ease: "easeOut" }}
            />

            <div className="absolute inset-0" style={{
              backgroundImage: `
                repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(0,0,0,0.05) 50px, rgba(0,0,0,0.05) 51px),
                repeating-linear-gradient(0deg, transparent, transparent 35px, rgba(0,0,0,0.04) 35px, rgba(0,0,0,0.04) 36px)
              `,
            }} />

            {/* Castle entrance */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.65 }}
              transition={{ duration: 8, ease: "easeOut" }}
            >
              <div className="relative" style={{ width: 300, height: 450 }}>
                <div className="absolute bottom-0 left-0 w-14 h-full" style={{ backgroundColor: "rgba(45,40,32,0.45)", borderRight: "1px solid rgba(60,55,45,0.1)" }} />
                <div className="absolute bottom-0 right-0 w-14 h-full" style={{ backgroundColor: "rgba(45,40,32,0.45)", borderLeft: "1px solid rgba(60,55,45,0.1)" }} />
                <div className="absolute top-0 left-14 right-14" style={{
                  height: 220,
                  borderRadius: "150px 150px 0 0",
                  border: "4px solid rgba(60,55,45,0.25)",
                  borderBottom: "none",
                }} />
                <div className="absolute top-[90px] left-[70px] right-[70px] bottom-0" style={{
                  borderRadius: "90px 90px 0 0",
                  background: "linear-gradient(180deg, rgba(8,6,4,0.65), rgba(8,6,4,0.9))",
                }} />
                <motion.div
                  className="absolute top-[110px] left-[80px] right-[80px] bottom-0"
                  style={{
                    borderRadius: "80px 80px 0 0",
                    background: "radial-gradient(ellipse at 50% 30%, rgba(255,180,60,0.18), transparent 60%)",
                  }}
                  animate={{ opacity: [0.4, 0.75, 0.4] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                {/* Torches */}
                {[{ x: "6%", y: "42%" }, { x: "90%", y: "42%" }].map((pos, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{ left: pos.x, top: pos.y }}
                  >
                    <motion.div
                      className="w-4 h-7 rounded-full"
                      style={{
                        background: "radial-gradient(circle, rgba(255,160,40,0.85), rgba(255,100,20,0.4) 60%, transparent)",
                        filter: "blur(1.5px)",
                      }}
                      animate={{ scaleY: [1, 1.25, 0.88, 1.1, 1], opacity: [0.7, 1, 0.55, 0.9, 0.7] }}
                      transition={{ duration: 1.5 + i * 0.3, repeat: Infinity }}
                    />
                    <div className="w-[3px] h-5 mx-auto" style={{ backgroundColor: "rgba(90,70,50,0.35)" }} />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <div className="absolute bottom-0 left-0 right-0 h-[25%]" style={{
              background: "linear-gradient(0deg, rgba(35,30,25,0.3), transparent)",
            }} />

            {/* Roots on ground */}
            <svg className="absolute bottom-0 left-[20%] right-[20%] h-[10%] opacity-25" viewBox="0 0 200 25" preserveAspectRatio="none">
              <path d="M0,20 Q30,15 60,18 T120,14 T180,17 T200,15 L200,25 L0,25 Z" fill="rgba(45,35,25,0.5)" />
              <path d="M20,20 Q25,8 30,20" stroke="rgba(55,42,30,0.4)" fill="none" strokeWidth="0.6" />
              <path d="M70,17 Q75,5 80,17" stroke="rgba(55,42,30,0.35)" fill="none" strokeWidth="0.5" />
              <path d="M130,15 Q135,3 140,15" stroke="rgba(55,42,30,0.35)" fill="none" strokeWidth="0.5" />
            </svg>

            {raindrops.slice(0, 20).map((drop) => (
              <motion.div
                key={drop.id}
                className="absolute"
                style={{
                  left: `${drop.x}%`,
                  width: 1,
                  height: drop.length * 0.35,
                  background: `linear-gradient(180deg, transparent, rgba(160,155,140,${drop.opacity * 0.2}), transparent)`,
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
              background: "linear-gradient(180deg, #080604, #0C0A07, #100E0B)",
            }} />

            {/* Gateposts */}
            <motion.div
              className="absolute left-[8%] top-[3%] bottom-[8%] w-[12%]"
              style={{ backgroundColor: "rgba(55,50,42,0.5)" }}
              initial={{ x: -90, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 2.5 }}
            >
              <div className="absolute top-[3%] left-0 w-full h-[42%]" style={{
                background: "linear-gradient(180deg, rgba(40,65,45,0.3), transparent)",
              }} />
              {/* Ivy vines */}
              <svg className="absolute top-[5%] left-[10%] w-[80%] h-[50%] opacity-30" viewBox="0 0 50 100">
                <path d="M10,0 Q15,20 8,40 Q12,60 5,80 Q10,90 8,100" stroke="rgba(40,70,45,0.6)" fill="none" strokeWidth="1.5" />
                <path d="M30,10 Q35,30 28,50 Q32,70 25,90" stroke="rgba(40,70,45,0.5)" fill="none" strokeWidth="1" />
                <ellipse cx="8" cy="30" rx="4" ry="3" fill="rgba(40,80,50,0.4)" />
                <ellipse cx="15" cy="55" rx="3" ry="2.5" fill="rgba(40,80,50,0.35)" />
                <ellipse cx="5" cy="75" rx="3.5" ry="2.5" fill="rgba(40,80,50,0.3)" />
                <ellipse cx="28" cy="40" rx="3" ry="2" fill="rgba(40,80,50,0.35)" />
              </svg>
              <motion.div
                className="absolute top-[38%] left-1/2 -translate-x-1/2"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-5 h-8 rounded-full" style={{
                  background: "radial-gradient(circle, rgba(255,160,40,0.85), rgba(255,100,20,0.4) 60%, transparent)",
                  filter: "blur(2px)",
                }} />
                <div className="w-[3px] h-6 mx-auto" style={{ backgroundColor: "rgba(90,70,50,0.4)" }} />
              </motion.div>
            </motion.div>

            <motion.div
              className="absolute right-[8%] top-[3%] bottom-[8%] w-[12%]"
              style={{ backgroundColor: "rgba(55,50,42,0.5)" }}
              initial={{ x: 90, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 2.5 }}
            >
              <div className="absolute top-[3%] right-0 w-full h-[42%]" style={{
                background: "linear-gradient(180deg, rgba(40,65,45,0.3), transparent)",
              }} />
              <svg className="absolute top-[5%] left-[10%] w-[80%] h-[50%] opacity-30" viewBox="0 0 50 100">
                <path d="M40,0 Q35,20 42,40 Q38,60 45,80 Q40,90 42,100" stroke="rgba(40,70,45,0.6)" fill="none" strokeWidth="1.5" />
                <path d="M20,10 Q15,30 22,50 Q18,70 25,90" stroke="rgba(40,70,45,0.5)" fill="none" strokeWidth="1" />
                <ellipse cx="42" cy="30" rx="4" ry="3" fill="rgba(40,80,50,0.4)" />
                <ellipse cx="35" cy="55" rx="3" ry="2.5" fill="rgba(40,80,50,0.35)" />
              </svg>
              <motion.div
                className="absolute top-[38%] left-1/2 -translate-x-1/2"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                <div className="w-5 h-8 rounded-full" style={{
                  background: "radial-gradient(circle, rgba(255,160,40,0.85), rgba(255,100,20,0.4) 60%, transparent)",
                  filter: "blur(2px)",
                }} />
                <div className="w-[3px] h-6 mx-auto" style={{ backgroundColor: "rgba(90,70,50,0.4)" }} />
              </motion.div>
            </motion.div>

            {/* Iron gate bars */}
            <motion.div
              className="relative flex gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.55 }}
              transition={{ duration: 2.5, delay: 0.8 }}
            >
              {Array.from({ length: 18 }).map((_, i) => (
                <div key={i} className="w-[3px] h-64" style={{
                  backgroundColor: "rgba(85,85,90,0.5)",
                  borderRadius: "2px 2px 0 0",
                }} />
              ))}
              <div className="absolute top-[14%] left-0 right-0 h-[3px]" style={{ backgroundColor: "rgba(85,85,90,0.45)" }} />
              <div className="absolute top-[48%] left-0 right-0 h-[3px]" style={{ backgroundColor: "rgba(85,85,90,0.35)" }} />
            </motion.div>

            <motion.div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[42%] h-[52%]"
              style={{
                background: "radial-gradient(ellipse at 50% 0%, rgba(255,180,60,0.15), transparent 55%)",
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
              background: "linear-gradient(180deg, #080604, #0C0A07, #100E0B)",
            }} />

            <div className="absolute top-0 bottom-0 left-0 w-[28%]" style={{ background: "linear-gradient(90deg, rgba(50,45,38,0.5), transparent)" }} />
            <div className="absolute top-0 bottom-0 right-0 w-[28%]" style={{ background: "linear-gradient(270deg, rgba(50,45,38,0.5), transparent)" }} />
            <div className="absolute top-0 left-0 right-0 h-[32%]" style={{ background: "linear-gradient(180deg, rgba(50,45,38,0.4), transparent)" }} />

            {/* Fountain */}
            <motion.div
              className="absolute bottom-[18%] left-1/2 -translate-x-1/2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.45, y: 0 }}
              transition={{ duration: 2.5, delay: 0.8 }}
            >
              <div className="relative" style={{ width: 130, height: 65 }}>
                <div className="absolute bottom-0 left-0 right-0 h-8 rounded-b-full" style={{ backgroundColor: "rgba(65,60,52,0.45)" }} />
                <motion.div
                  className="absolute bottom-2.5 left-[8%] right-[8%] h-[5px] rounded-full"
                  style={{ backgroundColor: "rgba(140,155,175,0.18)" }}
                  animate={{ opacity: [0.3, 0.75, 0.3] }}
                  transition={{ duration: 3.5, repeat: Infinity }}
                />
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[3px] h-14" style={{ backgroundColor: "rgba(65,60,52,0.4)" }} />
                <motion.div
                  className="absolute bottom-[3.5rem] left-1/2 -translate-x-1/2 w-10 h-10 rounded-full"
                  style={{
                    background: "radial-gradient(circle, rgba(140,155,175,0.1), transparent 65%)",
                  }}
                  animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.15, 0.35, 0.15] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </div>
            </motion.div>

            {/* Gargoyles on walls */}
            {["left-[22%]", "right-[22%]"].map((pos, i) => (
              <motion.div
                key={i}
                className={`absolute top-[28%] ${pos}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ delay: 1.5, duration: 2 }}
              >
                <svg width="20" height="25" viewBox="0 0 20 25">
                  <path d="M5,25 L5,12 Q5,5 10,3 Q15,5 15,12 L15,25" fill="rgba(55,50,42,0.6)" />
                  <circle cx="8" cy="10" r="1.5" fill="rgba(255,200,80,0.15)" />
                  <circle cx="12" cy="10" r="1.5" fill="rgba(255,200,80,0.15)" />
                </svg>
              </motion.div>
            ))}

            {raindrops.slice(0, 12).map((drop) => (
              <motion.div
                key={drop.id}
                className="absolute"
                style={{
                  left: `${drop.x}%`,
                  width: 1,
                  height: drop.length * 0.25,
                  background: `linear-gradient(180deg, transparent, rgba(160,155,140,${drop.opacity * 0.12}), transparent)`,
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
              background: "linear-gradient(180deg, #0A0806, #0E0C09, #100E0B)",
            }} />

            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 2.5 }}
            >
              <div className="absolute -inset-10 rounded-t-[90px]" style={{
                border: "7px solid rgba(60,55,45,0.3)",
                borderBottom: "none",
              }} />

              <div className="relative inline-block" style={{ width: 140, height: 300 }}>
                <div className="absolute inset-0 rounded-t-[70px] overflow-hidden" style={{
                  background: "linear-gradient(180deg, rgba(100,72,50,0.45), rgba(72,50,35,0.55))",
                  border: "2px solid rgba(120,88,60,0.18)",
                  borderRight: "1px solid rgba(120,88,60,0.1)",
                }}>
                  <div className="absolute inset-0" style={{
                    backgroundImage: "repeating-linear-gradient(87deg, transparent, transparent 4px, rgba(0,0,0,0.05) 4px, rgba(0,0,0,0.05) 8px)",
                  }} />
                  <div className="absolute inset-6" style={{ border: "1.5px solid rgba(120,88,60,0.12)" }} />
                  {[16, 36, 56, 76].map((y) => (
                    <div key={y} className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full" style={{
                      top: `${y}%`,
                      backgroundColor: "rgba(105,105,110,0.3)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                    }} />
                  ))}
                  <div className="absolute top-1/2 right-5 w-4 h-10 rounded-full" style={{
                    background: "linear-gradient(135deg, rgba(212,175,55,0.45), rgba(184,134,11,0.35))",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.5)",
                  }} />
                </div>
              </div>

              <div className="relative inline-block" style={{ width: 140, height: 300 }}>
                <div className="absolute inset-0 rounded-t-[70px] overflow-hidden" style={{
                  background: "linear-gradient(180deg, rgba(100,72,50,0.45), rgba(72,50,35,0.55))",
                  border: "2px solid rgba(120,88,60,0.18)",
                  borderLeft: "1px solid rgba(120,88,60,0.1)",
                }}>
                  <div className="absolute inset-0" style={{
                    backgroundImage: "repeating-linear-gradient(87deg, transparent, transparent 4px, rgba(0,0,0,0.05) 4px, rgba(0,0,0,0.05) 8px)",
                  }} />
                  <div className="absolute inset-6" style={{ border: "1.5px solid rgba(120,88,60,0.12)" }} />
                  {[16, 36, 56, 76].map((y) => (
                    <div key={y} className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full" style={{
                      top: `${y}%`,
                      backgroundColor: "rgba(105,105,110,0.3)",
                    }} />
                  ))}
                  <div className="absolute top-1/2 left-5 w-4 h-10 rounded-full" style={{
                    background: "linear-gradient(135deg, rgba(212,175,55,0.45), rgba(184,134,11,0.35))",
                  }} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ===== OPENING ===== */}
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
              background: "linear-gradient(180deg, #0A0806, #0E0C09, #100E0B)",
            }} />

            <div className="absolute -inset-10 rounded-t-[90px]" style={{
              border: "7px solid rgba(60,55,45,0.22)",
              borderBottom: "none",
              pointerEvents: "none",
              zIndex: 10,
            }} />

            <motion.div
              className="absolute top-[5%] left-[12%] w-[20%] h-[90%] origin-left overflow-hidden"
              style={{
                background: "linear-gradient(180deg, rgba(100,72,50,0.4), rgba(72,50,35,0.5))",
                borderRight: "1.5px solid rgba(120,88,60,0.12)",
                borderRadius: "45px 0 0 0",
              }}
              initial={{ rotateY: 0 }}
              animate={{ rotateY: -72 }}
              transition={{ duration: 3, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="absolute inset-0" style={{
                backgroundImage: "repeating-linear-gradient(87deg, transparent, transparent 4px, rgba(0,0,0,0.04) 4px, rgba(0,0,0,0.04) 8px)",
              }} />
            </motion.div>

            <motion.div
              className="absolute top-[5%] right-[12%] w-[20%] h-[90%] origin-right overflow-hidden"
              style={{
                background: "linear-gradient(180deg, rgba(100,72,50,0.4), rgba(72,50,35,0.5))",
                borderLeft: "1.5px solid rgba(120,88,60,0.12)",
                borderRadius: "0 45px 0 0",
              }}
              initial={{ rotateY: 0 }}
              animate={{ rotateY: 72 }}
              transition={{ duration: 3, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="absolute inset-0" style={{
                backgroundImage: "repeating-linear-gradient(87deg, transparent, transparent 4px, rgba(0,0,0,0.04) 4px, rgba(0,0,0,0.04) 8px)",
              }} />
            </motion.div>

            <motion.div
              className="absolute inset-0 z-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, delay: 1 }}
            >
              <div className="absolute inset-0" style={{
                background: "radial-gradient(ellipse at 50% 50%, rgba(255,180,60,0.25), transparent 40%)",
              }} />
            </motion.div>
          </motion.div>
        )}

        {/* ===== GREAT HALL ===== */}
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
              background: "linear-gradient(180deg, #0C0A07, #12100D, #0E0C09)",
            }} />

            <div className="absolute top-0 left-0 right-0 h-[42%]" style={{
              background: "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)",
            }} />
            <svg className="absolute top-0 left-0 right-0 h-[42%]" viewBox="0 0 100 50" preserveAspectRatio="none">
              <line x1="50" y1="0" x2="50" y2="50" stroke="rgba(70,65,55,0.1)" strokeWidth="0.3" />
              <line x1="10" y1="0" x2="50" y2="50" stroke="rgba(70,65,55,0.08)" strokeWidth="0.25" />
              <line x1="30" y1="0" x2="50" y2="50" stroke="rgba(70,65,55,0.08)" strokeWidth="0.25" />
              <line x1="90" y1="0" x2="50" y2="50" stroke="rgba(70,65,55,0.08)" strokeWidth="0.25" />
              <line x1="70" y1="0" x2="50" y2="50" stroke="rgba(70,65,55,0.08)" strokeWidth="0.25" />
              <line x1="0" y1="15" x2="100" y2="15" stroke="rgba(70,65,55,0.05)" strokeWidth="0.2" />
              <line x1="0" y1="30" x2="100" y2="30" stroke="rgba(70,65,55,0.04)" strokeWidth="0.15" />
            </svg>

            {/* Floating candles */}
            {Array.from({ length: 28 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${6 + (i % 7) * 13 + (Math.random() - 0.5) * 5}%`,
                  top: `${6 + Math.floor(i / 7) * 10 + (Math.random() - 0.5) * 4}%`,
                  width: 45 + Math.random() * 35,
                  height: 45 + Math.random() * 35,
                  background: `radial-gradient(circle, rgba(255,200,80,${0.05 + Math.random() * 0.04}), transparent 60%)`,
                }}
                animate={{
                  opacity: [0.5, 0.85, 0.5],
                  y: [0, -2.5, 0, 2.5, 0],
                }}
                transition={{
                  duration: 4 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                }}
              />
            ))}

            {/* Stained glass */}
            {[
              { x: "6%", w: "11%", colors: ["rgba(212,175,55,0.08)", "rgba(160,35,35,0.05)"] },
              { x: "20%", w: "9%", colors: ["rgba(160,35,35,0.06)", "rgba(35,90,55,0.04)"] },
              { x: "34%", w: "8%", colors: ["rgba(35,90,55,0.05)", "rgba(212,175,55,0.04)"] },
              { x: "58%", w: "8%", colors: ["rgba(35,90,55,0.05)", "rgba(160,35,35,0.04)"] },
              { x: "71%", w: "9%", colors: ["rgba(160,35,35,0.06)", "rgba(212,175,55,0.04)"] },
              { x: "83%", w: "11%", colors: ["rgba(212,175,55,0.08)", "rgba(160,35,35,0.05)"] },
            ].map((win, i) => (
              <motion.div
                key={i}
                className="absolute top-[4%] pointer-events-none"
                style={{
                  left: win.x,
                  width: win.w,
                  height: "52%",
                  background: `linear-gradient(180deg, ${win.colors[0]}, ${win.colors[1]}, transparent)`,
                  clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
                }}
                animate={{ opacity: [0.4, 0.75, 0.4] }}
                transition={{ duration: 10 + i * 2, repeat: Infinity, delay: i * 1.5 }}
              />
            ))}

            {/* Dining tables */}
            <div className="absolute bottom-[20%] left-[8%] right-[8%] h-[4px] rounded-full" style={{
              background: "linear-gradient(90deg, transparent, rgba(90,65,42,0.3) 18%, rgba(90,65,42,0.35) 50%, rgba(90,65,42,0.3) 82%, transparent)",
            }} />
            <div className="absolute bottom-[14%] left-[14%] right-[14%] h-[3px] rounded-full" style={{
              background: "linear-gradient(90deg, transparent, rgba(90,65,42,0.22) 22%, rgba(90,65,42,0.28) 50%, rgba(90,65,42,0.22) 78%, transparent)",
            }} />

            {/* People silhouettes at tables */}
            {[
              { x: 15 }, { x: 25 }, { x: 35 }, { x: 45 }, { x: 55 }, { x: 65 }, { x: 75 },
            ].map((p, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${p.x}%`,
                  bottom: "21%",
                  width: 6,
                  height: 12,
                  borderRadius: "3px 3px 0 0",
                  backgroundColor: `rgba(40,35,28,${0.2 + (i % 3) * 0.08})`,
                }}
                animate={{ opacity: [0.2, 0.35, 0.2] }}
                transition={{ duration: 3 + i * 0.5, repeat: Infinity }}
              />
            ))}

            <div className="absolute bottom-0 left-0 right-0 h-[14%]" style={{
              background: "linear-gradient(0deg, rgba(22,20,16,0.35), transparent)",
            }} />

            {/* Title */}
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 2.5 }}
            >
              <motion.h1
                className="font-cinzel-decorative text-4xl sm:text-5xl lg:text-6xl font-bold mb-3"
                style={{
                  color: "rgba(212,175,55,0.75)",
                  textShadow: "0 0 40px rgba(184,134,11,0.2), 0 0 80px rgba(184,134,11,0.08)",
                }}
                initial={{ opacity: 0, letterSpacing: "0.35em" }}
                animate={{ opacity: 1, letterSpacing: "0.15em" }}
                transition={{ delay: 2, duration: 3 }}
              >
                Hogwarts
              </motion.h1>
              <motion.p
                className="font-cinzel text-xs sm:text-sm tracking-[0.45em]"
                style={{ color: "rgba(212,175,55,0.4)" }}
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
