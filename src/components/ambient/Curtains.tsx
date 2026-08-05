import { useMemo } from "react";

export function Curtains({ count = 3 }: { count?: number }) {
  const curtains = useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i, left: 8 + (i / count) * 84, height: 25 + Math.random() * 15,
    delay: Math.random() * 4, color: i % 2 === 0 ? "rgba(94,27,36,0.08)" : "rgba(31,80,51,0.06)",
  })), [count]);
  return (
    <div className="pointer-events-none fixed inset-0 z-[5] overflow-hidden">
      {curtains.map((c) => (
        <div key={c.id} className="absolute top-0" style={{
          left: `${c.left}%`, width: "10px", height: `${c.height}%`,
          background: `linear-gradient(180deg, ${c.color}, transparent)`,
          borderRadius: "0 0 4px 4px", transformOrigin: "top center",
          animation: `sway ${8 + c.delay}s ease-in-out infinite`, animationDelay: `${c.delay}s`,
        }} />
      ))}
    </div>
  );
}
