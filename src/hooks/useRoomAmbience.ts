import { useEffect } from "react";
import { useAmbience, type Layer, type OneShot } from "@/context/AmbienceProvider";

type Pair = [Layer, number];
type Scape = Pair[];

// A continuous, subtle soundscape for each location. Volumes are relative
// to the shared engine defaults; layers crossfade when moving between rooms.
const SCAPES: Record<string, Scape> = {
  "great-hall": [
    ["choir", 0.012],
    ["pad", 0.016],
    ["murmur", 0.006],
  ],
  library: [
    ["pad", 0.012],
    ["pages", 0.008],
    ["quill", 0.006],
  ],
  "grand-staircase": [
    ["wind", 0.014],
    ["pad", 0.01],
    ["creak", 0.006],
  ],
  courtyard: [
    ["birds", 0.05],
    ["fountain", 0.05],
    ["wind", 0.018],
  ],
  "astronomy-tower": [
    ["wind", 0.022],
    ["arpeggio", 0.03],
  ],
  "headmasters-office": [
    ["pad", 0.01],
    ["pages", 0.01],
    ["creak", 0.005],
  ],
  "common-room": [
    ["fire", 0.03],
    ["pad", 0.014],
    ["murmur", 0.008],
  ],
  "potion-laboratory": [
    ["murmur", 0.008],
    ["arpeggio", 0.022],
    ["pad", 0.012],
  ],
  greenhouses: [
    ["birds", 0.035],
    ["fountain", 0.03],
    ["wind", 0.014],
  ],
  "forbidden-forest": [
    ["wind", 0.02],
    ["creak", 0.008],
    ["birds", 0.022],
  ],
  owlery: [
    ["wind", 0.024],
    ["birds", 0.04],
  ],
  "room-of-requirement": [
    ["pad", 0.02],
    ["arpeggio", 0.04],
  ],
  "secret-chamber": [
    ["pad", 0.014],
    ["arpeggio", 0.028],
    ["creak", 0.006],
  ],
  // Landing approach — a transition into the castle.
  approach: [
    ["rain", 0.024],
    ["wind", 0.022],
    ["pad", 0.02],
  ],
};

// Occasional one-shots per room, keyed by room id.
const ONE_SHOTS: Record<string, OneShot[]> = {
  owlery: ["owl"],
  courtyard: ["bells"],
  "great-hall": ["bells"],
  "astronomy-tower": ["bells"],
};

/**
 * Starts the continuous soundscape for a room (or "approach") and stops it on
 * cleanup. Also cycles gentle one-shots where fitting. Returns the engine so
 * callers can trigger bespoke moments via `.play(...)`.
 */
export function useRoomAmbience(roomId: string) {
  const engine = useAmbience();

  useEffect(() => {
    const scape = SCAPES[roomId] ?? [];
    scape.forEach(([id, vol]) => engine.start(id, vol));

    let oneshot: ReturnType<typeof setInterval> | undefined;
    const shots = ONE_SHOTS[roomId];
    if (shots && shots.length) {
      let i = 0;
      oneshot = setInterval(() => {
        engine.play(shots[i % shots.length]);
        i++;
      }, 9000);
    }

    return () => {
      if (oneshot) clearInterval(oneshot);
      scape.forEach(([id]) => engine.stop(id, 1.2));
    };
  }, [roomId, engine]);

  return engine;
}