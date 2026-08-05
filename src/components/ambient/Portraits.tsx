import { useMemo } from "react";

const COLORS = ["#8B6914", "#5E1B24", "#1F5033", "#4A9EFF", "#C9CDD3"];

export function Portraits({ count = 6 }: { count?: number }) {
  const portraits = useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i, left: 5 + (i / count) * 88, top: 12 + Math.random() * 38,
    width: 45 + Math.random() * 25, height: 58 + Math.random() * 22,
    color: COLORS[i % COLORS.length], blinkDelay: 4 + Math.random() * 6,
  })), [count]);
  return (
    <div className="pointer-events-none fixed inset-0 z-[5] overflow-hidden">
      {portraits.map((p) => (
        <div key={p.id} className="absolute" style={{ left: `${p.left}%`, top: `${p.top}%` }}>
          <div style={{
            width: `${p.width}px`, height: `${p.height}px`, border: "2px solid #8B6914",
            borderRadius: "3px", background: `linear-gradient(135deg, ${p.color}35, ${p.color}15)`,
            boxShadow: "inset 0 0 12px rgba(0,0,0,0.5), 0 2px 6px rgba(0,0,0,0.3)",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", bottom: "8%", left: "50%", transform: "translateX(-50%)",
              width: "55%", height: "65%", background: `radial-gradient(ellipse at 50% 30%, ${p.color}50, transparent)`,
              borderRadius: "50% 50% 0 0",
            }} />
            {[35, 65].map((right) => (
              <div key={right} style={{
                position: "absolute", top: "33%", [right < 50 ? "left" : "right"]: `${100 - right}%`,
                width: "3px", height: "3px", background: "#FFD700", borderRadius: "50%",
                boxShadow: "0 0 4px 1px rgba(255,215,0,0.4)",
                animation: `portraitBlink 6s ease-in-out infinite`, animationDelay: `${p.blinkDelay}s`,
              }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
