import { motion } from "framer-motion";

export function Spirits() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${(i * 13 + 5) % 100}%`,
            bottom: `${(i * 23) % 70}%`,
            width: 2 + (i % 3),
            height: 2 + (i % 3),
            background: i % 2 === 0 ? "#F4E9C3" : "#C0C0C0",
            boxShadow: `0 0 10px ${i % 2 === 0 ? "#D4AF37" : "#C0C0C0"}`,
          }}
          animate={{
            y: [-6, -30, -6],
            x: [(i % 2 === 0 ? 1 : -1) * 10, (i % 2 === 0 ? -1 : 1) * 6, (i % 2 === 0 ? 1 : -1) * 10],
            opacity: [0, 0.7, 0],
          }}
          transition={{ duration: 6 + i, delay: i * 0.7, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
