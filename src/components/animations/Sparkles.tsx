import { useMemo } from "react";
import { motion } from "framer-motion";

interface SparklesProps {
  count?: number;
  className?: string;
}

export function Sparkles({ count = 14, className }: SparklesProps) {
  const sparks = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 1 + Math.random() * 2,
        duration: 2.5 + Math.random() * 3,
        delay: Math.random() * 2.5,
      })),
    [count]
  );

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`} aria-hidden>
      {sparks.map((s) => (
        <motion.span
          key={s.id}
          className="absolute rounded-full"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            background: "#FBF0C8",
            boxShadow: `0 0 8px #D4AF37`,
          }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1.4, 0] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}