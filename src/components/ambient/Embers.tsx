import { motion } from "framer-motion";

const embers = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  x: 30 + Math.random() * 40,
  startY: 70 + Math.random() * 20,
  drift: -5 + Math.random() * 10,
  duration: 6 + Math.random() * 4,
  delay: Math.random() * 5,
}));

export function Embers() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {embers.map((e) => (
        <motion.div
          key={e.id}
          className="absolute rounded-full"
          style={{
            left: `${e.x}%`,
            width: 1.5,
            height: 1.5,
            backgroundColor: "rgba(255,143,0,0.3)",
            boxShadow: "0 0 3px rgba(255,109,0,0.2)",
          }}
          initial={{ top: `${e.startY}%`, opacity: 0 }}
          animate={{
            top: [`${e.startY}%`, `${e.startY - 30}%`],
            opacity: [0, 0.3, 0],
            x: [0, e.drift],
          }}
          transition={{
            duration: e.duration,
            repeat: Infinity,
            delay: e.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
