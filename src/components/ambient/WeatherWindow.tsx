import { useState, useEffect } from "react";

export function WeatherWindow() {
  const [lightning, setLightning] = useState(false);
  useEffect(() => {
    const t = setInterval(() => {
      if (Math.random() > 0.7) { setLightning(true); setTimeout(() => setLightning(false), 60); }
    }, 6000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="pointer-events-none fixed inset-0 z-[3] overflow-hidden">
      {/* Moonlight beam */}
      <div className="absolute top-0 right-[20%] w-32 h-full opacity-[0.03]"
        style={{ background: "linear-gradient(180deg, rgba(200,220,255,0.3), transparent 70%)", transform: "skewX(-8deg)" }} />
      {/* Occasional lightning flash */}
      {lightning && <div className="absolute inset-0 bg-white/5" />}
    </div>
  );
}
