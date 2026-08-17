import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAmbience } from "@/context/AmbienceProvider";

type Scene = "invitation" | "opening" | "letter" | "video" | "archive";

interface Props {
  onComplete: () => void;
}

/* ============================================================
   LOCKED PALETTE — one continuous visual world
   ============================================================ */
const C = {
  midnight: "#101A26",
  storm: "#263747",
  charcoal: "#17191B",
  slate: "#3B4A57",
  forest: "#24362F",
  walnut: "#4A3325",
  parchment: "#E8DFC9",
  agedIvory: "#D8CEB8",
  gold: "#B69A5A",
  candle: "#D9A85E",
  burgundy: "#5A2930",
};

/* The visitor is the invited one — never a named character. */
const LETTER = {
  salutation: "Dear Curious Explorer,",
  body: [
    "We are pleased to inform you that you have been invited to discover the Hogwarts Archive.",
    "Within these pages lie stories of an extraordinary castle, the witches and wizards who have walked its halls, the houses that shaped generations of students, and the secrets hidden within its ancient walls.",
    "Your journey begins beyond these words.",
  ],
  closer: ["The castle awaits.", "Yours sincerely,"],
  sign: "THE HOGWARTS ARCHIVE",
};

const RANDOM_FACTS = [
  "The castle has stood for over a thousand years, its foundations laid by the four founders who each chose a quality to cherish above all others.",
  "The staircases of Hogwarts are restless by design, shifting their paths at a whim so that no two journeys through the castle are ever quite the same.",
  "Each house is bound to an element of the school's spirit — boldness, loyalty, wit, and ambition — carried in crest, colour and candlelight alike.",
  "The library holds more than ten thousand volumes, a small number of which are kept behind a velvet rope and read by no living student.",
  "The Great Hall ceiling is enchanted to mirror the sky outside, so that rain and starlight fall together over the long tables.",
  "Portraits throughout the castle are not painted still — the figures within them wander, visiting one another between frames.",
  "The owls of the school carry more than post; they are the quiet messengers between the castle and the wider wizarding world.",
  "Every stone of Hogwarts is said to remember, holding the echoes of the footsteps that have crossed it for a thousand years.",
];

