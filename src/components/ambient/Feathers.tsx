import { motion } from "framer-motion";

const feathers = Array.from({ length: 3 }, (_, i) => ({
  id: i,
  x: 20 + Math.random() * 60,
  size: 4 + Math.random() * 3,
  duration: 20 + Math.random() * 15,
  delay: Math.random() * 15,
  drift: -15 + Math.random() * 30,
}));

export function Feathers() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {feathers.map((f) => (
        <motion.div
          key={f.id}
          className="absolute"
          style={{
            left: `${f.x}%`,
            width: f.size,
            height: f.size * 2,
            borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
            backgroundColor: "rgba(180,170,155,0.08)",
            transformOrigin: "center center",
          }}
          initial={{ top: "-5%", opacity: 0, rotate: 0 }}
          animate={{
            top: "105%",
            opacity: [0, 0.08, 0.08, 0],
            rotate: [0, 45, -30, 60, 0],
            x: [0, f.drift, -f.drift / 2, f.drift / 3],
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
