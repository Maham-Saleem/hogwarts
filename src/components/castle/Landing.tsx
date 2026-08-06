import { useState, useEffect, useRef } from "react";
import { useAmbience } from "@/context/AmbienceProvider";

interface Props {
  onComplete: () => void;
}

const DURATIONS: Record<number, number> = {
  1: 75, // single cinematic establishing shot
  2: 15, // doors open, enter
  3: 10, // interior warm fade
};

export function Landing({ onComplete }: Props) {
  const [scene, setScene] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const started = useRef(false);
  const audio = useAmbience();

  useEffect(() => {
    if (scene === 0) return;
    const t0 = performance.now();
    let raf: number;
    const loop = () => {
      setElapsed((performance.now() - t0) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [scene]);

  useEffect(() => {
    const dur = DURATIONS[scene];
    if (dur && elapsed >= dur) setScene(scene + 1);
  }, [elapsed, scene]);

  useEffect(() => {
    if (scene === 0) return;
    if (scene === 1) {
      audio.start("rain", 0.024);
      audio.start("wind", 0.018);
      audio.start("pad", 0.006);
      audio.start("arpeggio", 0.02);
      audio.fade("pad", 0.022, 12);
      audio.fade("arpeggio", 0.05, 14);
      const c = setTimeout(() => audio.start("choir", 0.006), 16000);
      const c2 = setTimeout(() => audio.fade("choir", 0.017, 12), 28000);
      return () => {
        clearTimeout(c);
        clearTimeout(c2);
      };
    } else if (scene === 2) {
      audio.start("fire", 0.02);
      audio.play("door");
      audio.fade("rain", 0.012, 6);
      audio.fade("wind", 0.008, 5);
      audio.fade("choir", 0.022, 6);
      audio.fade("pad", 0.03, 6);
      const f = setTimeout(() => audio.start("footsteps", 0.006), 4000);
      return () => clearTimeout(f);
    } else if (scene === 3) {
      audio.start("murmur");
      audio.start("pages");
      audio.fade("fire", 0.04, 3);
      audio.fade("rain", 0, 4);
      audio.fade("wind", 0, 3);
      audio.fade("choir", 0.014, 6);
      audio.fade("pad", 0.02, 6);
      audio.fade("arpeggio", 0.02, 5);
      const done = setTimeout(() => {
        audio.stopAll();
        onComplete();
      }, 9000);
      return () => clearTimeout(done);
    }
  }, [scene, audio, onComplete]);

  useEffect(() => {
    if (scene !== 1) return;
    const bell = setInterval(() => audio.play("bells"), 15000);
    const owl = setInterval(() => audio.play("owl"), 17000);
    const thunder = [6000, 22000, 38000, 54000].map((d) =>
      setTimeout(() => audio.play("thunder"), d),
    );
    return () => {
      clearInterval(bell);
      clearInterval(owl);
      thunder.forEach((tt) => clearTimeout(tt));
    };
  }, [scene, audio]);

  const enter = () => {
    if (started.current) return;
    started.current = true;
    audio.init();
    setScene(1);
  };

  const skip = () => {
    audio.stopAll();
    setScene(4);
  };

  if (scene === 0) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center cursor-pointer"
        style={{ backgroundColor: "#080b12" }}
        onClick={enter}
      >
        <div className="text-center select-none">
          <p
            className="font-cormorant text-sm tracking-[0.35em] uppercase"
            style={{ color: "rgba(200,163,74,0.3)" }}
          >
            Click to enter
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ backgroundColor: "#080b12" }}
    >
      {scene < 4 && elapsed > 4 && (
        <button
          onClick={skip}
          className="fixed top-6 right-6 z-50 px-4 py-2 cursor-pointer"
          style={{
            border: "1px solid rgba(200,163,74,0.15)",
            backgroundColor: "rgba(8,11,18,0.6)",
          }}
        >
          <span
            className="font-cinzel text-[10px] tracking-[0.2em] uppercase"
            style={{ color: "rgba(232,223,201,0.3)" }}
          >
            Skip
          </span>
        </button>
      )}

      {scene === 1 && <Establishing t={elapsed} />}
      {scene === 2 && <Doors t={elapsed} />}
      {scene === 3 && <Interior t={elapsed} />}
    </div>
  );
}

