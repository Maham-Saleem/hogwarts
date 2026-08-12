import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useAmbience } from "@/context/AmbienceProvider";

interface Props {
  onComplete: () => void;
}

export function Landing({ onComplete }: Props) {
  const [scene, setScene] = useState(0);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const started = useRef(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audio = useAmbience();

  // the video is mounted from the very start (hidden) so it *preloads during*
  // the gate and is ready the instant the visitor taps to enter.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.onended = () => setScene(2);
    v.onplaying = () => setVideoPlaying(true);
    v.onwaiting = () => setVideoPlaying(false);
    return () => {
      v.onended = null;
      v.onplaying = null;
      v.onwaiting = null;
    };
  }, []);

  // trigger playback once the visitor enters
  useEffect(() => {
    if (scene !== 1) return;
    const v = videoRef.current;
    if (!v) return;
    v.play()
      .then(() => setVideoPlaying(true))
      .catch(() => {
        // if audio autoplay is blocked, fall back to muted
        v.muted = true;
        v.play().then(() => setVideoPlaying(true)).catch(() => {});
      });
  }, [scene]);

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
    setVideoPlaying(false);
    setScene(1);
  };

  const skip = () => {
    audio.stopAll();
    onComplete();
  };

  const showVideo = scene === 1;
  const showVeil = scene === 1 && !videoPlaying;

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ backgroundColor: "#0a0807" }}
    >
      {/* always mounted so it preloads during the gate */}
      <video
        ref={videoRef}
        src="/intro.mp4"
        preload="auto"
        playsInline
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
        style={{
          opacity: showVideo ? 1 : 0,
          filter: "brightness(0.96) saturate(1.04)",
          pointerEvents: "none",
        }}
      />

      {/* warm 'waking' veil shown only while the first frames are being read */}
      {showVeil && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 45%, rgba(60,42,24,0.55), rgba(10,8,7,0.9) 78%)",
          }}
        >
          <motion.div
            className="w-14 h-14 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(255,200,140,0.5), transparent 66%)",
              boxShadow: "0 0 40px rgba(255,190,120,0.3)",
            }}
            animate={{ opacity: [0.4, 1, 0.4], scale: [0.96, 1.05, 0.96] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          />
          <p
            className="absolute mt-24 font-cormorant italic text-sm tracking-[0.25em]"
            style={{ color: "rgba(230,205,165,0.4)" }}
          >
            the lantern catches flame…
          </p>
        </div>
      )}

      {/* GATE */}
      {scene === 0 && (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
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
      )}

      {/* TITLE */}
      {scene === 2 && <Interior />}

      {/* SKIP */}
      {scene === 1 && (
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
    </div>
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