export interface Room {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  colors: {
    primary: string;
    ambient: string;
    glow: string;
  };
  ambientEffects: AmbientEffect[];
  interactiveElements: InteractiveElement[];
  secrets: Secret[];
  quote?: string;
}

export type AmbientEffect =
  | "floating-candles"
  | "rain"
  | "fog"
  | "fireflies"
  | "sparkles"
  | "dust-particles"
  | "snow"
  | "lightning"
  | "embers"
  | "leaves"
  | "stars"
  | "bubbles"
  | "smoke"
  | "feathers"
  | "stained-glass-light"
  | "moonlight"
  | "moving-stairs"
  | "portraits"
  | "floating-books"
  | "cauldron-steam"
  | "wind"
  | "candles"
  | "magic-glow";

export interface InteractiveElement {
  id: string;
  type: "candle" | "book" | "door" | "painting" | "potion" | "chest" | "rune" | "switch" | "statue" | "fireplace" | "telescope" | "cauldron";
  name: string;
  description: string;
  position: { x: number; y: number };
  interaction: string;
  discovered: boolean;
}

export interface Secret {
  id: string;
  name: string;
  description: string;
  hint: string;
  type: "rune-puzzle" | "hidden-door" | "enchanted-key" | "artifact" | "passage" | "spell";
  requiredKeys?: number;
}

export interface Discovery {
  id: string;
  roomId: string;
  secretId: string;
  discoveredAt: number;
}

export interface GameState {
  currentRoom: string | null;
  discoveries: Discovery[];
  unlockedRooms: string[];
  inventory: string[];
  totalSecrets: number;
  discoveredSecrets: number;
}

export type WeatherType = "clear" | "rain" | "snow" | "storm" | "fog";

export interface AmbientState {
  weather: WeatherType;
  timeOfDay: "dawn" | "day" | "dusk" | "night";
  audioEnabled: boolean;
  audioMuted: boolean;
}
