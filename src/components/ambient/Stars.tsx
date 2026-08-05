import { useMemo } from "react";

export function Stars({ count = 100 }: { count?: number }) {
  const stars = useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i, left: Math.random() * 100, top: Math.random() * 50, size: 0.4 + Math.random() * 1.5,
    delay: Math.random() * 6, duration: 6 + Math.random() * 6, brightness: 0.2 + Math.random() * 0.5,
  })), [count]);
  return (
    <div className="pointer-events-none fixed inset-0 z-[3] overflow-hidden">
      {stars.map((s) => (
        <div key={s.id} className="absolute rounded-full animate-pulse-glow" style={{
          left: `${s.left}%`, top: `${s.top}%`, width: `${s.size}px`, height: `${s.size}px`,
          background: "#FFF", opacity: s.brightness,
          boxShadow: `0 0 ${s.size}px ${s.size / 2}px rgba(200,220,255,${s.brightness * 0.3})`,
          animationDuration: `${s.duration}s`, animationDelay: `${s.delay}s`,
        }} />
      ))}
    </div>
  );
}
