import { useMemo } from "react";

export function Fireplace() {
  const flames = useMemo(() => Array.from({ length: 8 }, (_, i) => ({
    id: i, left: 40 + Math.random() * 20, delay: Math.random() * 2,
    height: 15 + Math.random() * 25, width: 6 + Math.random() * 8,
  })), []);
  return (
    <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-[5] h-40 overflow-hidden">
      {flames.map((f) => (
        <div key={f.id} className="absolute bottom-0 animate-flicker" style={{
          left: `${f.left}%`, width: `${f.width}px`, height: `${f.height}px`,
          background: `linear-gradient(to top, #FF4500 0%, #FF8C00 30%, #FFD700 60%, transparent 100%)`,
          borderRadius: "50% 50% 20% 20% / 70% 70% 30% 30%", opacity: 0.4,
          animationDuration: `${2 + Math.random() * 2}s`, animationDelay: `${f.delay}s`,
          filter: "blur(2px)",
        }} />
      ))}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 50% 100%, rgba(255,120,50,0.08), transparent 60%)",
      }} />
    </div>
  );
}
