import type { AmbientEffect } from "@/types";
import {
  Rain, Fog, FloatingCandles, Fireflies, Sparkles, Stars, Lightning,
  DustParticles, Bubbles, Smoke, Embers, Leaves, Feathers, Portraits,
  StainedGlassLight, Curtains, Fireplace, Banners, WeatherWindow,
} from "@/components/ambient";

const EFFECT_MAP: Record<AmbientEffect, React.FC> = {
  "floating-candles": FloatingCandles, rain: Rain, fog: Fog, fireflies: Fireflies,
  sparkles: Sparkles, dust: DustParticles, snow: Rain, lightning: Lightning,
  embers: Embers, leaves: Leaves, stars: Stars, bubbles: Bubbles, smoke: Smoke,
  feathers: Feathers, "stained-glass": StainedGlassLight, moonlight: Stars,
  portraits: Portraits, "floating-books": Sparkles, "cauldron-steam": Smoke,
  wind: Leaves, curtains: Curtains, fireplace: Fireplace, "weather-window": WeatherWindow,
  "moving-stairs": Sparkles, banners: Banners, owls: Feathers, "magic-glow": Sparkles,
};

export function EffectsRenderer({ effects }: { effects: AmbientEffect[] }) {
  return <>{effects.map((e) => { const C = EFFECT_MAP[e]; return C ? <C key={e} /> : null; })}</>;
}
