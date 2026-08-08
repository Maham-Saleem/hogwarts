import { useRef, useState } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useDiscovery } from "@/context/DiscoveryContext";
import { useRoomAmbience } from "@/hooks/useRoomAmbience";
import type { RoomId } from "@/types";

interface GreatHallProps {
  onNavigate: (roomId: string) => void;
  onOpenMap: () => void;
}

// roomId -> stylised label used in the passage stone
const PASSAGES: { target: string; label: string; pos: string }[] = [
  { target: "library", label: "Library", pos: "left-[8%]" },
  { target: "grand-staircase", label: "Grand Staircase", pos: "left-1/2 -translate-x-1/2" },
  { target: "courtyard", label: "Courtyard", pos: "right-[8%]" },
];

// four house banners, warm and muted
const BANNERS = [
  { x: "10%", c: "rgba(190,58,48,0.14)" },
  { x: "24%", c: "rgba(52,84,60,0.12)" },
  { x: "74%", c: "rgba(212,175,55,0.14)" },
  { x: "88%", c: "rgba(60,80,130,0.12)" },
];

export function GreatHall({ onNavigate }: GreatHallProps) {
  const { isRoomUnlocked } = useDiscovery();
  useRoomAmbience("great-hall");
  const [hovered, setHovered] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: scrollRef });

  return (
    <div
      ref={scrollRef}
      className="fixed inset-0 z-[60] overflow-y-scroll overscroll-none"
      style={{ background: "radial-gradient(ellipse at 50% 30%, #1a1410, #0a0807 78%)" }}
    >
      <div className="relative" style={{ height: "540vh" }}>
        <div className="sticky top-0 h-screen overflow-hidden">
          <Stage p={scrollYProgress} hovered={hovered} onHover={setHovered} onNavigate={onNavigate} isRoomUnlocked={(id) => isRoomUnlocked(id as RoomId)} />
        </div>
      </div>
    </div>
  );
}

interface StageProps {
  p: MotionValue<number>;
  hovered: string | null;
  onHover: (id: string | null) => void;
  onNavigate: (roomId: string) => void;
  isRoomUnlocked: (id: string) => boolean;
}

