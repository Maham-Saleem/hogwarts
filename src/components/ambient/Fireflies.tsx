import { useMemo } from "react";

export function Fireflies({ count = 35, color = "#AAFF88" }: { count?: number; color?: string }) {
  const flies = useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i, left: Math.random() * 100, top: Math.random() * 100, size: 2 + Math.random() * 3,
    delay: Math.random() * 6, duration: 4 + Math.random() * 6,
  })), [count]);
  return (
    <div className="pointer-events-none fixed inset-0 z-[6] overflow-hidden">
      {flies.map((f) => (
        <div key={f.id} className="absolute rounded-full animate-pulse-glow" style={{
          left: `${f.left}%`, top: `${f.top}%`, width: `${f.size}px`, height: `${f.size}px`,
          background: color, boxShadow: `0 0 ${f.size * 3}px ${f.size}px ${color}50`,
          animationDuration: `${f.duration}s`, animationDelay: `${f.delay}s`,
        }} />
      ))}
    </div>
  );
}
