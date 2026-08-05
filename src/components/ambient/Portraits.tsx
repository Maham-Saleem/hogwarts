import { useMemo } from "react";

const COLORS = ["rgba(139,105,20,0.2)", "rgba(94,27,36,0.2)", "rgba(31,80,51,0.2)", "rgba(74,158,255,0.15)", "rgba(201,205,211,0.15)"];

export function Portraits({ count = 5 }: { count?: number }) {
  const portraits = useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i, left: 8 + (i / count) * 80, top: 14 + Math.random() * 35,
    width: 40 + Math.random() * 20, height: 52 + Math.random() * 18,
    color: COLORS[i % COLORS.length], blinkDelay: 6 + Math.random() * 8,
  })), [count]);
  return (
    <div className="pointer-events-none fixed inset-0 z-[5] overflow-hidden">
      {portraits.map((p) => (
        <div key={p.id} className="absolute" style={{ left: `${p.left}%`, top: `${p.top}%` }}>
          <div style={{
            width: `${p.width}px`, height: `${p.height}px`, border: "1.5px solid rgba(139,105,20,0.25)",
            borderRadius: "2px", background: `linear-gradient(135deg, ${p.color}, transparent)`,
            boxShadow: "inset 0 0 10px rgba(0,0,0,0.4), 0 1px 4px rgba(0,0,0,0.25)",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", bottom: "8%", left: "50%", transform: "translateX(-50%)",
              width: "50%", height: "60%", background: `radial-gradient(ellipse at 50% 30%, ${p.color}, transparent)`,
              borderRadius: "50% 50% 0 0", opacity: 0.5,
            }} />
            {[35, 65].map((right) => (
              <div key={right} style={{
                position: "absolute", top: "32%", [right < 50 ? "left" : "right"]: `${100 - right}%`,
                width: "2.5px", height: "2.5px", background: "rgba(212,175,55,0.5)", borderRadius: "50%",
                boxShadow: "0 0 3px 1px rgba(212,175,55,0.25)",
                animation: `portraitBlink 8s ease-in-out infinite`, animationDelay: `${p.blinkDelay}s`,
              }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
