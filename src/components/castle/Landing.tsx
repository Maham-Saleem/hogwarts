import { useState, useEffect, useRef, useCallback } from "react";
import { useAmbientAudio } from "@/hooks/useAmbientAudio";

interface Props {
  onComplete: () => void;
}

export function Landing({ onComplete }: Props) {
  const [scene, setScene] = useState(0);
  const [t, setT] = useState(0);
  const started = useRef(false);
  const sceneRef = useRef(0);
  const audio = useAmbientAudio();

  const advance = useCallback((to: number) => {
    sceneRef.current = to;
    setScene(to);
    setT(0);
  }, []);

  useEffect(() => {
    if (!started.current) return;
    const t0 = performance.now();
    let raf: number;
    const loop = () => {
      setT((performance.now() - t0) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [started.current]);

  useEffect(() => {
    if (!started.current) return;
    const s = sceneRef.current;

    if (s === 1 && t >= 5) {
      advance(2);
    } else if (s === 2 && t >= 10) {
      advance(3);
    } else if (s === 3 && t >= 15) {
      advance(4);
    } else if (s === 4 && t >= 15) {
      advance(5);
    } else if (s === 5 && t >= 15) {
      advance(6);
    } else if (s === 6 && t >= 30) {
      advance(7);
    }
  }, [t, scene, advance]);

  useEffect(() => {
    if (!started.current) return;
    const s = scene;

    if (s === 1) {
      audio.start("wind");
      audio.start("rain", 0.02);
    } else if (s === 2) {
      audio.start("bells");
    } else if (s === 3) {
      audio.start("pad");
      audio.start("choir");
      audio.fade("wind", 0.015, 6);
      audio.start("owl");
    } else if (s === 4) {
      audio.fade("rain", 0.01, 5);
      audio.fade("wind", 0.005, 4);
      audio.start("fire");
    } else if (s === 5) {
      audio.start("footsteps");
      audio.fade("rain", 0, 3);
      audio.fade("wind", 0, 2.5);
      audio.fade("fire", 0.04, 3);
      audio.fade("pad", 0.008, 4);
      audio.fade("choir", 0.005, 4);
    } else if (s === 6) {
      audio.start("murmur");
      audio.fade("choir", 0.012, 4);
      audio.fade("fire", 0.035, 2);
      audio.start("hedwig");
    } else if (s === 7) {
      audio.stopAll();
      onComplete();
    }
  }, [scene, audio, onComplete]);

  const enter = () => {
    if (started.current) return;
    started.current = true;
    audio.init();
    advance(1);
  };

  const skip = () => {
    audio.stopAll();
    advance(7);
  };

  if (scene === 0) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center cursor-pointer"
        style={{ backgroundColor: "#1a1c1e" }}
        onClick={enter}
      >
        <div className="text-center select-none">
          <p
            className="font-cormorant text-sm tracking-[0.3em] uppercase"
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
      style={{ backgroundColor: "#0a0b0c" }}
    >
      {scene < 7 && t > 5 && (
        <button
          onClick={skip}
          className="fixed top-6 right-6 z-50 px-4 py-2 cursor-pointer"
          style={{
            border: "1px solid rgba(200,163,74,0.15)",
            backgroundColor: "rgba(10,11,12,0.7)",
          }}
        >
          <span
            className="font-cinzel text-[10px] tracking-[0.2em] uppercase"
            style={{ color: "rgba(232,223,201,0.35)" }}
          >
            Skip
          </span>
        </button>
      )}

      {scene === 1 && <SceneDarkness t={t} />}
      {scene === 2 && <SceneReveal t={t} />}
      {scene === 3 && <SceneApproach t={t} />}
      {scene === 4 && <SceneDoors t={t} />}
      {scene === 5 && <SceneEntrance t={t} />}
      {scene === 6 && <SceneGreatHall t={t} />}
    </div>
  );
}

function SceneDarkness({ t }: { t: number }) {
  const opacity = Math.min(t / 3, 1);
  return (
    <div className="absolute inset-0" style={{ backgroundColor: "#0a0b0c" }}>
      <div
        className="absolute rounded-full"
        style={{
          top: "50%",
          left: "50%",
          width: 300,
          height: 300,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(245,196,106,0.04), transparent 60%)",
          opacity,
        }}
      />
    </div>
  );
}

function SceneReveal({ t }: { t: number }) {
  const reveal = Math.min(t / 8, 1);
  const fogDrift = Math.sin(t * 0.15) * 3;

  return (
    <div
      className="absolute inset-0"
      style={{
        background: "linear-gradient(180deg, #0a0b0c, #1a1c1e, #0a0b0c)",
      }}
    >
      <div
        className="absolute top-[6%] right-[14%]"
        style={{
          width: 90,
          height: 90,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(110,143,191,0.25), rgba(110,143,191,0.06) 45%, transparent 65%)",
          opacity: reveal,
        }}
      />

      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={`s${i}`}
          className="absolute rounded-full"
          style={{
            left: `${5 + ((i * 37) % 90)}%`,
            top: `${3 + ((i * 23) % 30)}%`,
            width: 1,
            height: 1,
            backgroundColor: `rgba(244,239,226,${0.06 + (i % 4) * 0.03})`,
            opacity: reveal,
          }}
        />
      ))}

      <div
        className="absolute left-1/2"
        style={{
          bottom: "32%",
          transform: `translateX(-50%) translateX(${fogDrift}px)`,
          opacity: reveal * 0.5,
        }}
      >
        <CastleSilhouette />
      </div>

      <div
        className="absolute left-0 right-0"
        style={{
          bottom: "25%",
          height: "15%",
          background:
            "linear-gradient(0deg, rgba(26,28,30,0.6), transparent)",
          opacity: reveal,
        }}
      />

      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "28%",
          background: "linear-gradient(180deg, rgba(10,11,12,0.15), rgba(10,11,12,0.3))",
          opacity: reveal,
        }}
      />
      {[38, 36, 34].map((y, i) => (
        <div
          key={`w${i}`}
          className="absolute left-0 right-0"
          style={{
            top: `${y}%`,
            height: 1,
            background: `rgba(110,143,191,${0.06 - i * 0.015})`,
            opacity: reveal,
          }}
        />
      ))}
    </div>
  );
}

