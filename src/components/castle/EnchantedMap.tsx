import { useState } from "react";
import { motion } from "framer-motion";
import { useDiscovery } from "@/context/DiscoveryContext";
import { rooms } from "@/data/rooms";
import type { RoomId } from "@/types";

const roomNodes: Record<string, { x: number; y: number }> = {
  "great-hall":         { x: 50, y: 45 },
  "library":            { x: 26, y: 38 },
  "grand-staircase":    { x: 50, y: 28 },
  "courtyard":          { x: 74, y: 38 },
  "astronomy-tower":    { x: 50, y: 14 },
  "headmasters-office": { x: 30, y: 16 },
  "common-room":        { x: 38, y: 58 },
  "potion-laboratory":  { x: 22, y: 58 },
  "greenhouses":        { x: 78, y: 58 },
  "forbidden-forest":   { x: 88, y: 45 },
  "owlery":             { x: 65, y: 14 },
  "room-of-requirement":{ x: 12, y: 45 },
  "secret-chamber":     { x: 12, y: 62 },
};

interface EnchantedMapProps {
  onSelectRoom: (roomId: string) => void;
  onClose: () => void;
}

export function EnchantedMap({ onSelectRoom, onClose }: EnchantedMapProps) {
  const { isRoomUnlocked } = useDiscovery();
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
    <div className="relative min-h-screen w-full overflow-hidden" style={{ backgroundColor: "#0E0D0B" }}>
      {/* Parchment texture background */}
      <div className="absolute inset-0 opacity-[0.025]" style={{
        backgroundImage: `
          repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(139,105,20,0.1) 3px, rgba(139,105,20,0.1) 4px),
          repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(139,105,20,0.05) 4px, rgba(139,105,20,0.05) 5px)
        `,
      }} />

      {/* Warm glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none" style={{
        background: "radial-gradient(circle, rgba(212,175,55,0.015), transparent 60%)",
      }} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-8 pb-16">
        {/* Header */}
        <motion.div
          className="text-center mb-6 relative"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          <button
            onClick={onClose}
            className="absolute right-0 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-sm cursor-pointer transition-all duration-500"
            style={{
              background: "linear-gradient(135deg, rgba(25,23,21,0.15), rgba(18,16,14,0.2))",
              border: "1px solid rgba(55,50,45,0.08)",
            }}
          >
            <span className="font-cinzel text-[9px] tracking-wider text-engraved">Close</span>
          </button>
          <h1 className="font-cinzel text-xl sm:text-2xl font-bold tracking-wide text-engraved">
            Marauder's Map
          </h1>
          <p className="font-cormorant text-xs italic" style={{ color: "rgba(140,130,115,0.2)" }}>
            Tap a room to explore
          </p>
        </motion.div>

        {/* Map */}
        <motion.div
          className="relative mx-auto max-w-xl aspect-square rounded-sm overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(20,18,16,0.4), rgba(14,13,11,0.5))",
            border: "1px solid rgba(55,50,45,0.06)",
            boxShadow: "inset 0 0 40px rgba(0,0,0,0.2)",
          }}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
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
                  x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                  stroke={conn.unlocked ? "rgba(184,134,11,0.08)" : "rgba(80,75,68,0.03)"}
                  strokeWidth={0.25}
                  strokeDasharray={conn.unlocked ? "none" : "1,1"}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: 0.5 + i * 0.08 }}
                />
              );
            })}
          </svg>

          {/* Room nodes */}
          {rooms.map((room) => {
            const pos = roomNodes[room.id];
            if (!pos) return null;
            const unlocked = isRoomUnlocked(room.id);
            const isHovered = hoveredRoom === room.id;

            return (
              <motion.button
                key={room.id}
                className="absolute z-20 cursor-pointer"
                style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%, -50%)" }}
                onMouseEnter={() => setHoveredRoom(room.id)}
                onMouseLeave={() => setHoveredRoom(null)}
                onClick={() => unlocked && onSelectRoom(room.id)}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.8 + Math.random() * 0.5 }}
                whileHover={unlocked ? { scale: 1.15 } : {}}
                whileTap={unlocked ? { scale: 0.95 } : {}}
              >
                {/* Node circle */}
                <div
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-700"
                  style={{
                    border: `1px solid ${unlocked ? (isHovered ? "rgba(184,134,11,0.3)" : "rgba(184,134,11,0.12)") : "rgba(55,50,45,0.06)"}`,
                    background: unlocked
                      ? isHovered
                        ? "rgba(184,134,11,0.08)"
                        : "rgba(184,134,11,0.03)"
                      : "rgba(20,18,16,0.2)",
                  }}
                >
                  {unlocked ? (
                    <span className="text-xs">{room.icon}</span>
                  ) : (
                    <div className="w-1 h-1 rounded-full" style={{ backgroundColor: "rgba(55,50,45,0.1)" }} />
                  )}
                </div>

                {/* Label */}
                <motion.div
                  className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none"
                  animate={{ opacity: isHovered ? 0.85 : 0.3 }}
                  transition={{ duration: 0.4 }}
                >
                  <span className="font-cinzel text-[7px] sm:text-[8px] tracking-wider" style={{
                    color: unlocked ? (isHovered ? "rgba(184,134,11,0.5)" : "rgba(140,130,115,0.3)") : "rgba(80,75,68,0.15)",
                  }}>
                    {room.name}
                  </span>
                </motion.div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Legend */}
        <motion.div
          className="flex justify-center gap-6 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ border: "1px solid rgba(184,134,11,0.12)", backgroundColor: "rgba(184,134,11,0.03)" }} />
            <span className="font-cormorant text-[9px]" style={{ color: "rgba(100,95,88,0.2)" }}>Unlocked</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ border: "1px solid rgba(55,50,45,0.06)", backgroundColor: "rgba(20,18,16,0.2)" }} />
            <span className="font-cormorant text-[9px]" style={{ color: "rgba(100,95,88,0.2)" }}>Locked</span>
          </div>
        </motion.div>

        {/* Hovered room info */}
        {hoveredRoom && (
          <motion.div
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-sm"
            style={{
              background: "linear-gradient(135deg, rgba(25,23,21,0.92), rgba(16,14,12,0.96))",
              border: "1px solid rgba(55,50,45,0.1)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base">{hoveredRoomData?.icon}</span>
              <div>
                <p className="font-cinzel text-xs text-engraved">{hoveredRoomData?.name}</p>
                <p className="font-cormorant text-[10px] italic" style={{ color: "rgba(140,130,115,0.25)" }}>
                  {hoveredRoomData?.subtitle}
                </p>
              </div>
            </div>
            {!isRoomUnlocked(hoveredRoom as RoomId) && (
              <p className="font-cormorant text-[10px] mt-1 italic" style={{ color: "rgba(184,134,11,0.2)" }}>
                {hoveredRoomData?.unlockRequires}
              </p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
