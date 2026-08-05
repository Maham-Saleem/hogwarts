import { motion } from "framer-motion";

const leaves = Array.from({ length: 5 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  size: 3 + Math.random() * 2,
  duration: 15 + Math.random() * 10,
  delay: Math.random() * 12,
  drift: -20 + Math.random() * 40,
}));

export function Leaves() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {leaves.map((l) => (
        <motion.div
          key={l.id}
          className="absolute"
          style={{
            left: `${l.x}%`,
            width: l.size,
            height: l.size * 0.6,
            borderRadius: "50% 0 50% 0",
            backgroundColor: "rgba(40,70,40,0.15)",
          }}
          initial={{ top: "-3%", opacity: 0, rotate: 0 }}
          animate={{
            top: "103%",
            opacity: [0, 0.15, 0.15, 0],
            rotate: [0, 180, 360],
            x: [0, l.drift, -l.drift / 2],
          }}
          transition={{
            duration: l.duration,
            repeat: Infinity,
            delay: l.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
