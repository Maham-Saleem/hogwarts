import { useState, useEffect, useRef } from "react";
import { useAmbientAudio } from "@/hooks/useAmbientAudio";

interface Props {
  onComplete: () => void;
}

const DURATIONS: Record<number, number> = {
  1: 5,  // black screen, only audio
  2: 10, // castle emerges
  3: 20, // journey across the lake
  4: 15, // arrival, doors open
  5: 15, // entering the castle
  6: 20, // great hall
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
      audio.start("wind");
      audio.start("rain", 0.02);
    } else if (scene === 2) {
      audio.start("pad");
      audio.fade("pad", 0.012, 6);
    } else if (scene === 3) {
      audio.start("choir");
      audio.fade("choir", 0.008, 5);
    } else if (scene === 4) {
      audio.start("fire");
      audio.fade("rain", 0.012, 6);
    } else if (scene === 5) {
      audio.start("footsteps");
      audio.fade("rain", 0, 3);
      audio.fade("wind", 0, 3);
      audio.fade("fire", 0.045, 3);
    } else if (scene === 6) {
      audio.start("murmur");
      audio.start("pages");
      audio.fade("choir", 0.02, 5);
      audio.fade("pad", 0.03, 5);
      audio.fade("fire", 0.04, 2);
    } else if (scene === 7) {
      audio.stopAll();
      onComplete();
    }
  }, [scene, audio, onComplete]);

  useEffect(() => {
    if (scene < 1 || scene > 4) return;
    const bell = setInterval(() => audio.play("bells"), 13000);
    const owl = setInterval(() => audio.play("owl"), 12000);
    const thunder = setTimeout(() => audio.play("thunder"), 5000);
    const thunder2 = setTimeout(() => audio.play("thunder"), 15000);
    return () => {
      clearInterval(bell);
      clearInterval(owl);
      clearTimeout(thunder);
      clearTimeout(thunder2);
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
    setScene(7);
  };

  if (scene === 0) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center cursor-pointer"
        style={{ backgroundColor: "#0a0b0c" }}
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
      {scene < 7 && elapsed > 5 && (
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

      {scene === 1 && <SceneDarkness t={elapsed} />}
      {scene === 2 && <SceneReveal t={elapsed} />}
      {scene === 3 && <SceneJourney t={elapsed} />}
      {scene === 4 && <SceneArrival t={elapsed} />}
      {scene === 5 && <SceneEntrance t={elapsed} />}
      {scene === 6 && <SceneGreatHall t={elapsed} />}
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
          width: 320,
          height: 320,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(245,196,106,0.035), transparent 60%)",
          opacity,
        }}
      />
    </div>
  );
}

function SceneReveal({ t }: { t: number }) {
  const adjust = Math.min(t / 9, 1);
  const op = 0.12 + adjust * 0.5;
  const lightning = t > 3 && t < 3.15 ? 0.18 : 0;
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
            "radial-gradient(circle, rgba(110,143,191,0.22), rgba(110,143,191,0.05) 45%, transparent 65%)",
          opacity: op,
        }}
      />

      {Array.from({ length: 34 }).map((_, i) => (
        <div
          key={`s${i}`}
          className="absolute rounded-full"
          style={{
            left: `${5 + ((i * 37) % 90)}%`,
            top: `${3 + ((i * 23) % 28)}%`,
            width: 1,
            height: 1,
            backgroundColor: `rgba(244,239,226,${0.05 + (i % 4) * 0.03})`,
            opacity: op,
          }}
        />
      ))}

      {[0, 1, 2].map((i) => (
        <div
          key={`c${i}`}
          className="absolute"
          style={{
            top: `${12 + i * 9}%`,
            left: `${i * 30 - ((t * 3) % 50)}%`,
            width: "55%",
            height: 5,
            borderRadius: 999,
            background: "rgba(110,143,191,0.04)",
            filter: "blur(4px)",
            opacity: op * 0.5,
          }}
        />
      ))}

      <div
        className="absolute left-1/2"
        style={{
          bottom: "30%",
          transform: "translateX(-50%)",
          opacity: op,
        }}
      >
        <CastleSilhouette />
      </div>

      <div
        className="absolute left-0 right-0"
        style={{
          bottom: "24%",
          height: "16%",
          background:
            "linear-gradient(0deg, rgba(26,28,30,0.55), transparent)",
          opacity: op,
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
            opacity: op,
          }}
        />
      ))}

      {lightning > 0 && (
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 45% 35%, rgba(110,143,191,0.2), transparent 45%)",
          }}
        />
      )}
    </div>
  );
}

