import { useMemo } from "react";

export function Fireflies({ count = 20, color = "rgba(170,255,136,0.5)" }: { count?: number; color?: string }) {
  const flies = useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i, left: Math.random() * 100, top: Math.random() * 100, size: 1.5 + Math.random() * 2,
    delay: Math.random() * 10, duration: 8 + Math.random() * 10,
  })), [count]);
  return (
    <div className="pointer-events-none fixed inset-0 z-[6] overflow-hidden">
      {flies.map((f) => (
        <div key={f.id} className="absolute rounded-full animate-pulse-glow" style={{
          left: `${f.left}%`, top: `${f.top}%`, width: `${f.size}px`, height: `${f.size}px`,
          background: color, boxShadow: `0 0 ${f.size * 2}px ${f.size}px ${color.replace(/[\d.]+\)$/, "0.15)")}`,
          animationDuration: `${f.duration}s`, animationDelay: `${f.delay}s`,
        }} />
      ))}
    </div>
  );
}
