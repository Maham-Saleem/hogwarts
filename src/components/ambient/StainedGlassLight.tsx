import { useMemo } from "react";

export function StainedGlassLight() {
  const rays = useMemo(() => Array.from({ length: 5 }, (_, i) => ({
    id: i, left: 12 + i * 18, width: 35 + Math.random() * 25,
    color: ["rgba(212,175,55,0.035)", "rgba(94,27,36,0.025)", "rgba(74,158,255,0.025)", "rgba(31,80,51,0.025)", "rgba(212,175,55,0.035)"][i],
    delay: i * 2.5,
  })), []);
  return (
    <div className="pointer-events-none fixed inset-0 z-[4] overflow-hidden">
      {rays.map((r) => (
        <div key={r.id} className="absolute" style={{
          left: `${r.left}%`, top: "0%", width: `${r.width}px`, height: "100%",
          background: `linear-gradient(180deg, ${r.color} 0%, transparent 75%)`,
          transform: "skewX(-4deg)", animation: `pulseGlow 9s ease-in-out infinite`, animationDelay: `${r.delay}s`,
        }} />
      ))}
    </div>
  );
}
