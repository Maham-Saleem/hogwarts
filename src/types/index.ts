export type RoomId =
  | "great-hall"
  | "library"
  | "grand-staircase"
  | "courtyard"
  | "astronomy-tower"
  | "headmasters-office"
  | "common-room"
  | "potion-laboratory"
  | "greenhouses"
  | "forbidden-forest"
  | "owlery"
  | "room-of-requirement"
  | "secret-chamber";

export type TransitionType = "door" | "stairs" | "corridor" | "fade" | "parchment";

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
  connections: { target: RoomId; label: string; transition: TransitionType; direction: "left" | "right" | "forward" | "up" | "down" | "back" }[];
  quote?: string;
  starter: boolean;
  unlockRequires?: string;
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
  type: "candle" | "book" | "door" | "painting" | "potion" | "chest" | "rune" | "switch" | "statue" | "fireplace" | "telescope" | "cauldron" | "scroll" | "mirror" | "gargoyle" | "chandelier";
  name: string;
  description: string;
  position: { x: number; y: number };
  interaction: string;
  unlocksRoom?: RoomId;
}

export interface Secret {
  id: string;
  name: string;
  description: string;
  hint: string;
  type: "rune-puzzle" | "hidden-door" | "enchanted-key" | "artifact" | "passage" | "spell" | "alohomora";
}

export interface Discovery {
  roomId: string;
  secretId: string;
  discoveredAt: number;
}

export interface GameState {
  discoveries: Discovery[];
  unlockedRooms: RoomId[];
  inventory: string[];
  visitedRooms: RoomId[];
  interactedElements: string[];
}

export type LandingPhase = "rain" | "owl" | "seal" | "letter" | "boat" | "approach" | "doors" | "done";
