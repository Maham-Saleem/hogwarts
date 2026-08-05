import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDiscovery } from "@/context/DiscoveryContext";
import { rooms } from "@/data/rooms";
import { OwlLetter } from "@/components/ui/OwlLetter";
import { EffectsRenderer } from "@/components/effects/EffectsRenderer";
import type { RoomId } from "@/types";

const greatHall = rooms.find((r) => r.id === "great-hall")!;

export default function Hub() {
  const navigate = useNavigate();
  const { isRoomUnlocked, discoveredCount, totalSecrets, visitedRooms } = useDiscovery();
  const [hoveredDoor, setHoveredDoor] = useState<string | null>(null);
  const [showLetter, setShowLetter] = useState(true);
  const [transitionTarget, setTransitionTarget] = useState<string | null>(null);

  const handleNavigate = (targetId: string) => {
    if (!isRoomUnlocked(targetId as RoomId)) {
      setTransitionTarget(targetId);
      setTimeout(() => setTransitionTarget(null), 2500);
      return;
    }
    setTransitionTarget(targetId);
    setTimeout(() => {
      navigate(`/room/${targetId}`);
    }, 1000);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden" style={{ backgroundColor: "#0E0D0B" }}>
      {/* Architectural background - stone walls */}
      <div className="absolute inset-0 texture-stone" />

      {/* Atmospheric effects */}
      <EffectsRenderer effects={greatHall.ambientEffects} />

      {/* Architectural shadows */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.45) 100%)" }} />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-32">
        {/* Hall header */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <h1 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 tracking-wide text-engraved">
            The Great Hall
          </h1>
          <p className="font-cormorant text-base sm:text-lg italic" style={{ color: "rgba(160,150,130,0.3)" }}>
            Where all journeys begin
          </p>
        </motion.div>

        {/* Stats - carved into stone */}
        <motion.div
          className="flex justify-center gap-8 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="text-center">
            <div className="font-cinzel text-xl text-engraved">{visitedRooms.length}</div>
            <div className="font-cormorant text-xs" style={{ color: "rgba(100,95,88,0.3)" }}>Rooms Visited</div>
          </div>
          <div className="text-center">
            <div className="font-cinzel text-xl text-engraved">{discoveredCount}</div>
            <div className="font-cormorant text-xs" style={{ color: "rgba(100,95,88,0.3)" }}>Secrets Found</div>
          </div>
        </motion.div>

        {/* The Great Hall interior */}
        <motion.div
          className="relative mx-auto max-w-4xl aspect-[16/9] rounded-sm overflow-hidden"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
          style={{
            background: "linear-gradient(180deg, rgba(30,28,26,0.3), rgba(42,38,36,0.15), rgba(20,18,16,0.4))",
            border: "1px solid rgba(60,56,52,0.1)",
            boxShadow: "inset 0 0 80px rgba(0,0,0,0.4)",
          }}
        >
          {/* Ceiling - vaulted */}
          <div className="absolute top-0 left-0 right-0 h-[30%]" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.45), transparent)" }} />

          {/* Stained glass windows - light spill */}
          <div className="absolute top-[3%] left-[15%] w-[12%] h-[25%] rounded-t-full overflow-hidden opacity-40"
            style={{
              background: "linear-gradient(180deg, rgba(212,175,55,0.06), transparent)",
              clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
            }}
          />
          <div className="absolute top-[3%] left-[38%] w-[10%] h-[22%] rounded-t-full overflow-hidden opacity-30"
            style={{
              background: "linear-gradient(180deg, rgba(94,27,36,0.04), transparent)",
              clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
            }}
          />
          <div className="absolute top-[3%] right-[38%] w-[10%] h-[22%] rounded-t-full overflow-hidden opacity-30"
            style={{
              background: "linear-gradient(180deg, rgba(31,58,42,0.04), transparent)",
              clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
            }}
          />
          <div className="absolute top-[3%] right-[15%] w-[12%] h-[25%] rounded-t-full overflow-hidden opacity-40"
            style={{
              background: "linear-gradient(180deg, rgba(212,175,55,0.06), transparent)",
              clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
            }}
          />

          {/* House tables - long wooden tables */}
          <div className="absolute bottom-[35%] left-[8%] right-[8%] h-[2px] rounded-full" style={{ backgroundColor: "rgba(61,43,31,0.15)" }} />
          <div className="absolute bottom-[42%] left-[12%] right-[12%] h-[2px] rounded-full" style={{ backgroundColor: "rgba(61,43,31,0.12)" }} />

          {/* Doorways */}
          {greatHall.connections.map((conn) => {
            const room = rooms.find((r) => r.id === conn.target);
            if (!room) return null;
            const isLocked = !isRoomUnlocked(conn.target);
            const isHovered = hoveredDoor === conn.target;

            // Position doorways along the bottom
            const positions: Record<string, string> = {
              "library": "left-[18%]",
              "grand-staircase": "left-[45%] -translate-x-1/2",
              "courtyard": "right-[18%]",
            };

            return (
              <motion.button
                key={conn.target}
                className={`absolute bottom-[12%] ${positions[conn.target] || "left-1/2"} cursor-pointer group`}
                onMouseEnter={() => setHoveredDoor(conn.target)}
                onMouseLeave={() => setHoveredDoor(null)}
                onClick={() => handleNavigate(conn.target)}
                whileHover={isLocked ? {} : { scale: 1.02 }}
                whileTap={isLocked ? {} : { scale: 0.98 }}
              >
                {/* Gothic arch doorway */}
                <div className="relative" style={{ width: 50, height: 80 }}>
                  {/* Arch frame */}
                  <div
                    className="absolute inset-0 rounded-t-[25px] transition-all duration-1000"
                    style={{
                      border: `1px solid ${isLocked ? "rgba(60,56,52,0.08)" : isHovered ? "rgba(90,85,80,0.2)" : "rgba(60,56,52,0.12)"}`,
                      background: isLocked
                        ? "rgba(14,13,11,0.4)"
                        : isHovered
                          ? "linear-gradient(180deg, rgba(42,38,36,0.15), rgba(14,13,11,0.3))"
                          : "linear-gradient(180deg, rgba(35,32,30,0.1), rgba(14,13,11,0.25))",
                    }}
                  />

                  {/* Light spill when hovered */}
                  {!isLocked && isHovered && (
                    <motion.div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[140%] h-6 rounded-full blur-xl"
                      style={{ backgroundColor: "rgba(255,213,79,0.06)" }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8 }}
                    />
                  )}

                  {/* Lock indicator */}
                  {isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "rgba(60,56,52,0.15)" }} />
                    </div>
                  )}
                </div>

                {/* Label */}
                <motion.div
                  className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
                  animate={{ opacity: isHovered ? 0.8 : 0.4 }}
                  transition={{ duration: 0.6 }}
                >
                  <span
                    className="font-cinzel text-[9px] tracking-wider"
                    style={{ color: isLocked ? "rgba(100,95,88,0.2)" : isHovered ? "rgba(184,134,11,0.5)" : "rgba(160,150,130,0.3)" }}
                  >
                    {isLocked ? "\u25CB " : ""}{conn.label}
                  </span>
                </motion.div>
              </motion.button>
            );
          })}

          {/* Floor shadow */}
          <div className="absolute bottom-0 left-0 right-0 h-[20%]" style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.5), transparent)" }} />
        </motion.div>

        {/* Room unlock notification */}
        <AnimatePresence>
          {transitionTarget && !isRoomUnlocked(transitionTarget as RoomId) && (
            <motion.div
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-sm"
              style={{
                background: "linear-gradient(135deg, rgba(30,28,26,0.9), rgba(20,18,16,0.95))",
                border: "1px solid rgba(60,56,52,0.15)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <p className="font-cormorant text-sm text-center" style={{ color: "rgba(160,150,130,0.4)" }}>
                This passage is sealed.
              </p>
              <p className="font-cormorant text-xs text-center mt-1 italic" style={{ color: "rgba(184,134,11,0.3)" }}>
                {rooms.find((r) => r.id === transitionTarget)?.unlockRequires}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Discovery progress */}
        <motion.div
          className="max-w-xs mx-auto mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <div className="w-full h-[1px] rounded-full overflow-hidden" style={{ backgroundColor: "rgba(60,56,52,0.1)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: "rgba(184,134,11,0.2)" }}
              initial={{ width: 0 }}
              animate={{ width: `${(discoveredCount / totalSecrets) * 100}%` }}
              transition={{ duration: 2, ease: "easeOut", delay: 2.5 }}
            />
          </div>
          <p className="font-cormorant text-xs mt-2" style={{ color: "rgba(100,95,88,0.2)" }}>
            {discoveredCount} of {totalSecrets} secrets discovered
          </p>
        </motion.div>
      </div>

      {/* Welcome letter */}
      <OwlLetter isOpen={showLetter} onClose={() => setShowLetter(false)} />
    </div>
  );
}
