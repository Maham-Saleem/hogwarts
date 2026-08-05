import { useMemo } from "react";

export function Feathers({ count = 8 }: { count?: number }) {
  const feathers = useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i, left: 15 + Math.random() * 70, size: 5 + Math.random() * 5,
    delay: Math.random() * 15, duration: 12 + Math.random() * 10,
  })), [count]);
  return (
    <div className="pointer-events-none fixed inset-0 z-[5] overflow-hidden">
      {feathers.map((f) => (
        <div key={f.id} className="absolute" style={{
          left: `${f.left}%`, top: "-5%",
          animation: `featherDrift ${f.duration}s ease-in-out infinite`, animationDelay: `${f.delay}s`,
        }}>
          <svg width={f.size} height={f.size * 2} viewBox="0 0 12 24">
            <path d="M6 0 C8 4, 10 8, 10 14 C10 18, 8 22, 6 24 C4 22, 2 18, 2 14 C2 8, 4 4, 6 0Z" fill="rgba(200,200,210,0.25)" />
            <line x1="6" y1="0" x2="6" y2="24" stroke="rgba(180,180,190,0.2)" strokeWidth="0.5" />
          </svg>
        </div>
      ))}
      <style>{`@keyframes featherDrift { 0% { transform: translateY(-10vh) translateX(0) rotate(0deg); opacity: 0; } 8% { opacity: 0.35; } 50% { transform: translateY(50vh) translateX(25px) rotate(120deg); } 92% { opacity: 0.35; } 100% { transform: translateY(105vh) translateX(-10px) rotate(240deg); opacity: 0; } }`}</style>
    </div>
  );
}
