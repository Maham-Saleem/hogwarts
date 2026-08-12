import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useAmbience } from "@/context/AmbienceProvider";

interface Props {
  onComplete: () => void;
}

export function Landing({ onComplete }: Props) {
  const [scene, setScene] = useState(0);
  const started = useRef(false);
  const audio = useAmbience();

  // soft bed once the video begins
  useEffect(() => {
    if (scene !== 1) return;
    audio.start("pad", 0.006);
    audio.fade("pad", 0.018, 8);
    audio.start("choir", 0.006);
    return () => {
      audio.stop("choir", 1.5);
    };
  }, [scene, audio]);

  // title moment — clarify, then hand off
  useEffect(() => {
    if (scene !== 2) return;
    audio.fade("pad", 0.028, 4);
    audio.fade("choir", 0.02, 4);
    const done = setTimeout(() => {
      audio.stopAll();
      onComplete();
    }, 8000);
    return () => clearTimeout(done);
  }, [scene, audio, onComplete]);

  const enter = () => {
    if (started.current) return;
    started.current = true;
    audio.init();
    setScene(1);
  };

  const skip = () => {
    audio.stopAll();
    onComplete();
  };

  if (scene === 0) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center cursor-pointer overflow-hidden"
        style={{ backgroundColor: "#0a0807" }}
        onClick={enter}
      >
        <Embers />
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
      {scene < 3 && (
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

      {scene === 1 && <VideoIntro onEnded={() => setScene(2)} />}
      {scene === 2 && <Interior />}
    </div>
  );
}

/* ============ SCENE 1: VIDEO INTRO ============ */
function VideoIntro({ onEnded }: { onEnded: () => void }) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.onended = onEnded;
    v.play()
      .catch(() => {
        // if audio autoplay is blocked, fall back to muted
        v.muted = true;
        v.play().catch(() => {});
      });
    return () => {
      v.onended = null;
    };
  }, [onEnded]);

  return (
    <video
      ref={ref}
      src="/intro.mp4"
      playsInline
      className="absolute inset-0 w-full h-full object-cover"
      style={{ filter: "brightness(0.96) saturate(1.04)" }}
    />
  );
}

/* ============ SCENE 2: THE TITLE ============ */
function Interior() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        background: "linear-gradient(180deg, #3a2c18, #241a11, #18171a)",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(255,205,135,0.18), transparent 55%)",
        }}
      />
      <motion.h1
        className="relative font-cinzel-decorative text-4xl sm:text-5xl lg:text-6xl font-bold"
        initial={{ opacity: 0, letterSpacing: "0.3em" }}
        animate={{ opacity: 1, letterSpacing: "0.18em" }}
        transition={{ duration: 2.4, ease: "easeOut" }}
        style={{
          color: "rgba(216,178,110,0.8)",
          textShadow: "0 0 40px rgba(216,178,110,0.2)",
        }}
      >
        Hogwarts
      </motion.h1>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 50% 46%, transparent 52%, rgba(4,3,2,0.6) 100%)",
      }} />
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
    })),
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