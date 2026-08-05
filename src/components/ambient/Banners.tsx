import { useMemo } from "react";

const HOUSE_COLORS = [
  { bg: "rgba(212,175,55,0.12)", border: "rgba(212,175,55,0.3)" },
  { bg: "rgba(94,27,36,0.12)", border: "rgba(94,27,36,0.3)" },
  { bg: "rgba(31,80,51,0.12)", border: "rgba(31,80,51,0.3)" },
  { bg: "rgba(26,26,46,0.12)", border: "rgba(74,158,255,0.3)" },
];

export function Banners({ count = 4 }: { count?: number }) {
  const banners = useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i, left: 10 + (i / count) * 80, colors: HOUSE_COLORS[i % 4],
    delay: Math.random() * 4, height: 50 + Math.random() * 30,
  })), [count]);
  return (
    <div className="pointer-events-none fixed inset-0 z-[4] overflow-hidden">
      {banners.map((b) => (
        <div key={b.id} className="absolute top-0" style={{
          left: `${b.left}%`, width: "28px", height: `${b.height}px`,
          background: `linear-gradient(180deg, ${b.colors.bg}, transparent)`,
          borderLeft: `1px solid ${b.colors.border}`, borderRight: `1px solid ${b.colors.border}`,
          borderBottom: `2px solid ${b.colors.border}`, borderBottomLeftRadius: "14px",
          borderBottomRightRadius: "14px", transformOrigin: "top center",
          animation: `sway ${6 + b.delay}s ease-in-out infinite`, animationDelay: `${b.delay}s`,
        }} />
      ))}
    </div>
  );
}
