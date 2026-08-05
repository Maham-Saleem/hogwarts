import { motion } from "framer-motion";

const stars = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 60,
  size: 0.5 + Math.random() * 1.5,
  brightness: 0.15 + Math.random() * 0.25,
  twinkleDuration: 4 + Math.random() * 6,
  delay: Math.random() * 8,
}));

export function Stars() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            backgroundColor: `rgba(200,210,230,${s.brightness})`,
          }}
          animate={{
            opacity: [s.brightness, s.brightness * 0.5, s.brightness],
          }}
          transition={{
            duration: s.twinkleDuration,
            repeat: Infinity,
            delay: s.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
