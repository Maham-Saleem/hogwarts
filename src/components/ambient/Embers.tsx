import { useMemo } from "react";

interface EmbersProps {
  count?: number;
}

export function Embers({ count = 15 }: EmbersProps) {
  const embers = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: 40 + Math.random() * 20,
        size: 1 + Math.random() * 2,
        delay: Math.random() * 4,
        duration: 3 + Math.random() * 3,
        drift: (Math.random() - 0.5) * 30,
      })),
    [count]
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-[6] overflow-hidden">
      {embers.map((e) => (
        <div
          key={e.id}
          className="absolute rounded-full"
          style={{
            left: `${e.left}%`,
            bottom: "15%",
            width: `${e.size}px`,
            height: `${e.size}px`,
            background: "#FF6B00",
            boxShadow: `0 0 ${e.size * 3}px ${e.size}px rgba(255, 107, 0, 0.5)`,
            animation: `emberRise ${e.duration}s ease-out infinite`,
            animationDelay: `${e.delay}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes emberRise {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 1; }
          100% { transform: translateY(-250px) translateX(var(--ember-drift, 20px)) scale(0); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