function Stage({ p, hovered, onHover, onNavigate, isRoomUnlocked }: StageProps) {  // ---- shared camera feels ----
  const roomDrift = useTransform(p, [0, 1], [0, -2.5]);

  // ---- SECTIONS 1-2: THRESHOLD ----
  const threshold = useTransform(p, [0, 0.02, 0.09, 0.2], [0, 0.9, 0.9, 0]);
  const thresholdY = useTransform(p, [0, 0.14], [0, -140]);

  // the great doors just behind you, fading as you walk on
  const doorsOut = useTransform(p, [0, 0.06, 0.16, 0.22], [1, 0.85, 0.45, 0]);
  const doorsY = useTransform(p, [0, 0.22], [0, -120]);

  // ---- SECTION 2-3: THE HALL (bodies of candlelight) ----
  const hallIn = useTransform(p, [0.16, 0.26, 0.5, 0.62], [0, 1, 1, 0]);
  const hallY = useTransform(p, [0.16, 0.62], [0, -40]);

  // ceiling is slowest (furthest)
  const ceilY = useTransform(p, [0.2, 0.62], [8, -10]);
  const ceilOp = useTransform(p, [0.2, 0.28, 0.55, 0.63], [0, 0.9, 0.9, 0]);

  // tables
  const tableY = useTransform(p, [0.24, 0.58], [140, -60]);
  const tableOp = useTransform(p, [0.24, 0.3, 0.54, 0.6], [0, 1, 1, 0]);

  // banners + stained glass mid layer
  const midY = useTransform(p, [0.16, 0.62], [-30, -60]);
  const midOp = useTransform(p, [0.2, 0.28, 0.54, 0.62], [0, 0.9, 0.9, 0]);

  // ---- SECTION 4-5: THE DAIS ----
  const daisIn = useTransform(p, [0.6, 0.68, 0.78, 0.84], [0, 0.95, 0.95, 0]);
  const daisY = useTransform(p, [0.6, 0.84], [40, -40]);

  // ---- SECTION 5-6: THE PASSAGES ----
  const passageIn = useTransform(p, [0.8, 0.88, 1], [0, 1, 1]);
  const passageY = useTransform(p, [0.8, 1], [120, 0]);

  return (
    <div className="relative w-full h-full">
      {/* ---------- LIGHT GRADING ---------- */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 34%, rgba(255,196,120,0.1), transparent 58%)",
          opacity: useTransform(p, [0, 0.3, 0.8, 1], [0.4, 1, 1, 0.0]),
        }}
      />
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ boxShadow: "inset 0 0 160px rgba(0,0,0,0.72)", opacity: 0.9 }}
      />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(10,6,3,0.5) 100%)",
      }} />

      {/* ---------- THRESHOLD: the doors you came through ---------- */}
      <motion.div className="absolute inset-0" style={{ opacity: threshold, translateY: thresholdY }}>
        {/* deep arch separating threshold from hall */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 120% 90% at 50% 92%, transparent 40%, rgba(6,4,2,0.55) 78%)",
          }}
        />
        {/* receding corridor walls */}
        <div className="absolute inset-x-[16%] top-0 bottom-[8%] texture-stone" style={{}} />
        <div className="absolute left-[16%] top-0 bottom-[8%] w-px" style={{ background: "linear-gradient(180deg, transparent, rgba(120,90,50,0.12), transparent)" }} />
        <div className="absolute right-[16%] top-0 bottom-[8%] w-px" style={{ background: "linear-gradient(180deg, transparent, rgba(120,90,50,0.12), transparent)" }} />
        {/* running light near the floor */}
        <div className="absolute left-[20%] right-[20%] bottom-[10%] h-[2px]" style={{ background: "linear-gradient(90deg, transparent, rgba(255,176,90,0.1), transparent)" }} />

        <motion.div className="absolute inset-x-[14%] bottom-[4%] top-0" style={{ opacity: doorsOut, y: doorsY }}>
          {/* the great door slabs, now quiet behind you */}
          <div className="absolute left-0 top-[14%] bottom-0 w-[42%]" style={{
            background: "linear-gradient(90deg, rgba(30,22,14,0.6), rgba(20,15,10,0.5))",
            borderRight: "1px solid rgba(60,42,26,0.25)",
            borderRadius: "30px 0 0 0",
          }} />
          <div className="absolute right-0 top-[14%] bottom-0 w-[42%]" style={{
            background: "linear-gradient(270deg, rgba(30,22,14,0.6), rgba(20,15,10,0.5))",
            borderLeft: "1px solid rgba(60,42,26,0.25)",
            borderRadius: "0 30px 0 0",
          }} />
          {/* knocker light */}
          <div className="absolute left-1/2 top-[24%] -translate-x-1/2 w-16 h-16 rounded-full" style={{
            background: "radial-gradient(circle, rgba(255,190,120,0.1), transparent 65%)",
          }} />
        </motion.div>

        {/* inscription over the threshold */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: threshold }}
        >
          <p
            className="font-cormorant italic text-sm sm:text-base tracking-[0.2em] text-center px-8"
            style={{ color: "rgba(222,196,150,0.35)", textShadow: "0 2px 6px rgba(0,0,0,0.6)" }}
          >
            you crossed the threshold of an old hall.
            <br />
            <span className="font-cinzel text-[10px] not-italic tracking-[0.35em] uppercase" style={{ color: "rgba(200,163,105,0.28)" }}>
              keep moving
            </span>
          </p>
        </motion.div>
      </motion.div>

      {/* ---------- THE HALL ---------- */}
      <motion.div className="absolute inset-0" style={{ opacity: hallIn, y: roomDrift }}>
        <motion.div className="absolute inset-0" style={{ opacity: hallIn, y: hallY }}>
          {/* vaulted ceiling ribs, drifting slowest */}
          <motion.div className="absolute inset-0" style={{ opacity: ceilOp, y: ceilY }}>
            <Ceiling />
          </motion.div>

          {/* stained glass wash at the high side walls */}
          <motion.div className="absolute inset-0" style={{ opacity: midOp, y: midY }}>
            <StainedGlass />
          </motion.div>

          {/* banners */}
          <motion.div className="absolute inset-0" style={{ opacity: midOp, y: midY }}>
            {BANNERS.map((b, i) => (
              <motion.div
                key={i}
                className="absolute top-[16%] w-3 sm:w-4 h-[34%]"
                style={{ left: b.x, background: `linear-gradient(180deg, ${b.c}, transparent)`, filter: "blur(0.5px)" }}
                animate={{ opacity: [0.5, 0.9, 0.5], y: [0, -3, 0] }}
                transition={{ duration: 9 + i, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}
          </motion.div>

          {/* the four house tables */}
          <motion.div className="absolute inset-x-0" style={{ opacity: tableOp, top: "46%", y: tableY }}>
            {[
              { w: "70%", o: 0.5, tint: "rgba(255,150,90,0.06)" },
              { w: "80%", o: 0.42, tint: "rgba(255,170,100,0.05)" },
              { w: "74%", o: 0.4, tint: "rgba(255,180,110,0.05)" },
              { w: "64%", o: 0.3, tint: "rgba(255,160,90,0.045)" },
            ].map((t, i) => (
              <div
                key={i}
                className="absolute left-1/2 -translate-x-1/2"
                style={{
                  top: `${i * 11}%`,
                  width: t.w,
                  height: 3,
                  background: `linear-gradient(90deg, transparent, ${t.tint} 22%, rgba(70,50,30,0.35) 50%, ${t.tint} 78%, transparent)`,
                  opacity: t.o,
                  boxShadow: `0 8px 40px rgba(255,${180 - i * 12},80,${0.02 + i * 0.008})`,
                }}
              />
            ))}
            {/* little table candle glows */}
            {[0, 1, 2].map((r) =>
              [22, 40, 62, 80].map((c, j) => (
                <motion.div
                  key={`t${r}-${j}`}
                  className="absolute w-3 h-3 rounded-full"
                  style={{ left: `${c}%`, top: `${r * 11 + 1}%` }}
                  animate={{ opacity: [0.1, 0.5, 0.1] }}
                  transition={{ duration: 4 + (r + j), repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="w-full h-full rounded-full" style={{
                    background: "radial-gradient(circle, rgba(255,206,120,0.6), transparent 60%)",
                    filter: "blur(0.5px)",
                  }} />
                </motion.div>
              )),
            )}
          </motion.div>

          {/* luminous ceiling candles */}
          <Candle op={ceilOp} />
        </motion.div>

        {/* hall copy */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ opacity: useTransform(p, [0.3, 0.36, 0.5, 0.56], [0, 0.95, 0.8, 0]) }}
        >
          <div className="text-center px-8">
            <p
              className="font-cinzel-decorative text-2xl sm:text-3xl tracking-[0.16em]"
              style={{ color: "rgba(216,178,110,0.5)", textShadow: "0 0 30px rgba(216,178,110,0.15)" }}
            >
              The Great Hall
            </p>
            <p className="mt-3 font-cormorant italic text-sm sm:text-base" style={{ color: "rgba(196,176,140,0.4)" }}>
              a thousand candles float beneath an ever-changing sky
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* ---------- THE DAIS ---------- */}
      <motion.div className="absolute inset-0" style={{ opacity: daisIn, y: daisY }}>
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 60%, rgba(255,180,90,0.14), transparent 55%)",
          }}
        />
        {/* long dais table */}
        <div
          className="absolute left-1/2 bottom-[18%] -translate-x-1/2 w-[88%] h-[2px]"
          style={{ background: "linear-gradient(90deg, transparent, rgba(60,44,28,0.5) 20%, rgba(70,52,32,0.6) 50%, rgba(60,44,28,0.5) 80%, transparent)" }}
        />
        {/* the quote, etched like the head of the table remembers it */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-10 text-center">
          <div className="h-px w-16 mb-5" style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)" }} />
          <p
            className="font-cinzel text-[10px] tracking-[0.3em] uppercase mb-3"
            style={{ color: "rgba(212,175,55,0.3)" }}
          >
            the fall of our choices
          </p>
          <p
            className="font-cormorant italic text-xl sm:text-2xl max-w-xl lead-loose"
            style={{ color: "rgba(216,194,158,0.55)", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
          >
            “It is our choices that show what we truly are,
            far more than our abilities.”
          </p>
          <div className="h-px w-16 mt-5" style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)" }} />
          <p
            className="mt-6 font-cinzel text-[9px] tracking-[0.3em] uppercase"
            style={{ color: "rgba(196,176,140,0.25)" }}
          >
            the hall remembers
          </p>
        </div>
      </motion.div>

      {/* ---------- THE PASSAGES ---------- */}
      <motion.div className="absolute inset-0" style={{ opacity: passageIn, y: passageY }}>
        {/* far wall */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, rgba(22,16,10,0.55), rgba(8,6,4,0.85) 75%)",
          }}
        />
        {/* hearth glow at centre-back */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[8%] w-[30%] h-[34%]" style={{
          background: "radial-gradient(ellipse at 50% 80%, rgba(255,150,70,0.16), transparent 60%)",
          filter: "blur(4px)",
        }} />

        {PASSAGES.map((a) => {
          const unlocked = isRoomUnlocked(a.target);
          const lit = hovered === a.target;
          return (
            <button
              key={a.target}
              className={`absolute bottom-[16%] w-[22%] max-w-[210px] cursor-pointer group outline-none ${a.pos}`}
              onMouseEnter={() => onHover(a.target)}
              onMouseLeave={() => onHover(null)}
              onClick={() => unlocked && onNavigate(a.target)}
            >
              {/* stone arch */}
              <span
                className="block relative mx-auto"
                style={{
                  width: "100%",
                  paddingTop: "146%",
                }}
              >
                <span
                  className="absolute inset-0 transition-all duration-1000"
                  style={{
                    borderRadius: "100% 100% 0 0 / 46% 46% 0 0",
                    border: `2px solid ${lit ? "rgba(212,175,55,0.4)" : "rgba(120,96,60,0.18)"}`,
                    background: lit
                      ? "linear-gradient(180deg, rgba(60,44,26,0.35), rgba(20,15,10,0.55))"
                      : "linear-gradient(180deg, rgba(40,30,20,0.18), rgba(10,8,6,0.35))",
                    boxShadow: lit ? "0 0 40px rgba(255,180,90,0.14), inset 0 0 20px rgba(0,0,0,0.4)" : "inset 0 0 20px rgba(0,0,0,0.35)",
                  }}
                />
                {/* glowing passage beyond */}
                <span
                  className="absolute inset-x-[12%] top-[6%] bottom-[6%] rounded-[100% 100% 0 0] transition-all duration-1000"
                  style={{
                    background: `radial-gradient(ellipse at 50% 100%, ${lit ? "rgba(255,190,110,0.34)" : "rgba(255,180,90,0.12)"}, transparent 60%)`,
                  }}
                />
                {/* brass name plate */}
                <span
                  className="absolute left-1/2 -translate-x-1/2 -bottom-5 whitespace-nowrap font-cinzel text-[9px] sm:text-[10px] tracking-[0.2em] uppercase transition-all duration-700"
                  style={{
                    color: lit ? "rgba(212,175,55,0.75)" : !unlocked ? "rgba(196,176,150,0.16)" : "rgba(196,176,150,0.3)",
                    textShadow: lit ? "0 0 10px rgba(212,175,55,0.3)" : "none",
                  }}
                >
                  {a.label}
                </span>
                {!unlocked && (
                  <span
                    className="absolute left-1/2 -translate-x-1/2 -bottom-1 font-cormorant italic text-[9px] whitespace-nowrap"
                    style={{ color: "rgba(196,176,150,0.14)" }}
                  >
                    shrouded still
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </motion.div>

      {/* ---------- SHARED AMBIENT ---------- */}
      <FloorMist opacity={useTransform(p, [0, 0.9], [0.5, 0.7])} />
    </div>
  );
}

/* ===================== COMPOSED LAYERS ===================== */

function Ceiling() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* vaulted darkness */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(180deg, rgba(4,3,2,0.85) 0%, rgba(6,4,2,0.4) 34%, transparent 62%)",
      }} />
      {/* ribs */}
      <svg className="absolute inset-0 w-full h-[88%]" viewBox="0 0 100 100" preserveAspectRatio="none">
        {[6, 18, 30, 42, 58, 70, 82, 94].map((x, i) => (
          <line key={i} x1={x} y1="0" x2="50" y2="52" stroke="rgba(120,96,60,0.07)" strokeWidth="0.22" />
        ))}
        {[0, 14, 28, 40].map((y, i) => (
          <line key={`h${i}`} x1="0" y1={y} x2="100" y2={y} stroke="rgba(120,96,60,0.04)" strokeWidth="0.14" />
        ))}
      </svg>
    </div>
  );
}