function SceneApproach({ t }: { t: number }) {
  const push = 1 + t * 0.006;
  const lightning =
    t > 4 && t < 4.15
      ? 0.2
      : t > 9 && t < 9.1
        ? 0.15
        : 0;

  return (
    <div
      className="absolute inset-0"
      style={{
        background: "linear-gradient(180deg, #0a0b0c, #1a1c1e, #0a0b0c)",
      }}
    >
      <div
        className="absolute top-[6%] right-[14%]"
        style={{
          width: 110,
          height: 110,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(110,143,191,0.3), rgba(110,143,191,0.08) 45%, transparent 65%)",
        }}
      />

      <div
        className="absolute left-1/2"
        style={{
          bottom: "22%",
          transform: `translateX(-50%) scale(${push})`,
          transformOrigin: "center bottom",
        }}
      >
        <CastleSilhouetteDetail />
      </div>

      {[
        { x: 38, y: 38 },
        { x: 44, y: 37 },
        { x: 50, y: 36 },
        { x: 56, y: 37 },
        { x: 62, y: 38 },
        { x: 48, y: 33 },
        { x: 54, y: 32 },
      ].map((p, i) => (
        <div
          key={`gw${i}`}
          className="absolute"
          style={{
            left: `${p.x}%`,
            bottom: `${p.y}%`,
            width: 3,
            height: 2.5,
            backgroundColor: `rgba(245,196,106,${0.35 + (i % 3) * 0.1})`,
            boxShadow:
              "0 0 6px rgba(245,196,106,0.2), 0 0 12px rgba(217,119,50,0.08)",
          }}
        />
      ))}

      {lightning > 0 && (
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 48% 30%, rgba(110,143,191,${lightning}), transparent 45%)`,
          }}
        />
      )}

      <div
        className="absolute left-0 right-0"
        style={{
          bottom: "20%",
          height: "18%",
          background:
            "linear-gradient(0deg, rgba(26,28,30,0.5), transparent)",
        }}
      />
    </div>
  );
}

function SceneDoors({ t }: { t: number }) {
  const doorOpen = Math.min(t / 8, 1);
  const lightReveal = Math.min(Math.max((t - 6) / 4, 0), 1);

  return (
    <div
      className="absolute inset-0"
      style={{
        background: "linear-gradient(180deg, #0a0b0c, #1a1c1e, #0a0b0c)",
      }}
    >
      <div
        className="absolute top-[6%] right-[14%]"
        style={{
          width: 100,
          height: 100,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(110,143,191,0.28), rgba(110,143,191,0.07) 45%, transparent 65%)",
          opacity: 1 - doorOpen * 0.5,
        }}
      />

      <div
        className="absolute left-1/2 top-1/2"
        style={{
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="relative" style={{ width: 280, height: 400 }}>
          <div
            className="absolute rounded-t-full overflow-hidden"
            style={{
              left: 0,
              top: 0,
              width: 140,
              height: 400,
              background:
                "linear-gradient(180deg, rgba(59,42,31,0.5), rgba(46,50,56,0.4))",
              border: "2px solid rgba(94,70,50,0.15)",
              borderRight: "none",
              transformOrigin: "left center",
              transform: `perspective(800px) rotateY(${doorOpen * -55}deg)`,
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(88deg, transparent, transparent 6px, rgba(0,0,0,0.04) 6px, rgba(0,0,0,0.04) 10px)",
              }}
            />
            <div
              className="absolute top-1/2 right-4 w-4 h-10 rounded-full"
              style={{
                background:
                  "linear-gradient(135deg, rgba(200,163,74,0.45), rgba(141,115,74,0.3))",
                boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
              }}
            />
          </div>

          <div
            className="absolute rounded-t-full overflow-hidden"
            style={{
              right: 0,
              top: 0,
              width: 140,
              height: 400,
              background:
                "linear-gradient(180deg, rgba(59,42,31,0.5), rgba(46,50,56,0.4))",
              border: "2px solid rgba(94,70,50,0.15)",
              borderLeft: "none",
              transformOrigin: "right center",
              transform: `perspective(800px) rotateY(${doorOpen * 55}deg)`,
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(88deg, transparent, transparent 6px, rgba(0,0,0,0.04) 6px, rgba(0,0,0,0.04) 10px)",
              }}
            />
            <div
              className="absolute top-1/2 left-4 w-4 h-10 rounded-full"
              style={{
                background:
                  "linear-gradient(135deg, rgba(200,163,74,0.45), rgba(141,115,74,0.3))",
              }}
            />
          </div>

          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at 50% 50%, rgba(245,196,106,${0.06 + lightReveal * 0.12}), transparent 50%)`,
            }}
          />
        </div>
      </div>

      {[{ x: "10%", y: "32%" }, { x: "86%", y: "32%" }].map((p, i) => (
        <div
          key={i}
          className="absolute"
          style={{ left: p.x, top: p.y }}
        >
          <div
            style={{
              width: 18,
              height: 28,
              borderRadius: "50% 50% 30% 30%",
              background:
                "radial-gradient(circle, rgba(245,196,106,0.6), rgba(217,119,50,0.3) 60%, transparent)",
              filter: "blur(1px)",
              opacity: 0.6 + Math.sin(t * 2.5 + i) * 0.15,
            }}
          />
          <div
            style={{
              width: 2,
              height: 20,
              margin: "0 auto",
              backgroundColor: "rgba(94,70,50,0.3)",
            }}
          />
        </div>
      ))}
    </div>
  );
}

