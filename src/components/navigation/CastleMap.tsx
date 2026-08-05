import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { rooms } from "@/data/rooms";
import { useDiscovery } from "@/context/DiscoveryContext";

export function CastleMap({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const { isRoomUnlocked } = useDiscovery();
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);

  const handleRoomClick = (roomId: string) => {
    if (!isRoomUnlocked(roomId)) return;
    navigate(`/explore/${roomId}`);
    onClose();
  };

  const roomPositions: Record<string, { x: number; y: number }> = {
    "great-hall": { x: 50, y: 55 },
    library: { x: 75, y: 40 },
    "astronomy-tower": { x: 85, y: 15 },
    "potion-laboratory": { x: 25, y: 65 },
    "forbidden-forest": { x: 15, y: 45 },
    "grand-staircase": { x: 50, y: 35 },
    owlery: { x: 80, y: 25 },
    "secret-chamber": { x: 50, y: 80 },
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />

        <motion.div
          className="relative w-full max-w-4xl aspect-[4/3] bg-surface border border-gold/20 rounded-2xl overflow-hidden shadow-2xl"
          initial={{ scale: 0.8, opacity: 0, rotateX: 10 }}
          animate={{ scale: 1, opacity: 1, rotateX: 0 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
        >
          {/* Parchment texture overlay */}
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Title */}
          <div className="absolute top-4 left-0 right-0 text-center z-10">
            <h2 className="font-heading text-xl md:text-2xl text-gold tracking-[0.3em]">
              CASTLE MAP
            </h2>
            <p className="font-display text-sm text-moonlight/50 mt-1">Select a chamber to explore</p>
          </div>

          {/* Castle outline SVG */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Castle walls */}
            <path
              d="M20 75 L20 30 L30 25 L40 30 L40 20 L50 15 L60 20 L60 30 L70 25 L80 30 L80 75"
              stroke="rgba(212,175,55,0.15)"
              strokeWidth="0.3"
              fill="none"
            />
            {/* Towers */}
            <rect x="18" y="25" width="6" height="8" rx="1" stroke="rgba(212,175,55,0.12)" strokeWidth="0.2" fill="rgba(212,175,55,0.03)" />
            <rect x="76" y="25" width="6" height="8" rx="1" stroke="rgba(212,175,55,0.12)" strokeWidth="0.2" fill="rgba(212,175,55,0.03)" />
            <rect x="47" y="10" width="6" height="10" rx="1" stroke="rgba(212,175,55,0.12)" strokeWidth="0.2" fill="rgba(212,175,55,0.03)" />
            {/* Inner walls */}
            <path
              d="M35 60 L35 40 L50 35 L65 40 L65 60"
              stroke="rgba(212,175,55,0.08)"
              strokeWidth="0.2"
              fill="none"
              strokeDasharray="1 1"
            />
            {/* Connecting paths */}
            {rooms.map((room, i) => {
              if (i === 0) return null;
              const from = roomPositions[rooms[0].id];
              const to = roomPositions[room.id];
              return (
                <line
                  key={`path-${i}`}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke="rgba(212,175,55,0.06)"
                  strokeWidth="0.15"
                  strokeDasharray="0.5 0.5"
                />
              );
            })}
          </svg>

          {/* Room nodes */}
          {rooms.map((room) => {
            const pos = roomPositions[room.id];
            if (!pos) return null;
            const unlocked = isRoomUnlocked(room.id);
            const hovered = hoveredRoom === room.id;

            return (
              <motion.button
                key={room.id}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 group"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                onMouseEnter={() => setHoveredRoom(room.id)}
                onMouseLeave={() => setHoveredRoom(null)}
                onClick={() => handleRoomClick(room.id)}
                disabled={!unlocked}
                whileHover={unlocked ? { scale: 1.15 } : undefined}
                whileTap={unlocked ? { scale: 0.95 } : undefined}
              >
                {/* Pulse ring */}
                {unlocked && (
                  <motion.div
                    className="absolute -inset-4 rounded-full border border-gold/20"
                    animate={hovered ? { scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}

                {/* Node */}
                <div
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    background: unlocked
                      ? "radial-gradient(circle, rgba(212,175,55,0.3), rgba(212,175,55,0.05))"
                      : "radial-gradient(circle, rgba(100,100,100,0.2), rgba(50,50,50,0.05))",
                    border: unlocked ? "1.5px solid rgba(212,175,55,0.5)" : "1.5px solid rgba(100,100,100,0.3)",
                    boxShadow: hovered && unlocked ? "0 0 20px 4px rgba(212,175,55,0.3)" : "none",
                  }}
                >
                  <div
                    className="text-xs md:text-sm"
                    style={{ filter: unlocked ? "none" : "grayscale(1) opacity(0.4)" }}
                  >
                    {unlocked ? "🏰" : "🔒"}
                  </div>
                </div>

                {/* Label */}
                <AnimatePresence>
                  {hovered && (
                    <motion.div
                      className="absolute left-1/2 -translate-x-1/2 top-full mt-2 whitespace-nowrap px-3 py-2 rounded-lg bg-surface/95 border border-gold/20 backdrop-blur-md shadow-lg z-20"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                    >
                      <div className="font-heading text-sm text-gold">{room.name}</div>
                      <div className="font-display text-xs text-moonlight/60 mt-0.5">{room.subtitle}</div>
                      {!unlocked && (
                        <div className="text-xs text-moonlight/40 mt-1">🔒 Locked</div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-surface/80 border border-gold/20 text-moonlight/60 hover:text-gold hover:border-gold/40 transition-colors flex items-center justify-center text-sm"
          >
            ✕
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
