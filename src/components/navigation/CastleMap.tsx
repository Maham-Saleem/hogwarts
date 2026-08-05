import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { rooms } from "@/data/rooms";
import { useDiscovery } from "@/context/DiscoveryContext";

const POSITIONS: Record<string, { x: number; y: number }> = {
  "entrance-hall": { x: 50, y: 75 },
  "great-hall": { x: 50, y: 55 },
  "library": { x: 78, y: 42 },
  "grand-staircase": { x: 50, y: 38 },
  "astronomy-tower": { x: 85, y: 15 },
  "potion-laboratory": { x: 22, y: 65 },
  "greenhouses": { x: 15, y: 50 },
  "owl-tower": { x: 82, y: 25 },
  "forbidden-forest": { x: 12, y: 35 },
  "common-room": { x: 65, y: 60 },
  "courtyard": { x: 35, y: 48 },
  "headmasters-office": { x: 50, y: 20 },
  "secret-chamber": { x: 50, y: 88 },
};

export function CastleMap({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const { isRoomUnlocked } = useDiscovery();
  const [hovered, setHovered] = useState<string | null>(null);

  const handleNavigate = (id: string) => {
    if (!isRoomUnlocked(id as never)) return;
    navigate(`/explore/${id}`);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <div className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={onClose} />
        <motion.div className="relative w-full max-w-4xl aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl"
          style={{ background: "linear-gradient(135deg, rgba(21,24,31,0.95), rgba(9,11,16,0.98))", border: "1px solid rgba(212,175,55,0.15)" }}
          initial={{ scale: 0.8, opacity: 0, rotateX: 8 }} animate={{ scale: 1, opacity: 1, rotateX: 0 }}
          exit={{ scale: 0.8, opacity: 0 }} transition={{ type: "spring", damping: 25 }}>
          {/* Parchment texture */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E")`,
          }} />
          {/* Title */}
          <div className="absolute top-4 left-0 right-0 text-center z-10">
            <h2 className="font-heading text-xl md:text-2xl text-gold tracking-[0.25em]">CASTLE MAP</h2>
            <p className="font-display text-xs text-moonlight/40 mt-1">Select a chamber to explore</p>
          </div>
          {/* SVG castle outline */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" fill="none">
            <path d="M18 80 L18 32 L28 27 L38 32 L38 22 L50 16 L62 22 L62 32 L72 27 L82 32 L82 80" stroke="rgba(212,175,55,0.1)" strokeWidth="0.3" fill="none" />
            <rect x="16" y="28" width="5" height="7" rx="1" stroke="rgba(212,175,55,0.08)" strokeWidth="0.2" fill="rgba(212,175,55,0.02)" />
            <rect x="79" y="28" width="5" height="7" rx="1" stroke="rgba(212,175,55,0.08)" strokeWidth="0.2" fill="rgba(212,175,55,0.02)" />
            <rect x="47" y="12" width="6" height="10" rx="1" stroke="rgba(212,175,55,0.08)" strokeWidth="0.2" fill="rgba(212,175,55,0.02)" />
            {rooms.map((room, i) => {
              if (i === 0) return null;
              const from = POSITIONS[rooms[0].id];
              const to = POSITIONS[room.id];
              if (!from || !to) return null;
              return <line key={`p-${i}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="rgba(212,175,55,0.05)" strokeWidth="0.15" strokeDasharray="0.5 0.5" />;
            })}
          </svg>
          {/* Room nodes */}
          {rooms.map((room) => {
            const pos = POSITIONS[room.id];
            if (!pos) return null;
            const unlocked = isRoomUnlocked(room.id);
            const isHovered = hovered === room.id;
            return (
              <motion.button key={room.id} className="absolute z-10 -translate-x-1/2 -translate-y-1/2 group"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                onMouseEnter={() => setHovered(room.id)} onMouseLeave={() => setHovered(null)}
                onClick={() => handleNavigate(room.id)} disabled={!unlocked}
                whileHover={unlocked ? { scale: 1.15 } : undefined} whileTap={unlocked ? { scale: 0.95 } : undefined}>
                {unlocked && isHovered && (
                  <motion.div className="absolute -inset-5 rounded-full border border-gold/20"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }} />
                )}
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    background: unlocked ? `radial-gradient(circle, ${room.colors.glow}, ${room.colors.ambient})` : "radial-gradient(circle, rgba(80,80,80,0.15), rgba(40,40,40,0.05))",
                    border: `1.5px solid ${unlocked ? room.colors.primary + "60" : "rgba(80,80,80,0.25)"}`,
                    boxShadow: isHovered && unlocked ? `0 0 20px 4px ${room.colors.glow}` : "none",
                  }}>
                  <span className="text-xs md:text-sm" style={{ filter: unlocked ? "none" : "grayscale(1) opacity(0.3)" }}>
                    {unlocked ? room.icon : "🔒"}
                  </span>
                </div>
                <AnimatePresence>
                  {isHovered && (
                    <motion.div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 whitespace-nowrap px-3 py-2 rounded-lg bg-surface/95 border border-gold/15 backdrop-blur-md shadow-lg z-20"
                      initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
                      <div className="font-heading text-xs text-gold">{room.name}</div>
                      <div className="font-display text-[10px] text-moonlight/50 mt-0.5">{room.subtitle}</div>
                      {!unlocked && <div className="text-[10px] text-moonlight/30 mt-1">🔒 Locked</div>}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
          <button onClick={onClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-surface/80 border border-gold/15 text-moonlight/50 hover:text-gold hover:border-gold/30 transition-colors flex items-center justify-center text-sm">✕</button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