function SceneJourney({ t }: { t: number }) {
  const push = 1 + t * 0.012;
  const lightning =
    t > 6 && t < 6.15 ? 0.2 : t > 13 && t < 13.12 ? 0.16 : 0;
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0a0b0c, #1a1c1e, #0a0b0c)",
      }}
    >
      <div
        className="absolute top-[6%] right-[15%]"
        style={{
          width: 110,
          height: 110,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(110,143,191,0.28), rgba(110,143,191,0.08) 45%, transparent 65%)",
        }}
      />

      <OwlFlying progress={Math.max(0, Math.min(t / 18, 1))} />

      <div
        className="absolute left-1/2"
        style={{
          bottom: "18%",
          transform: `translateX(-50%) scale(${push})`,
          transformOrigin: "center bottom",
        }}
      >
        <CastleSilhouetteDetail />
      </div>

      {[
        { x: 38, y: 44 },
        { x: 44, y: 43 },
        { x: 50, y: 42 },
        { x: 56, y: 43 },
        { x: 62, y: 44 },
        { x: 48, y: 38 },
        { x: 54, y: 37 },
      ].map((p, i) => (
        <div
          key={`gw${i}`}
          className="absolute"
          style={{
            left: `${p.x}%`,
            bottom: `${p.y}%`,
            width: 3,
            height: 2.5,
            backgroundColor: `rgba(245,196,106,${0.3 + (i % 3) * 0.1})`,
            boxShadow:
              "0 0 6px rgba(245,196,106,0.18), 0 0 12px rgba(217,119,50,0.07)",
          }}
        />
      ))}

      {Array.from({ length: 14 }).map((_, i) => {
        const x = 24 + (i % 7) * 7 + Math.sin(t * 0.6 + i) * 2;
        const y = 60 + Math.floor(i / 7) * 5;
        const shimmer = 0.18 + Math.sin(t * 1.2 + i * 1.4) * 0.12;
        return (
          <div
            key={`rf${i}`}
            className="absolute"
            style={{
              left: `${(x + 22) % 92}%`,
              top: `${y + 20}%`,
              width: 14,
              height: 1,
              background:
                "linear-gradient(90deg, transparent, rgba(245,196,106,0.18), transparent)",
              opacity: Math.max(shimmer, 0),
            }}
          />
        );
      })}

      {[55, 53].map((y, i) => (
        <div
          key={`w${i}`}
          className="absolute left-0 right-0"
          style={{
            top: `${y + 20}%`,
            height: 1,
            background: `rgba(110,143,191,${0.05 - i * 0.02})`,
          }}
        />
      ))}

      {lightning > 0 && (
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 48% 30%, rgba(110,143,191,0.2), transparent 45%)",
          }}
        />
      )}
    </div>
  );
}

