import { useMemo } from "react";

export function Bubbles({ count = 22, color = "rgba(31,200,80,0.25)" }: { count?: number; color?: string }) {
  const bubbles = useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i, left: 30 + Math.random() * 40, size: 3 + Math.random() * 8,
    delay: Math.random() * 5, duration: 3 + Math.random() * 4,
  })), [count]);
  return (
    <div className="pointer-events-none fixed inset-0 z-[6] overflow-hidden">
      {bubbles.map((b) => (
        <div key={b.id} className="absolute rounded-full" style={{
          left: `${b.left}%`, bottom: "18%", width: `${b.size}px`, height: `${b.size}px`,
          border: `1px solid ${color}`, background: `radial-gradient(circle at 30% 30%, ${color}, transparent)`,
          animation: `bubbleRise ${b.duration}s ease-in infinite`, animationDelay: `${b.delay}s`,
        }} />
      ))}
      <style>{`@keyframes bubbleRise { 0% { transform: translateY(0) scale(1); opacity: 0.7; } 100% { transform: translateY(-280px) scale(0.2); opacity: 0; } }`}</style>
    </div>
  );
}
