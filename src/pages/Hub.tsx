import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDiscovery } from "@/context/DiscoveryContext";
import { rooms } from "@/data/rooms";
import { OwlLetter } from "@/components/ui/OwlLetter";
import { EffectsRenderer } from "@/components/effects/EffectsRenderer";
import type { RoomId } from "@/types";

const greatHall = rooms.find((r) => r.id === "great-hall")!;

/* Floating candle glow points — warm light from vaulted ceiling */
const ceilingLights = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  x: 12 + (i % 7) * 12 + (Math.random() - 0.5) * 4,
  y: 8 + Math.floor(i / 7) * 12 + (Math.random() - 0.5) * 4,
  size: 50 + Math.random() * 40,
  opacity: 0.02 + Math.random() * 0.015,
  flicker: 5 + Math.random() * 4,
  delay: Math.random() * 3,
}));

export default function Hub() {
  const navigate = useNavigate();
  const { isRoomUnlocked, discoveredCount, totalSecrets, visitedRooms } = useDiscovery();
  const [hoveredDoor, setHoveredDoor] = useState<string | null>(null);
  const [showLetter, setShowLetter] = useState(true);
  const [transitionTarget, setTransitionTarget] = useState<string | null>(null);

  const handleNavigate = (targetId: string) => {
    if (!isRoomUnlocked(targetId as RoomId)) {
      setTransitionTarget(targetId);
      setTimeout(() => setTransitionTarget(null), 3000);
      return;
    }
    setTransitionTarget(targetId);
    setTimeout(() => {
      navigate(`/room/${targetId}`);
    }, 1200);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden" style={{ backgroundColor: "#0E0D0B" }}>
      {/* ===== GREAT HALL INTERIOR ===== */}

      {/* Stone wall background */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(180deg, rgba(35,32,30,0.15) 0%, rgba(28,26,24,0.1) 40%, rgba(22,20,18,0.12) 100%)",
      }} />
      <div className="absolute inset-0 texture-stone" />

      {/* Atmospheric effects */}
      <EffectsRenderer effects={greatHall.ambientEffects} />

      {/* ===== ARCHITECTURE — Full viewport ===== */}
      <div className="relative z-10 min-h-screen flex flex-col">

        {/* --- VAULTED CEILING --- */}
        <div className="relative h-[35vh] sm:h-[40vh] flex-shrink-0">
          {/* Ceiling vault shadows */}
          <div className="absolute inset-0" style={{
            background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 40%, transparent 100%)",
          }} />

          {/* Ribbed vault lines — stone ribs converging */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Central rib */}
            <line x1="50" y1="0" x2="50" y2="45" stroke="rgba(60,56,52,0.06)" strokeWidth="0.3" />
            {/* Left ribs */}
            <line x1="20" y1="0" x2="50" y2="45" stroke="rgba(60,56,52,0.04)" strokeWidth="0.2" />
            <line x1="35" y1="0" x2="50" y2="45" stroke="rgba(60,56,52,0.04)" strokeWidth="0.2" />
            {/* Right ribs */}
            <line x1="80" y1="0" x2="50" y2="45" stroke="rgba(60,56,52,0.04)" strokeWidth="0.2" />
            <line x1="65" y1="0" x2="50" y2="45" stroke="rgba(60,56,52,0.04)" strokeWidth="0.2" />
            {/* Cross ribs */}
            <line x1="0" y1="15" x2="100" y2="15" stroke="rgba(60,56,52,0.025)" strokeWidth="0.2" />
            <line x1="0" y1="30" x2="100" y2="30" stroke="rgba(60,56,52,0.02)" strokeWidth="0.15" />
          </svg>

          {/* Floating candle glow — warm light points on ceiling */}
          {ceilingLights.map((light) => (
            <motion.div
              key={light.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: `${light.x}%`,
                top: `${light.y}%`,
                width: light.size,
                height: light.size,
                transform: "translate(-50%, -50%)",
                background: `radial-gradient(circle, rgba(255,213,79,${light.opacity}), transparent 70%)`,
              }}
              animate={{
                opacity: [light.opacity, light.opacity * 1.4, light.opacity * 0.7, light.opacity * 1.2, light.opacity],
                scale: [1, 1.03, 0.97, 1.02, 1],
              }}
              transition={{
                duration: light.flicker,
                repeat: Infinity,
                delay: light.delay,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Stained glass windows — high on walls */}
          {[
            { left: "8%", width: "10%", height: "55%", color: "rgba(212,175,55,0.04)" },
            { left: "22%", width: "8%", height: "50%", color: "rgba(94,27,36,0.025)" },
            { left: "38%", width: "7%", height: "45%", color: "rgba(31,58,42,0.025)" },
            { left: "55%", width: "7%", height: "45%", color: "rgba(31,58,42,0.025)" },
            { left: "70%", width: "8%", height: "50%", color: "rgba(94,27,36,0.025)" },
            { left: "82%", width: "10%", height: "55%", color: "rgba(212,175,55,0.04)" },
          ].map((win, i) => (
            <motion.div
              key={i}
              className="absolute top-[5%] pointer-events-none"
              style={{
                left: win.left,
                width: win.width,
                height: win.height,
                background: `linear-gradient(180deg, ${win.color}, transparent)`,
                clipPath: "polygon(25% 0%, 75% 0%, 100% 100%, 0% 100%)",
              }}
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "easeInOut", delay: i * 1.5 }}
            />
          ))}
        </div>

        {/* --- GREAT HALL MAIN SPACE --- */}
        <div className="relative flex-1 flex flex-col items-center justify-center px-4 sm:px-6">

          {/* Title — carved into stone */}
          <motion.div
            className="text-center mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            <h1 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 tracking-wide text-engraved">
              The Great Hall
            </h1>
            <p className="font-cormorant text-base sm:text-lg italic" style={{ color: "rgba(160,150,130,0.25)" }}>
              Where all journeys begin
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="flex justify-center gap-10 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1.5 }}
          >
            <div className="text-center">
              <div className="font-cinzel text-xl text-engraved">{visitedRooms.length}</div>
              <div className="font-cormorant text-xs" style={{ color: "rgba(100,95,88,0.25)" }}>Rooms Visited</div>
            </div>
            <div className="text-center">
              <div className="font-cinzel text-xl text-engraved">{discoveredCount}</div>
              <div className="font-cormorant text-xs" style={{ color: "rgba(100,95,88,0.25)" }}>Secrets Found</div>
            </div>
          </motion.div>

          {/* --- LONG DINING TABLES --- */}
          <motion.div
            className="relative w-full max-w-3xl mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 2 }}
          >
            {/* Table surfaces — perspective lines receding */}
            <div className="relative h-[60px] sm:h-[80px]">
              {/* Table 1 */}
              <div className="absolute left-[10%] right-[10%] h-[3px] top-[20%] rounded-full" style={{
                background: "linear-gradient(90deg, transparent, rgba(61,43,31,0.2), rgba(61,43,31,0.25), rgba(61,43,31,0.2), transparent)",
              }} />
              {/* Table 2 */}
              <div className="absolute left-[15%] right-[15%] h-[2px] top-[55%] rounded-full" style={{
                background: "linear-gradient(90deg, transparent, rgba(61,43,31,0.15), rgba(61,43,31,0.2), rgba(61,43,31,0.15), transparent)",
              }} />
              {/* Candle glow on tables */}
              {[25, 40, 55, 70].map((x, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    left: `${x}%`,
                    top: "15%",
                    width: 30,
                    height: 20,
                    transform: "translate(-50%, -50%)",
                    background: "radial-gradient(ellipse, rgba(255,213,79,0.03), transparent 70%)",
                  }}
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.8 }}
                />
              ))}
            </div>
          </motion.div>

          {/* --- DOORWAYS TO OTHER ROOMS --- */}
          <motion.div
            className="relative w-full max-w-2xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 1.5 }}
          >
            <p className="font-cinzel text-[10px] text-center mb-5 tracking-[0.25em] text-engraved">
              PASSAGES
            </p>

            <div className="flex justify-center gap-6 sm:gap-10">
              {greatHall.connections.map((conn) => {
                const targetRoom = rooms.find((r) => r.id === conn.target);
                if (!targetRoom) return null;
                const isLocked = !isRoomUnlocked(conn.target);
                const isHovered = hoveredDoor === conn.target;

                return (
                  <motion.button
                    key={conn.target}
                    className="relative cursor-pointer group"
                    onMouseEnter={() => setHoveredDoor(conn.target)}
                    onMouseLeave={() => setHoveredDoor(null)}
                    onClick={() => handleNavigate(conn.target)}
                    whileHover={isLocked ? {} : { y: -3 }}
                    whileTap={isLocked ? {} : { scale: 0.97 }}
                  >
                    {/* Gothic arch doorway — tall, narrow, pointed */}
                    <div className="relative mx-auto" style={{ width: 60, height: 110 }}>
                      {/* Arch outline */}
                      <div
                        className="absolute inset-0 transition-all duration-1000"
                        style={{
                          borderRadius: "30px 30px 0 0",
                          border: `1.5px solid ${isLocked ? "rgba(60,56,52,0.06)" : isHovered ? "rgba(90,85,80,0.18)" : "rgba(60,56,52,0.1)"}`,
                          background: isLocked
                            ? "rgba(14,13,11,0.3)"
                            : isHovered
                              ? "linear-gradient(180deg, rgba(42,38,36,0.1), rgba(14,13,11,0.2))"
                              : "linear-gradient(180deg, rgba(30,28,26,0.08), rgba(14,13,11,0.15))",
                        }}
                      />

                      {/* Inner arch — deeper space */}
                      <div
                        className="absolute top-[8px] left-[6px] right-[6px] bottom-0 transition-all duration-1000"
                        style={{
                          borderRadius: "24px 24px 0 0",
                          background: isLocked
                            ? "rgba(8,7,6,0.2)"
                            : isHovered
                              ? "rgba(8,7,6,0.25)"
                              : "rgba(8,7,6,0.15)",
                        }}
                      />

                      {/* Light spill at threshold — when hovered */}
                      {!isLocked && isHovered && (
                        <motion.div
                          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[160%] h-8 rounded-full blur-xl pointer-events-none"
                          style={{ backgroundColor: "rgba(255,213,79,0.04)" }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 1 }}
                        />
                      )}

                      {/* Lock dot */}
                      {isLocked && (
                        <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "rgba(60,56,52,0.12)" }} />
                      )}
                    </div>

                    {/* Label */}
                    <motion.div
                      className="mt-2 text-center"
                      animate={{ opacity: isHovered ? 0.9 : 0.4 }}
                      transition={{ duration: 0.8 }}
                    >
                      <span
                        className="font-cinzel text-[9px] sm:text-[10px] tracking-[0.15em]"
                        style={{ color: isLocked ? "rgba(100,95,88,0.15)" : isHovered ? "rgba(184,134,11,0.45)" : "rgba(160,150,130,0.25)" }}
                      >
                        {isLocked ? "\u25CB " : ""}{conn.label}
                      </span>
                    </motion.div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* --- FLOOR --- */}
        <div className="relative h-[15vh] flex-shrink-0">
          {/* Stone floor */}
          <div className="absolute inset-0" style={{
            background: "linear-gradient(180deg, transparent 0%, rgba(25,23,21,0.2) 40%, rgba(20,18,16,0.3) 100%)",
          }} />
          {/* Floor reflection of candlelight */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "radial-gradient(ellipse at 50% 0%, rgba(255,213,79,0.015), transparent 60%)",
          }} />
        </div>
      </div>

      {/* ===== ROOM UNLOCK NOTIFICATION ===== */}
      <AnimatePresence>
        {transitionTarget && !isRoomUnlocked(transitionTarget as RoomId) && (
          <motion.div
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-sm"
            style={{
              background: "linear-gradient(135deg, rgba(30,28,26,0.92), rgba(20,18,16,0.96))",
              border: "1px solid rgba(60,56,52,0.12)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
            }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <p className="font-cormorant text-sm text-center" style={{ color: "rgba(160,150,130,0.35)" }}>
              This passage is sealed.
            </p>
            <p className="font-cormorant text-xs text-center mt-1 italic" style={{ color: "rgba(184,134,11,0.25)" }}>
              {rooms.find((r) => r.id === transitionTarget)?.unlockRequires}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== DISCOVERY PROGRESS ===== */}
      <motion.div
        className="fixed bottom-4 left-4 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
      >
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "rgba(212,175,55,0.25)" }} />
          <span className="font-cinzel text-[9px] tracking-wider" style={{ color: "rgba(100,95,88,0.2)" }}>
            {discoveredCount}/{totalSecrets}
          </span>
        </div>
      </motion.div>

      {/* Welcome letter */}
      <OwlLetter isOpen={showLetter} onClose={() => setShowLetter(false)} />
    </div>
  );
}
