import type { AmbientEffect } from "@/types";
import {
  Rain,
  Fog,
  FloatingCandles,
  Fireflies,
  Sparkles,
  Stars,
  Lightning,
  DustParticles,
  Bubbles,
  Smoke,
  Embers,
  Leaves,
  Feathers,
  Portraits,
  StainedGlassLight,
} from "@/components/ambient";

const EFFECT_MAP: Record<AmbientEffect, React.FC> = {
  "floating-candles": FloatingCandles,
  rain: Rain,
  fog: Fog,
  fireflies: Fireflies,
  sparkles: Sparkles,
  "dust-particles": DustParticles,
  snow: Rain,
  lightning: Lightning,
  embers: Embers,
  leaves: Leaves,
  stars: Stars,
  bubbles: Bubbles,
  smoke: Smoke,
  feathers: Feathers,
  "stained-glass-light": StainedGlassLight,
  moonlight: Stars,
  "moving-stairs": Sparkles,
  portraits: Portraits,
  "floating-books": Sparkles,
  "cauldron-steam": Smoke,
  wind: Leaves,
  candles: FloatingCandles,
  "magic-glow": Sparkles,
};

interface EffectsRendererProps {
  effects: AmbientEffect[];
}

export function EffectsRenderer({ effects }: EffectsRendererProps) {
  return (
    <>
      {effects.map((effect) => {
        const Component = EFFECT_MAP[effect];
        return Component ? <Component key={effect} /> : null;
      })}
    </>
  );
}
