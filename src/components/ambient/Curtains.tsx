import { useMemo } from "react";

export function Curtains({ count = 4 }: { count?: number }) {
  const curtains = useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i, left: 5 + (i / count) * 90, height: 30 + Math.random() * 20,
    delay: Math.random() * 3, color: i % 2 === 0 ? "rgba(94,27,36,0.15)" : "rgba(31,80,51,0.12)",
  })), [count]);
  return (
    <div className="pointer-events-none fixed inset-0 z-[5] overflow-hidden">
      {curtains.map((c) => (
        <div key={c.id} className="absolute top-0" style={{
          left: `${c.left}%`, width: "12px", height: `${c.height}%`,
          background: `linear-gradient(180deg, ${c.color}, transparent)`,
          borderRadius: "0 0 6px 6px", transformOrigin: "top center",
          animation: `sway ${5 + c.delay}s ease-in-out infinite`, animationDelay: `${c.delay}s`,
        }} />
      ))}
    </div>
  );
}