function SceneArrival({ t }: { t: number }) {
  const doorOpen = Math.min(t / 9, 1);
  const light = Math.min(Math.max((t - 7) / 4, 0), 1);
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
            "radial-gradient(circle, rgba(110,143,191,0.25), rgba(110,143,191,0.06) 45%, transparent 65%)",
          opacity: 1 - doorOpen * 0.4,
        }}
      />

      <div className="absolute left-1/2 top-[32%]" style={{ transform: "translateX(-50%)" }}>
        <div className="relative" style={{ width: 260, height: 340 }}>
          <div
            className="absolute rounded-t-full overflow-hidden"
            style={{
              left: 0,
              top: 0,
              width: 130,
              height: 340,
              background:
                "linear-gradient(180deg, rgba(59,42,31,0.55), rgba(46,50,56,0.45))",
              border: "2px solid rgba(94,70,50,0.16)",
              borderRight: "none",
              transformOrigin: "left center",
              transform: `perspective(800px) rotateY(${doorOpen * -55}deg)`,
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(88deg, transparent, transparent 6px, rgba(0,0,0,0.05) 6px, rgba(0,0,0,0.05) 10px)",
              }}
            />
            <div
              className="absolute top-[42%] right-4 w-4 h-12 rounded-full"
              style={{
                background:
                  "linear-gradient(135deg, rgba(200,163,74,0.4), rgba(141,115,74,0.28))",
                boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
              }}
            />
          </div>

          <div
            className="absolute rounded-t-full overflow-hidden"
            style={{
              right: 0,
              top: 0,
              width: 130,
              height: 340,
              background:
                "linear-gradient(180deg, rgba(59,42,31,0.55), rgba(26,50,52,0.45))",
              border: "2px solid rgba(94,70,50,0.16)",
              borderLeft: "none",
              transformOrigin: "right center",
              transform: `perspective(800px) rotateY(${doorOpen * 55}deg)`,
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(88deg, transparent, transparent 6px, rgba(0,0,0,0.05) 6px, rgba(0,0,0,0.05) 10px)",
              }}
            />
            <div
              className="absolute top-[42%] left-4 w-4 h-12 rounded-full"
              style={{
                background:
                  "linear-gradient(135deg, rgba(200,163,74,0.4), rgba(141,115,74,0.28))",
              }}
            />
          </div>

          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at 50% 50%, rgba(245,196,106,${0.05 + light * 0.12}), transparent 52%)`,
            }}
          />
        </div>
      </div>

      {[0, 1, 2, 3].map((i) => (
        <div
          key={`stp${i}`}
          className="absolute"
          style={{
            left: "50%",
            bottom: `${28 - i * 7}%`,
            width: `${360 - i * 30}`,
            height: 4,
            transform: "translateX(-50%)",
            background: `rgba(94,70,50,${0.22 - i * 0.03})`,
          }}
        />
      ))}

      {[{ x: "8%", y: "30%" }, { x: "88%", y: "30%" }].map((p, i) => (
        <div key={i} className="absolute" style={{ left: p.x, top: p.y }}>
          <div
            style={{
              width: 16,
              height: 26,
              borderRadius: "50% 50% 30% 30%",
              background:
                "radial-gradient(circle, rgba(245,196,106,0.55), rgba(217,119,50,0.28) 60%, transparent)",
              filter: "blur(1px)",
              opacity: 0.6 + Math.sin(t * 2.4 + i) * 0.18,
            }}
          />
          <div
            style={{
              width: 2,
              height: 18,
              margin: "0 auto",
              backgroundColor: "rgba(94,70,50,0.3)",
            }}
          />
        </div>
      ))}

      {[{ x: "6%", y: 12 }, { x: "90%", y: 12 }].map((p, i) => (
        <div key={`rw${i}`} className="absolute" style={{ left: p.x, top: `${p.y}%` }}>
          {[0, 1, 2].map((r) => (
            <div
              key={r}
              style={{
                width: 1,
                height: `${60 + ((t * 40 + i * 40 + r * 25) % 80)}px`,
                background:
                  "linear-gradient(180deg, transparent, rgba(110,143,191,0.12), transparent)",
                position: "relative",
                left: r * 8,
              }}
            />
          ))}
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
        background: "linear-gradient(180deg, #2a1e15, #1a1c1e, #241a12)",
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
          height: "40%",
          background: "linear-gradient(180deg, rgba(42,30,21,0.4), transparent)",
        }}
      />

      {[10, 27, 73, 90].map((x, i) => (
        <div
          key={`col${i}`}
          className="absolute"
          style={{
            left: `${x}%`,
            top: "6%",
            bottom: "10%",
            width: "2.5%",
            background:
              "linear-gradient(90deg, rgba(63,67,74,0.1), rgba(63,67,74,0.2), rgba(63,67,74,0.1))",
          }}
        />
      ))}

      <div
        className="absolute left-1/2"
        style={{
          bottom: "8%",
          transform: `translateX(-50%) translateY(${(1 - panUp) * 18}px)`,
          opacity: 0.4,
        }}
      >
        <svg width="230" height="135" viewBox="0 0 230 135">
          {Array.from({ length: 14 }).map((_, i) => (
            <rect
              key={i}
              x={25 + i * 11}
              y={120 - i * 8.4}
              width={180 - i * 11}
              height={5}
              fill={`rgba(94,70,50,${0.12 + i * 0.015})`}
            />
          ))}
          <line x1="25" y1="120" x2="173" y2="6" stroke="rgba(141,115,74,0.12)" strokeWidth="1" />
          <line x1="205" y1="120" x2="57" y2="6" stroke="rgba(141,115,74,0.12)" strokeWidth="1" />
        </svg>
      </div>

      {Array.from({ length: 30 }).map((_, i) => {
        const x = 6 + (i % 8) * 11;
        const y = 7 + Math.floor(i / 8) * 9;
        const flicker = 0.5 + Math.sin(t * 1.8 + i * 1.3) * 0.2;
        return (
          <div
            key={`fc${i}`}
            className="absolute"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: 32 + (i % 4) * 9,
              height: 32 + (i % 4) * 9,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(245,196,106,${0.028 + (i % 3) * 0.01}), transparent 52%)`,
              opacity: flicker,
            }}
          />
        );
      })}

      {[
        { x: "17%", y: "20%" },
        { x: "36%", y: "18%" },
        { x: "64%", y: "18%" },
        { x: "83%", y: "20%" },
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
            background: `linear-gradient(180deg, rgba(94,70,50,${0.1 + i * 0.02}), rgba(42,30,21,${0.18 + i * 0.02}))`,
          }}
        />
      ))}

      {[
        { x: "24%", c: "rgba(123,45,58,0.2)", d: "rgba(123,45,58,0.1)" },
        { x: "34%", c: "rgba(52,84,62,0.2)", d: "rgba(52,84,62,0.1)" },
        { x: "66%", c: "rgba(110,143,191,0.2)", d: "rgba(110,143,191,0.1)" },
        { x: "76%", c: "rgba(200,163,74,0.2)", d: "rgba(200,163,74,0.1)" },
      ].map((p, i) => (
        <div
          key={`bn${i}`}
          className="absolute top-[5%]"
          style={{
            left: p.x,
            width: 15,
            height: 70,
            background: `linear-gradient(180deg, ${p.c}, ${p.d})`,
            borderRadius: "0 0 8px 8px",
            transform: `skewX(${Math.sin(t * 0.6 + i) * 1.4}deg)`,
          }}
        />
      ))}

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 32%, rgba(245,196,106,0.055), transparent 48%)",
        }}
      />
    </div>
  );
}

