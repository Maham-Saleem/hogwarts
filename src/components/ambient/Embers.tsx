import { useMemo } from "react";

export function Embers({ count = 10 }: { count?: number }) {
  const embers = useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i, left: 42 + Math.random() * 16, size: 0.8 + Math.random() * 1.2,
    delay: Math.random() * 6, duration: 4 + Math.random() * 4,
  })), [count]);
  return (
    <div className="pointer-events-none fixed inset-0 z-[6] overflow-hidden">
      {embers.map((e) => (
        <div key={e.id} className="absolute rounded-full" style={{
          left: `${e.left}%`, bottom: "10%", width: `${e.size}px`, height: `${e.size}px`,
          background: "#FF6B00", boxShadow: `0 0 ${e.size * 2}px ${e.size}px rgba(255,107,0,0.25)`,
          animation: `emberRise ${e.duration}s ease-out infinite`, animationDelay: `${e.delay}s`,
        }} />
      ))}
      <style>{`@keyframes emberRise { 0% { transform: translateY(0) scale(1); opacity: 0.6; } 100% { transform: translateY(-160px) scale(0); opacity: 0; } }`}</style>
    </div>
  );
}
