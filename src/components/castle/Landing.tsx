import { useState, useEffect, useRef } from "react";
import { useAmbience } from "@/context/AmbienceProvider";

interface Props {
  onComplete: () => void;
}

const DURATIONS: Record<number, number> = {
  1: 16, // literary title — smoke + candle-glow
  2: 12, // great doors open, enter
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
      audio.start("pad", 0.006);
      audio.fade("pad", 0.02, 10);
      audio.start("choir", 0.005);
      const c = setTimeout(() => audio.fade("choir", 0.016, 10), 7000);
      const f = setTimeout(() => audio.start("fire", 0.012), 2000);
      return () => {
        clearTimeout(c);
        clearTimeout(f);
      };
    } else if (scene === 2) {
      audio.start("fire", 0.03);
      audio.play("door");
      audio.fade("choir", 0.02, 6);
      audio.fade("pad", 0.028, 6);
      const steps = setTimeout(() => audio.start("footsteps", 0.005), 4000);
      return () => clearTimeout(steps);
    } else if (scene === 3) {
      audio.start("murmur");
      audio.start("pages");
      audio.fade("choir", 0.012, 5);
      audio.fade("pad", 0.02, 5);
      const done = setTimeout(() => {
        audio.stopAll();
        onComplete();
      }, 9000);
      return () => clearTimeout(done);
    }
  }, [scene, audio, onComplete]);

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
        className="fixed inset-0 flex items-center justify-center cursor-pointer overflow-hidden"
        style={{ backgroundColor: "#0a0807" }}
        onClick={enter}
      >
        <Embers />
        <Smoke t={0} warm />
        <div className="relative z-10 text-center select-none px-6">
          <p
            className="font-cormorant text-sm sm:text-base italic tracking-[0.2em]"
            style={{ color: "rgba(200,163,105,0.35)" }}
          >
            Before the wrought iron, a lantern waits to be lit.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="h-px w-10" style={{ background: "rgba(200,163,105,0.2)" }} />
            <span
              className="font-cinzel text-[9px] tracking-[0.3em] uppercase"
              style={{ color: "rgba(230,215,180,0.35)" }}
            >
              Tap to enter
            </span>
            <div className="h-px w-10" style={{ background: "rgba(200,163,105,0.2)" }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ backgroundColor: "#0a0807" }}
    >
      {scene < 4 && elapsed > 3 && (
        <button
          onClick={skip}
          className="fixed top-6 right-6 z-50 px-4 py-2 cursor-pointer"
          style={{
            border: "1px solid rgba(200,163,105,0.15)",
            backgroundColor: "rgba(10,8,7,0.6)",
          }}
        >
          <span
            className="font-cinzel text-[10px] tracking-[0.2em] uppercase"
            style={{ color: "rgba(240,225,200,0.3)" }}
          >
            Skip
          </span>
        </button>
      )}

      {scene === 1 && <Title t={elapsed} />}
      {scene === 2 && <Doors t={elapsed} />}
      {scene === 3 && <Interior t={elapsed} />}
    </div>
  );
}

