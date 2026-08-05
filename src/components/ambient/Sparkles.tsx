import { useMemo } from "react";

export function Sparkles({ count = 12, color = "rgba(212,175,55,0.4)" }: { count?: number; color?: string }) {
  const sparkles = useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i, left: Math.random() * 100, top: Math.random() * 100, size: 0.8 + Math.random() * 1.5,
    delay: Math.random() * 10, duration: 6 + Math.random() * 6,
  })), [count]);
  return (
    <div className="pointer-events-none fixed inset-0 z-[6] overflow-hidden">
      {sparkles.map((s) => (
        <div key={s.id} className="absolute animate-pulse-glow" style={{
          left: `${s.left}%`, top: `${s.top}%`, width: `${s.size}px`, height: `${s.size}px`,
          background: color, borderRadius: "50%",
          boxShadow: `0 0 ${s.size * 3}px ${s.size}px ${color.replace(/[\d.]+\)$/, "0.1)")}`,
          animationDuration: `${s.duration}s`, animationDelay: `${s.delay}s`,
        }} />
      ))}
    </div>
  );
}
