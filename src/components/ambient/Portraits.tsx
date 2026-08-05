import { useMemo } from "react";

interface PortraitsProps {
  count?: number;
}

const PORTRAIT_COLORS = ["#8B6914", "#5E1B24", "#1F5033", "#4A9EFF", "#C9CDD3"];

export function Portraits({ count = 6 }: PortraitsProps) {
  const portraits = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: 5 + (i / count) * 90,
        top: 15 + Math.random() * 40,
        width: 50 + Math.random() * 30,
        height: 65 + Math.random() * 25,
        color: PORTRAIT_COLORS[i % PORTRAIT_COLORS.length],
        blinkDelay: 3 + Math.random() * 5,
        blinkDuration: 0.2 + Math.random() * 0.3,
      })),
    [count]
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-[5] overflow-hidden">
      {portraits.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{ left: `${p.left}%`, top: `${p.top}%` }}
        >
          {/* Frame */}
          <div
            style={{
              width: `${p.width}px`,
              height: `${p.height}px`,
              border: "3px solid #8B6914",
              borderRadius: "4px",
              background: `linear-gradient(135deg, ${p.color}40, ${p.color}20)`,
              boxShadow: "inset 0 0 15px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Figure silhouette */}
            <div
              style={{
                position: "absolute",
                bottom: "10%",
                left: "50%",
                transform: "translateX(-50%)",
                width: "60%",
                height: "70%",
                background: `radial-gradient(ellipse at 50% 30%, ${p.color}60, transparent)`,
                borderRadius: "50% 50% 0 0",
              }}
            />
            {/* Eyes that blink */}
            <div
              style={{
                position: "absolute",
                top: "35%",
                left: "35%",
                width: "4px",
                height: "4px",
                background: "#FFD700",
                borderRadius: "50%",
                boxShadow: "0 0 4px 1px rgba(255, 215, 0, 0.5)",
                animation: `portraitBlink ${p.blinkDuration}s ease-in-out infinite`,
                animationDelay: `${p.blinkDelay}s`,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "35%",
                right: "35%",
                width: "4px",
                height: "4px",
                background: "#FFD700",
                borderRadius: "50%",
                boxShadow: "0 0 4px 1px rgba(255, 215, 0, 0.5)",
                animation: `portraitBlink ${p.blinkDuration}s ease-in-out infinite`,
                animationDelay: `${p.blinkDelay}s`,
              }}
            />
          </div>
          <style>{`
            @keyframes portraitBlink {
              0%, 95%, 100% { transform: scaleY(1); }
              97% { transform: scaleY(0.1); }
            }
          `}</style>
        </div>
      ))}
    </div>
  );
}
