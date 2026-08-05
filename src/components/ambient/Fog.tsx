import { useMemo } from "react";

interface FogProps {
  layers?: number;
  color?: string;
}

export function Fog({ layers = 3, color = "rgba(200, 210, 220, 0.04)" }: FogProps) {
  const fogLayers = useMemo(
    () =>
      Array.from({ length: layers }, (_, i) => ({
        id: i,
        duration: 25 + i * 10,
        opacity: 0.03 + i * 0.015,
        height: 30 + i * 20,
        bottom: -10 + i * 5,
      })),
    [layers]
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-[4] overflow-hidden">
      {fogLayers.map((f) => (
        <div
          key={f.id}
          className="absolute w-[200%] animate-drift"
          style={{
            bottom: `${f.bottom}%`,
            height: `${f.height}%`,
            background: `linear-gradient(90deg, transparent 0%, ${color} 20%, ${color} 50%, ${color} 80%, transparent 100%)`,
            opacity: f.opacity,
            animationDuration: `${f.duration}s`,
            filter: "blur(40px)",
          }}
        />
      ))}
    </div>
  );
}
