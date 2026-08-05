import { useMemo } from "react";

interface RainProps {
  intensity?: number;
  color?: string;
}

export function Rain({ intensity = 80, color = "rgba(174, 194, 224, 0.3)" }: RainProps) {
  const drops = useMemo(
    () =>
      Array.from({ length: intensity }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 0.5 + Math.random() * 0.5,
        opacity: 0.15 + Math.random() * 0.35,
        width: Math.random() > 0.7 ? 2 : 1,
        height: 15 + Math.random() * 25,
      })),
    [intensity]
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-[5] overflow-hidden">
      {drops.map((d) => (
        <div
          key={d.id}
          className="absolute animate-rain-fall"
          style={{
            left: `${d.left}%`,
            top: "-5%",
            width: `${d.width}px`,
            height: `${d.height}px`,
            background: `linear-gradient(to bottom, transparent, ${color})`,
            opacity: d.opacity,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
