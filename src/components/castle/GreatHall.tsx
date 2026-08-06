import { useState } from "react";
import { motion } from "framer-motion";
import { useDiscovery } from "@/context/DiscoveryContext";
import { useRoomAmbience } from "@/hooks/useRoomAmbience";
import { rooms } from "@/data/rooms";

const greatHall = rooms.find((r) => r.id === "great-hall")!;

const ceilingLights = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: 10 + (i % 6) * 15 + (Math.random() - 0.5) * 6,
  y: 6 + Math.floor(i / 6) * 10 + (Math.random() - 0.5) * 4,
  size: 40 + Math.random() * 50,
  opacity: 0.015 + Math.random() * 0.012,
  flicker: 5 + Math.random() * 5,
  delay: Math.random() * 4,
}));

interface GreatHallProps {
  onNavigate: (roomId: string) => void;
  onOpenMap: () => void;
}

export function GreatHall({ onNavigate }: GreatHallProps) {
  const { isRoomUnlocked } = useDiscovery();
  useRoomAmbience("great-hall");
  const [hoveredDoor, setHoveredDoor] = useState<string | null>(null);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* ===== GREAT HALL INTERIOR ===== */}

      {/* Stone walls */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(180deg, rgba(30,28,26,0.1) 0%, rgba(22,20,18,0.06) 50%, rgba(16,14,12,0.08) 100%)",
      }} />
      <div className="absolute inset-0 texture-stone" />

      {/* ===== VAULTED CEILING — Top 40% of screen ===== */}
      <div className="absolute top-0 left-0 right-0 h-[40vh]">
        {/* Ceiling darkness */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)",
        }} />

        {/* Ribbed vault — stone ribs */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Central spine */}
          <line x1="50" y1="0" x2="50" y2="50" stroke="rgba(55,50,45,0.05)" strokeWidth="0.25" />
          {/* Left ribs */}
          <line x1="10" y1="0" x2="50" y2="50" stroke="rgba(55,50,45,0.035)" strokeWidth="0.2" />
          <line x1="25" y1="0" x2="50" y2="50" stroke="rgba(55,50,45,0.035)" strokeWidth="0.2" />
          <line x1="38" y1="0" x2="50" y2="50" stroke="rgba(55,50,45,0.03)" strokeWidth="0.15" />
          {/* Right ribs */}
          <line x1="90" y1="0" x2="50" y2="50" stroke="rgba(55,50,45,0.035)" strokeWidth="0.2" />
          <line x1="75" y1="0" x2="50" y2="50" stroke="rgba(55,50,45,0.035)" strokeWidth="0.2" />
          <line x1="62" y1="0" x2="50" y2="50" stroke="rgba(55,50,45,0.03)" strokeWidth="0.15" />
          {/* Horizontal ribs */}
          <line x1="0" y1="12" x2="100" y2="12" stroke="rgba(55,50,45,0.02)" strokeWidth="0.15" />
          <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(55,50,45,0.015)" strokeWidth="0.12" />
          <line x1="0" y1="38" x2="100" y2="38" stroke="rgba(55,50,45,0.012)" strokeWidth="0.1" />
        </svg>

        {/* Floating candle glow — warm light points */}
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
              opacity: [light.opacity, light.opacity * 1.5, light.opacity * 0.6, light.opacity * 1.3, light.opacity],
              scale: [1, 1.04, 0.96, 1.02, 1],
            }}
            transition={{
              duration: light.flicker,
              repeat: Infinity,
              delay: light.delay,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Stained glass windows — high on side walls */}
        {[
          { left: "5%", width: "12%", height: "60%", colors: ["rgba(212,175,55,0.035)", "rgba(94,27,36,0.02)"] },
          { left: "20%", width: "9%", height: "50%", colors: ["rgba(94,27,36,0.025)", "rgba(31,58,42,0.015)"] },
          { left: "36%", width: "7%", height: "45%", colors: ["rgba(31,58,42,0.02)", "rgba(212,175,55,0.015)"] },
          { left: "57%", width: "7%", height: "45%", colors: ["rgba(31,58,42,0.02)", "rgba(94,27,36,0.015)"] },
          { left: "71%", width: "9%", height: "50%", colors: ["rgba(94,27,36,0.025)", "rgba(212,175,55,0.015)"] },
          { left: "83%", width: "12%", height: "60%", colors: ["rgba(212,175,55,0.035)", "rgba(94,27,36,0.02)"] },
        ].map((win, i) => (
          <motion.div
            key={i}
            className="absolute top-[3%] pointer-events-none"
            style={{
              left: win.left,
              width: win.width,
              height: win.height,
              background: `linear-gradient(180deg, ${win.colors[0]}, ${win.colors[1]}, transparent)`,
              clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
            }}
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 12 + i * 2, repeat: Infinity, ease: "easeInOut", delay: i * 2 }}
          />
        ))}
      </div>

      {/* ===== HALL CONTENT — Center of screen ===== */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6">
        {/* Title — engraved in stone */}
        <motion.div
          className="text-center mb-3"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2.5, ease: "easeOut" }}
        >
          <h1 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 tracking-wide text-engraved">
            The Great Hall
          </h1>
          <p className="font-cormorant text-sm sm:text-base italic" style={{ color: "rgba(160,150,130,0.2)" }}>
            Where all journeys begin
          </p>
        </motion.div>

        {/* ===== LONG DINING TABLES ===== */}
        <motion.div
          className="relative w-full max-w-3xl mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 2 }}
        >
          <div className="relative h-[50px] sm:h-[65px]">
            {/* Table 1 — nearest */}
            <div className="absolute left-[8%] right-[8%] h-[3px] top-[25%] rounded-full" style={{
              background: "linear-gradient(90deg, transparent 5%, rgba(61,43,31,0.18) 20%, rgba(61,43,31,0.22) 50%, rgba(61,43,31,0.18) 80%, transparent 95%)",
            }} />
            {/* Table 2 — further */}
            <div className="absolute left-[14%] right-[14%] h-[2px] top-[60%] rounded-full" style={{
              background: "linear-gradient(90deg, transparent 10%, rgba(61,43,31,0.12) 25%, rgba(61,43,31,0.16) 50%, rgba(61,43,31,0.12) 75%, transparent 90%)",
            }} />
            {/* Candle glow on tables */}
            {[22, 38, 54, 70].map((x, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full pointer-events-none"
                style={{
                  left: `${x}%`,
                  top: "20%",
                  width: 25,
                  height: 15,
                  transform: "translate(-50%, -50%)",
                  background: "radial-gradient(ellipse, rgba(255,213,79,0.025), transparent 70%)",
                }}
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.7 }}
              />
            ))}
          </div>
        </motion.div>

        {/* ===== DOORWAYS — Gothic arches ===== */}
        <motion.div
          className="relative w-full max-w-2xl"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 2 }}
        >
          <div className="flex justify-center gap-8 sm:gap-12">
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
                  onClick={() => !isLocked && onNavigate(conn.target)}
                  whileHover={isLocked ? {} : { y: -2 }}
                  whileTap={isLocked ? {} : { scale: 0.98 }}
                >
                  {/* Gothic arch doorway */}
                  <div className="relative mx-auto" style={{ width: 55, height: 100 }}>
                    {/* Outer arch */}
                    <div
                      className="absolute inset-0 transition-all duration-1000"
                      style={{
                        borderRadius: "27px 27px 0 0",
                        border: `1.5px solid ${isLocked ? "rgba(55,50,45,0.05)" : isHovered ? "rgba(80,75,68,0.15)" : "rgba(55,50,45,0.08)"}`,
                        background: isLocked
                          ? "rgba(8,7,6,0.25)"
                          : isHovered
                            ? "linear-gradient(180deg, rgba(35,32,30,0.08), rgba(8,7,6,0.18))"
                            : "linear-gradient(180deg, rgba(25,23,21,0.06), rgba(8,7,6,0.12))",
                      }}
                    />
                    {/* Inner depth */}
                    <div
                      className="absolute top-[6px] left-[5px] right-[5px] bottom-0 transition-all duration-1000"
                      style={{
                        borderRadius: "22px 22px 0 0",
                        background: isLocked
                          ? "rgba(5,4,4,0.15)"
                          : isHovered
                            ? "rgba(5,4,4,0.2)"
                            : "rgba(5,4,4,0.1)",
                      }}
                    />
                    {/* Light spill at threshold */}
                    {!isLocked && isHovered && (
                      <motion.div
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[150%] h-6 rounded-full blur-lg pointer-events-none"
                        style={{ backgroundColor: "rgba(255,213,79,0.035)" }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                      />
                    )}
                    {/* Lock indicator */}
                    {isLocked && (
                      <div className="absolute bottom-[12%] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" style={{ backgroundColor: "rgba(55,50,45,0.1)" }} />
                    )}
                  </div>

                  {/* Label */}
                  <motion.div
                    className="mt-1.5 text-center"
                    animate={{ opacity: isHovered ? 0.85 : 0.35 }}
                    transition={{ duration: 0.8 }}
                  >
                    <span
                      className="font-cinzel text-[8px] sm:text-[9px] tracking-[0.15em]"
                      style={{ color: isLocked ? "rgba(80,75,68,0.12)" : isHovered ? "rgba(184,134,11,0.4)" : "rgba(140,130,115,0.2)" }}
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

      {/* ===== FLOOR ===== */}
      <div className="absolute bottom-0 left-0 right-0 h-[12vh]" style={{
        background: "linear-gradient(180deg, transparent, rgba(20,18,16,0.15))",
      }} />
    </div>
  );
}
