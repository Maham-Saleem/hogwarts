export type RoomId =
  | "entrance-hall"
  | "great-hall"
  | "library"
  | "grand-staircase"
  | "astronomy-tower"
  | "potion-laboratory"
  | "greenhouses"
  | "owl-tower"
  | "forbidden-forest"
  | "common-room"
  | "courtyard"
  | "headmasters-office"
  | "secret-chamber";

export interface Room {
  id: RoomId;
  name: string;
  subtitle: string;
  description: string;
  icon: string;
  colors: { primary: string; ambient: string; glow: string; surface: string };
  ambientEffects: AmbientEffect[];
  interactiveElements: InteractiveElement[];
  secrets: Secret[];
  quote?: string;
  unlocked: boolean;
}

export type AmbientEffect =
  | "floating-candles" | "rain" | "fog" | "fireflies" | "sparkles"
  | "dust" | "snow" | "lightning" | "embers" | "leaves" | "stars"
  | "bubbles" | "smoke" | "feathers" | "stained-glass" | "moonlight"
  | "portraits" | "floating-books" | "cauldron-steam" | "wind"
  | "curtains" | "weather-window" | "fireplace" | "moving-stairs"
  | "banners" | "owls" | "magic-glow";

export interface InteractiveElement {
  id: string;
  type: "candle" | "book" | "door" | "painting" | "potion" | "chest" | "rune" | "switch" | "statue" | "fireplace" | "telescope" | "cauldron" | "scroll" | "mirror";
  name: string;
  description: string;
  position: { x: number; y: number };
  interaction: string;
}

export interface Secret {
  id: string;
  name: string;
  description: string;
  hint: string;
  type: "rune-puzzle" | "hidden-door" | "enchanted-key" | "artifact" | "passage" | "spell" | "alohomora";
}

export interface Discovery {
  id: string;
  roomId: string;
  secretId: string;
  discoveredAt: number;
}

export interface GameState {
  currentRoom: RoomId | null;
  discoveries: Discovery[];
  unlockedRooms: RoomId[];
  inventory: string[];
  totalSecrets: number;
  discoveredSecrets: number;
}

export type LandingPhase = "rain" | "letter" | "seal" | "unfold" | "boat" | "approach" | "doors" | "entering" | "done";
export type WeatherType = "clear" | "rain" | "storm" | "fog";
