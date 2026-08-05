import { useMemo } from "react";

export function Fog({ layers = 4, color = "rgba(180,195,210,0.035)" }: { layers?: number; color?: string }) {
  const fogLayers = useMemo(() => Array.from({ length: layers }, (_, i) => ({
    id: i, duration: 20 + i * 8, opacity: 0.025 + i * 0.01, height: 25 + i * 18, bottom: -8 + i * 4,
  })), [layers]);
  return (
    <div className="pointer-events-none fixed inset-0 z-[4] overflow-hidden">
      {fogLayers.map((f) => (
        <div key={f.id} className="absolute w-[200%] animate-drift" style={{
          bottom: `${f.bottom}%`, height: `${f.height}%`,
          background: `linear-gradient(90deg, transparent 0%, ${color} 20%, ${color} 50%, ${color} 80%, transparent 100%)`,
          opacity: f.opacity, animationDuration: `${f.duration}s`, filter: "blur(50px)",
        }} />
      ))}
    </div>
  );
}