function SceneEntrance({ t }: { t: number }) {
  const panUp = Math.min(t / 10, 1);

  return (
    <div
      className="absolute inset-0"
      style={{
        background: "linear-gradient(180deg, #2a1e15, #1a1c1e, #2a1e15)",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            repeating-linear-gradient(90deg, transparent, transparent 65px, rgba(0,0,0,0.03) 65px, rgba(0,0,0,0.03) 66px),
            repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(0,0,0,0.025) 50px, rgba(0,0,0,0.025) 51px)
          `,
        }}
      />

      <div
        className="absolute top-0 left-0 right-0"
        style={{
          height: "38%",
          background: "linear-gradient(180deg, rgba(42,30,21,0.35), transparent)",
        }}
      />

      {[10, 28, 72, 90].map((x, i) => (
        <div
          key={`col${i}`}
          className="absolute"
          style={{
            left: `${x}%`,
            top: "8%",
            bottom: "12%",
            width: "2.5%",
            background:
              "linear-gradient(90deg, rgba(63,67,74,0.1), rgba(63,67,74,0.18), rgba(63,67,74,0.1))",
          }}
        />
      ))}

      <div
        className="absolute left-1/2"
        style={{
          bottom: "10%",
          transform: `translateX(-50%) translateY(${(1 - panUp) * 15}px)`,
          opacity: 0.4,
        }}
      >
        <svg width="220" height="130" viewBox="0 0 220 130">
          {Array.from({ length: 13 }).map((_, i) => (
            <rect
              key={i}
              x={25 + i * 11}
              y={115 - i * 8.5}
              width={170 - i * 11}
              height={5}
              fill={`rgba(94,70,50,${0.12 + i * 0.015})`}
            />
          ))}
          <line
            x1="25"
            y1="115"
            x2="168"
            y2="9"
            stroke="rgba(141,115,74,0.12)"
            strokeWidth="1"
          />
          <line
            x1="195"
            y1="115"
            x2="52"
            y2="9"
            stroke="rgba(141,115,74,0.12)"
            strokeWidth="1"
          />
        </svg>
      </div>

      {Array.from({ length: 18 }).map((_, i) => {
        const x = 12 + (i % 6) * 14 + ((i * 7) % 5) * 2;
        const y = 6 + Math.floor(i / 6) * 10 + ((i * 3) % 4) * 2;
        const flicker = 0.5 + Math.sin(t * 1.8 + i * 1.3) * 0.2;
        return (
          <div
            key={`fc${i}`}
            className="absolute"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: 35 + (i % 3) * 10,
              height: 35 + (i % 3) * 10,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(245,196,106,${0.03 + (i % 3) * 0.01}), transparent 55%)`,
              opacity: flicker,
            }}
          />
        );
      })}

      {[
        { x: "18%", y: "22%" },
        { x: "38%", y: "20%" },
        { x: "62%", y: "20%" },
        { x: "82%", y: "22%" },
      ].map((p, i) => (
        <div
          key={`pr${i}`}
          className="absolute"
          style={{
            left: p.x,
            top: p.y,
            width: 24,
            height: 32,
            border: "1.5px solid rgba(141,115,74,0.15)",
            background: `linear-gradient(180deg, rgba(94,70,50,${0.1 + i * 0.02}), rgba(42,30,21,${0.15 + i * 0.02}))`,
          }}
        />
      ))}

      {[{ x: "24%" }, { x: "76%" }].map((p, i) => (
        <div
          key={`bn${i}`}
          className="absolute top-[6%]"
          style={{
            left: p.x,
            width: 15,
            height: 70,
            background: `linear-gradient(180deg, ${i === 0 ? "rgba(123,45,58,0.2)" : "rgba(200,163,74,0.2)"}, ${i === 0 ? "rgba(123,45,58,0.1)" : "rgba(200,163,74,0.1)"})`,
            borderRadius: "0 0 8px 8px",
          }}
        />
      ))}

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 35%, rgba(245,196,106,0.06), transparent 45%)",
        }}
      />
    </div>
  );
}

