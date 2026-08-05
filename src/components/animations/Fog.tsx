import { useMemo } from "react";
import { motion } from "framer-motion";

interface FogProps {
  intensity?: number;
  className?: string;
}

export function Fog({ intensity = 3, className }: FogProps) {
  const layers = useMemo(
    () =>
      Array.from({ length: intensity }).map((_, i) => ({
        id: i,
        top: 10 + Math.random() * 60,
        height: 90 + Math.random() * 160,
        duration: 40 + Math.random() * 30,
        delay: -Math.random() * 40,
      })),
    [intensity]
  );

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`} aria-hidden>
      {layers.map((l) => (
        <motion.div
          key={l.id}
          className="fog absolute inset-x-0"
          style={{ top: `${l.top}%`, height: l.height }}
          animate={{ x: ["-20%", "20%", "-20%"] }}
          transition={{ duration: l.duration, delay: l.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
}