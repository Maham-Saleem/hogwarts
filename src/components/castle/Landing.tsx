import { useState, useEffect, useRef } from "react";
import { useAmbientAudio } from "@/hooks/useAmbientAudio";

interface Props {
  onComplete: () => void;
}

const DURATIONS: Record<number, number> = {
  1: 60, // single cinematic establishing shot
  2: 15, // doors focus, opening
  3: 10, // interior warm fade
};

export function Landing({ onComplete }: Props) {
  const [scene, setScene] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const started = useRef(false);
  const audio = useAmbientAudio();

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
      audio.fade("pad", 0.02, 10);
      audio.fade("arpeggio", 0.05, 12);
      const t1 = setTimeout(() => audio.start("choir", 0.006), 12000);
      const t2 = setTimeout(() => audio.fade("choir", 0.016, 10), 22000);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    } else if (scene === 2) {
      audio.start("fire", 0.02);
      audio.play("door");
      audio.fade("rain", 0.012, 6);
      audio.fade("wind", 0.008, 5);
      audio.fade("choir", 0.02, 6);
      audio.fade("pad", 0.028, 6);
      const t = setTimeout(() => audio.start("footsteps", 0.006), 4000);
      return () => clearTimeout(t);
    } else if (scene === 3) {
      audio.start("murmur");
      audio.start("pages");
      audio.fade("fire", 0.04, 3);
      audio.fade("rain", 0, 4);
      audio.fade("wind", 0, 3);
      audio.fade("choir", 0.014, 6);
      audio.fade("pad", 0.02, 6);
      audio.fade("arpeggio", 0.02, 5);
      const t = setTimeout(() => {
        audio.stopAll();
        onComplete();
      }, 9000);
      return () => clearTimeout(t);
    }
  }, [scene, audio, onComplete]);

  useEffect(() => {
    if (scene !== 1) return;
    const bell = setInterval(() => audio.play("bells"), 14000);
    const owl = setInterval(() => audio.play("owl"), 15000);
    const thunder = [4000, 15000, 30000, 45000].map((d) =>
      setTimeout(() => audio.play("thunder"), d),
    );
    return () => {
      clearInterval(bell);
      clearInterval(owl);
      thunder.forEach((t) => clearTimeout(t));
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
  const zoom = 1 + (t / 60) * 0.07;
  const rise = t * 0.4;
  const rainOpacity = 0.28 + Math.sin(t * 0.3) * 0.04;
  const lightning = lightningAt(t);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          transform: `scale(${zoom}) translateY(-${rise}px)`,
          transformOrigin: "50% 62%",
        }}
      >
        <Sky t={t} />
        <Mountains t={t} />
        <EpicCastle t={t} />
        <Shore />
        <Lake t={t} />
      </div>

      {lightning > 0 && (
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 50% 42%, rgba(210,226,255,${lightning * 0.5}), transparent 55%)`,
          }}
        />
      )}

      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(102deg, transparent 0px, transparent 2px, rgba(120,150,190,0.05) 3px, transparent 4px)",
          opacity: rainOpacity,
          transform: `translateY(${t * 6}px)`,
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 46%, transparent 52%, rgba(4,6,10,0.55) 100%)",
        }}
      />
    </div>
  );
}

function lightningAt(t: number): number {
  const flashes: [number, number, number][] = [
    [5, 0.12, 0.3],
    [18, 0.12, 0.22],
    [31, 0.12, 0.26],
    [44, 0.12, 0.2],
  ];
  for (const [start, span, amp] of flashes) {
    if (t >= start && t < start + span) return amp;
  }
  return 0;
}

function Sky({ t }: { t: number }) {
  return (
    <div className="absolute inset-0" style={{ overflow: "hidden" }}>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #070a11 0%, #0b1220 30%, #16223a 60%, #1f3352 85%, #2c4770 100%)",
        }}
      />
      {Array.from({ length: 90 }).map((_, i) => (
        <div
          key={`star${i}`}
          className="absolute rounded-full"
          style={{
            left: `${(i * 47) % 100}%`,
            top: `${(i * 29) % 42}%`,
            width: (i % 6) === 0 ? 1.6 : 0.9,
            height: (i % 6) === 0 ? 1.6 : 0.9,
            backgroundColor: `rgba(226,236,255,${0.25 + (i % 5) * 0.12})`,
            opacity: 0.5 + Math.sin(t * 0.3 + i) * 0.3,
          }}
        />
      ))}
      <div
        className="absolute rounded-full"
        style={{
          right: "13%",
          top: "9%",
          width: 130,
          height: 130,
          background:
            "radial-gradient(circle, rgba(214,226,246,0.85) 0%, rgba(196,214,240,0.4) 38%, rgba(180,205,235,0.08) 55%, transparent 68%)",
          boxShadow: "0 0 90px rgba(190,214,244,0.25)",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          right: "14%",
          top: "10%",
          width: 118,
          height: 118,
          background: "rgba(150,175,215,0.18)",
          filter: "blur(2px)",
        }}
      />
      {[0, 1, 2].map((i) => (
        <div
          key={`cl${i}`}
          className="absolute"
          style={{
            top: `${14 + i * 9}%`,
            left: `${(i * 36 - (t * 1.2) % 55)}%`,
            width: "58%",
            height: 26 + i * 10,
            borderRadius: 999,
            background: "linear-gradient(90deg, transparent, rgba(90,120,165,0.1), transparent)",
            filter: "blur(8px)",
          }}
        />
      ))}
    </div>
  );
}

function Mountains({ t }: { t: number }) {
  const drift = (t * 0.2) % 2;
  return (
    <div className="absolute inset-0" style={{ overflow: "hidden" }}>
      <svg
        className="absolute left-0 right-0"
        style={{ top: "30%", height: "34%" }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          d="M0 100 L0 70 L8 60 L16 68 L26 50 L36 64 L46 55 L58 70 L70 52 L82 66 L92 58 L100 66 L100 100 Z"
          fill="rgba(36,54,86,0.55)"
        />
        <path
          d="M0 100 L0 80 L10 72 L22 82 L34 70 L48 84 L60 74 L74 86 L86 76 L100 82 L100 100 Z"
          fill="rgba(28,44,72,0.6)"
        />
      </svg>
      <div
        className="absolute left-0 right-0"
        style={{
          top: "52%",
          height: "30%",
          background:
            "linear-gradient(180deg, rgba(20,32,54,0.0), rgba(12,20,36,0.5))",
          transform: `translateX(${drift}%)`,
        }}
      />
    </div>
  );
}

function Shore() {
  return (
    <div className="absolute inset-0" style={{ overflow: "hidden" }}>
      <svg
        className="absolute left-0 right-0"
        style={{ top: "56%", height: "20%" }}
        viewBox="0 0 100 40"
        preserveAspectRatio="none"
      >
        {[8, 16, 24, 32].map((y, i) => (
          <path
            key={`tree${i}`}
            d={`M${i * 20 - 6} ${y * 0 + 34} L${i * 20 - 6 + 3} 30 L${i * 20 - 6 + 6} ${y * 0 + 34} Z`}
            fill="transparent"
          />
        ))}
        <path
          d="M0 40 L0 34 Q4 30 6 34 Q9 31 11 34 Q14 30 17 34 Q20 32 23 34 Q27 30 30 34 Q33 32 36 34 Q39 30 43 34 Q46 31 50 34 Q53 30 57 34 Q60 32 64 34 Q67 30 71 34 Q74 31 78 34 Q81 30 85 34 Q88 32 92 34 Q95 31 100 34 L100 40 Z"
          fill="rgba(10,16,28,0.9)"
        />
      </svg>
    </div>
  );
}

function Lake({ t }: { t: number }) {
  return (
    <div className="absolute inset-0" style={{ overflow: "hidden" }}>
      <div
        className="absolute left-0 right-0"
        style={{
          top: "52%",
          height: "48%",
          background:
            "linear-gradient(180deg, rgba(24,38,64,0.35), rgba(6,10,18,0.6) 40%, rgba(3,6,12,0.9))",
        }}
      />
      <div
        className="absolute left-0 right-0"
        style={{
          top: "58%",
          height: "30%",
          background:
            "linear-gradient(180deg, transparent, rgba(150,178,214,0.06), transparent)",
        }}
      />
      {Array.from({ length: 26 }).map((_, i) => {
        const x = 20 + (i % 9) * 8 + Math.sin(t * 0.5 + i) * 1.5;
        const y = 56 + Math.floor(i / 9) * 4;
        return (
          <div
            key={`wp${i}`}
            className="absolute"
            style={{
              left: `${(x + 10) % 88}%`,
              top: `${(y + 6) % 26 + 56}%`,
              width: 6 + (i % 4) * 4,
              height: 1,
              background:
                "linear-gradient(90deg, transparent, rgba(255,198,130,0.12), transparent)",
              opacity: 0.5 + Math.sin(t * 1.3 + i * 1.4) * 0.4,
            }}
          />
        );
      })}
      {[60, 63, 66, 69, 72].map((y, i) => (
        <div
          key={`mr${i}`}
          className="absolute left-0 right-0"
          style={{
            top: `${y}%`,
            height: 1,
            background: `linear-gradient(90deg, transparent, rgba(150,178,214,${0.1 - i * 0.015}), transparent)`,
            opacity: 0.5 + Math.sin(t * 0.8 + i) * 0.3,
          }}
        />
      ))}
      <div
        className="absolute left-1/2"
        style={{
          top: "55%",
          width: "52%",
          height: "34%",
          transform: "translateX(-50%)",
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(255,196,120,0.1), transparent 60%)",
        }}
      />
    </div>
  );
}

function EpicCastle({ t }: { t: number }) {
  return (
    <div className="absolute inset-0" style={{ overflow: "hidden" }}>
      <div
        className="absolute left-1/2"
        style={{
          top: "38%",
          width: 980,
          transform: "translateX(-50%)",
        }}
      >
        <svg width="980" height="420" viewBox="0 0 980 420">
          <defs>
            <linearGradient id="stone" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#232c3c" />
              <stop offset="1" stopColor="#131a28" />
            </linearGradient>
            <linearGradient id="roof" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1b2232" />
              <stop offset="1" stopColor="#0e1420" />
            </linearGradient>
            <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="rgba(255,190,120,0.5)" />
              <stop offset="1" stopColor="rgba(255,190,120,0)" />
            </radialGradient>
          </defs>

          {/* warm halo rising from the castle */}
          <ellipse cx="490" cy="360" rx="330" ry="120" fill="url(#glow)" opacity="0.5" />

          {/* long low curtain walls */}
          <rect x="60" y="330" width="860" height="70" fill="url(#stone)" />
          {[80, 160, 240, 320, 400, 480, 560, 640, 720, 800, 880].map((x) => (
            <rect key={`b${x}`} x={x} y="318" width="14" height="14" fill="#1c2534" />
          ))}

          {/* central great hall with peaked roof */}
          <rect x="360" y="250" width="260" height="150" fill="url(#stone)" />
          <polygon points="360,250 490,150 620,250" fill="url(#roof)" />
          {[400, 460, 520].map((x) => (
            <rect key={`rh${x}`} x={x} y="160" width="22" height="20" fill="#0e1420" />
          ))}

          {/* main keep */}
          <rect x="420" y="120" width="140" height="280" fill="url(#stone)" />
          <rect x="420" y="90" width="140" height="34" fill="#1c2534" />
          <polygon points="420,90 490,18 560,90" fill="url(#roof)" />
          <rect x="478" y="30" width="24" height="30" fill="#0e1420" />

          {/* east wing */}
          <rect x="170" y="270" width="190" height="130" fill="url(#stone)" />
          <polygon points="170,270 265,210 360,270" fill="url(#roof)" />
          <rect x="80" y="250" width="90" height="150" fill="url(#stone)" />
          <rect x="80" y="224" width="90" height="28" fill="#1c2534" />
          <polygon points="80,224 125,168 170,224" fill="url(#roof)" />
          <rect x="160" y="180" width="34" height="50" fill="url(#stone)" />
          <polygon points="160,180 177,150 194,180" fill="url(#roof)" />

          {/* west wing */}
          <rect x="620" y="270" width="190" height="130" fill="url(#stone)" />
          <polygon points="620,270 715,210 810,270" fill="url(#roof)" />
          <rect x="810" y="250" width="90" height="150" fill="url(#stone)" />
          <rect x="810" y="224" width="90" height="28" fill="#1c2534" />
          <polygon points="810,224 855,168 900,224" fill="url(#roof)" />
          <rect x="786" y="180" width="34" height="50" fill="url(#stone)" />
          <polygon points="786,180 803,150 820,180" fill="url(#roof)" />

          {/* flanking round towers */}
          <rect x="16" y="250" width="64" height="150" rx="6" fill="url(#stone)" />
          <rect x="16" y="224" width="64" height="28" rx="6" fill="#1c2534" />
          <polygon points="16,224 48,158 80,224" fill="url(#roof)" />
          <rect x="900" y="250" width="64" height="150" rx="6" fill="url(#stone)" />
          <rect x="900" y="224" width="64" height="28" rx="6" fill="#1c2534" />
          <polygon points="900,224 932,158 964,224" fill="url(#roof)" />

          {/* tall corner towers */}
          <rect x="260" y="120" width="70" height="260" rx="5" fill="url(#stone)" />
          <rect x="260" y="92" width="70" height="30" rx="5" fill="#1c2534" />
          <polygon points="260,92 295,30 330,92" fill="url(#roof)" />
          <rect x="650" y="120" width="70" height="260" rx="5" fill="url(#stone)" />
          <rect x="650" y="92" width="70" height="30" rx="5" fill="#1c2534" />
          <polygon points="650,92 685,30 720,92" fill="url(#roof)" />

          {/* entrance: massive arched door */}
          <path
            d="M430 330 L430 260 Q490 220 550 260 L550 330 Z"
            fill="#0a0f1a"
          />
          <path
            d="M448 330 L448 268 Q490 236 532 268 L532 330 Z"
            fill="url(#stone)"
          />
          <ellipse cx="490" cy="300" rx="46" ry="70" fill="rgba(255,190,120,0.18)" />
          <rect x="474" y="270" width="32" height="60" fill="rgba(255,210,150,0.75)" />

          {/* window glows */}
          <g fill="rgba(255,202,130,0.9)">
            {[445, 475, 505, 535].map((x, r) =>
              [0, 1, 2, 3].map((c) => {
                const y = 130 + r * 46 + c * 6;
                return (
                  <rect
                    key={`wk${x}-${c}`}
                    x={x + 14}
                    y={y}
                    width="11"
                    height="15"
                    rx="1.5"
                    opacity={0.55 + Math.sin(t * 1.2 + x + c) * 0.2}
                  />
                );
              }),
            )}
            {[186, 216, 246, 276, 306].map((x) =>
              [0, 1, 2].map((c) => (
                <rect
                  key={`e${x}${c}`}
                  x={x}
                  y={285 + c * 40}
                  width="10"
                  height="14"
                  rx="1.5"
                  opacity={0.5 + Math.sin(t * 1.1 + x * 0.3 + c) * 0.22}
                />
              )),
            )}
            {[636, 666, 696, 726, 756].map((x) =>
              [0, 1, 2].map((c) => (
                <rect
                  key={`w${x}${c}`}
                  x={x}
                  y={285 + c * 40}
                  width="10"
                  height="14"
                  rx="1.5"
                  opacity={0.5 + Math.sin(t * 1.1 + x * 0.3 + c) * 0.22}
                />
              )),
            )}
            {[34, 74].map((x) => [0, 1].map((c) => (
              <rect key={`t${x}${c}`} x={x} y={262 + c * 44} width="9" height="12" rx="1.5" opacity={0.5} />
            )))}
            {[918, 954].map((x) => [0, 1].map((c) => (
              <rect key={`tr${x}${c}`} x={x} y={262 + c * 44} width="9" height="12" rx="1.5" opacity={0.5} />
            )))}
            {[98, 98].map((x, c) => (
              <rect key={`k${c}`} x={x} y={272 + c * 44} width="10" height="13" rx="1.5" opacity={0.5} />
            ))}
            {[880, 880].map((x, c) => (
              <rect key={`k2${c}`} x={x} y={272 + c * 44} width="10" height="13" rx="1.5" opacity={0.5} />
            ))}
          </g>

          {/* faint mist at the base */}
          <ellipse cx="490" cy="400" rx="480" ry="30" fill="rgba(90,120,165,0.12)" />
        </svg>
      </div>
    </div>
  );
}

/* ============ SCENE 2: DOORS ============ */
function Doors({ t }: { t: number }) {
  const open = Math.min(t / 10, 1);
  const light = Math.min(Math.max((t - 6) / 5, 0), 1);
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        background: "linear-gradient(180deg, #0a0f1a, #1a2436)",
      }}
    >
      <div className="relative" style={{ width: 360, height: 480 }}>
        <div
          className="absolute -inset-10 rounded-t-[140px]"
          style={{
            border: "14px solid #151d2b",
            borderBottom: "none",
            boxShadow: "inset 0 0 40px rgba(0,0,0,0.6)",
          }}
        />
        <div
          className="absolute inset-0 overflow-hidden rounded-t-[120px]"
          style={{
            background: "linear-gradient(180deg, #0a0f1a, #131a28)",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 40%, rgba(255,190,120,0.14), transparent 55%)",
              opacity: 0.4 + light * 0.6,
            }}
          />
          <div
            className="absolute left-0 top-0 bottom-0"
            style={{
              width: "50%",
              background:
                "repeating-linear-gradient(86deg, transparent 0, transparent 8px, rgba(0,0,0,0.18) 8px, rgba(0,0,0,0.18) 13px)",
              transform: `perspective(900px) rotateY(${open * -62}deg)`,
              transformOrigin: "left center",
            }}
          />
          <div
            className="absolute right-0 top-0 bottom-0"
            style={{
              width: "50%",
              background:
                "repeating-linear-gradient(86deg, transparent 0, transparent 8px, rgba(0,0,0,0.18) 8px, rgba(0,0,0,0.18) 13px)",
              transform: `perspective(900px) rotateY(${open * 62}deg)`,
              transformOrigin: "right center",
            }}
          />
          <div
            className="absolute top-[40%] left-1/2 -translate-x-1/2"
            style={{
              width: 120,
              height: 200,
              background: `radial-gradient(ellipse at 50% 60%, rgba(255,214,150,${0.5 + light * 0.4}), transparent 60%)`,
            }}
          />
        </div>
      </div>

      {[{ x: "14%", y: "34%" }, { x: "84%", y: "34%" }].map((p, i) => (
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
          background: `radial-gradient(ellipse at 50% 45%, rgba(255,200,130,${light * 0.25}), transparent 55%)`,
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
