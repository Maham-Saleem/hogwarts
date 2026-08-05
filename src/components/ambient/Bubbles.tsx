import { motion } from "framer-motion";

const bubbles = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  x: 20 + Math.random() * 60,
  startY: 80 + Math.random() * 15,
  size: 1 + Math.random() * 2,
  duration: 4 + Math.random() * 3,
  delay: Math.random() * 6,
}));

export function Bubbles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {bubbles.map((b) => (
        <motion.div
          key={b.id}
          className="absolute rounded-full"
          style={{
            left: `${b.x}%`,
            width: b.size,
            height: b.size,
            border: "0.5px solid rgba(100,180,140,0.12)",
            backgroundColor: "rgba(100,180,140,0.03)",
          }}
          initial={{ top: `${b.startY}%`, opacity: 0 }}
          animate={{
            top: [`${b.startY}%`, `${b.startY - 25}%`],
            opacity: [0, 0.12, 0],
            x: [0, -2 + Math.random() * 4],
          }}
          transition={{
            duration: b.duration,
            repeat: Infinity,
            delay: b.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
