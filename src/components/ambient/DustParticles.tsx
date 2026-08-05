import { useMemo } from "react";

export function DustParticles({ count = 45, color = "rgba(255,230,180,0.25)" }: { count?: number; color?: string }) {
  const particles = useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i, left: Math.random() * 100, top: Math.random() * 100, size: 1 + Math.random() * 2,
    delay: Math.random() * 8, duration: 12 + Math.random() * 18,
  })), [count]);
  return (
    <div className="pointer-events-none fixed inset-0 z-[5] overflow-hidden">
      {particles.map((p) => (
        <div key={p.id} className="absolute rounded-full animate-float-slow" style={{
          left: `${p.left}%`, top: `${p.top}%`, width: `${p.size}px`, height: `${p.size}px`,
          background: color, opacity: 0.4, animationDuration: `${p.duration}s`, animationDelay: `${p.delay}s`,
        }} />
      ))}
    </div>
  );
}
