import { motion } from "framer-motion";

const motes = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  x: 10 + Math.random() * 80,
  size: 1 + Math.random() * 1.5,
  opacity: 0.15 + Math.random() * 0.15,
  duration: 20 + Math.random() * 20,
  delay: Math.random() * 15,
  drift: -10 + Math.random() * 20,
}));

export function DustParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {motes.map((m) => (
        <motion.div
          key={m.id}
          className="absolute rounded-full"
          style={{
            left: `${m.x}%`,
            width: m.size,
            height: m.size,
            backgroundColor: `rgba(212,195,160,${m.opacity})`,
          }}
          initial={{ top: "-2%", opacity: 0 }}
          animate={{
            top: "102%",
            opacity: [0, m.opacity, m.opacity, 0],
            x: [0, m.drift, -m.drift / 2, m.drift / 3],
          }}
          transition={{
            duration: m.duration,
            repeat: Infinity,
            delay: m.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
