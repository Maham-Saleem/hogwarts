import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDiscovery } from "@/context/DiscoveryContext";
import { rooms } from "@/data/rooms";
import { OwlLetter } from "@/components/ui/OwlLetter";
import type { RoomId } from "@/types";

const hubConnections = rooms.find((r) => r.id === "great-hall")!.connections;

const doorways = [
  { x: 50, y: 55, connection: hubConnections[0], label: "To the Library", icon: "📚" },
  { x: 25, y: 55, connection: hubConnections[1], label: "To the Grand Staircase", icon: "🪜" },
  { x: 75, y: 55, connection: hubConnections[2], label: "To the Courtyard", icon: "⛲" },
];

const floatingCandles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: 8 + Math.random() * 84,
  y: 8 + Math.random() * 35,
  size: 6 + Math.random() * 10,
  delay: Math.random() * 8,
  duration: 4 + Math.random() * 3,
}));

const sparkles = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  delay: Math.random() * 10,
}));

export default function Hub() {
  const navigate = useNavigate();
  const { isRoomUnlocked, discoveredCount, totalSecrets, visitedRooms } = useDiscovery();
  const [hoveredDoor, setHoveredDoor] = useState<string | null>(null);
  const [showLetter, setShowLetter] = useState(true);
  const [transitionTarget, setTransitionTarget] = useState<string | null>(null);

  useEffect(() => {
    rooms.forEach((r) => {
      if (!r.starter) {
        const deps = rooms.filter((other) =>
          other.connections.some((c) => c.target === r.id && other.starter)
        );
        if (deps.length === 0) return;
      }
    });
  }, []);

  const handleNavigate = (targetId: string) => {
    const room = rooms.find((r) => r.id === targetId);
    if (!room) return;
    if (!isRoomUnlocked(targetId as RoomId)) {
      setTransitionTarget(targetId);
      setTimeout(() => setTransitionTarget(null), 2000);
      return;
    }
    setTransitionTarget(targetId);
    setTimeout(() => {
      navigate(`/room/${targetId}`);
    }, 800);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#090B10] overflow-hidden font-body">
      {/* Stained glass background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#090B10] via-[#12151e] to-[#090B10]" />
        <div
          className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full opacity-[0.04] blur-[120px]"
          style={{ background: "radial-gradient(circle, #5E1B24, transparent)" }}
        />
        <div
          className="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full opacity-[0.04] blur-[120px]"
          style={{ background: "radial-gradient(circle, #4A9EFF, transparent)" }}
        />
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-[0.06] blur-[100px]"
          style={{ background: "radial-gradient(circle, #D4AF37, transparent)" }}
        />
      </div>

      {/* Floating candles */}
      {floatingCandles.map((candle) => (
        <motion.div
          key={candle.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${candle.x}%`,
            top: `${candle.y}%`,
            width: candle.size,
            height: candle.size + 2,
            background: "radial-gradient(ellipse at bottom, #FFD54F 0%, #FF8F00 40%, rgba(255,143,0,0) 70%)",
          }}
          animate={{
            y: [-4, 4, -4],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: candle.duration,
            repeat: Infinity,
            delay: candle.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Sparkles */}
      {sparkles.map((s) => (
        <motion.div
          key={s.id}
          className="absolute w-[2px] h-[2px] rounded-full bg-gold pointer-events-none"
          style={{ left: `${s.x}%`, top: `${s.y}%` }}
          animate={{ opacity: [0, 0.6, 0], scale: [0, 1, 0] }}
          transition={{ duration: 3 + Math.random() * 3, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-32">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <h1 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl text-gold font-bold mb-2 tracking-wide">
            The Great Hall
          </h1>
          <p className="font-cormorant text-lg sm:text-xl text-moonlight/60 italic">
            Where all journeys begin
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="flex justify-center gap-8 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="text-center">
            <div className="font-cinzel text-2xl text-gold font-bold">{visitedRooms.length}</div>
            <div className="font-cormorant text-sm text-moonlight/50">Rooms Visited</div>
          </div>
          <div className="text-center">
            <div className="font-cinzel text-2xl text-gold font-bold">{discoveredCount}</div>
            <div className="font-cormorant text-sm text-moonlight/50">Secrets Found</div>
          </div>
        </motion.div>

        {/* Main hall scene */}
        <motion.div
          className="relative mx-auto max-w-4xl aspect-[16/9] rounded-xl overflow-hidden border border-gold/10"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          style={{ background: "linear-gradient(180deg, rgba(18,21,30,0.8) 0%, rgba(42,29,20,0.3) 50%, rgba(9,11,16,0.9) 100%)" }}
        >
          {/* Ceiling */}
          <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-[#090B10] to-transparent z-10" />

          {/* Stained glass windows */}
          {[20, 40, 60, 80].map((x, i) => (
            <motion.div
              key={i}
              className="absolute top-[5%] w-[40px] h-[80px] rounded-t-full overflow-hidden opacity-20"
              style={{
                left: `${x}%`,
                background: `linear-gradient(180deg, ${["#5E1B24", "#1F5033", "#4A9EFF", "#D4AF37"][i]} 0%, transparent 100%)`,
              }}
              animate={{ opacity: [0.15, 0.25, 0.15] }}
              transition={{ duration: 4, repeat: Infinity, delay: i * 0.8 }}
            />
          ))}

          {/* House tables (subtle) */}
          <div className="absolute bottom-[30%] left-[10%] right-[10%] h-[2px] bg-gold/5 rounded-full" />
          <div className="absolute bottom-[38%] left-[15%] right-[15%] h-[2px] bg-gold/5 rounded-full" />

          {/* Doorways */}
          {doorways.map((door) => {
            const isLocked = !isRoomUnlocked(door.connection.target);
            const isHovered = hoveredDoor === door.label;
            return (
              <motion.button
                key={door.label}
                className="absolute group cursor-pointer"
                style={{ left: `${door.x}%`, top: `${door.y}%`, transform: "translate(-50%, -50%)" }}
                onMouseEnter={() => setHoveredDoor(door.label)}
                onMouseLeave={() => setHoveredDoor(null)}
                onClick={() => handleNavigate(door.connection.target)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                {/* Door frame */}
                <div className={`relative w-16 h-24 sm:w-20 sm:h-28 rounded-t-lg border transition-all duration-700 ${
                  isLocked ? "border-moonlight/5" : isHovered ? "border-gold/30" : "border-gold/10"
                }`}
                  style={{
                    background: isLocked
                      ? "linear-gradient(180deg, rgba(9,11,16,0.6) 0%, rgba(9,11,16,0.8) 100%)"
                      : isHovered
                        ? "linear-gradient(180deg, rgba(42,29,20,0.3) 0%, rgba(9,11,16,0.4) 100%)"
                        : "linear-gradient(180deg, rgba(42,29,20,0.15) 0%, rgba(9,11,16,0.25) 100%)",
                  }}
                >
                  {/* Inner glow */}
                  {!isLocked && (
                    <motion.div
                      className="absolute inset-[2px] rounded-t-[5px] overflow-hidden"
                      style={{
                        background: isHovered
                          ? "radial-gradient(ellipse at center, rgba(212,175,55,0.08) 0%, transparent 70%)"
                          : "radial-gradient(ellipse at center, rgba(212,175,55,0.02) 0%, transparent 70%)",
                      }}
                      animate={isHovered ? { opacity: [0.5, 1, 0.5] } : { opacity: 1 }}
                      transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
                    />
                  )}

                  {/* Lock icon */}
                  {isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-moonlight/20 text-lg">🔒</span>
                    </div>
                  )}

                  {/* Light spill when hovered */}
                  {!isLocked && isHovered && (
                    <motion.div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-8 rounded-full blur-xl"
                      style={{ background: "rgba(212,175,55,0.12)" }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                  )}
                </div>

                {/* Label */}
                <motion.div
                  className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap"
                  animate={{ opacity: isHovered ? 1 : 0.5, y: isHovered ? 0 : 3 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className={`font-cinzel text-xs tracking-wider ${isLocked ? "text-moonlight/30" : "text-gold/70"}`}>
                    {isLocked ? "🔒 " : ""}{door.label}
                  </span>
                </motion.div>
              </motion.button>
            );
          })}

          {/* Ambient floor gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-[#090B10] to-transparent z-10 pointer-events-none" />
        </motion.div>

        {/* Room unlock notification */}
        <AnimatePresence>
          {transitionTarget && !isRoomUnlocked(transitionTarget as RoomId) && (
            <motion.div
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-lg border border-gold/20 bg-abyss/90 backdrop-blur-md"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <p className="font-cormorant text-moonlight/70 text-sm text-center">
                🔒 This room is locked. Discover secrets to unlock it.
              </p>
              <p className="font-cormorant text-gold/60 text-xs text-center mt-1 italic">
                {rooms.find((r) => r.id === transitionTarget)?.unlockRequires}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Discovery progress */}
        <motion.div
          className="max-w-md mx-auto mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="w-full h-1 rounded-full bg-gold/5 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gold/30"
              initial={{ width: 0 }}
              animate={{ width: `${(discoveredCount / totalSecrets) * 100}%` }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 2 }}
            />
          </div>
          <p className="font-cormorant text-xs text-moonlight/30 mt-2">
            {discoveredCount} of {totalSecrets} secrets discovered
          </p>
        </motion.div>
      </div>

      {/* Welcome letter */}
      <OwlLetter isOpen={showLetter} onClose={() => setShowLetter(false)} />
    </div>
  );
}
