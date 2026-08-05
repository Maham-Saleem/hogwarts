import { useMemo } from "react";

export function Embers({ count = 18 }: { count?: number }) {
  const embers = useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i, left: 38 + Math.random() * 24, size: 1 + Math.random() * 2,
    delay: Math.random() * 4, duration: 2.5 + Math.random() * 3,
  })), [count]);
  return (
    <div className="pointer-events-none fixed inset-0 z-[6] overflow-hidden">
      {embers.map((e) => (
        <div key={e.id} className="absolute rounded-full" style={{
          left: `${e.left}%`, bottom: "12%", width: `${e.size}px`, height: `${e.size}px`,
          background: "#FF6B00", boxShadow: `0 0 ${e.size * 3}px ${e.size}px rgba(255,107,0,0.4)`,
          animation: `emberRise ${e.duration}s ease-out infinite`, animationDelay: `${e.delay}s`,
        }} />
      ))}
      <style>{`@keyframes emberRise { 0% { transform: translateY(0) scale(1); opacity: 1; } 100% { transform: translateY(-220px) scale(0); opacity: 0; } }`}</style>
    </div>
  );
}
