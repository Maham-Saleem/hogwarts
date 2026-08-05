import { useState, useEffect } from "react";

export function Lightning() {
  const [flash, setFlash] = useState(false);
  useEffect(() => {
    const trigger = () => {
      if (Math.random() > 0.25) return;
      setFlash(true);
      setTimeout(() => setFlash(false), 120);
      setTimeout(() => { if (Math.random() > 0.6) { setFlash(true); setTimeout(() => setFlash(false), 80); } }, 200);
    };
    const interval = setInterval(trigger, 12000);
    return () => clearInterval(interval);
  }, []);
  if (!flash) return null;
  return <div className="pointer-events-none fixed inset-0 z-[8]"><div className="absolute inset-0 bg-white/[0.04]" /></div>;
}
