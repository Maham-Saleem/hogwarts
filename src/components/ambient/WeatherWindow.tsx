import { useState, useEffect } from "react";

export function WeatherWindow() {
  const [lightning, setLightning] = useState(false);
  useEffect(() => {
    const t = setInterval(() => {
      if (Math.random() > 0.75) { setLightning(true); setTimeout(() => setLightning(false), 100); }
    }, 10000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="pointer-events-none fixed inset-0 z-[3] overflow-hidden">
      <div className="absolute top-0 right-[22%] w-24 h-full opacity-[0.02]"
        style={{ background: "linear-gradient(180deg, rgba(200,220,255,0.2), transparent 65%)", transform: "skewX(-6deg)" }} />
      {lightning && <div className="absolute inset-0 bg-white/[0.03]" />}
    </div>
  );
}
