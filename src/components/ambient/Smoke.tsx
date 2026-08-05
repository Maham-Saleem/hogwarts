import { useMemo } from "react";

interface SmokeProps {
  count?: number;
  originX?: number;
  originY?: number;
}

export function Smoke({ count = 15, originX = 50, originY = 70 }: SmokeProps) {
  const wisps = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        offsetX: (Math.random() - 0.5) * 20,
        size: 20 + Math.random() * 40,
        delay: Math.random() * 6,
        duration: 5 + Math.random() * 5,
      })),
    [count]
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-[5] overflow-hidden">
      {wisps.map((w) => (
        <div
          key={w.id}
          className="absolute rounded-full"
          style={{
            left: `${originX + w.offsetX}%`,
            top: `${originY}%`,
            width: `${w.size}px`,
            height: `${w.size}px`,
            background: "radial-gradient(circle, rgba(150,150,150,0.08), transparent)",
            filter: "blur(12px)",
            animation: `smokeRise ${w.duration}s ease-out infinite`,
            animationDelay: `${w.delay}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes smokeRise {
          0% { transform: translateY(0) scale(1); opacity: 0.15; }
          50% { opacity: 0.08; }
          100% { transform: translateY(-200px) scale(2.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
