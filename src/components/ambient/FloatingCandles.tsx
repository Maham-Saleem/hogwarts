import { useMemo } from "react";

interface FloatingCandlesProps {
  count?: number;
}

export function FloatingCandles({ count = 20 }: FloatingCandlesProps) {
  const candles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: 5 + Math.random() * 90,
        top: 5 + Math.random() * 50,
        size: 3 + Math.random() * 5,
        delay: Math.random() * 4,
        duration: 3 + Math.random() * 4,
        floatDuration: 6 + Math.random() * 8,
      })),
    [count]
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-[6] overflow-hidden">
      {candles.map((c) => (
        <div
          key={c.id}
          className="absolute"
          style={{
            left: `${c.left}%`,
            top: `${c.top}%`,
            animation: `float ${c.floatDuration}s ease-in-out infinite`,
            animationDelay: `${c.delay}s`,
          }}
        >
          {/* Flame */}
          <div
            className="animate-flicker"
            style={{
              width: `${c.size}px`,
              height: `${c.size * 1.8}px`,
              background: "radial-gradient(ellipse at center, #FFD700 0%, #FF8C00 40%, transparent 70%)",
              borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
              animationDuration: `${c.duration}s`,
              animationDelay: `${c.delay}s`,
              boxShadow: "0 0 8px 2px rgba(255, 200, 50, 0.4)",
            }}
          />
          {/* Candle body */}
          <div
            style={{
              width: `${c.size * 0.6}px`,
              height: `${c.size * 2.5}px`,
              background: "linear-gradient(to bottom, #E8DCC4, #C9A96E)",
              borderRadius: "0 0 2px 2px",
              margin: "0 auto",
            }}
          />
        </div>
      ))}
    </div>
  );
}
