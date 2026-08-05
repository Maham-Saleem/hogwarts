import { motion } from "framer-motion";

const glowPoints = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  x: 15 + Math.random() * 70,
  y: 5 + Math.random() * 25,
  size: 60 + Math.random() * 80,
  opacity: 0.02 + Math.random() * 0.02,
  flickerDuration: 5 + Math.random() * 4,
  flickerDelay: Math.random() * 3,
}));

export function FloatingCandles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {glowPoints.map((g) => (
        <motion.div
          key={g.id}
          className="absolute rounded-full"
          style={{
            left: `${g.x}%`,
            top: `${g.y}%`,
            width: g.size,
            height: g.size,
            background: `radial-gradient(circle, rgba(255,213,79,${g.opacity}), transparent 70%)`,
            transform: "translate(-50%, -50%)",
          }}
          animate={{
            opacity: [g.opacity, g.opacity * 1.3, g.opacity * 0.8, g.opacity * 1.1, g.opacity],
            scale: [1, 1.02, 0.98, 1.01, 1],
          }}
          transition={{
            duration: g.flickerDuration,
            repeat: Infinity,
            delay: g.flickerDelay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
