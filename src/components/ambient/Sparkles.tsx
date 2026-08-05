import { useMemo } from "react";

interface SparklesProps {
  count?: number;
  color?: string;
}

export function Sparkles({ count = 25, color = "#D4AF37" }: SparklesProps) {
  const sparkles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 1 + Math.random() * 3,
        delay: Math.random() * 5,
        duration: 2 + Math.random() * 3,
      })),
    [count]
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-[6] overflow-hidden">
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="absolute animate-pulse-glow"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
          }}
        >
          <div
            className="absolute inset-0 rotate-45"
            style={{
              background: color,
              boxShadow: `0 0 ${s.size * 4}px ${s.size}px ${color}40`,
            }}
          />
          <div
            className="absolute inset-0 -rotate-45"
            style={{
              background: color,
              boxShadow: `0 0 ${s.size * 4}px ${s.size}px ${color}40`,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: color,
              boxShadow: `0 0 ${s.size * 4}px ${s.size}px ${color}40`,
            }}
          />
          <style>{`
            @keyframes sparklePulse {
              0%, 100% { opacity: 0.2; transform: scale(0.8); }
              50% { opacity: 1; transform: scale(1.2); }
            }
          `}</style>
        </div>
      ))}
    </div>
  );
}
