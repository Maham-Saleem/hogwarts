import { useMemo } from "react";

export function StainedGlassLight() {
  const rays = useMemo(() => Array.from({ length: 4 }, (_, i) => ({
    id: i, left: 15 + i * 20, width: 30 + Math.random() * 20,
    color: ["rgba(212,175,55,0.025)", "rgba(94,27,36,0.018)", "rgba(74,158,255,0.018)", "rgba(212,175,55,0.025)"][i],
    delay: i * 3,
  })), []);
  return (
    <div className="pointer-events-none fixed inset-0 z-[4] overflow-hidden">
      {rays.map((r) => (
        <div key={r.id} className="absolute" style={{
          left: `${r.left}%`, top: "0%", width: `${r.width}px`, height: "100%",
          background: `linear-gradient(180deg, ${r.color} 0%, transparent 70%)`,
          transform: "skewX(-3deg)", animation: `pulseGlow 12s ease-in-out infinite`, animationDelay: `${r.delay}s`,
        }} />
      ))}
    </div>
  );
}