/* ============ SCENE 1: CINEMATIC ESTABLISHING SHOT ============ */
function Establishing({ t }: { t: number }) {
  // single, imperceptible cinema dolly push toward the castle
  const push = 1 + (t / 75) * 0.08;
  const rise = t * 0.25;
  const lightning = lightningAt(t);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          transform: `scale(${push}) translateY(${-rise}px)`,
          transformOrigin: "50% 60%",
        }}
      >
        <img
          src="/castle-establishing.jpg"
          alt="Ancient castle at night across a lake"
          className="w-full h-full object-cover"
          style={{
            filter: "brightness(0.7) saturate(1.05) contrast(1.05)",
          }}
        />
        {/* atmospheric grading */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(20,32,58,0.28) 0%, transparent 35%, rgba(6,10,20,0.4) 100%)",
            mixBlendMode: "multiply",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 42%, transparent 55%, rgba(90,120,165,0.14) 100%)",
            mixBlendMode: "soft-light",
          }}
        />
        <Mist t={t} />
      </div>

      {/* gentle rain */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(103deg, transparent 0, transparent 2px, rgba(150,175,214,0.05) 3px, transparent 4px)",
          opacity: 0.26 + Math.sin(t * 0.3) * 0.04,
          transform: `translateY(${t * 5}px)`,
        }}
      />

      {/* distant lightning flash */}
      {lightning > 0 && (
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, rgba(214,228,255,0.4), transparent 55%)",
            mixBlendMode: "screen",
          }}
        />
      )}

      {/* film grain */}
      <FilmGrain />

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 46%, transparent 48%, rgba(3,5,9,0.6) 100%)",
        }}
      />
    </div>
  );
}

function lightningAt(t: number): number {
  const flashes: [number, number, number][] = [
    [7, 0.1, 0.55],
    [22, 0.1, 0.4],
    [38, 0.1, 0.5],
    [54, 0.1, 0.42],
  ];
  for (const [start, span, amp] of flashes) {
    if (t >= start && t < start + span) return amp * Math.random();
  }
  return 0;
}

function Mist({ t }: { t: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="absolute left-[-20%] right-[-20%]"
          style={{
            top: `${42 + i * 13}%`,
            height: `${90 - i * 16}px`,
            background:
              "linear-gradient(90deg, transparent, rgba(150,190,230,0.05), transparent)",
            filter: "blur(18px)",
            transform: `translateX(${(t * (2 + i * 0.4)) % 50}px)`,
          }}
        />
      ))}
      {[0, 1, 2].map((i) => (
        <div
          key={`up${i}`}
          className="absolute left-[-10%] right-[-10%]"
          style={{
            bottom: `${6 + i * 10}%`,
            height: `${36 + i * 12}px`,
            background:
              "linear-gradient(90deg, transparent, rgba(120,160,180,0.12), transparent)",
            filter: "blur(20px)",
          }}
        />
      ))}
    </div>
  );
}

function FilmGrain() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;
    let raf: number;
    const w = 320;
    const h = 180;
    canvas.width = w;
    canvas.height = h;
    const loop = () => {
      const image = ctx2d.createImageData(w, h);
      const d = image.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        d[i] = v;
        d[i + 1] = v;
        d[i + 2] = v;
        d[i + 3] = 10;
      }
      ctx2d.putImageData(image, 0, 0);
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <canvas
      ref={ref}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.12, mixBlendMode: "overlay" }}
    />
  );
}