/* ============ SCENE 1: LITERARY TITLE ============ */
function Title({ t }: { t: number }) {
  const titleIn = Math.min(Math.max((t - 1) / 2.5, 0), 1);
  const subtitleIn = Math.min(Math.max((t - 4) / 2, 0), 1);
  const resolve = Math.min(Math.max((t - 9) / 5, 0), 1);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* warm atmospheric base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 42%, rgba(74,50,26,0.4), rgba(20,13,9,0.85) 70%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 60%, rgba(255,190,120,0.12), transparent 55%)",
          opacity: 0.5 + Math.sin(t * 0.3) * 0.1,
        }}
      />

      {/* drifting smoke behind the lettering */}
      <Smoke t={t} warm />
      <CandleGlow t={t} />

      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
        style={{ opacity: 1 - resolve * 0.9, transform: `scale(${1 + resolve * 0.05})` }}
      >
        {/* glowing star over the i */}
        <div
          className="mb-6"
          style={{
            opacity: titleIn,
            transform: `scale(${0.6 + titleIn * 0.4})`,
          }}
        >
          <div
            className="w-10 h-10 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(255,206,140,0.5), transparent 65%)",
              boxShadow: "0 0 34px rgba(255,190,120,0.35)",
            }}
          />
        </div>

        <h1
          className="font-cinzel-decorative text-4xl sm:text-5xl lg:text-6xl font-bold"
          style={{
            opacity: titleIn,
            transform: `scale(${0.94 + titleIn * 0.06}) translateY(${(1 - titleIn) * 16}px)`,
            color: "rgba(216,178,110,0.8)",
            textShadow:
              "0 0 24px rgba(216,178,110,0.18), 0 2px 2px rgba(0,0,0,0.5)",
            letterSpacing: "0.18em",
          }}
        >
          {["H", "O", "G", "W", "A", "R", "T", "S"].map((ch, i) => (
            <span
              key={i}
              className="inline-block"
              style={{
                opacity: titleIn,
                transform: `translateY(${(1 - titleIn) * (8 + (i % 3) * 6)}px)`,
                animation: `flicker 3.5s ease-in-out ${i * 0.35}s infinite alternate`,
              }}
            >
              {ch}
            </span>
          ))}
        </h1>

        <div
          className="mx-auto mt-4 h-px"
          style={{
            width: `${120 * subtitleIn}px`,
            background: "linear-gradient(90deg, transparent, rgba(216,178,110,0.4), transparent)",
            opacity: subtitleIn,
          }}
        />

        <p
          className="font-cormorant text-sm sm:text-base italic mt-4"
          style={{
            opacity: subtitleIn,
            color: "rgba(226,203,160,0.45)",
            transform: `translateY(${(1 - subtitleIn) * 10}px)`,
            textShadow: "0 1px 2px rgba(0,0,0,0.4)",
          }}
        >
          a digital love letter to a place of towers
        </p>
      </div>

      {/* faint resolve cue */}
      <div
        className="absolute bottom-[12%] left-1/2 -translate-x-1/2"
        style={{ opacity: resolve * 0.5 }}
      >
        <span className="font-cinzel text-[9px] tracking-[0.25em] uppercase" style={{ color: "rgba(230,205,160,0.25)" }}>
          the doors are heavy with years
        </span>
      </div>

      <FilmGrain />
      <Vignette />
    </div>
  );
}

/* ============ AMBIENT LAYERS ============ */
function Smoke({ t, warm = false }: { t: number; warm?: boolean }) {
  const tint = warm ? "rgba(170,130,90,0.07)" : "rgba(150,140,150,0.05)";
  const tint2 = warm ? "rgba(200,160,110,0.1)" : "rgba(170,160,180,0.08)";
  return (
    <div className="absolute inset-0 pointer-events-none">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={`h${i}`}
          className="absolute left-[-25%] right-[-25%]"
          style={{
            top: `${40 + i * 14}%`,
            height: `${110 - i * 18}px`,
            background: `linear-gradient(90deg, transparent, ${tint}, transparent)`,
            filter: `blur(${16 + i * 4}px)`,
            transform: `translateX(${(t * (2.4 + i * 0.5)) % 46}px)`,
          }}
        />
      ))}
      {[0, 1, 2].map((i) => (
        <div
          key={`up${i}`}
          className="absolute left-[-15%] right-[-15%]"
          style={{
            bottom: `${6 + i * 12}%`,
            height: `${40 + i * 14}px`,
            background: `linear-gradient(90deg, transparent, ${tint2}, transparent)`,
            filter: "blur(22px)",
          }}
        />
      ))}
    </div>
  );
}