function SceneGreatHall({ t }: { t: number }) {
  const title = Math.min(Math.max((t - 2) / 3, 0), 1);
  return (
    <div
      className="absolute inset-0"
      style={{
        background: "linear-gradient(180deg, #241a11, #1a1c1e, #241a11)",
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 overflow-hidden"
        style={{ height: "45%" }}
      >
        <div
          className="absolute left-0 right-0 top-[2%]"
          style={{
            height: "40%",
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(63,67,74,0.35), transparent 60%)",
          }}
        />
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={`gcstar${i}`}
            className="absolute rounded-full"
            style={{
              left: `${(i * 53) % 100}%`,
              top: `${(i * 29) % 26}%`,
              width: i % 5 === 0 ? 1.4 : 0.8,
              height: i % 5 === 0 ? 1.4 : 0.8,
              backgroundColor: `rgba(244,239,226,${0.05 + (i % 4) * 0.04})`,
              opacity: 0.5 + Math.sin(t * 0.4 + i) * 0.2,
            }}
          />
        ))}
        <div
          className="absolute right-[18%] top-[3%]"
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(110,143,191,0.5), rgba(110,143,191,0.15) 45%, transparent 65%)",
          }}
        />
      </div>

      <svg
        className="absolute top-0 left-0 right-0"
        style={{ height: "45%" }}
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

      {Array.from({ length: 45 }).map((_, i) => {
        const x = 4 + (i % 9) * 11 + ((i * 5) % 6);
        const y = 4 + Math.floor(i / 9) * 7 + ((i * 3) % 4) * 1.5;
        const flicker = 0.5 + Math.sin(t * 1.6 + i * 1.1) * 0.2;
        return (
          <div
            key={`gc${i}`}
            className="absolute"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: 34 + (i % 4) * 8,
              height: 34 + (i % 4) * 8,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(245,196,106,${0.03 + (i % 3) * 0.01}), transparent 52%)`,
              opacity: flicker,
            }}
          />
        );
      })}

      {[
        { x: "3%", w: "13%", c: "rgba(123,45,58,0.03)" },
        { x: "19%", w: "10%", c: "rgba(52,84,62,0.03)" },
        { x: "32%", w: "9%", c: "rgba(110,143,191,0.03)" },
        { x: "59%", w: "9%", c: "rgba(52,84,62,0.03)" },
        { x: "71%", w: "10%", c: "rgba(123,45,58,0.03)" },
        { x: "84%", w: "13%", c: "rgba(200,163,74,0.03)" },
      ].map((w, i) => (
        <div
          key={`wg${i}`}
          className="absolute top-[2%]"
          style={{
            left: w.x,
            width: w.w,
            height: "46%",
            background: `linear-gradient(180deg, ${w.c}, transparent)`,
            clipPath: "polygon(18% 0%, 82% 0%, 100% 100%, 0% 100%)",
            opacity: 0.4 + Math.sin(t * 0.8 + i * 1.5) * 0.12,
          }}
        />
      ))}

      <div
        className="absolute bottom-[21%] left-[5%] right-[5%]"
        style={{
          height: 4,
          background:
            "linear-gradient(90deg, transparent, rgba(94,70,50,0.3) 12%, rgba(94,70,50,0.35) 50%, rgba(94,70,50,0.3) 88%, transparent)",
        }}
      />
      <div
        className="absolute bottom-[15%] left-[11%] right-[11%]"
        style={{
          height: 3,
          background:
            "linear-gradient(90deg, transparent, rgba(94,70,50,0.2) 18%, rgba(94,70,50,0.25) 50%, rgba(94,70,50,0.2) 82%, transparent)",
        }}
      />

      {[13, 22, 31, 40, 49, 58, 67, 76, 85].map((x, i) => (
        <div
          key={`st${i}`}
          className="absolute"
          style={{
            left: `${x}%`,
            bottom: "22%",
            width: 5,
            height: 10,
            borderRadius: "2.5px 2.5px 0 0",
            backgroundColor: `rgba(42,30,21,${0.15 + (i % 3) * 0.04})`,
          }}
        />
      ))}

      {[{ x: "4%", c: "rgba(217,119,50,0.2)" }, { x: "91%", c: "rgba(217,119,50,0.2)" }].map((p, i) => (
        <div key={`fp${i}`} className="absolute bottom-[16%]" style={{ left: p.x }}>
          <div style={{ width: 44, height: 52, position: "relative" }}>
            <div
              className="absolute bottom-0 left-0 right-0 rounded-t"
              style={{
                height: 30,
                background:
                  "linear-gradient(180deg, rgba(217,119,50,0.2), rgba(200,163,74,0.1))",
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
                  "radial-gradient(ellipse at 50% 100%, rgba(217,119,50,0.35), rgba(245,196,106,0.18) 50%, transparent)",
                opacity: 0.5 + Math.sin(t * 2.2 + i) * 0.18,
              }}
            />
          </div>
        </div>
      ))}

      {[
        { x: "16%", c: "rgba(123,45,58,0.22)" },
        { x: "33%", c: "rgba(52,84,62,0.22)" },
        { x: "50%", c: "rgba(110,143,191,0.22)" },
        { x: "67%", c: "rgba(200,163,74,0.22)" },
      ].map((p, i) => (
        <div
          key={`hb${i}`}
          className="absolute top-[30%]"
          style={{
            left: p.x,
            width: 16,
            height: 90,
            background: `linear-gradient(180deg, ${p.c}, transparent)`,
            borderRadius: "0 0 8px 8px",
            transform: `skewX(${Math.sin(t * 0.5 + i) * 1.6}deg)`,
          }}
        />
      ))}

      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{
          opacity: title,
          transform: `translateY(${(1 - title) * 12}px)`,
        }}
      >
        <h1
          className="font-cinzel-decorative text-4xl sm:text-5xl lg:text-6xl font-bold"
          style={{
            color: "rgba(200,163,74,0.7)",
            textShadow: "0 0 35px rgba(200,163,74,0.14)",
            letterSpacing: "0.18em",
          }}
        >
          Hogwarts
        </h1>
      </div>
    </div>
  );
}

function OwlFlying({ progress }: { progress: number }) {
  const x = -6 + progress * 112;
  return (
    <div
      className="absolute"
      style={{
        top: "9%",
        left: `${x}%`,
        opacity: Math.sin(progress * Math.PI) * 0.6,
      }}
    >
      <svg width="46" height="20" viewBox="0 0 46 20">
        <ellipse cx="23" cy="12" rx="7" ry="4" fill="rgba(20,22,24,0.85)" />
        <circle cx="29" cy="7" r="3" fill="rgba(20,22,24,0.85)" />
        <path
          d="M 18 11 Q 12 2 2 4 Q 9 9 16 12"
          fill="rgba(20,22,24,0.7)"
        />
        <path
          d="M 28 11 Q 34 2 44 4 Q 37 9 30 12"
          fill="rgba(20,22,24,0.7)"
        />
      </svg>
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

      <g fill="rgba(245,196,106,0.22)">
        {[
          [30, 130], [48, 120], [76, 128], [90, 128], [115, 112], [115, 128],
          [160, 105], [160, 122], [205, 110], [224, 106], [244, 110],
          [224, 128], [270, 118], [312, 126], [340, 130], [380, 136],
        ].map(([x, y], i) => (
          <rect key={`w${i}`} x={x} y={y} width="3.2" height="2.6" rx="0.5" />
        ))}
      </g>
    </svg>
  );
}

function CastleSilhouetteDetail() {
  return (
    <svg width="600" height="250" viewBox="0 0 600 250">
      <rect x="12" y="160" width="22" height="90" fill="rgba(24,26,28,0.85)" />
      <polygon points="12,160 23,134 34,160" fill="rgba(24,26,28,0.8)" />
      <rect x="38" y="145" width="32" height="105" fill="rgba(24,26,28,0.8)" />
      <rect x="46" y="100" width="12" height="45" rx="2" fill="rgba(42,30,21,0.8)" />
      <polygon points="46,100 52,78 58,100" fill="rgba(42,30,21,0.75)" />
      <rect x="75" y="152" width="40" height="98" fill="rgba(24,26,28,0.78)" />
      <rect x="119" y="132" width="46" height="118" fill="rgba(24,26,28,0.82)" />
      <rect x="128" y="70" width="14" height="62" rx="3" fill="rgba(42,30,21,0.82)" />
      <polygon points="128,70 135,45 142,70" fill="rgba(42,30,21,0.78)" />
      <rect x="169" y="118" width="58" height="132" fill="rgba(24,26,28,0.88)" />
      <rect x="180" y="28" width="18" height="90" rx="4" fill="rgba(42,30,21,0.88)" />
      <polygon points="180,28 189,4 198,28" fill="rgba(42,30,21,0.82)" />
      <rect x="233" y="126" width="72" height="124" fill="rgba(24,26,28,0.82)" />
      <polygon points="233,126 268,80 303,126" fill="rgba(24,26,28,0.85)" />
      <rect x="262" y="86" width="12" height="40" rx="2" fill="rgba(42,30,21,0.78)" />
      <rect x="308" y="133" width="48" height="117" fill="rgba(24,26,28,0.8)" />
      <rect x="317" y="66" width="14" height="67" rx="3" fill="rgba(42,30,21,0.82)" />
      <polygon points="317,66 324,42 331,66" fill="rgba(42,30,21,0.78)" />
      <rect x="360" y="147" width="38" height="103" fill="rgba(24,26,28,0.78)" />
      <rect x="400" y="156" width="32" height="94" fill="rgba(24,26,28,0.8)" />
      <rect x="406" y="116" width="11" height="40" rx="2" fill="rgba(42,30,21,0.75)" />
      <polygon points="406,116 411,96 416,116" fill="rgba(42,30,21,0.7)" />
      <rect x="436" y="160" width="42" height="90" fill="rgba(24,26,28,0.78)" />
      <rect x="482" y="166" width="26" height="84" fill="rgba(24,26,28,0.8)" />
      <rect x="487" y="140" width="9" height="26" rx="1" fill="rgba(42,30,21,0.72)" />
      <rect x="512" y="160" width="34" height="90" fill="rgba(24,26,28,0.78)" />
      <rect x="550" y="166" width="26" height="84" fill="rgba(24,26,28,0.8)" />

      <g fill="rgba(245,196,106,0.25)">
        {[
          [20, 172], [52, 158], [90, 166], [134, 148], [134, 170],
          [150, 166], [182, 132], [182, 156], [182, 180], [245, 140],
          [265, 136], [285, 140], [265, 158], [265, 180],
          [330, 146], [330, 168], [380, 158], [412, 130], [412, 152],
          [456, 168], [494, 176], [528, 172],
        ].map(([x, y], i) => (
          <rect key={`d${i}`} x={x} y={y} width="4" height="3.4" rx="0.5" />
        ))}
      </g>
    </svg>
  );
}