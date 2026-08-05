import { useMemo } from "react";

export function StainedGlassLight() {
  const rays = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        id: i,
        left: 15 + i * 18,
        width: 40 + Math.random() * 30,
        color: ["rgba(212,175,55,0.04)", "rgba(94,27,36,0.03)", "rgba(74,158,255,0.03)", "rgba(31,80,51,0.03)", "rgba(212,175,55,0.04)"][i],
        delay: i * 2,
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-[4] overflow-hidden">
      {rays.map((r) => (
        <div
          key={r.id}
          className="absolute"
          style={{
            left: `${r.left}%`,
            top: "0%",
            width: `${r.width}px`,
            height: "100%",
            background: `linear-gradient(180deg, ${r.color} 0%, transparent 80%)`,
            transform: "skewX(-5deg)",
            animation: `pulseGlow 8s ease-in-out infinite`,
            animationDelay: `${r.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
