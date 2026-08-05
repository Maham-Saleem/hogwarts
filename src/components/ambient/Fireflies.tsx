import { useMemo } from "react";

interface FirefliesProps {
  count?: number;
  color?: string;
}

export function Fireflies({ count = 30, color = "#AAFF88" }: FirefliesProps) {
  const flies = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 2 + Math.random() * 3,
        delay: Math.random() * 6,
        duration: 4 + Math.random() * 6,
        driftX: (Math.random() - 0.5) * 60,
        driftY: (Math.random() - 0.5) * 60,
      })),
    [count]
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-[6] overflow-hidden">
      {flies.map((f) => (
        <div
          key={f.id}
          className="absolute rounded-full animate-pulse-glow"
          style={{
            left: `${f.left}%`,
            top: `${f.top}%`,
            width: `${f.size}px`,
            height: `${f.size}px`,
            background: color,
            boxShadow: `0 0 ${f.size * 3}px ${f.size}px ${color}60`,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
            ["--drift-x" as string]: `${f.driftX}px`,
            ["--drift-y" as string]: `${f.driftY}px`,
          }}
        />
      ))}
    </div>
  );
}
