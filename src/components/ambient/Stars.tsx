import { useMemo } from "react";

export function Stars({ count = 120 }: { count?: number }) {
  const stars = useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i, left: Math.random() * 100, top: Math.random() * 55, size: 0.5 + Math.random() * 2,
    delay: Math.random() * 4, duration: 3 + Math.random() * 4, brightness: 0.3 + Math.random() * 0.7,
  })), [count]);
  return (
    <div className="pointer-events-none fixed inset-0 z-[3] overflow-hidden">
      {stars.map((s) => (
        <div key={s.id} className="absolute rounded-full animate-pulse-glow" style={{
          left: `${s.left}%`, top: `${s.top}%`, width: `${s.size}px`, height: `${s.size}px`,
          background: "#FFF", opacity: s.brightness,
          boxShadow: `0 0 ${s.size * 2}px ${s.size / 2}px rgba(200,220,255,${s.brightness * 0.4})`,
          animationDuration: `${s.duration}s`, animationDelay: `${s.delay}s`,
        }} />
      ))}
    </div>
  );
}
