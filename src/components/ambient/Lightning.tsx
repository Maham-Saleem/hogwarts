import { useState, useEffect } from "react";

export function Lightning() {
  const [flash, setFlash] = useState(false);
  useEffect(() => {
    const trigger = () => {
      if (Math.random() > 0.3) return;
      setFlash(true);
      setTimeout(() => setFlash(false), 80);
      setTimeout(() => { if (Math.random() > 0.5) { setFlash(true); setTimeout(() => setFlash(false), 50); } }, 120);
    };
    const interval = setInterval(trigger, 7000);
    return () => clearInterval(interval);
  }, []);
  if (!flash) return null;
  return <div className="pointer-events-none fixed inset-0 z-[8]"><div className="absolute inset-0 bg-white/8" /></div>;
}
