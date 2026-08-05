import { motion } from "framer-motion";

const wisps = Array.from({ length: 4 }, (_, i) => ({
  id: i,
  x: 35 + Math.random() * 30,
  startY: 60 + Math.random() * 20,
  size: 40 + Math.random() * 30,
  duration: 10 + Math.random() * 8,
  delay: Math.random() * 6,
}));

export function Smoke() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {wisps.map((w) => (
        <motion.div
          key={w.id}
          className="absolute rounded-full"
          style={{
            left: `${w.x}%`,
            top: `${w.startY}%`,
            width: w.size,
            height: w.size,
            background: "radial-gradient(circle, rgba(60,58,55,0.06), transparent 70%)",
          }}
          animate={{
            y: [0, -40, -70],
            x: [0, 5, -3],
            opacity: [0, 0.06, 0],
            scale: [1, 1.5, 2],
          }}
          transition={{
            duration: w.duration,
            repeat: Infinity,
            delay: w.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
