import { motion } from "framer-motion";

const streaks = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  length: 8 + Math.random() * 12,
  opacity: 0.06 + Math.random() * 0.06,
  duration: 1.8 + Math.random() * 1.2,
  delay: Math.random() * 4,
}));

export function Rain() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {streaks.map((s) => (
        <motion.div
          key={s.id}
          className="absolute"
          style={{
            left: `${s.x}%`,
            width: 1,
            height: s.length,
            background: `linear-gradient(180deg, transparent, rgba(160,168,176,${s.opacity}), transparent)`,
          }}
          initial={{ top: "-3%", opacity: 0 }}
          animate={{
            top: "103%",
            opacity: [0, s.opacity, s.opacity, 0],
          }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            delay: s.delay,
            ease: "linear",
          }}
        />
      ))}
      {/* Wet window glow */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(138,154,170,0.015), transparent 70%)",
        }}
      />
    </div>
  );
}