const CANDLE_FIELD = Array.from({ length: 40 }, (_, i) => ({
  x: (i * 29) % 100,
  y: (i * 41) % 60,
  s: 3 + (i % 3) * 2,
  d: 0.03 + (i % 5) * 0.01,
  w: 4 + (i % 4),
}));

function Candle({ op }: { op: MotionValue<number> }) {
  return (
    <motion.div className="absolute inset-x-0 top-0 h-[68%] pointer-events-none" style={{ opacity: op }}>
      {CANDLE_FIELD.map((c, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${c.x}%`,
            top: `${c.y}%`,
            width: c.s,
            height: c.s,
            background: "radial-gradient(circle, rgba(255,206,130,0.6), transparent 65%)",
            filter: "blur(0.4px)",
          }}
          animate={{ y: [0, -6, 0], opacity: [0.5, 1, 0.5], x: [0, 2, -2, 0] }}
          transition={{ duration: c.w, repeat: Infinity, ease: "easeInOut", delay: (i % 9) * 0.4 }}
        />
      ))}
    </motion.div>
  );
}

function StainedGlass() {
  const wins = [
    { x: 2, w: 10, tints: ["rgba(212,175,55,0.08)", "rgba(150,60,90,0.05)"] },
    { x: 14, w: 8, tints: ["rgba(120,196,170,0.06)", "rgba(212,175,55,0.04)"] },
    { x: 78, w: 8, tints: ["rgba(150,60,90,0.06)", "rgba(120,196,170,0.04)"] },
    { x: 88, w: 10, tints: ["rgba(120,140,220,0.08)", "rgba(212,175,55,0.05)"] },
  ];
  return (
    <div className="absolute inset-0 pointer-events-none">
      {wins.map((wn, i) => (
        <motion.div
          key={i}
          className="absolute top-[6%]"
          style={{
            left: `${wn.x}%`,
            width: `${wn.w}%`,
            height: "34%",
            background: `linear-gradient(180deg, ${wn.tints[0]}, ${wn.tints[1]}, transparent)`,
            clipPath: "polygon(18% 0%, 82% 0%, 100% 100%, 0% 100%)",
          }}
          animate={{ opacity: [0.35, 0.9, 0.35] }}
          transition={{ duration: 14 + i * 3, repeat: Infinity, ease: "easeInOut", delay: i * 2 }}
        />
      ))}
    </div>
  );
}

function FloorMist({ opacity: op }: { opacity: MotionValue<number> }) {
  return (
    <motion.div className="absolute inset-x-0 bottom-0 h-[20%] pointer-events-none" style={{ opacity: op }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute left-[-20%] right-[-20%]"
          style={{
            top: `${40 + i * 22}%`,
            height: 70,
            background: "linear-gradient(90deg, transparent, rgba(220,180,130,0.06), transparent)",
            filter: "blur(20px)",
          }}
          animate={{ x: [0, 40 + i * 30, 0], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 20 + i * 6, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </motion.div>
  );
}