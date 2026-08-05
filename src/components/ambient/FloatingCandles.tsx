import { useMemo } from "react";

export function FloatingCandles({ count = 18 }: { count?: number }) {
  const candles = useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i, left: 6 + Math.random() * 88, top: 4 + Math.random() * 40,
    size: 2 + Math.random() * 4, delay: Math.random() * 8, flickerDur: 4 + Math.random() * 4,
    floatDur: 12 + Math.random() * 12,
  })), [count]);
  return (
    <div className="pointer-events-none fixed inset-0 z-[6] overflow-hidden">
      {candles.map((c) => (
        <div key={c.id} className="absolute" style={{
          left: `${c.left}%`, top: `${c.top}%`,
          animation: `float ${c.floatDur}s ease-in-out infinite`, animationDelay: `${c.delay}s`,
        }}>
          <div className="animate-flicker" style={{
            width: `${c.size}px`, height: `${c.size * 1.6}px`,
            background: "radial-gradient(ellipse at center, #FFD700 0%, #FF8C00 40%, transparent 70%)",
            borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
            animationDuration: `${c.flickerDur}s`, animationDelay: `${c.delay}s`,
            boxShadow: "0 0 8px 2px rgba(255,200,50,0.2)",
          }} />
          <div style={{
            width: `${c.size * 0.4}px`, height: `${c.size * 2}px`,
            background: "linear-gradient(to bottom, #E8DCC4, #C9A96E)",
            borderRadius: "0 0 1px 1px", margin: "0 auto",
          }} />
        </div>
      ))}
    </div>
  );
}