function SceneGreatHall({ t }: { t: number }) {
  const titleOpacity = Math.min(Math.max((t - 3) / 3, 0), 1);

  return (
    <div
      className="absolute inset-0"
      style={{
        background: "linear-gradient(180deg, #2a1e15, #1a1c1e, #2a1e15)",
      }}
    >
      <div
        className="absolute top-0 left-0 right-0"
        style={{
          height: "42%",
          background: "linear-gradient(180deg, rgba(42,30,21,0.45), transparent)",
        }}
      />

      <svg
        className="absolute top-0 left-0 right-0"
        style={{ height: "42%" }}
        viewBox="0 0 100 50"
        preserveAspectRatio="none"
      >
        <line x1="50" y1="0" x2="50" y2="50" stroke="rgba(94,70,50,0.1)" strokeWidth="0.3" />
        <line x1="10" y1="0" x2="50" y2="50" stroke="rgba(94,70,50,0.08)" strokeWidth="0.2" />
        <line x1="30" y1="0" x2="50" y2="50" stroke="rgba(94,70,50,0.08)" strokeWidth="0.2" />
        <line x1="90" y1="0" x2="50" y2="50" stroke="rgba(94,70,50,0.08)" strokeWidth="0.2" />
        <line x1="70" y1="0" x2="50" y2="50" stroke="rgba(94,70,50,0.08)" strokeWidth="0.2" />
        <line x1="0" y1="18" x2="100" y2="18" stroke="rgba(94,70,50,0.05)" strokeWidth="0.15" />
        <line x1="0" y1="33" x2="100" y2="33" stroke="rgba(94,70,50,0.04)" strokeWidth="0.12" />
      </svg>

      {Array.from({ length: 28 }).map((_, i) => {
        const x = 6 + (i % 7) * 13 + ((i * 5) % 6);
        const y = 4 + Math.floor(i / 7) * 8 + ((i * 3) % 4) * 1.5;
        const flicker = 0.5 + Math.sin(t * 1.6 + i * 1.1) * 0.2;
        return (
          <div
            key={`gc${i}`}
            className="absolute"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: 40 + (i % 4) * 8,
              height: 40 + (i % 4) * 8,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(245,196,106,${0.035 + (i % 3) * 0.01}), transparent 55%)`,
              opacity: flicker,
            }}
          />
        );
      })}

      {[
        { x: "3%", w: "13%", c1: "rgba(200,163,74,0.08)", c2: "rgba(123,45,58,0.04)" },
        { x: "19%", w: "10%", c1: "rgba(123,45,58,0.06)", c2: "rgba(52,84,62,0.03)" },
        { x: "32%", w: "9%", c1: "rgba(52,84,62,0.05)", c2: "rgba(200,163,74,0.03)" },
        { x: "59%", w: "9%", c1: "rgba(52,84,62,0.05)", c2: "rgba(123,45,58,0.03)" },
        { x: "71%", w: "10%", c1: "rgba(123,45,58,0.06)", c2: "rgba(200,163,74,0.03)" },
        { x: "84%", w: "13%", c1: "rgba(200,163,74,0.08)", c2: "rgba(123,45,58,0.04)" },
      ].map((w, i) => (
        <div
          key={`wg${i}`}
          className="absolute top-[2%]"
          style={{
            left: w.x,
            width: w.w,
            height: "48%",
            background: `linear-gradient(180deg, ${w.c1}, ${w.c2}, transparent)`,
            clipPath: "polygon(18% 0%, 82% 0%, 100% 100%, 0% 100%)",
            opacity: 0.5 + Math.sin(t * 0.8 + i * 1.5) * 0.15,
          }}
        />
      ))}

      <div
        className="absolute bottom-[20%] left-[5%] right-[5%]"
        style={{
          height: 4,
          background:
            "linear-gradient(90deg, transparent, rgba(94,70,50,0.3) 12%, rgba(94,70,50,0.35) 50%, rgba(94,70,50,0.3) 88%, transparent)",
        }}
      />
      <div
        className="absolute bottom-[14%] left-[11%] right-[11%]"
        style={{
          height: 3,
          background:
            "linear-gradient(90deg, transparent, rgba(94,70,50,0.2) 18%, rgba(94,70,50,0.25) 50%, rgba(94,70,50,0.2) 82%, transparent)",
        }}
      />

      {[14, 24, 34, 44, 54, 64, 74].map((x, i) => (
        <div
          key={`st${i}`}
          className="absolute"
          style={{
            left: `${x}%`,
            bottom: "21%",
            width: 5,
            height: 10,
            borderRadius: "2.5px 2.5px 0 0",
            backgroundColor: `rgba(42,30,21,${0.15 + (i % 3) * 0.04})`,
          }}
        />
      ))}

      {[{ x: "4%" }, { x: "92%" }].map((p, i) => (
        <div
          key={`fp${i}`}
          className="absolute bottom-[17%]"
          style={{ left: p.x }}
        >
          <div style={{ width: 40, height: 50, position: "relative" }}>
            <div
              className="absolute bottom-0 left-0 right-0 rounded-t"
              style={{
                height: 28,
                background:
                  "linear-gradient(180deg, rgba(217,119,50,0.18), rgba(200,163,74,0.1))",
              }}
            />
            <div
              className="absolute rounded-t"
              style={{
                bottom: 6,
                left: "15%",
                right: "15%",
                height: 14,
                background:
                  "radial-gradient(ellipse at 50% 100%, rgba(217,119,50,0.3), rgba(245,196,106,0.15) 50%, transparent)",
                opacity: 0.5 + Math.sin(t * 2.2 + i) * 0.15,
              }}
            />
          </div>
        </div>
      ))}

      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{
          opacity: titleOpacity,
          transform: `translateY(${(1 - titleOpacity) * 12}px)`,
        }}
      >
        <h1
          className="font-cinzel-decorative text-4xl sm:text-5xl lg:text-6xl font-bold"
          style={{
            color: "rgba(200,163,74,0.75)",
            textShadow: "0 0 35px rgba(200,163,74,0.15)",
            letterSpacing: "0.15em",
          }}
        >
          Hogwarts
        </h1>
      </div>
    </div>
  );
}

function CastleSilhouette() {
  return (
    <svg width="420" height="180" viewBox="0 0 420 180">
      <rect x="20" y="120" width="16" height="60" fill="rgba(26,28,30,0.8)" />
      <polygon points="20,120 28,102 36,120" fill="rgba(26,28,30,0.75)" />
      <rect x="40" y="110" width="24" height="70" fill="rgba(26,28,30,0.75)" />
      <rect x="46" y="86" width="9" height="24" rx="1" fill="rgba(42,30,21,0.7)" />
      <polygon points="46,86 50.5,72 55,86" fill="rgba(42,30,21,0.65)" />
      <rect x="68" y="118" width="32" height="62" fill="rgba(26,28,30,0.7)" />
      <rect x="104" y="102" width="38" height="78" fill="rgba(26,28,30,0.75)" />
      <rect x="111" y="60" width="12" height="42" rx="2" fill="rgba(42,30,21,0.75)" />
      <polygon points="111,60 117,42 123,60" fill="rgba(42,30,21,0.7)" />
      <rect x="146" y="92" width="48" height="88" fill="rgba(26,28,30,0.8)" />
      <rect x="155" y="30" width="15" height="62" rx="3" fill="rgba(42,30,21,0.8)" />
      <polygon points="155,30 162.5,10 170,30" fill="rgba(42,30,21,0.75)" />
      <rect x="198" y="98" width="60" height="82" fill="rgba(26,28,30,0.75)" />
      <polygon points="198,98 228,65 258,98" fill="rgba(26,28,30,0.78)" />
      <rect x="224" y="70" width="10" height="28" rx="2" fill="rgba(42,30,21,0.7)" />
      <polygon points="224,70 229,54 234,70" fill="rgba(42,30,21,0.65)" />
      <rect x="262" y="106" width="36" height="74" fill="rgba(26,28,30,0.7)" />
      <rect x="302" y="114" width="26" height="66" fill="rgba(26,28,30,0.75)" />
      <rect x="308" y="90" width="9" height="24" rx="1" fill="rgba(42,30,21,0.7)" />
      <polygon points="308,90 312.5,76 317,90" fill="rgba(42,30,21,0.65)" />
      <rect x="332" y="120" width="34" height="60" fill="rgba(26,28,30,0.7)" />
      <rect x="370" y="126" width="20" height="54" fill="rgba(26,28,30,0.75)" />
      <rect x="374" y="106" width="7" height="20" rx="1" fill="rgba(42,30,21,0.65)" />
      <rect x="394" y="120" width="26" height="60" fill="rgba(26,28,30,0.7)" />
    </svg>
  );
}

function CastleSilhouetteDetail() {
  return (
    <svg width="560" height="240" viewBox="0 0 560 240">
      <rect x="10" y="155" width="20" height="85" fill="rgba(26,28,30,0.85)" />
      <polygon points="10,155 20,132 30,155" fill="rgba(26,28,30,0.8)" />
      <rect x="35" y="140" width="30" height="100" fill="rgba(26,28,30,0.8)" />
      <rect x="42" y="98" width="12" height="42" rx="2" fill="rgba(42,30,21,0.8)" />
      <polygon points="42,98 48,78 54,98" fill="rgba(42,30,21,0.75)" />
      <rect x="70" y="148" width="38" height="92" fill="rgba(26,28,30,0.78)" />
      <rect x="112" y="128" width="44" height="112" fill="rgba(26,28,30,0.82)" />
      <rect x="120" y="68" width="14" height="60" rx="3" fill="rgba(42,30,21,0.82)" />
      <polygon points="120,68 127,44 134,68" fill="rgba(42,30,21,0.78)" />
      <rect x="160" y="115" width="55" height="125" fill="rgba(26,28,30,0.88)" />
      <rect x="170" y="28" width="18" height="87" rx="4" fill="rgba(42,30,21,0.88)" />
      <polygon points="170,28 179,5 188,28" fill="rgba(42,30,21,0.82)" />
      <rect x="220" y="120" width="70" height="120" fill="rgba(26,28,30,0.82)" />
      <polygon points="220,120 255,78 290,120" fill="rgba(26,28,30,0.85)" />
      <rect x="250" y="82" width="12" height="38" rx="2" fill="rgba(42,30,21,0.78)" />
      <polygon points="250,82 256,62 262,82" fill="rgba(42,30,21,0.72)" />
      <rect x="294" y="128" width="46" height="112" fill="rgba(26,28,30,0.8)" />
      <rect x="302" y="66" width="14" height="62" rx="3" fill="rgba(42,30,21,0.82)" />
      <polygon points="302,66 309,42 316,66" fill="rgba(42,30,21,0.78)" />
      <rect x="344" y="142" width="36" height="98" fill="rgba(26,28,30,0.78)" />
      <rect x="384" y="152" width="30" height="88" fill="rgba(26,28,30,0.8)" />
      <rect x="390" y="115" width="10" height="37" rx="2" fill="rgba(42,30,21,0.75)" />
      <polygon points="390,115 395,98 400,115" fill="rgba(42,30,21,0.7)" />
      <rect x="418" y="155" width="40" height="85" fill="rgba(26,28,30,0.78)" />
      <rect x="462" y="162" width="24" height="78" fill="rgba(26,28,30,0.8)" />
      <rect x="466" y="138" width="8" height="24" rx="1" fill="rgba(42,30,21,0.72)" />
      <rect x="490" y="155" width="32" height="85" fill="rgba(26,28,30,0.78)" />
      <rect x="526" y="162" width="24" height="78" fill="rgba(26,28,30,0.8)" />

      {[
        [18, 168], [50, 155], [88, 162], [128, 145], [128, 168],
        [175, 130], [175, 155], [175, 178], [240, 135], [260, 132],
        [280, 135], [260, 155], [260, 178],
        [316, 142], [316, 165], [362, 155], [396, 128], [396, 152],
        [438, 165], [474, 172], [506, 168],
      ].map(([x, y], i) => (
        <rect
          key={i}
          x={x}
          y={y}
          width="4"
          height="3.5"
          rx="0.5"
          fill={`rgba(245,196,106,${0.3 + (i % 4) * 0.08})`}
        />
      ))}
    </svg>
  );
}