function Embers() {
  const motes = useRef(
    Array.from({ length: 26 }, (_, i) => ({
      x: (i * 37) % 100,
      y: 30 + (i * 53) % 55,
      size: 2 + (i % 3),
      dur: 7 + (i % 5) * 2,
      delay: (i % 8) * 0.7,
    }))
  );
  return (
    <div className="absolute inset-0 pointer-events-none">
      {motes.current.map((m, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${m.x}%`,
            top: `${m.y}%`,
            width: m.size,
            height: m.size,
            backgroundColor: "rgba(255,200,130,0.5)",
            boxShadow: "0 0 6px rgba(255,190,110,0.5)",
            animation: `emberrise ${m.dur}s linear ${m.dur * (i % 3)}ms infinite`,
          }}
        />
      ))}
    </div>
  );
}

function CandleGlow({ t }: { t: number }) {
  const glows = [
    { x: "18%", y: "20%", s: 40, a: 0.05, d: 2.4 },
    { x: "82%", y: "24%", s: 34, a: 0.045, d: 3.1 },
    { x: "24%", y: "74%", s: 30, a: 0.04, d: 2.8 },
    { x: "77%", y: "78%", s: 36, a: 0.045, d: 3.4 },
  ];
  return (
    <div className="absolute inset-0 pointer-events-none">
      {glows.map((g, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: g.x,
            top: g.y,
            width: g.s,
            height: g.s,
            background: `radial-gradient(circle, rgba(255,190,120,${g.a * (0.7 + Math.sin(t * 0.7 + i) * 0.3)}), transparent 65%)`,
            animation: `breathe ${g.d}s ease-in-out infinite`,
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
        d[i + 3] = 9;
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
      style={{ opacity: 0.1, mixBlendMode: "overlay" }}
    />
  );
}

function Vignette() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: "radial-gradient(ellipse at 50% 46%, transparent 52%, rgba(4,3,2,0.6) 100%)",
      }}
    />
  );
}

/* ============ SCENE 2: DOORS ============ */
function Doors({ t }: { t: number }) {
  const open = Math.min(t / 9, 1);
  const light = Math.min(Math.max((t - 5) / 5, 0), 1);
  return (
    <div
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #120d09, #1c1610)",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 46%, rgba(255,206,140,${0.08 + light * 0.32}), transparent 52%)`,
        }}
      />

      <div className="relative" style={{ width: 360, height: 460 }}>
        <div
          className="absolute -inset-10 rounded-t-[140px]"
          style={{
            border: "16px solid #14100c",
            borderBottom: "none",
            boxShadow: "inset 0 0 60px rgba(0,0,0,0.6)",
          }}
        />
        <div
          className="absolute inset-0 overflow-hidden rounded-t-[120px]"
          style={{ backgroundColor: "#0c0a08" }}
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
        <div key={i} className="absolute" style={{ left: p.x, top: p.y, opacity: light * 0.5 }}>
          <div
            style={{
              width: 20,
              height: 34,
              borderRadius: "50% 50% 30% 30%",
              background:
                "radial-gradient(circle, rgba(255,210,130,0.8), rgba(240,160,70,0.4) 60%, transparent)",
              filter: "blur(1.5px)",
            }}
          />
          <div style={{ width: 2, height: 26, margin: "0 auto", backgroundColor: "#0d0b08" }} />
        </div>
      ))}

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(200,163,105,0.06), transparent 60%)",
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
        background: "linear-gradient(180deg, #3a2c18, #241a11, #18171a)",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(255,205,135,0.18), transparent 55%)",
          opacity: warm,
        }}
      />
      {Array.from({ length: 40 }).map((_, i) => {
        const flick = 0.4 + Math.sin(t * 1.7 + i * 1.2) * 0.2;
        return (
          <div
            key={`c${i}`}
            className="absolute rounded-full"
            style={{
              left: `${6 + (i % 9) * 11}%`,
              top: `${4 + Math.floor(i / 9) * 9}%`,
              width: 26 + (i % 4) * 10,
              height: 26 + (i % 4) * 10,
              background: `radial-gradient(circle, rgba(255,206,140,${0.05 + (i % 3) * 0.014}), transparent 55%)`,
              opacity: flick,
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
            color: "rgba(216,178,110,0.75)",
            textShadow: "0 0 40px rgba(216,178,110,0.18)",
            letterSpacing: "0.18em",
          }}
        >
          Hogwarts
        </h1>
      </div>
    </div>
  );
}