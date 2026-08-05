import { useMemo } from "react";

export function Smoke({ count = 10, originX = 50, originY = 75 }: { count?: number; originX?: number; originY?: number }) {
  const wisps = useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i, offsetX: (Math.random() - 0.5) * 15, size: 25 + Math.random() * 40,
    delay: Math.random() * 8, duration: 7 + Math.random() * 6,
  })), [count]);
  return (
    <div className="pointer-events-none fixed inset-0 z-[5] overflow-hidden">
      {wisps.map((w) => (
        <div key={w.id} className="absolute rounded-full" style={{
          left: `${originX + w.offsetX}%`, top: `${originY}%`,
          width: `${w.size}px`, height: `${w.size}px`,
          background: "radial-gradient(circle, rgba(140,140,140,0.04), transparent)",
          filter: "blur(18px)", animation: `smokeRise ${w.duration}s ease-out infinite`,
          animationDelay: `${w.delay}s`,
        }} />
      ))}
      <style>{`@keyframes smokeRise { 0% { transform: translateY(0) scale(1); opacity: 0.08; } 100% { transform: translateY(-150px) scale(2); opacity: 0; } }`}</style>
    </div>
  );
}
