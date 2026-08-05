import { useMemo } from "react";

export function Bubbles({ count = 12, color = "rgba(31,200,80,0.15)" }: { count?: number; color?: string }) {
  const bubbles = useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i, left: 35 + Math.random() * 30, size: 2 + Math.random() * 5,
    delay: Math.random() * 8, duration: 5 + Math.random() * 5,
  })), [count]);
  return (
    <div className="pointer-events-none fixed inset-0 z-[6] overflow-hidden">
      {bubbles.map((b) => (
        <div key={b.id} className="absolute rounded-full" style={{
          left: `${b.left}%`, bottom: "20%", width: `${b.size}px`, height: `${b.size}px`,
          border: `0.5px solid ${color}`, background: `radial-gradient(circle at 30% 30%, ${color}, transparent)`,
          animation: `bubbleRise ${b.duration}s ease-in infinite`, animationDelay: `${b.delay}s`,
        }} />
      ))}
      <style>{`@keyframes bubbleRise { 0% { transform: translateY(0) scale(1); opacity: 0.5; } 100% { transform: translateY(-200px) scale(0.2); opacity: 0; } }`}</style>
    </div>
  );
}
