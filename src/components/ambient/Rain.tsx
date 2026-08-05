import { useMemo } from "react";

export function Rain({ intensity = 60, color = "rgba(174,194,224,0.18)" }: { intensity?: number; color?: string }) {
  const drops = useMemo(() => Array.from({ length: intensity }, (_, i) => ({
    id: i, left: Math.random() * 100, delay: Math.random() * 3, duration: 0.9 + Math.random() * 0.5,
    opacity: 0.08 + Math.random() * 0.15, width: Math.random() > 0.8 ? 1.5 : 1, height: 18 + Math.random() * 30,
  })), [intensity]);
  return (
    <div className="pointer-events-none fixed inset-0 z-[5] overflow-hidden">
      {drops.map((d) => (
        <div key={d.id} className="absolute animate-rain-fall" style={{
          left: `${d.left}%`, top: "-8%", width: `${d.width}px`, height: `${d.height}px`,
          background: `linear-gradient(to bottom, transparent, ${color})`, opacity: d.opacity,
          animationDelay: `${d.delay}s`, animationDuration: `${d.duration}s`,
        }} />
      ))}
    </div>
  );
}
