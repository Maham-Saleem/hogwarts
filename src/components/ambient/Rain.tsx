import { useMemo } from "react";

export function Rain({ intensity = 80, color = "rgba(174,194,224,0.25)" }: { intensity?: number; color?: string }) {
  const drops = useMemo(() => Array.from({ length: intensity }, (_, i) => ({
    id: i, left: Math.random() * 100, delay: Math.random() * 2, duration: 0.4 + Math.random() * 0.4,
    opacity: 0.1 + Math.random() * 0.3, width: Math.random() > 0.7 ? 2 : 1, height: 12 + Math.random() * 22,
  })), [intensity]);
  return (
    <div className="pointer-events-none fixed inset-0 z-[5] overflow-hidden">
      {drops.map((d) => (
        <div key={d.id} className="absolute animate-rain-fall" style={{
          left: `${d.left}%`, top: "-5%", width: `${d.width}px`, height: `${d.height}px`,
          background: `linear-gradient(to bottom, transparent, ${color})`, opacity: d.opacity,
          animationDelay: `${d.delay}s`, animationDuration: `${d.duration}s`,
        }} />
      ))}
    </div>
  );
}