export function Landing({ onComplete }: Props) {
  const [scene, setScene] = useState<Scene>("invitation");
  const [dip, setDip] = useState(false);
  const [fact, setFact] = useState<string | null>(null);
  const started = useRef(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audio = useAmbience();

  const isOpen = scene === "opening" || scene === "letter";
  const showAction = scene === "letter";

  /* ---- audio follows the world, never competes with the film ----
     A candle's quiet presence in the study; silence for the castle
     cinematic (the video carries its own sound); a warm bed inside. */
  useEffect(() => {
    if (scene === "video") {
      audio.stopAll();
    } else if (scene === "archive") {
      audio.start("choir", 0.012);
      audio.start("fire", 0.01);
    }
  }, [scene, audio]);

  /* ---- the castle film ---- */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (scene !== "video") {
      v.pause();
      return;
    }
    v.currentTime = 0;
    const p = v.play();
    if (p && typeof p.catch === "function") {
      p.catch(() => {
        v.muted = true;
        v.play().catch(() => {});
      });
    }
    const onEnd = () => {
      // hold the final frame, then cross-fade into the Archive
      window.setTimeout(() => setScene("archive"), 1100);
    };
    v.addEventListener("ended", onEnd);
    const dur = v.duration;
    const fb = window.setTimeout(onEnd, (isFinite(dur) && dur > 0 ? dur * 1000 : 15000) + 1500);
    return () => {
      v.removeEventListener("ended", onEnd);
      window.clearTimeout(fb);
    };
  }, [scene]);

  const openLetter = () => {
    if (started.current) return;
    started.current = true;
    audio.init();
    audio.start("fire", 0.014);
    setScene("opening");
    // the letter has physically emerged by the time we settle into reading
    window.setTimeout(() => setScene("letter"), 3400);
  };

  const beginJourney = () => {
    setDip(true);
    window.setTimeout(() => setDip(false), 1100);
    window.setTimeout(() => setScene("video"), 560);
  };

  const skip = () => {
    audio.init();
    audio.stopAll();
    if (videoRef.current) videoRef.current.pause();
    setScene("archive");
  };

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ backgroundColor: C.midnight }}>
      {/* persistent castle film — preloaded, revealed only for the arrival */}
      <video
        ref={videoRef}
        src="/intro.mp4"
        preload="auto"
        playsInline
        onEnded={() => window.setTimeout(() => setScene("archive"), 1100)}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
        style={{
          opacity: scene === "video" ? 1 : 0,
          zIndex: scene === "video" ? 20 : 0,
          pointerEvents: scene === "video" ? "auto" : "none",
          filter: "brightness(0.97) saturate(1.04)",
        }}
      />

      {/* ===== THE DESK — invitation, opening, reading ===== */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: scene === "video" || scene === "archive" ? 0 : 1 }}
        transition={{ duration: 1.1, ease: "easeInOut" }}
        style={{
          zIndex: 10,
          pointerEvents: scene === "video" || scene === "archive" ? "none" : "auto",
        }}
      >
        <DeskScene
          isOpen={isOpen}
          scene={scene}
          showAction={showAction}
          onOpen={openLetter}
          onBegin={beginJourney}
        />
      </motion.div>

      {/* ===== THE ARCHIVE — the website, at last ===== */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: scene === "archive" ? 1 : 0 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        style={{ zIndex: 30, pointerEvents: scene === "archive" ? "auto" : "none" }}
      >
        <ArchiveHero onExplore={onComplete} onFact={() => setFact(RANDOM_FACTS[Math.floor(Math.random() * RANDOM_FACTS.length)])} />
      </motion.div>

      {/* dark cinematic dip into the film */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-[25]"
        style={{ backgroundColor: "#070608" }}
        animate={{ opacity: dip ? 0.92 : 0 }}
        transition={{ duration: 0.55, ease: "easeInOut" }}
      />

      {/* ===== SKIP — always present, never loud ===== */}
      <AnimatePresence>
        {scene !== "archive" && (
          <motion.button
            key="skip"
            onClick={skip}
            className="absolute bottom-5 right-5 z-[40] cursor-pointer select-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4 }}
          >
            <span
              className="font-cinzel text-[10px] tracking-[0.28em] uppercase"
              style={{ color: "rgba(216,206,184,0.4)" }}
            >
              Skip Intro <span style={{ color: "rgba(182,154,90,0.55)" }}>→</span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ===== RANDOM FACT ===== */}
      <AnimatePresence>
        {fact && (
          <motion.div
            className="absolute inset-0 z-[50] flex items-center justify-center px-6"
            style={{ backgroundColor: "rgba(7,6,8,0.78)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            onClick={() => setFact(null)}
          >
            <motion.div
              className="relative max-w-md px-9 py-10 text-center"
              style={{
                background: "linear-gradient(135deg, #E8DFC9, #D8CEB8)",
                border: "1px solid rgba(182,154,90,0.4)",
                boxShadow: "0 10px 60px rgba(0,0,0,0.6), inset 0 0 40px rgba(139,105,20,0.08)",
              }}
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 14, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-5 h-px w-16 mx-auto" style={{ background: "linear-gradient(90deg, transparent, rgba(182,154,90,0.7), transparent)" }} />
              <p className="font-cinzel text-[9px] tracking-[0.34em] uppercase mb-4" style={{ color: "rgba(90,41,48,0.85)" }}>
                From the Archive
              </p>
              <p className="font-cormorant text-lg leading-relaxed" style={{ color: "#2a2118" }}>
                {fact}
              </p>
              <div className="mt-6 h-px w-16 mx-auto" style={{ background: "linear-gradient(90deg, transparent, rgba(182,154,90,0.7), transparent)" }} />
              <button
                onClick={() => setFact(null)}
                className="mt-6 font-cinzel text-[10px] tracking-[0.3em] uppercase cursor-pointer"
                style={{ color: "rgba(74,51,37,0.8)" }}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============================================================
   THE DESK — a quiet, physical study at night
   ============================================================ */
function DeskScene({
  isOpen,
  scene,
  showAction,
  onOpen,
  onBegin,
}: {
  isOpen: boolean;
  scene: Scene;
  showAction: boolean;
  onOpen: () => void;
  onBegin: () => void;
}) {
  return (
    <div className="absolute inset-0" style={{ perspective: 1400 }}>
      {/* cool, enclosing dark — never crushed to black */}
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(ellipse at 50% 42%, ${C.storm}33, ${C.midnight} 70%)` }}
      />

      {/* the study deepens as we lean in */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: isOpen ? 0.32 : 0 }}
        transition={{ duration: 2.4, ease: "easeInOut" }}
        style={{ background: `radial-gradient(ellipse at 50% 55%, transparent 30%, ${C.charcoal} 92%)` }}
      />

      {/* candle, set off to one side */}
      <Candle />

      {/* a few old books, partly in frame */}
      <div className="absolute hidden sm:block" style={{ left: "68%", top: "52%", transform: "rotate(4deg)" }}>
        <div className="relative" style={{ width: 120, height: 26, opacity: 0.85 }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #3A2418, #241610)", border: "1px solid rgba(0,0,0,0.4)", borderRadius: 2, boxShadow: "0 6px 18px rgba(0,0,0,0.5)" }} />
          <div style={{ position: "absolute", left: 6, right: 6, top: 9, height: 2, background: "rgba(182,154,90,0.25)" }} />
          <div style={{ position: "absolute", left: 6, right: 6, top: 15, height: 2, background: "rgba(182,154,90,0.18)" }} />
        </div>
        <div className="relative" style={{ width: 132, height: 24, opacity: 0.7, marginTop: -4, marginLeft: 10, transform: "rotate(-3deg)" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #2A2F2A, #18201C)", border: "1px solid rgba(0,0,0,0.4)", borderRadius: 2, boxShadow: "0 6px 18px rgba(0,0,0,0.5)" }} />
        </div>
      </div>

      {/* a black fountain pen resting on the desk */}
      <div className="absolute" style={{ left: "24%", top: "70%", transform: "rotate(-18deg)" }}>
        <div style={{ width: 150, height: 7, borderRadius: 4, background: "linear-gradient(180deg, #2b2b2e, #0e0e10)", boxShadow: "0 2px 8px rgba(0,0,0,0.5)" }} />
        <div style={{ position: "absolute", right: -10, top: 1, width: 14, height: 5, background: "linear-gradient(90deg, #B69A5A, #6b5a30)", clipPath: "polygon(0 0, 100% 50%, 0 100%)" }} />
      </div>

      {/* the aged walnut desk */}
      <div
        className="absolute inset-x-0 bottom-0 h-[40%] texture-wood"
        style={{
          background: `linear-gradient(180deg, ${C.walnut} 0%, ${C.charcoal} 120%)`,
          boxShadow: "inset 0 18px 40px rgba(0,0,0,0.55), 0 -2px 0 rgba(182,154,90,0.05)",
          borderTop: "1px solid rgba(0,0,0,0.6)",
        }}
      >
        {/* warm light spilling across the grain */}
        <div
          className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse at 22% 0%, ${C.candle}22, transparent 55%)` }}
        />
      </div>

      {/* restrained dust, only where the candlelight falls */}
      <DustMotes />

      {/* the envelope — the interface itself */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ scale: isOpen ? 1.06 : 1 }}
          transition={{ duration: 2.6, ease: "easeInOut" }}
          style={{ width: "min(82vw, 440px)", transformStyle: "preserve-3d" }}
        >
          <Envelope isOpen={isOpen} showAction={showAction} onOpen={onOpen} onBegin={onBegin} />
        </motion.div>
      </div>

      {/* the only words on the opening screen */}
      <AnimatePresence>
        {scene === "invitation" && (
          <motion.div
            className="absolute inset-x-0 bottom-[10%] flex flex-col items-center gap-3 select-none"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: "easeOut" }}
          >
            <p
              className="font-cinzel text-[10px] sm:text-xs tracking-[0.4em] uppercase"
              style={{ color: "rgba(216,206,184,0.42)" }}
            >
              An Invitation Awaits
            </p>
            <button onClick={onOpen} className="group cursor-pointer bg-transparent border-0 p-0">
              <span
                className="font-cinzel text-[10px] sm:text-[11px] tracking-[0.42em] uppercase"
                style={{ color: "rgba(182,154,90,0.7)" }}
              >
                Open the Letter
              </span>
              <span className="block mx-auto mt-2 h-px w-0 group-hover:w-28 transition-all duration-700" style={{ background: "linear-gradient(90deg, transparent, rgba(217,168,94,0.7), transparent)" }} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============================================================
   THE ENVELOPE + LETTER — a single physical object
   ============================================================ */
function Envelope({
  isOpen,
  showAction,
  onOpen,
  onBegin,
}: {
  isOpen: boolean;
  showAction: boolean;
  onOpen: () => void;
  onBegin: () => void;
}) {
  return (
    <div
      className="relative mx-auto"
      style={{ width: "100%", aspectRatio: "1.62 / 1", cursor: isOpen ? "default" : "pointer", transformStyle: "preserve-3d" }}
      onClick={() => !isOpen && onOpen()}
      role="button"
      aria-label="Open the letter"
    >
      {/* envelope back — faint frame once opened */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #EFE7D2, #D8CEB8)",
          borderRadius: 4,
          boxShadow: "0 18px 50px rgba(0,0,0,0.55)",
        }}
      />

      {/* the letter itself, rising from within */}
        <motion.div
          className="absolute"
          style={{
            left: "7%",
            right: "7%",
            bottom: "10%",
            top: "-46%",
            borderRadius: 3,
            transformOrigin: "center bottom",
            pointerEvents: isOpen ? "auto" : "none",
          }}
        animate={{
          y: isOpen ? "0%" : "62%",
          scale: isOpen ? 1 : 0.82,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 1.5, delay: isOpen ? 0.55 : 0, ease: [0.22, 1, 0.36, 1] }}
      >
        <LetterPaper showAction={showAction} onBegin={onBegin} />
      </motion.div>

      {/* the front pocket — carries the address, fades as the letter lifts */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: isOpen ? 0 : 1 }}
        transition={{ duration: 0.9, delay: isOpen ? 0.5 : 0 }}
        style={{
          background: "linear-gradient(135deg, #E8DFC9, #D8CEB8)",
          borderRadius: 4,
          boxShadow: "inset 0 0 30px rgba(139,105,20,0.06)",
          pointerEvents: isOpen ? "none" : "auto",
        }}
      >
        {/* pocket seams */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 62" preserveAspectRatio="none">
          <path d="M0 62 L50 30 L100 62" fill="none" stroke="rgba(139,105,20,0.18)" strokeWidth="0.5" />
          <rect x="2" y="2" width="96" height="58" fill="none" stroke="rgba(182,154,90,0.35)" strokeWidth="0.6" />
        </svg>

        {/* printed address */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <p className="font-cinzel text-[11px] sm:text-[13px] tracking-[0.22em] uppercase" style={{ color: "#1d2a26" }}>
            Hogwarts School
          </p>
          <p className="font-cinzel text-[8px] sm:text-[9px] tracking-[0.3em] uppercase mt-1" style={{ color: "#1d2a26", opacity: 0.85 }}>
            of Witchcraft and Wizardry
          </p>
          <div className="my-3 h-px w-12" style={{ background: "rgba(182,154,90,0.5)" }} />
          <p className="font-cormorant italic text-[11px] sm:text-[13px]" style={{ color: "#24362F" }}>
            To:
          </p>
          <p className="font-cinzel text-[12px] sm:text-[14px] tracking-[0.16em] uppercase mt-0.5" style={{ color: "#1d2a26" }}>
            The Curious Explorer
          </p>
        </div>
      </motion.div>

      {/* the flap — opens upward and back */}
      <motion.div
        className="absolute inset-x-0 top-0"
        style={{
          height: "52%",
          transformOrigin: "top center",
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
          clipPath: "polygon(0 0, 100% 0, 50% 100%)",
          background: "linear-gradient(180deg, #EDE4CF, #DfD5BF)",
          boxShadow: "inset 0 0 24px rgba(139,105,20,0.06)",
          pointerEvents: "none",
        }}
        animate={{ rotateX: isOpen ? -176 : 0 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* the wax seal — cracks and releases */}
      <motion.div
        className="absolute left-1/2"
        style={{ top: "52%", transform: "translate(-50%, -50%)", pointerEvents: "none" }}
        animate={{ scale: isOpen ? 0.4 : 1, opacity: isOpen ? 0 : 1, rotate: isOpen ? -12 : 0 }}
        transition={{ duration: 0.5, ease: "easeIn" }}
      >
        <WaxSeal />
      </motion.div>
    </div>
  );
}

function WaxSeal() {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{
        width: 58,
        height: 58,
        borderRadius: "50%",
        background: "radial-gradient(circle at 38% 32%, #7a3540, #5A2930 55%, #3c1b22 100%)",
        boxShadow: "0 4px 14px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.06), inset 0 -3px 6px rgba(0,0,0,0.4)",
        border: "1px solid rgba(60,20,28,0.6)",
      }}
    >
      <div
        className="flex items-center justify-center rounded-full"
        style={{ width: 40, height: 40, border: "1px solid rgba(182,154,90,0.55)", background: "radial-gradient(circle, rgba(182,154,90,0.08), transparent)" }}
      >
        <span className="font-cinzel text-lg font-bold" style={{ color: "rgba(216,206,184,0.8)", textShadow: "0 1px 1px rgba(0,0,0,0.5)" }}>
          H
        </span>
      </div>
    </div>
  );
}

function LetterPaper({ showAction, onBegin }: { showAction: boolean; onBegin: () => void }) {
  return (
    <div
      className="relative h-full w-full texture-parchment"
      style={{
        background: "linear-gradient(135deg, #E8DFC9, #D8CEB8)",
        border: "1px solid rgba(182,154,90,0.5)",
        boxShadow: "0 14px 44px rgba(0,0,0,0.5), inset 0 0 40px rgba(139,105,20,0.08)",
        padding: "clamp(14px, 4.5%, 26px)",
        overflow: "hidden",
      }}
    >
      {/* aged edges */}
      <div className="pointer-events-none absolute inset-0" style={{ boxShadow: "inset 0 0 26px rgba(120,90,40,0.12)" }} />

      <div className="flex h-full flex-col">
        {/* heading */}
        <div className="text-center shrink-0">
          <p className="font-cinzel text-[9px] text-[11px] tracking-[0.34em] uppercase" style={{ color: "#1d2a26" }}>
            Hogwarts School
          </p>
          <p className="font-cinzel text-[7px] text-[8px] tracking-[0.26em] uppercase mt-0.5" style={{ color: "#1d2a26", opacity: 0.8 }}>
            of Witchcraft and Wizardry
          </p>
          <div className="my-2.5 h-px w-14 mx-auto" style={{ background: "linear-gradient(90deg, transparent, rgba(182,154,90,0.7), transparent)" }} />
        </div>

        {/* body */}
        <div className="flex-1 min-h-0 overflow-auto pr-1">
          <p className="font-cormorant text-[13px] sm:text-[15px] leading-[1.55]" style={{ color: "#1f2a33" }}>
            <span className="block mb-2">{LETTER.salutation}</span>
            {LETTER.body.map((p, i) => (
              <span key={i} className="block mb-2.5">
                {p}
              </span>
            ))}
            <span className="block mt-1">{LETTER.closer[0]}</span>
            <span className="block">{LETTER.closer[1]}</span>
          </p>
        </div>

        {/* signature */}
        <div className="shrink-0 text-center mt-1">
          <p className="font-decorative text-[14px] sm:text-[16px] tracking-[0.08em]" style={{ color: "#3a2a1a" }}>
            {LETTER.sign}
          </p>
        </div>

        {/* the engraved invitation to continue */}
        <AnimatePresence>
          {showAction && (
            <motion.button
              onClick={onBegin}
              className="shrink-0 mx-auto mt-3 cursor-pointer bg-transparent border-0 block"
              initial={{ opacity: 0, letterSpacing: "0.3em" }}
              animate={{ opacity: 1, letterSpacing: "0.34em" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              whileHover={{ letterSpacing: "0.42em" }}
              style={{ padding: "6px 4px" }}
            >
              <span
                className="font-cinzel text-[10px] sm:text-[11px] uppercase transition-colors duration-700"
                style={{ color: "rgba(182,154,90,0.78)", textShadow: "0 0 0 rgba(217,168,94,0)" }}
                onMouseEnter={(e) => (e.currentTarget.style.textShadow = "0 0 12px rgba(217,168,94,0.35)")}
                onMouseLeave={(e) => (e.currentTarget.style.textShadow = "0 0 0 rgba(217,168,94,0)")}
              >
                Begin Your Journey
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ============================================================
   THE CANDLE — a single, steady flame
   ============================================================ */
function Candle() {
  return (
    <div className="absolute" style={{ left: "16%", top: "30%", width: 60, height: 200 }}>
      {/* warm pool of light */}
      <div
        className="absolute"
        style={{
          left: "50%",
          top: 70,
          width: 320,
          height: 320,
          transform: "translate(-50%, -30%)",
          background: `radial-gradient(circle, ${C.candle}26, transparent 62%)`,
          filter: "blur(2px)",
        }}
      />
      {/* candle body */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{ top: 96, width: 22, height: 96, background: "linear-gradient(90deg, #c9bfa6, #efe7d2 45%, #b8ad92)", borderRadius: "4px 4px 2px 2px", boxShadow: "0 4px 14px rgba(0,0,0,0.5)" }}
      />
      {/* wax drip */}
      <div className="absolute left-1/2 -translate-x-1/2" style={{ top: 150, width: 6, height: 18, background: "rgba(184,173,146,0.7)", borderRadius: "0 0 4px 4px" }} />
      {/* wick */}
      <div className="absolute left-1/2 -translate-x-1/2" style={{ top: 88, width: 2, height: 10, background: "#2a211a" }} />
      {/* flame */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2"
        style={{ top: 60, width: 16, height: 34, transformOrigin: "bottom center" }}
        animate={{ scaleY: [1, 1.08, 0.96, 1.04, 1], scaleX: [1, 0.96, 1.03, 0.98, 1], opacity: [0.9, 1, 0.86, 0.97, 0.9], translateY: [0, -1, 1, -0.5, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div style={{ width: "100%", height: "100%", background: "radial-gradient(ellipse at 50% 70%, #fff3c4, #FFB300 45%, rgba(217,92,20,0.6) 80%, transparent 100%)", borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", filter: "blur(0.4px)", boxShadow: "0 0 22px rgba(255,179,0,0.5)" }} />
      </motion.div>
    </div>
  );
}

/* ============================================================
   DUST — barely there, only in the candlelight
   ============================================================ */
function DustMotes() {
  const motes = useRef(
    Array.from({ length: 9 }, (_, i) => ({
      x: 8 + (i * 17) % 38,
      y: 30 + (i * 23) % 50,
      s: 1.5 + (i % 2),
      dur: 14 + (i % 5) * 3,
      delay: (i % 6) * 1.4,
    })),
  ).current;
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ clipPath: "inset(0 0 40% 0)" }}>
      {motes.map((m, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ left: `${m.x}%`, top: `${m.y}%`, width: m.s, height: m.s, background: "rgba(217,168,94,0.5)", filter: "blur(0.4px)" }}
          animate={{ y: [0, -26, 0], x: [0, 8, -4, 0], opacity: [0, 0.5, 0] }}
          transition={{ duration: m.dur, repeat: Infinity, delay: m.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ============================================================
   THE ARCHIVE HERO — the website, revealed at last
   ============================================================ */
function ArchiveHero({ onExplore, onFact }: { onExplore: () => void; onFact: () => void }) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center px-6 text-center"
      style={{
        background: `radial-gradient(ellipse at 50% 38%, ${C.walnut}55, ${C.charcoal} 72%), linear-gradient(180deg, ${C.charcoal}, ${C.midnight})`,
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 40%, ${C.candle}14, transparent 55%)` }}
      />
      <div className="relative max-w-2xl">
        <motion.p
          className="font-cinzel text-[10px] tracking-[0.5em] uppercase mb-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          style={{ color: "rgba(182,154,90,0.6)" }}
        >
          You have entered
        </motion.p>
        <motion.h1
          className="font-decorative text-4xl sm:text-6xl lg:text-7xl font-bold"
          initial={{ opacity: 0, letterSpacing: "0.18em" }}
          animate={{ opacity: 1, letterSpacing: "0.06em" }}
          transition={{ duration: 2.2, ease: "easeOut" }}
          style={{ color: "rgba(232,223,201,0.92)", textShadow: "0 0 40px rgba(182,154,90,0.18)" }}
        >
          The Hogwarts Archive
        </motion.h1>
        <motion.div
          className="h-px w-40 mx-auto my-7"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.4, delay: 0.8 }}
          style={{ background: "linear-gradient(90deg, transparent, rgba(182,154,90,0.7), transparent)" }}
        />
        <motion.p
          className="font-cormorant text-base sm:text-lg leading-relaxed mx-auto max-w-xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 1 }}
          style={{ color: "rgba(216,206,184,0.7)" }}
        >
          A collection of the people, places, houses, stories and secrets that make Hogwarts extraordinary.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 1.3 }}
        >
          <button
            onClick={onExplore}
            className="cursor-pointer group"
            style={{
              padding: "14px 34px",
              background: "linear-gradient(180deg, rgba(74,51,37,0.4), rgba(23,25,27,0.5))",
              border: "1px solid rgba(182,154,90,0.35)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.4), inset 0 0 20px rgba(182,154,90,0.04)",
            }}
          >
            <span className="font-cinzel text-[11px] sm:text-xs tracking-[0.3em] uppercase" style={{ color: "rgba(216,206,184,0.85)" }}>
              Begin Exploring
            </span>
          </button>
          <button
            onClick={onFact}
            className="cursor-pointer"
            style={{
              padding: "14px 28px",
              background: "transparent",
              border: "1px solid rgba(182,154,90,0.18)",
            }}
          >
            <span className="font-cinzel text-[10px] sm:text-[11px] tracking-[0.28em] uppercase" style={{ color: "rgba(182,154,90,0.7)" }}>
              Discover a Random Fact
            </span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
