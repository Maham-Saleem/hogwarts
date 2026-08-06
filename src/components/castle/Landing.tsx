import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAmbientAudio } from "@/hooks/useAmbientAudio";

interface LandingProps {
  onComplete: () => void;
}

export function Landing({ onComplete }: LandingProps) {
  const [phase, setPhase] = useState(0);
  const [started, setStarted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audio = useAmbientAudio();

  // Phase progression — slow, deliberate
  // 0: black (0-5s)
  // 1: reveal (5-12s) — castle emerges from darkness
  // 2: approach (12-22s) — slow camera push
  // 3: music (22-30s) — strings, choir begin
  // 4: doors (30-38s) — doors open, warm light
  // 5: enter (38-44s) — walking in
  // 6: hall (44-50s) — Great Hall reveal
  // 7: done

  const advance = useCallback(() => {
    setPhase((p) => {
      if (p >= 7) return p;
      return p + 1;
    });
  }, []);

  useEffect(() => {
    if (!started) return;

    const durations = [
      5000,   // 0: black — only sound
      7000,   // 1: reveal — castle emerges
      10000,  // 2: approach — slow push
      8000,   // 3: music begins
      8000,   // 4: doors open
      6000,   // 5: enter
      6000,   // 6: hall
      999999, // 7: done
    ];

    if (phase < 7) {
      timerRef.current = setTimeout(advance, durations[phase]);
    }

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [phase, started, advance]);

  // Sound design — layered, continuous, crossfading
  useEffect(() => {
    if (!started) return;

    if (phase === 0) {
      // Black — distant wind, faint rain, single bell
      audio.playLayer("wind");
      audio.scheduleSound("rain", 500);
      audio.scheduleSound("bells", 2500);
    } else if (phase === 1) {
      // Reveal — rain continues, wind continues, thunder distant
      audio.scheduleSound("thunder", 4000);
    } else if (phase === 2) {
      // Approach — add owl
      audio.scheduleSound("owl", 5000);
    } else if (phase === 3) {
      // Music begins — pad and choir, fade down wind
      audio.playLayer("pad");
      audio.playLayer("choir");
      audio.fadeLayer("wind", 0.008, 4);
    } else if (phase === 4) {
      // Doors open — fade rain down, fade fire up
      audio.fadeLayer("rain", 0.012, 4);
      audio.fadeLayer("wind", 0.005, 3);
      audio.playLayer("fire");
    } else if (phase === 5) {
      // Enter — footsteps, fade rain out, fire up
      audio.playLayer("footsteps");
      audio.fadeLayer("rain", 0, 3);
      audio.fadeLayer("wind", 0, 2);
      audio.fadeLayer("fire", 0.05, 2);
    } else if (phase === 6) {
      // Great Hall — murmur, pages, choir stronger, hedwig theme
      audio.playLayer("murmur");
      audio.scheduleSound("pages", 2000);
      audio.fadeLayer("choir", 0.02, 3);
      audio.playLayer("hedwig");
    } else if (phase === 7) {
      audio.stopAll();
      onComplete();
    }
  }, [phase, started, audio, onComplete]);

  const handleStart = () => {
    audio.initAudio();
    setStarted(true);
    setPhase(0);
  };

  // Click to begin
  if (!started) {
    return (
      <div
        className="relative min-h-screen w-full overflow-hidden flex items-center justify-center cursor-pointer"
        style={{ backgroundColor: "#050403" }}
        onClick={handleStart}
      >
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 3, delay: 1 }}
        >
          <p className="font-cinzel text-[10px] tracking-[0.5em] mb-4" style={{ color: "rgba(160,150,130,0.2)" }}>
            EXPLORE HOGWARTS
          </p>
          <div className="w-[1px] h-8 mx-auto" style={{ backgroundColor: "rgba(160,150,130,0.1)" }} />
          <p className="font-cormorant text-xs italic mt-4" style={{ color: "rgba(140,130,115,0.15)" }}>
            click to enter
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden" style={{ backgroundColor: "#050403" }}>
      <AnimatePresence>
        {/* ===== PHASE 0: COMPLETE DARKNESS ===== */}
        {phase === 0 && (
          <motion.div
            key="black"
            className="absolute inset-0"
            exit={{ opacity: 0 }}
            transition={{ duration: 3 }}
          >
            <div className="absolute inset-0" style={{ backgroundColor: "#050403" }} />
          </motion.div>
        )}

        {/* ===== PHASE 1: CASTLE REVEAL — eyes adjusting ===== */}
        {phase === 1 && (
          <motion.div
            key="reveal"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
          >
            <div className="absolute inset-0" style={{
              background: "linear-gradient(180deg, #060504, #0A0908, #0C0B09)",
            }} />

            {/* Stars — very faint */}
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${5 + Math.random() * 90}%`,
                  top: `${3 + Math.random() * 38}%`,
                  width: 0.6 + Math.random() * 1.2,
                  height: 0.6 + Math.random() * 1.2,
                  backgroundColor: `rgba(200,195,180,${0.08 + Math.random() * 0.12})`,
                }}
                animate={{ opacity: [0.05, 0.15, 0.05] }}
                transition={{ duration: 3 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 4 }}
              />
            ))}

            {/* Moon */}
            <motion.div
              className="absolute"
              style={{
                top: "10%",
                right: "18%",
                width: 90,
                height: 90,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(220,215,200,0.2), rgba(200,195,180,0.06) 45%, transparent 65%)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 6, delay: 1 }}
            />

            {/* Castle — emerges from darkness, not fades in */}
            <motion.div
              className="absolute bottom-[35%] left-1/2 -translate-x-1/2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ duration: 8, delay: 1, ease: "easeOut" }}
            >
              <svg width="380" height="160" viewBox="0 0 380 160">
                {/* Left towers */}
                <rect x="12" y="110" width="14" height="50" fill="rgba(30,26,22,0.55)" />
                <polygon points="12,110 19,95 26,110" fill="rgba(30,26,22,0.5)" />
                <rect x="30" y="100" width="20" height="60" fill="rgba(30,26,22,0.5)" />
                <rect x="35" y="78" width="8" height="22" rx="1" fill="rgba(40,35,28,0.55)" />
                <polygon points="35,78 39,65 43,78" fill="rgba(40,35,28,0.5)" />
                <rect x="55" y="105" width="28" height="55" fill="rgba(30,26,22,0.45)" />
                {/* Central towers */}
                <rect x="88" y="90" width="35" height="70" fill="rgba(30,26,22,0.5)" />
                <rect x="95" y="55" width="10" height="35" rx="2" fill="rgba(40,35,28,0.6)" />
                <polygon points="95,55 100,40 105,55" fill="rgba(40,35,28,0.55)" />
                {/* Main tower */}
                <rect x="128" y="80" width="40" height="80" fill="rgba(30,26,22,0.55)" />
                <rect x="135" y="30" width="14" height="50" rx="3" fill="rgba(40,35,28,0.65)" />
                <polygon points="135,30 142,12 149,30" fill="rgba(40,35,28,0.6)" />
                {/* Great Hall */}
                <rect x="172" y="85" width="50" height="75" fill="rgba(30,26,22,0.5)" />
                <polygon points="172,85 197,62 222,85" fill="rgba(30,26,22,0.55)" />
                <rect x="193" y="65" width="8" height="20" rx="2" fill="rgba(40,35,28,0.55)" />
                <polygon points="193,65 197,52 201,65" fill="rgba(40,35,28,0.5)" />
                {/* Right towers */}
                <rect x="227" y="95" width="25" height="65" fill="rgba(30,26,22,0.45)" />
                <rect x="257" y="100" width="22" height="60" fill="rgba(30,26,22,0.5)" />
                <rect x="262" y="82" width="8" height="18" rx="1" fill="rgba(40,35,28,0.55)" />
                <polygon points="262,82 266,70 270,82" fill="rgba(40,35,28,0.5)" />
                <rect x="284" y="105" width="30" height="55" fill="rgba(30,26,22,0.45)" />
                <rect x="319" y="110" width="16" height="50" fill="rgba(30,26,22,0.5)" />
                <rect x="323" y="95" width="5" height="15" rx="1" fill="rgba(40,35,28,0.5)" />
                {/* Windows — faint warm dots */}
                {[
                  [19, 120], [39, 112], [68, 115],
                  [100, 100], [100, 115],
                  [140, 90], [140, 105], [140, 120],
                  [185, 95], [197, 93], [210, 95],
                  [197, 110], [197, 125],
                  [240, 110], [268, 92], [299, 115],
                ].map(([x, y], i) => (
                  <rect key={i} x={x} y={y} width="3" height="2.5" rx="0.5" fill={`rgba(255,200,80,${0.2 + (i % 3) * 0.08})`} />
                ))}
              </svg>
            </motion.div>

            {/* Window glows — barely visible */}
            {[
              { x: 43, y: 43 }, { x: 47, y: 42 }, { x: 51, y: 41 },
              { x: 55, y: 42 }, { x: 59, y: 43 },
            ].map((pos, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${pos.x}%`,
                  bottom: `${pos.y}%`,
                  width: 3,
                  height: 2.5,
                  backgroundColor: "rgba(255,200,80,0.25)",
                  boxShadow: "0 0 6px rgba(255,200,80,0.12)",
                }}
                animate={{ opacity: [0.2, 0.35, 0.2] }}
                transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }}
              />
            ))}

            {/* Rain */}
            {Array.from({ length: 35 }).map((_, i) => {
              const drop = {
                x: Math.random() * 100,
                delay: Math.random() * 2,
                duration: 1.4 + Math.random() * 0.6,
                opacity: 0.1 + Math.random() * 0.15,
                length: 20 + Math.random() * 30,
              };
              return (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${drop.x}%`,
                    width: 1,
                    height: drop.length,
                    background: `linear-gradient(180deg, transparent, rgba(160,155,140,${drop.opacity}), transparent)`,
                  }}
                  initial={{ top: "-5%", opacity: 0 }}
                  animate={{ top: "105%", opacity: [0, drop.opacity, 0] }}
                  transition={{ duration: drop.duration, repeat: Infinity, delay: drop.delay, ease: "linear" }}
                />
              );
            })}
          </motion.div>
        )}

        {/* ===== PHASE 2: SLOW APPROACH — drone shot ===== */}
        {phase === 2 && (
          <motion.div
            key="approach"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
          >
            <div className="absolute inset-0" style={{
              background: "linear-gradient(180deg, #050403, #0A0908, #0C0B09)",
            }} />

            {/* Stars */}
            {Array.from({ length: 25 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${5 + Math.random() * 90}%`,
                  top: `${2 + Math.random() * 35}%`,
                  width: 0.6 + Math.random() * 1,
                  height: 0.6 + Math.random() * 1,
                  backgroundColor: `rgba(200,195,180,${0.1 + Math.random() * 0.1})`,
                }}
                animate={{ opacity: [0.06, 0.14, 0.06] }}
                transition={{ duration: 3 + Math.random() * 4, repeat: Infinity }}
              />
            ))}

            {/* Moon */}
            <div
              className="absolute"
              style={{
                top: "8%",
                right: "16%",
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(225,220,205,0.25), rgba(200,195,180,0.08) 45%, transparent 65%)",
                boxShadow: "0 0 80px rgba(200,195,180,0.06)",
              }}
            />

            {/* Castle — larger as we approach */}
            <motion.div
              className="absolute bottom-[28%] left-1/2 -translate-x-1/2"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.55 }}
              transition={{ duration: 10, ease: "easeOut" }}
            >
              <svg width="480" height="200" viewBox="0 0 480 200">
                <ellipse cx="240" cy="198" rx="250" ry="10" fill="rgba(12,10,8,0.3)" />
                {/* Left */}
                <rect x="10" y="135" width="16" height="65" fill="rgba(30,26,22,0.55)" />
                <polygon points="10,135 18,118 26,135" fill="rgba(30,26,22,0.5)" />
                <rect x="30" y="125" width="24" height="75" fill="rgba(30,26,22,0.5)" />
                <rect x="36" y="95" width="10" height="30" rx="2" fill="rgba(40,35,28,0.6)" />
                <polygon points="36,95 41,78 46,95" fill="rgba(40,35,28,0.55)" />
                <rect x="58" y="130" width="32" height="70" fill="rgba(30,26,22,0.45)" />
                {/* Center-left */}
                <rect x="95" y="110" width="40" height="90" fill="rgba(30,26,22,0.5)" />
                <rect x="102" y="65" width="12" height="45" rx="3" fill="rgba(40,35,28,0.65)" />
                <polygon points="102,65 108,45 114,65" fill="rgba(40,35,28,0.6)" />
                {/* Main tower */}
                <rect x="140" y="95" width="48" height="105" fill="rgba(30,26,22,0.55)" />
                <rect x="148" y="30" width="16" height="65" rx="4" fill="rgba(40,35,28,0.7)" />
                <polygon points="148,30 156,8 164,30" fill="rgba(40,35,28,0.65)" />
                {/* Great Hall */}
                <rect x="192" y="105" width="65" height="95" fill="rgba(30,26,22,0.5)" />
                <polygon points="192,105 224,75 257,105" fill="rgba(30,26,22,0.55)" />
                <rect x="220" y="80" width="10" height="25" rx="2" fill="rgba(40,35,28,0.6)" />
                <polygon points="220,80 225,62 230,80" fill="rgba(40,35,28,0.55)" />
                {/* Center-right */}
                <rect x="262" y="110" width="42" height="90" fill="rgba(30,26,22,0.5)" />
                <rect x="270" y="60" width="12" height="50" rx="3" fill="rgba(40,35,28,0.65)" />
                <polygon points="270,60 276,40 282,60" fill="rgba(40,35,28,0.6)" />
                {/* Right */}
                <rect x="310" y="125" width="28" height="75" fill="rgba(30,26,22,0.45)" />
                <rect x="342" y="130" width="24" height="70" fill="rgba(30,26,22,0.5)" />
                <rect x="347" y="105" width="8" height="25" rx="1" fill="rgba(40,35,28,0.55)" />
                <polygon points="347,105 351,92 355,105" fill="rgba(40,35,28,0.5)" />
                <rect x="370" y="135" width="32" height="65" fill="rgba(30,26,22,0.45)" />
                <rect x="407" y="140" width="18" height="60" fill="rgba(30,26,22,0.5)" />
                <rect x="411" y="120" width="6" height="20" rx="1" fill="rgba(40,35,28,0.5)" />
                {/* Windows */}
                {[
                  [18, 148], [42, 138], [42, 155], [72, 145],
                  [108, 125], [108, 142], [108, 160],
                  [155, 110], [155, 128], [155, 145], [155, 162],
                  [210, 118], [225, 115], [240, 118],
                  [225, 138], [225, 155],
                  [278, 125], [278, 142],
                  [324, 140], [354, 118], [354, 135],
                  [386, 148], [415, 152],
                ].map(([x, y], i) => (
                  <rect key={i} x={x} y={y} width="3.5" height="3" rx="0.5" fill={`rgba(255,200,80,${0.3 + (i % 4) * 0.08})`} />
                ))}
              </svg>
            </motion.div>

            {/* Window glows */}
            {[
              { x: 38, y: 44 }, { x: 42, y: 43 }, { x: 46, y: 42 },
              { x: 50, y: 41 }, { x: 54, y: 42 }, { x: 58, y: 43 },
              { x: 62, y: 44 }, { x: 44, y: 39 }, { x: 50, y: 38 },
              { x: 56, y: 39 }, { x: 50, y: 34 },
            ].map((pos, i) => (
              <motion.div
                key={i}
                className="absolute rounded-sm"
                style={{
                  left: `${pos.x}%`,
                  bottom: `${pos.y}%`,
                  width: 3.5,
                  height: 3,
                  backgroundColor: "rgba(255,200,80,0.45)",
                  boxShadow: "0 0 8px rgba(255,200,80,0.2)",
                }}
                animate={{ opacity: [0.35, 0.6, 0.35] }}
                transition={{ duration: 3 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}

            {/* Rain — lighter */}
            {Array.from({ length: 25 }).map((_, i) => {
              const drop = {
                x: Math.random() * 100,
                delay: Math.random() * 2,
                duration: 1.5 + Math.random() * 0.5,
                opacity: 0.08 + Math.random() * 0.12,
                length: 18 + Math.random() * 25,
              };
              return (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${drop.x}%`,
                    width: 1,
                    height: drop.length,
                    background: `linear-gradient(180deg, transparent, rgba(160,155,140,${drop.opacity}), transparent)`,
                  }}
                  initial={{ top: "-5%", opacity: 0 }}
                  animate={{ top: "105%", opacity: [0, drop.opacity, 0] }}
                  transition={{ duration: drop.duration, repeat: Infinity, delay: drop.delay, ease: "linear" }}
                />
              );
            })}

            {/* Lightning — single flash */}
            <motion.div
              className="absolute inset-0"
              style={{ background: "radial-gradient(ellipse at 50% 35%, rgba(210,205,190,0.06), transparent 40%)" }}
              animate={{ opacity: [0, 0, 0, 0.2, 0, 0, 0, 0, 0, 0] }}
              transition={{ duration: 12, repeat: Infinity }}
            />

            {/* Fog */}
            <motion.div
              className="absolute bottom-[25%] left-0 right-0 h-[20%]"
              style={{ background: "linear-gradient(0deg, rgba(50,48,42,0.1), transparent)" }}
              animate={{ x: ["-3%", "3%", "-3%"] }}
              transition={{ duration: 25, repeat: Infinity }}
            />
          </motion.div>
        )}

        {/* ===== PHASE 3: MUSIC BEGINS — strings, choir ===== */}
        {phase === 3 && (
          <motion.div
            key="music"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
          >
            <div className="absolute inset-0" style={{
              background: "linear-gradient(180deg, #050403, #080706, #0A0908)",
            }} />

            {/* Moon */}
            <div
              className="absolute"
              style={{
                top: "8%",
                right: "15%",
                width: 110,
                height: 110,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(230,225,210,0.3), rgba(210,205,190,0.1) 45%, transparent 65%)",
                boxShadow: "0 0 100px rgba(210,205,190,0.08)",
              }}
            />

            {/* Stars */}
            {Array.from({ length: 35 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${4 + Math.random() * 92}%`,
                  top: `${2 + Math.random() * 36}%`,
                  width: 0.7 + Math.random() * 1.3,
                  height: 0.7 + Math.random() * 1.3,
                  backgroundColor: `rgba(210,205,190,${0.1 + Math.random() * 0.15})`,
                }}
                animate={{ opacity: [0.06, 0.16, 0.06] }}
                transition={{ duration: 3 + Math.random() * 5, repeat: Infinity }}
              />
            ))}

            {/* Castle — closer */}
            <motion.div
              className="absolute bottom-[22%] left-1/2 -translate-x-1/2"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1.05, opacity: 0.65 }}
              transition={{ duration: 10, ease: "easeOut" }}
            >
              <svg width="560" height="240" viewBox="0 0 560 240">
                <ellipse cx="280" cy="238" rx="290" ry="12" fill="rgba(12,10,8,0.3)" />
                {/* Towers */}
                <rect x="8" y="160" width="18" height="80" fill="rgba(30,26,22,0.6)" />
                <polygon points="8,160 17,142 26,160" fill="rgba(30,26,22,0.55)" />
                <rect x="30" y="148" width="28" height="92" fill="rgba(30,26,22,0.55)" />
                <rect x="37" y="108" width="12" height="40" rx="2" fill="rgba(40,35,28,0.65)" />
                <polygon points="37,108 43,88 49,108" fill="rgba(40,35,28,0.6)" />
                <rect x="62" y="155" width="35" height="85" fill="rgba(30,26,22,0.5)" />
                <rect x="100" y="140" width="42" height="100" fill="rgba(30,26,22,0.55)" />
                <rect x="108" y="85" width="14" height="55" rx="3" fill="rgba(40,35,28,0.7)" />
                <polygon points="108,85 115,62 122,85" fill="rgba(40,35,28,0.65)" />
                {/* Main tower */}
                <rect x="148" y="120" width="52" height="120" fill="rgba(30,26,22,0.6)" />
                <rect x="157" y="35" width="18" height="85" rx="4" fill="rgba(40,35,28,0.75)" />
                <polygon points="157,35 166,10 175,35" fill="rgba(40,35,28,0.7)" />
                {/* Great Hall */}
                <rect x="205" y="125" width="72" height="115" fill="rgba(30,26,22,0.55)" />
                <polygon points="205,125 241,88 277,125" fill="rgba(30,26,22,0.6)" />
                <rect x="236" y="92" width="12" height="33" rx="3" fill="rgba(40,35,28,0.65)" />
                <polygon points="236,92 242,72 248,92" fill="rgba(40,35,28,0.6)" />
                {/* Right */}
                <rect x="282" y="140" width="44" height="100" fill="rgba(30,26,22,0.55)" />
                <rect x="290" y="80" width="14" height="60" rx="3" fill="rgba(40,35,28,0.7)" />
                <polygon points="290,80 297,58 304,80" fill="rgba(40,35,28,0.65)" />
                <rect x="330" y="150" width="32" height="90" fill="rgba(30,26,22,0.5)" />
                <rect x="366" y="155" width="26" height="85" fill="rgba(30,26,22,0.55)" />
                <rect x="372" y="120" width="10" height="35" rx="2" fill="rgba(40,35,28,0.6)" />
                <polygon points="372,120 377,105 382,120" fill="rgba(40,35,28,0.55)" />
                <rect x="398" y="160" width="35" height="80" fill="rgba(30,26,22,0.5)" />
                <rect x="438" y="165" width="20" height="75" fill="rgba(30,26,22,0.55)" />
                <rect x="442" y="145" width="7" height="20" rx="1" fill="rgba(40,35,28,0.55)" />
                <rect x="465" y="160" width="30" height="80" fill="rgba(30,26,22,0.5)" />
                {/* Windows */}
                {[
                  [17, 172], [44, 160], [44, 178], [78, 168],
                  [115, 155], [115, 172], [115, 190],
                  [165, 138], [165, 158], [165, 178], [165, 198],
                  [225, 140], [245, 135], [265, 140],
                  [245, 160], [245, 180],
                  [300, 155], [300, 175],
                  [346, 165], [378, 135], [378, 155],
                  [415, 172], [448, 178], [480, 172],
                ].map(([x, y], i) => (
                  <rect key={i} x={x} y={y} width="4" height="3.5" rx="0.5" fill={`rgba(255,200,80,${0.35 + (i % 4) * 0.1})`} />
                ))}
              </svg>
            </motion.div>

            {/* Window glows */}
            {[
              { x: 36, y: 44 }, { x: 40, y: 43 }, { x: 44, y: 42 },
              { x: 48, y: 41 }, { x: 52, y: 40 }, { x: 56, y: 41 },
              { x: 60, y: 42 }, { x: 64, y: 43 }, { x: 42, y: 38 },
              { x: 46, y: 37 }, { x: 50, y: 36 }, { x: 54, y: 37 },
              { x: 58, y: 38 }, { x: 50, y: 32 },
            ].map((pos, i) => (
              <motion.div
                key={i}
                className="absolute rounded-sm"
                style={{
                  left: `${pos.x}%`,
                  bottom: `${pos.y}%`,
                  width: 4,
                  height: 3.5,
                  backgroundColor: "rgba(255,200,80,0.55)",
                  boxShadow: "0 0 10px rgba(255,200,80,0.28), 0 0 20px rgba(255,180,60,0.1)",
                }}
                animate={{ opacity: [0.45, 0.75, 0.45] }}
                transition={{ duration: 3 + i * 0.25, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}

            {/* Rain very light */}
            {Array.from({ length: 15 }).map((_, i) => {
              const drop = {
                x: Math.random() * 100,
                delay: Math.random() * 2,
                duration: 1.5 + Math.random() * 0.5,
                opacity: 0.06 + Math.random() * 0.08,
                length: 15 + Math.random() * 20,
              };
              return (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${drop.x}%`,
                    width: 1,
                    height: drop.length,
                    background: `linear-gradient(180deg, transparent, rgba(160,155,140,${drop.opacity}), transparent)`,
                  }}
                  initial={{ top: "-5%", opacity: 0 }}
                  animate={{ top: "105%", opacity: [0, drop.opacity, 0] }}
                  transition={{ duration: drop.duration, repeat: Infinity, delay: drop.delay, ease: "linear" }}
                />
              );
            })}

            {/* Fog */}
            <motion.div
              className="absolute bottom-[20%] left-0 right-0 h-[18%]"
              style={{ background: "linear-gradient(0deg, rgba(50,48,42,0.08), transparent)" }}
              animate={{ x: ["-2%", "2%", "-2%"] }}
              transition={{ duration: 20, repeat: Infinity }}
            />
          </motion.div>
        )}

        {/* ===== PHASE 4: DOORS OPEN ===== */}
        {phase === 4 && (
          <motion.div
            key="doors"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
          >
            <div className="absolute inset-0" style={{
              background: "linear-gradient(180deg, #080706, #0C0B09, #0E0D0B)",
            }} />

            {/* Stone arch */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="absolute -inset-10 rounded-t-[95px]" style={{
                border: "8px solid rgba(55,50,42,0.28)",
                borderBottom: "none",
              }} />

              {/* Left door */}
              <div className="relative inline-block" style={{ width: 150, height: 320 }}>
                <div className="absolute inset-0 rounded-t-[75px] overflow-hidden" style={{
                  background: "linear-gradient(180deg, rgba(100,72,50,0.45), rgba(72,50,35,0.55))",
                  border: "2px solid rgba(120,88,60,0.2)",
                  borderRight: "1px solid rgba(120,88,60,0.1)",
                }}>
                  <div className="absolute inset-0" style={{
                    backgroundImage: "repeating-linear-gradient(87deg, transparent, transparent 5px, rgba(0,0,0,0.05) 5px, rgba(0,0,0,0.05) 9px)",
                  }} />
                  <div className="absolute inset-7" style={{ border: "1.5px solid rgba(120,88,60,0.12)" }} />
                  {[14, 34, 54, 74].map((y) => (
                    <div key={y} className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full" style={{
                      top: `${y}%`,
                      backgroundColor: "rgba(105,105,110,0.3)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                    }} />
                  ))}
                  <div className="absolute top-1/2 right-5 w-4 h-11 rounded-full" style={{
                    background: "linear-gradient(135deg, rgba(212,175,55,0.5), rgba(184,134,11,0.4))",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.5)",
                  }} />
                </div>
              </div>

              {/* Right door */}
              <div className="relative inline-block" style={{ width: 150, height: 320 }}>
                <div className="absolute inset-0 rounded-t-[75px] overflow-hidden" style={{
                  background: "linear-gradient(180deg, rgba(100,72,50,0.45), rgba(72,50,35,0.55))",
                  border: "2px solid rgba(120,88,60,0.2)",
                  borderLeft: "1px solid rgba(120,88,60,0.1)",
                }}>
                  <div className="absolute inset-0" style={{
                    backgroundImage: "repeating-linear-gradient(87deg, transparent, transparent 5px, rgba(0,0,0,0.05) 5px, rgba(0,0,0,0.05) 9px)",
                  }} />
                  <div className="absolute inset-7" style={{ border: "1.5px solid rgba(120,88,60,0.12)" }} />
                  {[14, 34, 54, 74].map((y) => (
                    <div key={y} className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full" style={{
                      top: `${y}%`,
                      backgroundColor: "rgba(105,105,110,0.3)",
                    }} />
                  ))}
                  <div className="absolute top-1/2 left-5 w-4 h-11 rounded-full" style={{
                    background: "linear-gradient(135deg, rgba(212,175,55,0.5), rgba(184,134,11,0.4))",
                  }} />
                </div>
              </div>
            </motion.div>

            {/* Warm light beginning to spill */}
            <motion.div
              className="absolute inset-0 z-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 4, delay: 2 }}
            >
              <div className="absolute inset-0" style={{
                background: "radial-gradient(ellipse at 50% 50%, rgba(255,180,60,0.08), transparent 40%)",
              }} />
            </motion.div>
          </motion.div>
        )}

        {/* ===== PHASE 5: DOORS SWING OPEN ===== */}
        {phase === 5 && (
          <motion.div
            key="opening"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            <div className="absolute inset-0" style={{
              background: "linear-gradient(180deg, #080706, #0C0B09, #0E0D0B)",
            }} />

            {/* Stone arch */}
            <div className="absolute -inset-10 rounded-t-[95px]" style={{
              border: "8px solid rgba(55,50,42,0.22)",
              borderBottom: "none",
              pointerEvents: "none",
              zIndex: 10,
            }} />

            {/* Left door — swings open */}
            <motion.div
              className="absolute top-[4%] left-[10%] w-[22%] h-[92%] origin-left overflow-hidden"
              style={{
                background: "linear-gradient(180deg, rgba(100,72,50,0.4), rgba(72,50,35,0.5))",
                borderRight: "1.5px solid rgba(120,88,60,0.12)",
                borderRadius: "50px 0 0 0",
              }}
              initial={{ rotateY: 0 }}
              animate={{ rotateY: -75 }}
              transition={{ duration: 4, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="absolute inset-0" style={{
                backgroundImage: "repeating-linear-gradient(87deg, transparent, transparent 5px, rgba(0,0,0,0.04) 5px, rgba(0,0,0,0.04) 9px)",
              }} />
            </motion.div>

            {/* Right door — swings open */}
            <motion.div
              className="absolute top-[4%] right-[10%] w-[22%] h-[92%] origin-right overflow-hidden"
              style={{
                background: "linear-gradient(180deg, rgba(100,72,50,0.4), rgba(72,50,35,0.5))",
                borderLeft: "1.5px solid rgba(120,88,60,0.12)",
                borderRadius: "0 50px 0 0",
              }}
              initial={{ rotateY: 0 }}
              animate={{ rotateY: 75 }}
              transition={{ duration: 4, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="absolute inset-0" style={{
                backgroundImage: "repeating-linear-gradient(87deg, transparent, transparent 5px, rgba(0,0,0,0.04) 5px, rgba(0,0,0,0.04) 9px)",
              }} />
            </motion.div>

            {/* Warm light flooding in */}
            <motion.div
              className="absolute inset-0 z-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 3, delay: 1 }}
            >
              <div className="absolute inset-0" style={{
                background: "radial-gradient(ellipse at 50% 50%, rgba(255,180,60,0.2), transparent 35%)",
              }} />
            </motion.div>
          </motion.div>
        )}

        {/* ===== PHASE 6: GREAT HALL REVEAL ===== */}
        {phase === 6 && (
          <motion.div
            key="hall"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.5 }}
          >
            <div className="absolute inset-0" style={{
              background: "linear-gradient(180deg, #0C0A07, #12100D, #0E0C09)",
            }} />

            {/* Vaulted ceiling */}
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

            {/* Floating candles — only things that move */}
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
                  y: [0, -2, 0, 2, 0],
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

            {/* People silhouettes — barely there, like shadows */}
            {[
              { x: 18 }, { x: 28 }, { x: 38 }, { x: 48 }, { x: 58 }, { x: 68 }, { x: 78 },
            ].map((p, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${p.x}%`,
                  bottom: "21%",
                  width: 5,
                  height: 10,
                  borderRadius: "2px 2px 0 0",
                  backgroundColor: `rgba(35,30,25,${0.15 + (i % 3) * 0.05})`,
                }}
              />
            ))}

            <div className="absolute bottom-0 left-0 right-0 h-[14%]" style={{
              background: "linear-gradient(0deg, rgba(22,20,16,0.35), transparent)",
            }} />

            {/* Title */}
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 3 }}
            >
              <motion.h1
                className="font-cinzel-decorative text-4xl sm:text-5xl lg:text-6xl font-bold mb-3"
                style={{
                  color: "rgba(212,175,55,0.7)",
                  textShadow: "0 0 40px rgba(184,134,11,0.15)",
                }}
                initial={{ opacity: 0, letterSpacing: "0.4em" }}
                animate={{ opacity: 1, letterSpacing: "0.15em" }}
                transition={{ delay: 2, duration: 4 }}
              >
                Hogwarts
              </motion.h1>
              <motion.p
                className="font-cinzel text-xs sm:text-sm tracking-[0.5em]"
                style={{ color: "rgba(212,175,55,0.35)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.5, duration: 2 }}
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
