import { useMemo } from "react";

const HOUSE_COLORS = [
  { bg: "rgba(212,175,55,0.06)", border: "rgba(212,175,55,0.15)" },
  { bg: "rgba(94,27,36,0.06)", border: "rgba(94,27,36,0.15)" },
  { bg: "rgba(31,80,51,0.06)", border: "rgba(31,80,51,0.15)" },
  { bg: "rgba(26,26,46,0.06)", border: "rgba(74,158,255,0.15)" },
];

export function Banners({ count = 4 }: { count?: number }) {
  const banners = useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i, left: 12 + (i / count) * 76, colors: HOUSE_COLORS[i % 4],
    delay: Math.random() * 5, height: 40 + Math.random() * 25,
  })), [count]);
  return (
    <div className="pointer-events-none fixed inset-0 z-[4] overflow-hidden">
      {banners.map((b) => (
        <div key={b.id} className="absolute top-0" style={{
          left: `${b.left}%`, width: "22px", height: `${b.height}px`,
          background: `linear-gradient(180deg, ${b.colors.bg}, transparent)`,
          borderLeft: `0.5px solid ${b.colors.border}`, borderRight: `0.5px solid ${b.colors.border}`,
          borderBottom: `1px solid ${b.colors.border}`, borderBottomLeftRadius: "10px",
          borderBottomRightRadius: "10px", transformOrigin: "top center",
          animation: `sway-slow ${12 + b.delay}s ease-in-out infinite`, animationDelay: `${b.delay}s`,
        }} />
      ))}
    </div>
  );
}
