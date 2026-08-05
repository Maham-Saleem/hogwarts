import { useMemo } from "react";

interface FeathersProps {
  count?: number;
}

export function Feathers({ count = 12 }: FeathersProps) {
  const feathers = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: 10 + Math.random() * 80,
        size: 6 + Math.random() * 8,
        delay: Math.random() * 10,
        duration: 8 + Math.random() * 8,
      })),
    [count]
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-[5] overflow-hidden">
      {feathers.map((f) => (
        <div
          key={f.id}
          className="absolute"
          style={{
            left: `${f.left}%`,
            top: "-5%",
            animation: `featherDrift ${f.duration}s ease-in-out infinite`,
            animationDelay: `${f.delay}s`,
          }}
        >
          <svg width={f.size} height={f.size * 2} viewBox="0 0 12 24">
            <path
              d="M6 0 C8 4, 10 8, 10 14 C10 18, 8 22, 6 24 C4 22, 2 18, 2 14 C2 8, 4 4, 6 0Z"
              fill="rgba(200, 200, 210, 0.5)"
            />
            <line x1="6" y1="0" x2="6" y2="24" stroke="rgba(180, 180, 190, 0.4)" strokeWidth="0.5" />
          </svg>
        </div>
      ))}
      <style>{`
        @keyframes featherDrift {
          0% { transform: translateY(-10vh) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.6; }
          50% { transform: translateY(50vh) translateX(40px) rotate(180deg); }
          90% { opacity: 0.6; }
          100% { transform: translateY(105vh) translateX(-20px) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
