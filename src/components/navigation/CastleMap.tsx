import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDiscovery } from "@/context/DiscoveryContext";
import { rooms } from "@/data/rooms";
import type { RoomId } from "@/types";

const roomNodes: Record<string, { x: number; y: number }> = {
  "great-hall":         { x: 50, y: 42 },
  "library":            { x: 26, y: 35 },
  "grand-staircase":    { x: 50, y: 28 },
  "courtyard":          { x: 74, y: 35 },
  "astronomy-tower":    { x: 50, y: 14 },
  "headmasters-office": { x: 30, y: 16 },
  "common-room":        { x: 38, y: 55 },
  "potion-laboratory":  { x: 22, y: 55 },
  "greenhouses":        { x: 78, y: 55 },
  "forbidden-forest":   { x: 88, y: 42 },
  "owlery":             { x: 65, y: 14 },
  "room-of-requirement":{ x: 12, y: 42 },
  "secret-chamber":     { x: 12, y: 58 },
};

export default function CastleMap({ onClose }: { onClose?: () => void } = {}) {
  const navigate = useNavigate();
  const { isRoomUnlocked, visitedRooms } = useDiscovery();
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);

  const connections = rooms.flatMap((room) =>
    room.connections.map((conn) => ({
      from: room.id,
      to: conn.target,
      unlocked: isRoomUnlocked(room.id) && isRoomUnlocked(conn.target),
    }))
  );

  const hoveredRoomData = hoveredRoom ? rooms.find((r) => r.id === hoveredRoom) : null;

  return (
    <div className={`relative w-full overflow-hidden ${onClose ? 'min-h-screen' : 'min-h-screen'}`}>
      {/* Backdrop when used as modal */}
      {onClose && (
        <motion.div
          className="fixed inset-0 bg-abyss/90 backdrop-blur-sm z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
      )}
      <div className={`relative z-50 w-full ${onClose ? 'min-h-screen' : 'min-h-screen'} bg-[#090B10]`}>
      {/* Parchment background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
      </div>

      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gold/[0.02] blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-32">
        {/* Header */}
        <motion.div
          className="text-center mb-8 relative"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {onClose && (
            <button
              onClick={onClose}
              className="absolute right-0 top-1/2 -translate-y-1/2 px-3 py-1 rounded border border-gold/15 bg-gold/5 hover:bg-gold/10 transition-all cursor-pointer"
            >
              <span className="font-cinzel text-xs text-gold/60">Close</span>
            </button>
          )}
          <h1 className="font-cinzel text-2xl sm:text-3xl text-gold font-bold mb-2 tracking-wide">
            Marauder's Map
          </h1>
          <p className="font-cormorant text-sm text-moonlight/40 italic">
            Tap a room to explore
          </p>
        </motion.div>

        {/* Map container */}
        <motion.div
          className="relative mx-auto max-w-2xl aspect-square rounded-xl border border-gold/10 overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(9,11,16,0.95), rgba(18,21,30,0.9))" }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* SVG connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            {connections.map((conn, i) => {
              const from = roomNodes[conn.from];
              const to = roomNodes[conn.to];
              if (!from || !to) return null;
              return (
                <motion.line
                  key={`${conn.from}-${conn.to}`}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={conn.unlocked ? "rgba(212,175,55,0.12)" : "rgba(201,205,211,0.04)"}
                  strokeWidth={0.3}
                  strokeDasharray={conn.unlocked ? "none" : "1,1"}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.5 + i * 0.1 }}
                />
              );
            })}
          </svg>

          {/* Room nodes */}
          {rooms.map((room) => {
            const pos = roomNodes[room.id];
            if (!pos) return null;
            const unlocked = isRoomUnlocked(room.id);
            const visited = visitedRooms.includes(room.id);
            const isHovered = hoveredRoom === room.id;

            return (
              <motion.button
                key={room.id}
                className="absolute z-20 cursor-pointer group"
                style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%, -50%)" }}
                onMouseEnter={() => setHoveredRoom(room.id)}
                onMouseLeave={() => setHoveredRoom(null)}
                onClick={() => unlocked && navigate(`/room/${room.id}`)}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 + Math.random() * 0.5 }}
                whileHover={unlocked ? { scale: 1.2 } : {}}
                whileTap={unlocked ? { scale: 0.95 } : {}}
              >
                {/* Glow ring */}
                {unlocked && visited && (
                  <motion.div
                    className="absolute inset-[-6px] rounded-full"
                    style={{ border: `1px solid rgba(212,175,55,${isHovered ? 0.3 : 0.1})` }}
                    animate={isHovered ? { scale: [1, 1.3, 1], opacity: [0.2, 0, 0.2] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}

                {/* Node */}
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    unlocked
                      ? isHovered
                        ? "border-gold/50 bg-gold/15"
                        : visited
                          ? "border-gold/25 bg-gold/8"
                          : "border-gold/15 bg-gold/5"
                      : "border-moonlight/8 bg-moonlight/[0.02]"
                  } border`}
                >
                  {unlocked ? (
                    <span className="text-sm sm:text-base">{room.icon}</span>
                  ) : (
                    <span className="text-[10px] text-moonlight/15">🔒</span>
                  )}
                </div>

                {/* Label */}
                <motion.div
                  className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none"
                  animate={{ opacity: isHovered ? 1 : 0.4 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className={`font-cinzel text-[8px] sm:text-[9px] tracking-wider ${
                    unlocked ? (isHovered ? "text-gold" : "text-gold/50") : "text-moonlight/20"
                  }`}>
                    {room.name}
                  </span>
                </motion.div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Legend */}
        <motion.div
          className="flex justify-center gap-6 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border border-gold/25 bg-gold/8" />
            <span className="font-cormorant text-xs text-moonlight/30">Unlocked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border border-moonlight/8 bg-moonlight/[0.02]" />
            <span className="font-cormorant text-xs text-moonlight/30">Locked</span>
          </div>
        </motion.div>

        {/* Room info panel */}
        <AnimatePresence>
          {hoveredRoom && (
            <motion.div
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-lg border border-gold/15 bg-abyss/95 backdrop-blur-md max-w-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">{hoveredRoomData?.icon}</span>
                <div>
                  <p className="font-cinzel text-sm text-gold">
                    {hoveredRoomData?.name}
                  </p>
                  <p className="font-cormorant text-xs text-moonlight/40 italic">
                    {hoveredRoomData?.subtitle}
                  </p>
                </div>
              </div>
              {hoveredRoom && isRoomUnlocked(hoveredRoom as RoomId) ? (
                <p className="font-cormorant text-xs text-moonlight/50">
                  {hoveredRoomData?.connections.length} passages connect here
                </p>
              ) : (
                <p className="font-cormorant text-xs text-gold/40 italic">
                  {hoveredRoomData?.unlockRequires}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </div>
    </div>
  );
}
