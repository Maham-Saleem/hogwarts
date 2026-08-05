import { useMemo } from "react";

export function Fireplace() {
  const flames = useMemo(() => Array.from({ length: 6 }, (_, i) => ({
    id: i, left: 42 + Math.random() * 16, delay: Math.random() * 3,
    height: 12 + Math.random() * 18, width: 5 + Math.random() * 6,
  })), []);
  return (
    <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-[5] h-32 overflow-hidden">
      {flames.map((f) => (
        <div key={f.id} className="absolute bottom-0 animate-flicker-slow" style={{
          left: `${f.left}%`, width: `${f.width}px`, height: `${f.height}px`,
          background: "linear-gradient(to top, #FF4500 0%, #FF8C00 30%, #FFD700 60%, transparent 100%)",
          borderRadius: "50% 50% 20% 20% / 70% 70% 30% 30%", opacity: 0.25,
          animationDuration: `${4 + Math.random() * 3}s`, animationDelay: `${f.delay}s`,
          filter: "blur(3px)",
        }} />
      ))}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 50% 100%, rgba(255,120,50,0.05), transparent 55%)",
      }} />
    </div>
  );
}