/* ============ SCENE 2: DOORS ============ */
function Doors({ t }: { t: number }) {
  const open = Math.min(t / 10, 1);
  const light = Math.min(Math.max((t - 6) / 6, 0), 1);
  return (
    <div
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0a0f1a, #151d2b)",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          transform: `scale(${1 + open * 0.18})`,
          opacity: 1 - open * 0.5,
        }}
      >
        <img
          src="/castle-establishing.jpg"
          alt=""
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.6)" }}
        />
      </div>

      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 46%, rgba(255,206,140,${0.06 + light * 0.3}), transparent 52%)`,
        }}
      />

      <div className="relative" style={{ width: 360, height: 460 }}>
        <div
          className="absolute -inset-10 rounded-t-[140px]"
          style={{
            border: "16px solid #121a28",
            borderBottom: "none",
            boxShadow: "inset 0 0 60px rgba(0,0,0,0.6)",
          }}
        />
        <div
          className="absolute inset-0 overflow-hidden rounded-t-[120px]"
          style={{ backgroundColor: "#0b101b" }}
        >
          <div
            className="absolute left-0 top-0 bottom-0"
            style={{
              width: "50%",
              background:
                "repeating-linear-gradient(86deg, transparent 0, transparent 9px, rgba(0,0,0,0.2) 9px, rgba(0,0,0,0.2) 14px)",
              transform: `perspective(900px) rotateY(${open * -62}deg)`,
              transformOrigin: "left center",
            }}
          />
          <div
            className="absolute right-0 top-0 bottom-0"
            style={{
              width: "50%",
              background:
                "repeating-linear-gradient(86deg, transparent 0, transparent 9px, rgba(0,0,0,0.2) 9px, rgba(0,0,0,0.2) 14px)",
              transform: `perspective(900px) rotateY(${open * 62}deg)`,
              transformOrigin: "right center",
            }}
          />
          <div
            className="absolute top-[38%] left-1/2 -translate-x-1/2"
            style={{
              width: 130,
              height: 220,
              background: `radial-gradient(ellipse at 50% 60%, rgba(255,214,150,${0.5 + light * 0.4}), transparent 60%)`,
            }}
          />
        </div>
      </div>

      {[{ x: "16%", y: "36%" }, { x: "81%", y: "36%" }].map((p, i) => (
        <div key={i} className="absolute" style={{ left: p.x, top: p.y }}>
          <div
            style={{
              width: 20,
              height: 34,
              borderRadius: "50% 50% 30% 30%",
              background:
                "radial-gradient(circle, rgba(255,200,120,0.7), rgba(232,150,60,0.35) 60%, transparent)",
              filter: "blur(1.5px)",
              opacity: 0.65 + Math.sin(t * 2.4 + i) * 0.2,
            }}
          />
          <div style={{ width: 2, height: 26, margin: "0 auto", backgroundColor: "#0c111c" }} />
        </div>
      ))}

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(200,163,74,0.06), transparent 60%)",
        }}
      />
    </div>
  );
}

/* ============ SCENE 3: INTERIOR ============ */
function Interior({ t }: { t: number }) {
  const warm = Math.min(t / 4, 1);
  const title = Math.min(Math.max((t - 2) / 2, 0), 1);
  return (
    <div
      className="absolute inset-0"
      style={{
        background: "linear-gradient(180deg, #3a2c18, #241a11, #1a1c1e)",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(255,200,130,0.16), transparent 55%)",
          opacity: warm,
        }}
      />
      {Array.from({ length: 40 }).map((_, i) => {
        const flicker = 0.4 + Math.sin(t * 1.7 + i * 1.2) * 0.2;
        return (
          <div
            key={`c${i}`}
            className="absolute rounded-full"
            style={{
              left: `${6 + (i % 9) * 11}%`,
              top: `${4 + Math.floor(i / 9) * 9}%`,
              width: 26 + (i % 4) * 10,
              height: 26 + (i % 4) * 10,
              background: `radial-gradient(circle, rgba(255,206,140,${0.04 + (i % 3) * 0.012}), transparent 55%)`,
              opacity: flicker,
            }}
          />
        );
      })}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          opacity: title,
          transform: `translateY(${(1 - title) * 14}px)`,
        }}
      >
        <h1
          className="font-cinzel-decorative text-4xl sm:text-5xl lg:text-6xl font-bold"
          style={{
            color: "rgba(200,163,74,0.72)",
            textShadow: "0 0 40px rgba(200,163,74,0.18)",
            letterSpacing: "0.18em",
          }}
        >
          Hogwarts
        </h1>
      </div>
    </div>
  );
}