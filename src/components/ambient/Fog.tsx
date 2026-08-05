import { useMemo } from "react";

export function Fog({ layers = 4, color = "rgba(180,195,210,0.025)" }: { layers?: number; color?: string }) {
  const fogLayers = useMemo(() => Array.from({ length: layers }, (_, i) => ({
    id: i, duration: 35 + i * 12, opacity: 0.018 + i * 0.007, height: 20 + i * 15, bottom: -6 + i * 3,
  })), [layers]);
  return (
    <div className="pointer-events-none fixed inset-0 z-[4] overflow-hidden">
      {fogLayers.map((f) => (
        <div key={f.id} className="absolute w-[200%] animate-drift" style={{
          bottom: `${f.bottom}%`, height: `${f.height}%`,
          background: `linear-gradient(90deg, transparent 0%, ${color} 25%, ${color} 50%, ${color} 75%, transparent 100%)`,
          opacity: f.opacity, animationDuration: `${f.duration}s`, filter: "blur(60px)",
        }} />
      ))}
    </div>
  );
}
