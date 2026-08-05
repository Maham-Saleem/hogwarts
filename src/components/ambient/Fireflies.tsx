import { motion } from "framer-motion";

const fireflies = Array.from({ length: 5 }, (_, i) => ({
  id: i,
  x: 20 + Math.random() * 60,
  y: 30 + Math.random() * 50,
  size: 2 + Math.random() * 1.5,
  driftX: -15 + Math.random() * 30,
  driftY: -10 + Math.random() * 20,
  duration: 12 + Math.random() * 10,
  delay: Math.random() * 8,
}));

export function Fireflies() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {fireflies.map((f) => (
        <motion.div
          key={f.id}
          className="absolute rounded-full"
          style={{
            left: `${f.x}%`,
            top: `${f.y}%`,
            width: f.size,
            height: f.size,
            backgroundColor: "rgba(200,210,150,0.25)",
            boxShadow: "0 0 4px rgba(200,210,150,0.15)",
          }}
          animate={{
            x: [0, f.driftX, -f.driftX / 2, f.driftX / 3, 0],
            y: [0, f.driftY, -f.driftY / 2, f.driftY / 3, 0],
            opacity: [0, 0.25, 0.1, 0.3, 0],
          }}
          transition={{
            duration: f.duration,
            repeat: Infinity,
            delay: f.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
