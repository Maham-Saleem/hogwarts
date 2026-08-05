import type { AmbientEffect } from "@/types";
import { DustParticles } from "@/components/ambient/DustParticles";
import { FloatingCandles } from "@/components/ambient/FloatingCandles";
import { Rain } from "@/components/ambient/Rain";
import { Fog } from "@/components/ambient/Fog";
import { Fireflies } from "@/components/ambient/Fireflies";
import { Sparkles } from "@/components/ambient/Sparkles";
import { Stars } from "@/components/ambient/Stars";
import { Lightning } from "@/components/ambient/Lightning";
import { Embers } from "@/components/ambient/Embers";
import { Leaves } from "@/components/ambient/Leaves";
import { Bubbles } from "@/components/ambient/Bubbles";
import { Smoke } from "@/components/ambient/Smoke";
import { Portraits } from "@/components/ambient/Portraits";
import { StainedGlassLight } from "@/components/ambient/StainedGlassLight";
import { Curtains } from "@/components/ambient/Curtains";
import { Fireplace } from "@/components/ambient/Fireplace";
import { Banners } from "@/components/ambient/Banners";
import { WeatherWindow } from "@/components/ambient/WeatherWindow";
import { MovingStairs } from "@/components/ambient/MovingStairs";
import { Owls } from "@/components/ambient/Owls";
import { Feathers } from "@/components/ambient/Feathers";
import { MagicGlow } from "@/components/ambient/MagicGlow";

const effectMap: Record<AmbientEffect, React.ComponentType> = {
  "dust": DustParticles,
  "floating-candles": FloatingCandles,
  "rain": Rain,
  "fog": Fog,
  "fireflies": Fireflies,
  "sparkles": Sparkles,
  "stars": Stars,
  "lightning": Lightning,
  "embers": Embers,
  "leaves": Leaves,
  "bubbles": Bubbles,
  "smoke": Smoke,
  "portraits": Portraits,
  "stained-glass": StainedGlassLight,
  "curtains": Curtains,
  "fireplace": Fireplace,
  "banners": Banners,
  "weather-window": WeatherWindow,
  "moving-stairs": MovingStairs,
  "owls": Owls,
  "feathers": Feathers,
  "magic-glow": MagicGlow,
  "snow": Fog,
  "wind": Curtains,
  "floating-books": DustParticles,
  "cauldron-steam": Smoke,
  "moonlight": StainedGlassLight,
};

interface EffectsRendererProps {
  effects: AmbientEffect[];
}

export function EffectsRenderer({ effects }: EffectsRendererProps) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {effects.map((effect) => {
        const Component = effectMap[effect];
        if (!Component) return null;
        return <Component key={effect} />;
      })}
    </div>
  );
}
