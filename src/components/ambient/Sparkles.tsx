import { motion } from "framer-motion";

const catchers = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  x: 10 + Math.random() * 80,
  y: 10 + Math.random() * 80,
  size: 1 + Math.random(),
  duration: 6 + Math.random() * 6,
  delay: Math.random() * 10,
}));

export function Sparkles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {catchers.map((c) => (
        <motion.div
          key={c.id}
          className="absolute rounded-full"
          style={{
            left: `${c.x}%`,
            top: `${c.y}%`,
            width: c.size,
            height: c.size,
            backgroundColor: "rgba(212,195,160,0.2)",
          }}
          animate={{
            opacity: [0, 0.2, 0],
          }}
          transition={{
            duration: c.duration,
            repeat: Infinity,
            delay: c.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
