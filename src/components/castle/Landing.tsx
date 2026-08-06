import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAmbientAudio } from "@/hooks/useAmbientAudio";

interface LandingProps {
  onComplete: () => void;
}

export function Landing({ onComplete }: LandingProps) {
  const [phase, setPhase] = useState(0);
  const [started, setStarted] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audio = useAmbientAudio();

  // 7 scenes, 90-120 seconds total
  // 0: click to enter
  // 1: darkness + candle (0-5s)
  // 2: first reveal (5-15s)
  // 3: establishing shot (15-30s)
  // 4: arrival (30-45s)
  // 5: entrance hall (45-60s)
  // 6: great hall (60-90s)
  // 7: done

  const advance = useCallback(() => {
    setPhase((p) => (p >= 7 ? p : p + 1));
  }, []);

  useEffect(() => {
    if (!started) return;
    const durations = [
      5000,    // 1: candle
      10000,   // 2: reveal
      15000,   // 3: establishing
      15000,   // 4: arrival
      15000,   // 5: entrance
      30000,   // 6: great hall
      999999,  // 7: done
    ];
    if (phase > 0 && phase < 7) {
      timerRef.current = setTimeout(advance, durations[phase]);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [phase, started, advance]);

  useEffect(() => {
    if (!started) return;
    if (phase === 0) return;

    if (phase === 1) {
      audio.playLayer("wind");
      audio.scheduleSound("rain", 1000);
      audio.scheduleSound("bells", 2500);
    } else if (phase === 2) {
      audio.scheduleSound("thunder", 5000);
    } else if (phase === 3) {
      audio.playLayer("pad");
      audio.playLayer("choir");
      audio.fadeLayer("wind", 0.012, 5);
      audio.scheduleSound("owl", 4000);
      audio.scheduleSound("owl", 9000);
    } else if (phase === 4) {
      audio.fadeLayer("rain", 0.015, 5);
      audio.fadeLayer("wind", 0.006, 4);
      audio.playLayer("fire");
    } else if (phase === 5) {
      audio.playLayer("footsteps");
      audio.fadeLayer("rain", 0, 4);
      audio.fadeLayer("wind", 0, 3);
      audio.fadeLayer("fire", 0.05, 3);
      audio.fadeLayer("pad", 0.008, 4);
      audio.fadeLayer("choir", 0.006, 4);
    } else if (phase === 6) {
      audio.playLayer("murmur");
      audio.scheduleSound("pages", 3000);
      audio.fadeLayer("choir", 0.015, 5);
      audio.fadeLayer("fire", 0.04, 3);
      audio.playLayer("hedwig");
    } else if (phase === 7) {
      audio.stopAll();
      onComplete();
    }
  }, [phase, started, audio, onComplete]);

  useEffect(() => {
    if (started && phase > 0) {
      const t = setTimeout(() => setShowSkip(true), 5000);
      return () => clearTimeout(t);
    }
  }, [started, phase]);

  const handleStart = () => {
    audio.initAudio();
    setStarted(true);
    setPhase(1);
  };

  const skipToEnd = () => {
    audio.stopAll();
    setPhase(7);
  };

  // ===== CLICK TO ENTER SCREEN =====
  if (!started) {
    return (
      <div
        className="relative min-h-screen w-full overflow-hidden flex items-center justify-center cursor-pointer"
        style={{ backgroundColor: "#2E3238" }}
        onClick={handleStart}
      >
        {/* Warm ambient glow */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 50% 55%, rgba(245,196,106,0.06), transparent 55%)",
        }} />

        {/* Distant castle silhouette */}
        <motion.div
          className="absolute bottom-[18%] left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.12 }}
          transition={{ duration: 4, delay: 1 }}
        >
          <svg width="300" height="100" viewBox="0 0 300 100">
            <rect x="20" y="55" width="12" height="45" fill="rgba(63,67,74,0.6)" />
            <polygon points="20,55 26,42 32,55" fill="rgba(63,67,74,0.55)" />
            <rect x="36" y="48" width="18" height="52" fill="rgba(63,67,74,0.55)" />
            <rect x="42" y="32" width="7" height="16" rx="1" fill="rgba(94,70,50,0.5)" />
            <polygon points="42,32 45.5,22 49,32" fill="rgba(94,70,50,0.45)" />
            <rect x="58" y="52" width="24" height="48" fill="rgba(63,67,74,0.5)" />
            <rect x="86" y="45" width="30" height="55" fill="rgba(63,67,74,0.55)" />
            <rect x="93" y="22" width="10" height="23" rx="2" fill="rgba(94,70,50,0.6)" />
            <polygon points="93,22 98,12 103,22" fill="rgba(94,70,50,0.55)" />
            <rect x="120" y="50" width="40" height="50" fill="rgba(63,67,74,0.5)" />
            <polygon points="120,50 140,35 160,50" fill="rgba(63,67,74,0.55)" />
            <rect x="137" y="28" width="7" height="22" rx="1" fill="rgba(94,70,50,0.55)" />
            <polygon points="137,28 140.5,18 144,28" fill="rgba(94,70,50,0.5)" />
            <rect x="164" y="48" width="28" height="52" fill="rgba(63,67,74,0.5)" />
            <rect x="196" y="52" width="22" height="48" fill="rgba(63,67,74,0.55)" />
            <rect x="201" y="38" width="8" height="14" rx="1" fill="rgba(94,70,50,0.5)" />
            <polygon points="201,38 205,28 209,38" fill="rgba(94,70,50,0.45)" />
            <rect x="222" y="55" width="16" height="45" fill="rgba(63,67,74,0.5)" />
            <rect x="242" y="58" width="20" height="42" fill="rgba(63,67,74,0.55)" />
            <rect x="266" y="55" width="14" height="45" fill="rgba(63,67,74,0.5)" />
            {/* Windows */}
            {[[26, 62], [44, 55], [70, 58], [99, 52], [99, 65], [135, 60], [150, 58], [178, 55], [205, 58], [230, 62], [252, 62], [273, 62]].map(([x, y], i) => (
              <rect key={i} x={x} y={y} width="3" height="2.5" rx="0.5" fill={`rgba(245,196,106,${0.3 + (i % 3) * 0.12})`} />
            ))}
          </svg>
        </motion.div>

        {/* Owl in flight */}
        <motion.div
          className="absolute top-[15%] right-[25%]"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 0.25, x: 0 }}
          transition={{ duration: 4, delay: 2 }}
        >
          <svg width="50" height="28" viewBox="0 0 50 28">
            <ellipse cx="25" cy="16" rx="8" ry="5" fill="rgba(232,223,201,0.4)" />
            <circle cx="32" cy="14" r="4" fill="rgba(232,223,201,0.45)" />
            <circle cx="33" cy="13.5" r="1" fill="rgba(46,50,56,0.6)" />
            <motion.path
              d="M 20 15 Q 12 4 3 7 Q 10 12 17 15"
              fill="rgba(200,195,180,0.35)"
              animate={{ d: [
                "M 20 15 Q 12 4 3 7 Q 10 12 17 15",
                "M 20 15 Q 12 24 3 20 Q 10 14 17 15",
                "M 20 15 Q 12 4 3 7 Q 10 12 17 15",
              ]}}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
            <motion.path
              d="M 30 15 Q 38 4 47 7 Q 40 12 33 15"
              fill="rgba(200,195,180,0.35)"
              animate={{ d: [
                "M 30 15 Q 38 4 47 7 Q 40 12 33 15",
                "M 30 15 Q 38 24 47 20 Q 40 14 33 15",
                "M 30 15 Q 38 4 47 7 Q 40 12 33 15",
              ]}}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
          </svg>
        </motion.div>

        {/* Creatures — tiny silhouettes on ground */}
        <motion.div
          className="absolute bottom-[12%] left-[15%]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 3, delay: 3 }}
        >
          {/* Cat (McGonagall's form) */}
          <svg width="20" height="14" viewBox="0 0 20 14">
            <ellipse cx="10" cy="10" rx="6" ry="4" fill="rgba(46,50,56,0.6)" />
            <circle cx="15" cy="7" r="3" fill="rgba(46,50,56,0.6)" />
            <path d="M 13,5 L 12,1 L 14,4" fill="rgba(46,50,56,0.5)" />
            <path d="M 16,5 L 17,1 L 18,4" fill="rgba(46,50,56,0.5)" />
            <path d="M 4,10 Q 1,8 0,10" stroke="rgba(46,50,56,0.5)" fill="none" strokeWidth="1" />
          </svg>
        </motion.div>

        <motion.div
          className="absolute bottom-[14%] right-[18%]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.12 }}
          transition={{ duration: 3, delay: 4 }}
        >
          {/* Toad */}
          <svg width="14" height="10" viewBox="0 0 14 10">
            <ellipse cx="7" cy="7" rx="5" ry="3" fill="rgba(52,84,62,0.5)" />
            <circle cx="4" cy="4" r="2" fill="rgba(52,84,62,0.5)" />
            <circle cx="10" cy="4" r="2" fill="rgba(52,84,62,0.5)" />
            <circle cx="4" cy="3.5" r="0.8" fill="rgba(46,50,56,0.6)" />
            <circle cx="10" cy="3.5" r="0.8" fill="rgba(46,50,56,0.6)" />
          </svg>
        </motion.div>

        {/* Main content */}
        <motion.div
          className="text-center relative z-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 3, delay: 0.5 }}
        >
          {/* Candle */}
          <motion.div
            className="mx-auto mb-6"
            animate={{ scaleY: [1, 1.08, 0.95, 1.04, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-5 h-7 mx-auto rounded-t-full" style={{
              background: "linear-gradient(180deg, rgba(245,196,106,0.8), rgba(217,119,50,0.6), rgba(141,115,74,0.4))",
              boxShadow: "0 0 25px rgba(245,196,106,0.25), 0 0 50px rgba(217,119,50,0.12)",
            }} />
            <div className="w-2.5 h-10 mx-auto rounded-b-sm" style={{
              background: "linear-gradient(180deg, rgba(232,223,201,0.3), rgba(200,180,140,0.2))",
            }} />
          </motion.div>

          <h1
            className="font-cinzel-decorative text-3xl sm:text-4xl lg:text-5xl font-bold mb-3"
            style={{
              color: "rgba(200,163,74,0.75)",
              textShadow: "0 0 30px rgba(200,163,74,0.15)",
            }}
          >
            Hogwarts
          </h1>
          <p className="font-cinzel text-[10px] sm:text-xs tracking-[0.5em] mb-6" style={{ color: "rgba(200,163,74,0.35)" }}>
            EXPLORE THE CASTLE
          </p>

          <div className="w-[1px] h-6 mx-auto mb-4" style={{ backgroundColor: "rgba(200,163,74,0.15)" }} />

          <p className="font-cormorant text-sm italic mb-2" style={{ color: "rgba(232,223,201,0.3)" }}>
            "Whether you come back by page or by the big screen,
          </p>
          <p className="font-cormorant text-sm italic mb-6" style={{ color: "rgba(232,223,201,0.3)" }}>
            Hogwarts will always be there to welcome you home."
          </p>

          <p className="font-cinzel text-[9px] tracking-[0.4em]" style={{ color: "rgba(200,163,74,0.25)" }}>
            CLICK TO ENTER
          </p>
        </motion.div>
      </div>
    );
  }

  // ===== CINEMATIC OPENING =====
  return (
    <div className="relative min-h-screen w-full overflow-hidden" style={{ backgroundColor: "#2E3238" }}>
      {/* Skip button */}
      {showSkip && phase < 7 && (
        <motion.button
          className="absolute top-5 right-5 z-50 cursor-pointer px-4 py-2 rounded-sm"
          style={{
            background: "rgba(46,50,56,0.7)",
            border: "1px solid rgba(200,163,74,0.2)",
          }}
          onClick={skipToEnd}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          whileHover={{ borderColor: "rgba(200,163,74,0.4)" }}
        >
          <span className="font-cinzel text-[10px] tracking-[0.25em]" style={{ color: "rgba(232,223,201,0.5)" }}>
            Skip
          </span>
        </motion.button>
      )}

      <AnimatePresence>
        {/* ===== SCENE 1: DARKNESS + CANDLE ===== */}
        {phase === 1 && (
          <motion.div
            key="candle"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3 }}
          >
            <div className="absolute inset-0" style={{ backgroundColor: "#2E3238" }} />

            {/* Warm glow expanding */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 500,
                height: 500,
                background: "radial-gradient(circle, rgba(245,196,106,0.12), rgba(217,119,50,0.04) 40%, transparent 65%)",
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 4, ease: "easeOut" }}
            />

            {/* Candle flame */}
            <motion.div
              className="absolute"
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 2, delay: 1 }}
            >
              <motion.div
                className="relative"
                style={{ width: 12, height: 28 }}
                animate={{ scaleY: [1, 1.1, 0.93, 1.05, 1], skewX: [-1.5, 1.5, -1, 1, -1.5] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="absolute inset-0 rounded-full" style={{
                  background: "linear-gradient(180deg, rgba(244,239,226,0.95), rgba(245,196,106,0.9), rgba(217,119,50,0.7), rgba(123,45,58,0.4))",
                  filter: "blur(1px)",
                }} />
                <div className="absolute inset-x-1.5 top-1 bottom-2 rounded-full" style={{
                  background: "linear-gradient(180deg, rgba(255,255,240,1), rgba(245,196,106,0.9))",
                  filter: "blur(0.5px)",
                }} />
              </motion.div>
              <div className="w-3 h-12 mx-auto rounded-b-sm" style={{
                background: "linear-gradient(180deg, rgba(232,223,201,0.3), rgba(200,180,140,0.2))",
              }} />
            </motion.div>

            {/* Text */}
            <motion.div
              className="absolute bottom-[15%] left-0 right-0 text-center px-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 3 }}
            >
              <p className="font-cormorant text-lg italic" style={{ color: "rgba(200,163,74,0.5)" }}>
                "Mr. Potter... our new celebrity."
              </p>
              <p className="font-cinzel text-[9px] tracking-[0.3em] mt-3" style={{ color: "rgba(141,115,74,0.3)" }}>
                — Professor McGonagall
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* ===== SCENE 2: FIRST REVEAL — castle across lake ===== */}
        {phase === 2 && (
          <motion.div
            key="reveal"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3 }}
          >
            <div className="absolute inset-0" style={{
              background: "linear-gradient(180deg, #3F434A, #2E3238, #3B2A1F)",
            }} />

            {/* Stars */}
            {Array.from({ length: 40 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${4 + Math.random() * 92}%`,
                  top: `${2 + Math.random() * 35}%`,
                  width: 0.8 + Math.random() * 1.5,
                  height: 0.8 + Math.random() * 1.5,
                  backgroundColor: `rgba(244,239,226,${0.12 + Math.random() * 0.15})`,
                }}
                animate={{ opacity: [0.08, 0.2, 0.08] }}
                transition={{ duration: 3 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 3 }}
              />
            ))}

            {/* Moon */}
            <motion.div
              className="absolute"
              style={{
                top: "8%",
                right: "16%",
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(110,143,191,0.35), rgba(110,143,191,0.1) 45%, transparent 65%)",
                boxShadow: "0 0 80px rgba(110,143,191,0.1)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 5 }}
            />

            {/* Water */}
            <div className="absolute bottom-0 left-0 right-0 h-[40%]" style={{
              background: "linear-gradient(180deg, rgba(63,67,74,0.2), rgba(46,50,56,0.15))",
            }} />
            {[42, 40, 38].map((y, i) => (
              <motion.div
                key={i}
                className="absolute left-0 right-0 h-[1px]"
                style={{ top: `${y}%`, backgroundColor: `rgba(110,143,191,${0.12 - i * 0.03})` }}
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }}
              />
            ))}

            {/* Fog */}
            <motion.div
              className="absolute bottom-[28%] left-0 right-0 h-[18%]"
              style={{ background: "linear-gradient(0deg, rgba(63,67,74,0.12), transparent)" }}
              animate={{ x: ["-3%", "3%", "-3%"] }}
              transition={{ duration: 25, repeat: Infinity }}
            />

            {/* Castle — rich colors */}
            <motion.div
              className="absolute bottom-[40%] left-1/2 -translate-x-1/2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.65 }}
              transition={{ duration: 8, delay: 1 }}
            >
              <svg width="400" height="170" viewBox="0 0 400 170">
                <ellipse cx="200" cy="168" rx="200" ry="8" fill="rgba(46,50,56,0.3)" />
                {/* Left */}
                <rect x="15" y="115" width="15" height="55" fill="rgba(63,67,74,0.65)" />
                <polygon points="15,115 22.5,98 30,115" fill="rgba(63,67,74,0.6)" />
                <rect x="34" y="105" width="22" height="65" fill="rgba(63,67,74,0.6)" />
                <rect x="40" y="82" width="8" height="23" rx="1" fill="rgba(94,70,50,0.6)" />
                <polygon points="40,82 44,68 48,82" fill="rgba(94,70,50,0.55)" />
                <rect x="60" y="110" width="30" height="60" fill="rgba(63,67,74,0.55)" />
                {/* Center */}
                <rect x="95" y="95" width="38" height="75" fill="rgba(63,67,74,0.6)" />
                <rect x="102" y="58" width="12" height="37" rx="2" fill="rgba(94,70,50,0.7)" />
                <polygon points="102,58 108,40 114,58" fill="rgba(94,70,50,0.65)" />
                {/* Main tower */}
                <rect x="138" y="85" width="45" height="85" fill="rgba(63,67,74,0.65)" />
                <rect x="146" y="28" width="14" height="57" rx="3" fill="rgba(94,70,50,0.75)" />
                <polygon points="146,28 153,8 160,28" fill="rgba(94,70,50,0.7)" />
                {/* Great Hall */}
                <rect x="188" y="90" width="55" height="80" fill="rgba(63,67,74,0.6)" />
                <polygon points="188,90 215,65 243,90" fill="rgba(63,67,74,0.65)" />
                <rect x="210" y="68" width="10" height="22" rx="2" fill="rgba(94,70,50,0.65)" />
                <polygon points="210,68 215,52 220,68" fill="rgba(94,70,50,0.6)" />
                {/* Right */}
                <rect x="248" y="100" width="30" height="70" fill="rgba(63,67,74,0.55)" />
                <rect x="282" y="108" width="25" height="62" fill="rgba(63,67,74,0.6)" />
                <rect x="288" y="85" width="8" height="23" rx="1" fill="rgba(94,70,50,0.6)" />
                <polygon points="288,85 292,72 296,85" fill="rgba(94,70,50,0.55)" />
                <rect x="312" y="112" width="32" height="58" fill="rgba(63,67,74,0.55)" />
                <rect x="348" y="118" width="18" height="52" fill="rgba(63,67,74,0.6)" />
                <rect x="352" y="100" width="6" height="18" rx="1" fill="rgba(94,70,50,0.55)" />
                {/* Windows — warm candlelight */}
                {[
                  [22, 125], [45, 118], [45, 135], [75, 122],
                  [110, 108], [110, 125], [110, 142],
                  [152, 98], [152, 115], [152, 132], [152, 148],
                  [205, 102], [220, 100], [235, 102],
                  [220, 118], [220, 135],
                  [262, 115], [294, 95], [294, 112],
                  [328, 122], [356, 128],
                ].map(([x, y], i) => (
                  <rect key={i} x={x} y={y} width="3.5" height="3" rx="0.5" fill={`rgba(245,196,106,${0.4 + (i % 3) * 0.12})`} />
                ))}
              </svg>
            </motion.div>

            {/* Window glows — warm gold */}
            {[
              { x: 42, y: 42 }, { x: 46, y: 41 }, { x: 50, y: 40 },
              { x: 54, y: 41 }, { x: 58, y: 42 }, { x: 62, y: 43 },
              { x: 48, y: 37 }, { x: 52, y: 36 }, { x: 56, y: 37 },
            ].map((pos, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${pos.x}%`,
                  bottom: `${pos.y}%`,
                  width: 4,
                  height: 3,
                  backgroundColor: "rgba(245,196,106,0.65)",
                  boxShadow: "0 0 8px rgba(245,196,106,0.35), 0 0 16px rgba(217,119,50,0.15)",
                }}
                animate={{ opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}

            {/* Rain */}
            {Array.from({ length: 40 }).map((_, i) => {
              const x = Math.random() * 100;
              const delay = Math.random() * 2;
              const dur = 1.4 + Math.random() * 0.5;
              const op = 0.1 + Math.random() * 0.15;
              const len = 20 + Math.random() * 30;
              return (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${x}%`,
                    width: 1,
                    height: len,
                    background: `linear-gradient(180deg, transparent, rgba(110,143,191,${op}), transparent)`,
                  }}
                  initial={{ top: "-5%", opacity: 0 }}
                  animate={{ top: "105%", opacity: [0, op, 0] }}
                  transition={{ duration: dur, repeat: Infinity, delay, ease: "linear" }}
                />
              );
            })}
          </motion.div>
        )}

        {/* ===== SCENE 3: ESTABLISHING SHOT — slow push ===== */}
        {phase === 3 && (
          <motion.div
            key="establishing"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5 }}
          >
            <div className="absolute inset-0" style={{
              background: "linear-gradient(180deg, #3F434A, #2E3238, #3B2A1F)",
            }} />

            {/* Moon */}
            <div className="absolute" style={{
              top: "6%",
              right: "14%",
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(110,143,191,0.4), rgba(110,143,191,0.12) 45%, transparent 65%)",
              boxShadow: "0 0 100px rgba(110,143,191,0.12)",
            }} />

            {/* Stars */}
            {Array.from({ length: 35 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${3 + Math.random() * 94}%`,
                  top: `${2 + Math.random() * 32}%`,
                  width: 0.7 + Math.random() * 1.3,
                  height: 0.7 + Math.random() * 1.3,
                  backgroundColor: `rgba(244,239,226,${0.1 + Math.random() * 0.15})`,
                }}
                animate={{ opacity: [0.06, 0.18, 0.06] }}
                transition={{ duration: 3 + Math.random() * 4, repeat: Infinity }}
              />
            ))}

            {/* Castle — closer */}
            <motion.div
              className="absolute bottom-[25%] left-1/2 -translate-x-1/2"
              initial={{ scale: 0.75, opacity: 0 }}
              animate={{ scale: 1.1, opacity: 0.75 }}
              transition={{ duration: 15, ease: "easeOut" }}
            >
              <svg width="520" height="220" viewBox="0 0 520 220">
                <ellipse cx="260" cy="218" rx="270" ry="10" fill="rgba(46,50,56,0.25)" />
                <rect x="10" y="140" width="18" height="80" fill="rgba(63,67,74,0.7)" />
                <polygon points="10,140 19,120 28,140" fill="rgba(63,67,74,0.65)" />
                <rect x="32" y="128" width="28" height="92" fill="rgba(63,67,74,0.65)" />
                <rect x="40" y="90" width="10" height="38" rx="2" fill="rgba(94,70,50,0.7)" />
                <polygon points="40,90 45,72 50,90" fill="rgba(94,70,50,0.65)" />
                <rect x="64" y="135" width="35" height="85" fill="rgba(63,67,74,0.6)" />
                <rect x="104" y="118" width="42" height="102" fill="rgba(63,67,74,0.65)" />
                <rect x="112" y="65" width="14" height="53" rx="3" fill="rgba(94,70,50,0.75)" />
                <polygon points="112,65 119,42 126,65" fill="rgba(94,70,50,0.7)" />
                <rect x="150" y="105" width="52" height="115" fill="rgba(63,67,74,0.7)" />
                <rect x="159" y="28" width="18" height="77" rx="4" fill="rgba(94,70,50,0.8)" />
                <polygon points="159,28 168,5 177,28" fill="rgba(94,70,50,0.75)" />
                <rect x="206" y="110" width="72" height="110" fill="rgba(63,67,74,0.65)" />
                <polygon points="206,110 242,72 278,110" fill="rgba(63,67,74,0.7)" />
                <rect x="237" y="78" width="12" height="32" rx="3" fill="rgba(94,70,50,0.7)" />
                <polygon points="237,78 243,58 249,78" fill="rgba(94,70,50,0.65)" />
                <rect x="282" y="115" width="44" height="105" fill="rgba(63,67,74,0.65)" />
                <rect x="290" y="62" width="14" height="53" rx="3" fill="rgba(94,70,50,0.75)" />
                <polygon points="290,62 297,40 304,62" fill="rgba(94,70,50,0.7)" />
                <rect x="330" y="130" width="32" height="90" fill="rgba(63,67,74,0.6)" />
                <rect x="366" y="138" width="28" height="82" fill="rgba(63,67,74,0.65)" />
                <rect x="372" y="105" width="10" height="33" rx="2" fill="rgba(94,70,50,0.65)" />
                <polygon points="372,105 377,88 382,105" fill="rgba(94,70,50,0.6)" />
                <rect x="398" y="142" width="35" height="78" fill="rgba(63,67,74,0.6)" />
                <rect x="438" y="148" width="22" height="72" fill="rgba(63,67,74,0.65)" />
                <rect x="442" y="125" width="8" height="23" rx="1" fill="rgba(94,70,50,0.6)" />
                <rect x="464" y="142" width="30" height="78" fill="rgba(63,67,74,0.6)" />
                {[
                  [19, 152], [46, 140], [46, 158], [80, 148],
                  [118, 132], [118, 150], [118, 168],
                  [165, 120], [165, 140], [165, 160], [165, 178],
                  [225, 125], [245, 122], [265, 125],
                  [245, 145], [245, 165],
                  [300, 130], [300, 150],
                  [346, 145], [380, 118], [380, 138],
                  [415, 155], [448, 158], [478, 152],
                ].map(([x, y], i) => (
                  <rect key={i} x={x} y={y} width="4" height="3.5" rx="0.5" fill={`rgba(245,196,106,${0.4 + (i % 4) * 0.1})`} />
                ))}
              </svg>
            </motion.div>

            {/* Window glows */}
            {[
              { x: 35, y: 44 }, { x: 40, y: 43 }, { x: 45, y: 42 },
              { x: 50, y: 41 }, { x: 55, y: 42 }, { x: 60, y: 43 },
              { x: 65, y: 44 }, { x: 42, y: 38 }, { x: 48, y: 37 },
              { x: 54, y: 37 }, { x: 60, y: 38 }, { x: 50, y: 32 },
            ].map((pos, i) => (
              <motion.div
                key={i}
                className="absolute rounded-sm"
                style={{
                  left: `${pos.x}%`,
                  bottom: `${pos.y}%`,
                  width: 4.5,
                  height: 4,
                  backgroundColor: "rgba(245,196,106,0.7)",
                  boxShadow: "0 0 10px rgba(245,196,106,0.4), 0 0 20px rgba(217,119,50,0.15)",
                }}
                animate={{ opacity: [0.5, 0.85, 0.5] }}
                transition={{ duration: 3 + i * 0.25, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}

            {/* Lightning */}
            <motion.div
              className="absolute inset-0"
              style={{ background: "radial-gradient(ellipse at 45% 35%, rgba(110,143,191,0.08), transparent 40%)" }}
              animate={{ opacity: [0, 0, 0, 0.25, 0, 0.12, 0, 0, 0, 0] }}
              transition={{ duration: 14, repeat: Infinity }}
            />

            {/* Rain lighter */}
            {Array.from({ length: 20 }).map((_, i) => {
              const x = Math.random() * 100;
              const delay = Math.random() * 2;
              const dur = 1.5 + Math.random() * 0.5;
              const op = 0.06 + Math.random() * 0.1;
              const len = 15 + Math.random() * 22;
              return (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${x}%`,
                    width: 1,
                    height: len,
                    background: `linear-gradient(180deg, transparent, rgba(110,143,191,${op}), transparent)`,
                  }}
                  initial={{ top: "-5%", opacity: 0 }}
                  animate={{ top: "105%", opacity: [0, op, 0] }}
                  transition={{ duration: dur, repeat: Infinity, delay, ease: "linear" }}
                />
              );
            })}
          </motion.div>
        )}

        {/* ===== SCENE 4: ARRIVAL — doors ===== */}
        {phase === 4 && (
          <motion.div
            key="arrival"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5 }}
          >
            <div className="absolute inset-0" style={{
              background: "linear-gradient(180deg, #3F434A, #2E3238, #3B2A1F)",
            }} />

            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 3, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Stone arch */}
              <div className="absolute -inset-12 rounded-t-[100px]" style={{
                border: "9px solid rgba(63,67,74,0.35)",
                borderBottom: "none",
              }} />

              {/* Left door */}
              <div className="relative inline-block" style={{ width: 160, height: 340 }}>
                <div className="absolute inset-0 rounded-t-[80px] overflow-hidden" style={{
                  background: "linear-gradient(180deg, rgba(94,70,50,0.5), rgba(59,42,31,0.6))",
                  border: "2px solid rgba(141,115,74,0.2)",
                  borderRight: "1px solid rgba(141,115,74,0.1)",
                }}>
                  <div className="absolute inset-0" style={{
                    backgroundImage: "repeating-linear-gradient(87deg, transparent, transparent 5px, rgba(0,0,0,0.06) 5px, rgba(0,0,0,0.06) 9px)",
                  }} />
                  <div className="absolute inset-8" style={{ border: "2px solid rgba(141,115,74,0.12)" }} />
                  {[12, 32, 52, 72].map((y) => (
                    <div key={y} className="absolute left-1/2 -translate-x-1/2 w-5 h-5 rounded-full" style={{
                      top: `${y}%`,
                      backgroundColor: "rgba(63,67,74,0.4)",
                      boxShadow: "inset 0 1px 0 rgba(244,239,226,0.08)",
                    }} />
                  ))}
                  <div className="absolute top-1/2 right-5 w-5 h-12 rounded-full" style={{
                    background: "linear-gradient(135deg, rgba(200,163,74,0.55), rgba(141,115,74,0.4))",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.5)",
                  }} />
                </div>
              </div>

              {/* Right door */}
              <div className="relative inline-block" style={{ width: 160, height: 340 }}>
                <div className="absolute inset-0 rounded-t-[80px] overflow-hidden" style={{
                  background: "linear-gradient(180deg, rgba(94,70,50,0.5), rgba(59,42,31,0.6))",
                  border: "2px solid rgba(141,115,74,0.2)",
                  borderLeft: "1px solid rgba(141,115,74,0.1)",
                }}>
                  <div className="absolute inset-0" style={{
                    backgroundImage: "repeating-linear-gradient(87deg, transparent, transparent 5px, rgba(0,0,0,0.06) 5px, rgba(0,0,0,0.06) 9px)",
                  }} />
                  <div className="absolute inset-8" style={{ border: "2px solid rgba(141,115,74,0.12)" }} />
                  {[12, 32, 52, 72].map((y) => (
                    <div key={y} className="absolute left-1/2 -translate-x-1/2 w-5 h-5 rounded-full" style={{
                      top: `${y}%`,
                      backgroundColor: "rgba(63,67,74,0.4)",
                    }} />
                  ))}
                  <div className="absolute top-1/2 left-5 w-5 h-12 rounded-full" style={{
                    background: "linear-gradient(135deg, rgba(200,163,74,0.55), rgba(141,115,74,0.4))",
                  }} />
                </div>
              </div>
            </motion.div>

            {/* Torchlight on walls */}
            {[{ x: "8%", y: "35%" }, { x: "88%", y: "35%" }].map((pos, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{ left: pos.x, top: pos.y }}
              >
                <motion.div
                  className="w-6 h-9 rounded-full"
                  style={{
                    background: "radial-gradient(circle, rgba(245,196,106,0.8), rgba(217,119,50,0.4) 60%, transparent)",
                    filter: "blur(2px)",
                  }}
                  animate={{ scaleY: [1, 1.15, 0.9, 1.08, 1], opacity: [0.7, 1, 0.6, 0.9, 0.7] }}
                  transition={{ duration: 1.8 + i * 0.3, repeat: Infinity }}
                />
                <div className="w-[3px] h-6 mx-auto" style={{ backgroundColor: "rgba(94,70,50,0.4)" }} />
              </motion.div>
            ))}

            {/* Warm light from doors */}
            <motion.div
              className="absolute inset-0 z-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 4, delay: 3 }}
            >
              <div className="absolute inset-0" style={{
                background: "radial-gradient(ellipse at 50% 50%, rgba(245,196,106,0.1), transparent 38%)",
              }} />
            </motion.div>
          </motion.div>
        )}

        {/* ===== SCENE 5: ENTRANCE HALL ===== */}
        {phase === 5 && (
          <motion.div
            key="entrance"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5 }}
          >
            <div className="absolute inset-0" style={{
              background: "linear-gradient(180deg, #3B2A1F, #2E3238, #3F434A)",
            }} />

            {/* Stone walls */}
            <div className="absolute inset-0" style={{
              backgroundImage: `
                repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(0,0,0,0.04) 60px, rgba(0,0,0,0.04) 61px),
                repeating-linear-gradient(0deg, transparent, transparent 45px, rgba(0,0,0,0.03) 45px, rgba(0,0,0,0.03) 46px)
              `,
            }} />

            {/* High ceiling */}
            <div className="absolute top-0 left-0 right-0 h-[35%]" style={{
              background: "linear-gradient(180deg, rgba(59,42,31,0.4), transparent)",
            }} />

            {/* Stone columns */}
            {[12, 30, 70, 88].map((x, i) => (
              <div
                key={i}
                className="absolute top-[10%] bottom-[15%]"
                style={{
                  left: `${x}%`,
                  width: "3%",
                  background: "linear-gradient(90deg, rgba(63,67,74,0.15), rgba(63,67,74,0.25), rgba(63,67,74,0.15))",
                }}
              />
            ))}

            {/* Grand staircase — center */}
            <motion.div
              className="absolute bottom-[15%] left-1/2 -translate-x-1/2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.5, y: 0 }}
              transition={{ duration: 3, delay: 1 }}
            >
              <svg width="200" height="120" viewBox="0 0 200 120">
                {/* Stairs going up */}
                {Array.from({ length: 12 }).map((_, i) => (
                  <rect
                    key={i}
                    x={20 + i * 12}
                    y={100 - i * 8}
                    width={140 - i * 12}
                    height={6}
                    fill={`rgba(94,70,50,${0.15 + i * 0.02})`}
                  />
                ))}
                {/* Banister */}
                <line x1="20" y1="100" x2="164" y2="4" stroke="rgba(141,115,74,0.2)" strokeWidth="1.5" />
              </svg>
            </motion.div>

            {/* Floating candles */}
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${10 + (i % 5) * 18 + (Math.random() - 0.5) * 6}%`,
                  top: `${8 + Math.floor(i / 5) * 12 + (Math.random() - 0.5) * 4}%`,
                  width: 40 + Math.random() * 30,
                  height: 40 + Math.random() * 30,
                  background: `radial-gradient(circle, rgba(245,196,106,${0.04 + Math.random() * 0.03}), transparent 60%)`,
                }}
                animate={{ opacity: [0.4, 0.75, 0.4], y: [0, -2, 0, 2, 0] }}
                transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 3 }}
              />
            ))}

            {/* Portraits on walls */}
            {[
              { x: "15%", y: "20%" }, { x: "35%", y: "18%" },
              { x: "65%", y: "18%" }, { x: "85%", y: "20%" },
            ].map((pos, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: pos.x,
                  top: pos.y,
                  width: 28,
                  height: 35,
                  border: "2px solid rgba(141,115,74,0.2)",
                  borderRadius: 2,
                  background: `linear-gradient(180deg, rgba(94,70,50,${0.15 + i * 0.03}), rgba(59,42,31,${0.2 + i * 0.03}))`,
                }}
              >
                {/* Eyes */}
                <motion.div
                  className="absolute top-[35%] left-[30%] w-[3px] h-[3px] rounded-full"
                  style={{ backgroundColor: "rgba(245,196,106,0.2)" }}
                  animate={{ opacity: [0.15, 0.3, 0.15] }}
                  transition={{ duration: 4 + i, repeat: Infinity }}
                />
                <motion.div
                  className="absolute top-[35%] right-[30%] w-[3px] h-[3px] rounded-full"
                  style={{ backgroundColor: "rgba(245,196,106,0.2)" }}
                  animate={{ opacity: [0.15, 0.3, 0.15] }}
                  transition={{ duration: 4 + i, repeat: Infinity, delay: 0.5 }}
                />
              </motion.div>
            ))}

            {/* Banners */}
            {[{ x: "22%" }, { x: "78%" }].map((pos, i) => (
              <motion.div
                key={i}
                className="absolute top-[8%]"
                style={{
                  left: pos.x,
                  width: 18,
                  height: 80,
                  background: `linear-gradient(180deg, ${i === 0 ? "rgba(123,45,58,0.25)" : "rgba(200,163,74,0.25)"}, ${i === 0 ? "rgba(123,45,58,0.15)" : "rgba(200,163,74,0.15)"})`,
                  borderRadius: "0 0 9px 9px",
                }}
                animate={{ skewX: [-1, 1, -1] }}
                transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}

            {/* Warm light from ahead */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 3 }}
            >
              <div className="absolute inset-0" style={{
                background: "radial-gradient(ellipse at 50% 40%, rgba(245,196,106,0.08), transparent 50%)",
              }} />
            </motion.div>
          </motion.div>
        )}

        {/* ===== SCENE 6: GREAT HALL ===== */}
        {phase === 6 && (
          <motion.div
            key="hall"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3 }}
          >
            <div className="absolute inset-0" style={{
              background: "linear-gradient(180deg, #3B2A1F, #2E3238, #3F434A)",
            }} />

            {/* Vaulted ceiling */}
            <div className="absolute top-0 left-0 right-0 h-[40%]" style={{
              background: "linear-gradient(180deg, rgba(59,42,31,0.5), transparent)",
            }} />
            <svg className="absolute top-0 left-0 right-0 h-[40%]" viewBox="0 0 100 50" preserveAspectRatio="none">
              <line x1="50" y1="0" x2="50" y2="50" stroke="rgba(94,70,50,0.12)" strokeWidth="0.3" />
              <line x1="10" y1="0" x2="50" y2="50" stroke="rgba(94,70,50,0.1)" strokeWidth="0.25" />
              <line x1="30" y1="0" x2="50" y2="50" stroke="rgba(94,70,50,0.1)" strokeWidth="0.25" />
              <line x1="90" y1="0" x2="50" y2="50" stroke="rgba(94,70,50,0.1)" strokeWidth="0.25" />
              <line x1="70" y1="0" x2="50" y2="50" stroke="rgba(94,70,50,0.1)" strokeWidth="0.25" />
              <line x1="0" y1="15" x2="100" y2="15" stroke="rgba(94,70,50,0.06)" strokeWidth="0.2" />
              <line x1="0" y1="30" x2="100" y2="30" stroke="rgba(94,70,50,0.05)" strokeWidth="0.15" />
            </svg>

            {/* Floating candles — warm golden glow */}
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${5 + (i % 6) * 16 + (Math.random() - 0.5) * 5}%`,
                  top: `${5 + Math.floor(i / 6) * 9 + (Math.random() - 0.5) * 4}%`,
                  width: 50 + Math.random() * 40,
                  height: 50 + Math.random() * 40,
                  background: `radial-gradient(circle, rgba(245,196,106,${0.05 + Math.random() * 0.04}), transparent 55%)`,
                }}
                animate={{ opacity: [0.5, 0.9, 0.5], y: [0, -2.5, 0, 2.5, 0] }}
                transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 3 }}
              />
            ))}

            {/* Stained glass — rich colors */}
            {[
              { x: "5%", w: "12%", colors: ["rgba(200,163,74,0.1)", "rgba(123,45,58,0.06)"] },
              { x: "20%", w: "10%", colors: ["rgba(123,45,58,0.08)", "rgba(52,84,62,0.05)"] },
              { x: "33%", w: "9%", colors: ["rgba(52,84,62,0.06)", "rgba(200,163,74,0.05)"] },
              { x: "58%", w: "9%", colors: ["rgba(52,84,62,0.06)", "rgba(123,45,58,0.05)"] },
              { x: "70%", w: "10%", colors: ["rgba(123,45,58,0.08)", "rgba(200,163,74,0.05)"] },
              { x: "83%", w: "12%", colors: ["rgba(200,163,74,0.1)", "rgba(123,45,58,0.06)"] },
            ].map((win, i) => (
              <motion.div
                key={i}
                className="absolute top-[3%] pointer-events-none"
                style={{
                  left: win.x,
                  width: win.w,
                  height: "50%",
                  background: `linear-gradient(180deg, ${win.colors[0]}, ${win.colors[1]}, transparent)`,
                  clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
                }}
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 10 + i * 2, repeat: Infinity, delay: i * 1.5 }}
              />
            ))}

            {/* Long oak tables */}
            <div className="absolute bottom-[18%] left-[6%] right-[6%] h-[5px] rounded-full" style={{
              background: "linear-gradient(90deg, transparent, rgba(94,70,50,0.35) 15%, rgba(94,70,50,0.4) 50%, rgba(94,70,50,0.35) 85%, transparent)",
            }} />
            <div className="absolute bottom-[12%] left-[12%] right-[12%] h-[4px] rounded-full" style={{
              background: "linear-gradient(90deg, transparent, rgba(94,70,50,0.25) 20%, rgba(94,70,50,0.3) 50%, rgba(94,70,50,0.25) 80%, transparent)",
            }} />

            {/* Students — dark silhouettes */}
            {[
              { x: 15 }, { x: 25 }, { x: 35 }, { x: 45 }, { x: 55 }, { x: 65 }, { x: 75 },
            ].map((p, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  left: `${p.x}%`,
                  bottom: "19%",
                  width: 6,
                  height: 12,
                  borderRadius: "3px 3px 0 0",
                  backgroundColor: `rgba(59,42,31,${0.2 + (i % 3) * 0.06})`,
                }}
              />
            ))}

            {/* Fireplace — warm ember glow */}
            <motion.div
              className="absolute bottom-[15%] left-[3%]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ duration: 3, delay: 2 }}
            >
              <div className="relative" style={{ width: 50, height: 60 }}>
                <div className="absolute bottom-0 left-0 right-0 h-[30px] rounded-t" style={{
                  background: "linear-gradient(180deg, rgba(217,119,50,0.25), rgba(200,163,74,0.15))",
                }} />
                <motion.div
                  className="absolute bottom-[8px] left-[15%] right-[15%] h-[15px] rounded-t"
                  style={{
                    background: "radial-gradient(ellipse at 50% 100%, rgba(217,119,50,0.4), rgba(245,196,106,0.2) 50%, transparent)",
                  }}
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>

            <div className="absolute bottom-0 left-0 right-0 h-[12%]" style={{
              background: "linear-gradient(0deg, rgba(46,50,56,0.35), transparent)",
            }} />

            {/* Title */}
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 3.5 }}
            >
              <motion.h1
                className="font-cinzel-decorative text-4xl sm:text-5xl lg:text-6xl font-bold mb-3"
                style={{
                  color: "rgba(200,163,74,0.8)",
                  textShadow: "0 0 40px rgba(200,163,74,0.2)",
                }}
                initial={{ opacity: 0, letterSpacing: "0.4em" }}
                animate={{ opacity: 1, letterSpacing: "0.15em" }}
                transition={{ delay: 3, duration: 4 }}
              >
                Hogwarts
              </motion.h1>
              <motion.p
                className="font-cinzel text-xs sm:text-sm tracking-[0.5em]"
                style={{ color: "rgba(200,163,74,0.4)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 5, duration: 2.5 }}
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
