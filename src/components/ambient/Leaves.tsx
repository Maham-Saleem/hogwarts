import { useMemo } from "react";

export function Leaves({ count = 22 }: { count?: number }) {
  const leaves = useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i, left: Math.random() * 100, size: 4 + Math.random() * 6,
    delay: Math.random() * 8, duration: 6 + Math.random() * 6,
  })), [count]);
  return (
    <div className="pointer-events-none fixed inset-0 z-[5] overflow-hidden">
      {leaves.map((l) => (
        <div key={l.id} className="absolute" style={{
          left: `${l.left}%`, top: "-5%",
          animation: `leafFall ${l.duration}s linear infinite`, animationDelay: `${l.delay}s`,
        }}>
          <svg width={l.size} height={l.size * 1.5} viewBox="0 0 10 15">
            <path d="M5 0 C8 3, 10 7, 8 12 C6 14, 4 14, 2 12 C0 7, 2 3, 5 0Z" fill="#2A6B44" opacity="0.5" />
            <line x1="5" y1="0" x2="5" y2="14" stroke="#1F5033" strokeWidth="0.5" />
          </svg>
        </div>
      ))}
      <style>{`@keyframes leafFall { 0% { transform: translateY(-10vh) rotate(0deg); opacity: 0; } 10% { opacity: 0.6; } 90% { opacity: 0.6; } 100% { transform: translateY(105vh) rotate(720deg); opacity: 0; } }`}</style>
    </div>
  );
}
