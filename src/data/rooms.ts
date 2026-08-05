import type { Room } from "@/types";

export const rooms: Room[] = [
  // === STARTER ROOMS ===
  {
    id: "great-hall",
    name: "The Great Hall",
    subtitle: "Heart of the Castle",
    description: "A vast enchanted chamber where a thousand candles float beneath an ever-changing sky. Four house tables stretch into the distance. The air shimmers with ancient magic. Doorways lead in every direction — this is where all journeys begin.",
    icon: "🏰",
    colors: { primary: "#D4AF37", ambient: "rgba(212,175,55,0.06)", glow: "rgba(212,175,55,0.2)", surface: "rgba(42,29,20,0.3)" },
    ambientEffects: ["floating-candles", "sparkles", "stained-glass", "banners", "fireplace"],
    interactiveElements: [
      { id: "gh-candle", type: "candle", name: "Floating Candle", description: "A warm flame dances in mid-air.", position: { x: 25, y: 18 }, interaction: "The flame brightens, revealing ancient runes carved into the ceiling stones." },
      { id: "gh-painting", type: "painting", name: "Founder's Portrait", description: "A massive painting of the four founders.", position: { x: 50, y: 12 }, interaction: "The figures turn to look at you and nod. One gestures toward the Library." },
      { id: "gh-hourglass", type: "rune", name: "House Hourglass", description: "A towering hourglass filled with glowing gems.", position: { x: 78, y: 35 }, interaction: "The gems pulse with house colors. A hidden compartment opens at the base, revealing a golden key." },
      { id: "gh-fireplace", type: "fireplace", name: "Grand Fireplace", description: "An enormous stone fireplace with an eternal flame.", position: { x: 50, y: 82 }, interaction: "The flames part to reveal a hidden message: 'The forest remembers what the castle forgets.'", unlocksRoom: "forbidden-forest" },
    ],
    secrets: [
      { id: "gh-secret-1", name: "The Founders' Toast", description: "Light all floating candles simultaneously to witness the founders' ancient gathering.", hint: "The candles remember their first toast.", type: "rune-puzzle" },
    ],
    connections: [
      { target: "library", label: "Library", transition: "corridor", direction: "left" },
      { target: "grand-staircase", label: "Grand Staircase", transition: "corridor", direction: "forward" },
      { target: "courtyard", label: "Courtyard", transition: "door", direction: "right" },
    ],
    quote: "It is our choices that show what we truly are, far more than our abilities.",
    starter: true,
  },
  {
    id: "library",
    name: "The Library",
    subtitle: "Repository of All Knowledge",
    description: "Endless shelves stretch into shadow, holding thousands of ancient volumes. Dust motes drift through candlelight. Occasionally a book lifts itself from a shelf. The Restricted Section glows faintly behind its velvet rope.",
    icon: "📚",
    colors: { primary: "#8B6914", ambient: "rgba(139,105,20,0.05)", glow: "rgba(212,175,55,0.12)", surface: "rgba(61,43,31,0.25)" },
    ambientEffects: ["dust", "floating-books", "floating-candles"],
    interactiveElements: [
      { id: "lib-book", type: "book", name: "Ancient Tome", description: "A leather-bound book with golden clasps, pulsing faintly.", position: { x: 30, y: 42 }, interaction: "The book opens to reveal a map of hidden passages throughout the castle." },
      { id: "lib-restricted", type: "door", name: "Restricted Section", description: "A chained book behind a velvet rope.", position: { x: 72, y: 50 }, interaction: "The chains loosen with a whisper. Inside: 'The Headmaster keeps his greatest secrets behind the mirror.'", unlocksRoom: "headmasters-office" },
      { id: "lib-ladder", type: "switch", name: "Moving Ladder", description: "A tall wooden ladder that slides along the shelves.", position: { x: 55, y: 30 }, interaction: "The ladder carries you to a hidden alcove. Behind the false wall: a passage to the Secret Chamber.", unlocksRoom: "secret-chamber" },
      { id: "lib-desk", type: "scroll", name: "Reading Desk", description: "An ancient oak desk with an open spellbook and quill.", position: { x: 45, y: 72 }, interaction: "The quill writes by itself: 'To find the Room of Requirement, you must need it truly.'" },
    ],
    secrets: [
      { id: "lib-secret-1", name: "The Lost Chapter", description: "Find all enchanted books to reconstruct a lost chapter of a legendary spellbook.", hint: "Knowledge floats to those who seek it.", type: "enchanted-key" },
      { id: "lib-secret-2", name: "The Librarian's Secret", description: "A hidden reading room behind a false bookshelf.", hint: "Pull the thickest volume on the third shelf.", type: "hidden-door" },
    ],
    connections: [
      { target: "great-hall", label: "Great Hall", transition: "corridor", direction: "right" },
    ],
    quote: "When in doubt, go to the library.",
    starter: true,
  },
  {
    id: "grand-staircase",
    name: "The Grand Staircase",
    subtitle: "The Living Architecture",
    description: "Enormous stone staircases shift and rearrange without warning. The walls are lined with living portraits that watch and whisper. Suits of armor track your movement. Stained-glass windows cast colored light across the moving steps.",
    icon: "🪜",
    colors: { primary: "#C9CDD3", ambient: "rgba(201,205,211,0.03)", glow: "rgba(212,175,55,0.1)", surface: "rgba(74,74,74,0.15)" },
    ambientEffects: ["portraits", "moving-stairs", "floating-candles", "stained-glass", "banners"],
    interactiveElements: [
      { id: "gs-portrait", type: "painting", name: "Sleeping Knight", description: "A portrait of a knight who appears to be sleeping.", position: { x: 25, y: 32 }, interaction: "He wakes, blinks slowly, and whispers: 'The Astronomy Tower holds the oldest secrets. Look up.'" },
      { id: "gs-armor", type: "statue", name: "Suit of Armor", description: "An ornate suit of armor that follows you with its gaze.", position: { x: 72, y: 55 }, interaction: "It steps aside with a grinding sound, revealing a staircase going up.", unlocksRoom: "astronomy-tower" },
      { id: "gs-gargoyle", type: "gargoyle", name: "Stone Gargoyle", description: "A carved gargoyle perched on the banister.", position: { x: 40, y: 48 }, interaction: "The gargoyle's eyes glow. A spiral staircase appears behind it, leading to a circular office.", unlocksRoom: "headmasters-office" },
    ],
    secrets: [
      { id: "gs-secret-1", name: "The Moving Passage", description: "Time the staircase movements to find a momentary passage.", hint: "The stairs move in a pattern. Patience reveals the way.", type: "passage" },
    ],
    connections: [
      { target: "great-hall", label: "Great Hall", transition: "stairs", direction: "down" },
      { target: "common-room", label: "Common Room", transition: "corridor", direction: "forward" },
    ],
    starter: true,
  },
  {
    id: "courtyard",
    name: "The Courtyard",
    subtitle: "Where Worlds Collide",
    description: "An open courtyard surrounded by gothic arches and flowering vines. A stone fountain murmurs in the center. The sky above is always changing. This is the castle's breathing room — a place of calm between adventures.",
    icon: "⛲",
    colors: { primary: "#C9CDD3", ambient: "rgba(201,205,211,0.03)", glow: "rgba(74,158,255,0.08)", surface: "rgba(74,74,74,0.12)" },
    ambientEffects: ["weather-window", "leaves", "dust", "wind"],
    interactiveElements: [
      { id: "cy-fountain", type: "rune", name: "Wishing Fountain", description: "A stone fountain with glowing water.", position: { x: 50, y: 55 }, interaction: "Throwing a coin reveals a vision: the Greenhouses, hidden behind the eastern wall." },
      { id: "cy-arch", type: "door", name: "Eastern Arch", description: "A stone archway covered in ivy.", position: { x: 82, y: 40 }, interaction: "Pushing aside the vines reveals a path to the Greenhouses.", unlocksRoom: "greenhouses" },
      { id: "cy-tree", type: "statue", name: "Ancient Oak", description: "A massive tree growing through the courtyard stones.", position: { x: 20, y: 45 }, interaction: "Carved into the bark: 'Only those who know the forest's name may enter.' The path to the Forbidden Forest opens.", unlocksRoom: "forbidden-forest" },
    ],
    secrets: [
      { id: "cy-secret-1", name: "The Fountain's Wish", description: "The fountain grants one wish to those who know the words.", hint: "Water remembers every word spoken above it.", type: "spell" },
    ],
    connections: [
      { target: "great-hall", label: "Great Hall", transition: "door", direction: "left" },
    ],
    starter: true,
  },

  // === UNLOCKABLE ROOMS ===
  {
    id: "astronomy-tower",
    name: "Astronomy Tower",
    subtitle: "Window to the Cosmos",
    description: "The highest point of the castle. The night sky unfolds in infinite splendor. Constellations shift and pulse. A great brass telescope points toward distant worlds. The wind carries the scent of stars.",
    icon: "🔭",
    colors: { primary: "#4A9EFF", ambient: "rgba(74,158,255,0.05)", glow: "rgba(74,158,255,0.15)", surface: "rgba(26,26,46,0.35)" },
    ambientEffects: ["stars", "moonlight", "wind"],
    interactiveElements: [
      { id: "at-telescope", type: "telescope", name: "Grand Telescope", description: "A magnificent brass telescope aimed at the stars.", position: { x: 50, y: 50 }, interaction: "Looking through it, you see not stars but memories — the castle's founding, centuries ago." },
      { id: "at-constellation", type: "rune", name: "Dancing Constellation", description: "Stars rearrange into an unfamiliar pattern.", position: { x: 30, y: 22 }, interaction: "The constellation draws a map in the sky, marking the location of the Room of Requirement." },
    ],
    secrets: [
      { id: "at-secret-1", name: "The Star Map", description: "Align the telescope to three hidden constellations.", hint: "The stars remember the old routes.", type: "rune-puzzle" },
    ],
    connections: [
      { target: "grand-staircase", label: "Grand Staircase", transition: "stairs", direction: "down" },
    ],
    quote: "We are all made of star stuff.",
    starter: false,
    unlockRequires: "The suit of armor steps aside",
  },
  {
    id: "headmasters-office",
    name: "Headmaster's Office",
    subtitle: "The Inner Sanctum",
    description: "A circular room filled with fascinating instruments. The Sorting Hat sits on a shelf. Portraits of past headmasters line the walls. A magnificent phoenix perches above the desk. This room holds the castle's deepest wisdom.",
    icon: "🪶",
    colors: { primary: "#D4AF37", ambient: "rgba(212,175,55,0.06)", glow: "rgba(212,175,55,0.18)", surface: "rgba(42,29,20,0.3)" },
    ambientEffects: ["floating-candles", "dust", "fireplace", "portraits"],
    interactiveElements: [
      { id: "ho-hat", type: "statue", name: "The Sorting Hat", description: "An old, patched, frayed and dirty wizard's hat.", position: { x: 30, y: 30 }, interaction: "The Hat whispers: 'I see courage in you. And something else... curiosity. The deepest kind.'" },
      { id: "ho-phoenix", type: "statue", name: "The Phoenix", description: "A magnificent scarlet and gold bird.", position: { x: 70, y: 25 }, interaction: "A single feather falls — it glows with warm light. Written on it: 'About the Architect.'" },
      { id: "ho-pensieve", type: "potion", name: "The Pensieve", description: "A shallow stone basin filled with silvery substance.", position: { x: 50, y: 55 }, interaction: "Dipping in reveals memories of the castle being built — stone by stone, century by century." },
      { id: "ho-mirror", type: "mirror", name: "Enchanted Mirror", description: "An ornate mirror that shows not reflections but truths.", position: { x: 80, y: 45 }, interaction: "The mirror shows the developer's journey — lines of code becoming castles, bugs becoming dragons, fixes becoming spells." },
    ],
    secrets: [
      { id: "ho-secret-1", name: "The Headmaster's Secret", description: "A hidden drawer contains the headmaster's private journal.", hint: "The phoenix guards what matters most.", type: "hidden-door" },
    ],
    connections: [
      { target: "grand-staircase", label: "Grand Staircase", transition: "stairs", direction: "down" },
    ],
    quote: "Help will always be given at Hogwarts to those who ask for it.",
    starter: false,
    unlockRequires: "The gargoyle reveals the way",
  },
  {
    id: "common-room",
    name: "The Common Room",
    subtitle: "Your Private Sanctuary",
    description: "A warm, inviting chamber with plush armchairs, a crackling fireplace, and your house banner. This is your personal space — a place to rest, study, and display your achievements. The window shows the weather outside.",
    icon: "🪑",
    colors: { primary: "#D4AF37", ambient: "rgba(212,175,55,0.05)", glow: "rgba(255,120,50,0.12)", surface: "rgba(61,43,31,0.25)" },
    ambientEffects: ["fireplace", "floating-candles", "dust", "curtains"],
    interactiveElements: [
      { id: "cr-mirror", type: "mirror", name: "Enchanted Mirror", description: "An ornate mirror showing your magical progress.", position: { x: 50, y: 30 }, interaction: "The mirror reflects not your face, but your greatest achievement so far." },
      { id: "cr-chest", type: "chest", name: "Personal Chest", description: "A wooden chest with brass fittings.", position: { x: 25, y: 65 }, interaction: "Inside are collected artifacts from your adventures — each one a memory." },
      { id: "cr-bookshelf", type: "book", name: "Personal Library", description: "A small bookshelf with your collected volumes.", position: { x: 75, y: 40 }, interaction: "The books arrange themselves by discovery date. The latest one is still being written." },
    ],
    secrets: [
      { id: "cr-secret-1", name: "The Hidden Compartment", description: "A secret drawer in the desk contains a family heirloom.", hint: "Trust no one who doesn't know the password.", type: "artifact" },
    ],
    connections: [
      { target: "grand-staircase", label: "Grand Staircase", transition: "stairs", direction: "up" },
      { target: "potion-laboratory", label: "Potions Laboratory", transition: "corridor", direction: "forward" },
    ],
    starter: false,
    unlockRequires: "Discover the staircase pattern",
  },
  {
    id: "potion-laboratory",
    name: "Potion Laboratory",
    subtitle: "Where Magic Simmers",
    description: "Stone tables line the walls, each bearing cauldrons bubbling with luminous liquids. Shelves of ingredients stretch to the ceiling. The air is thick with strange fragrances, and steam curls in mesmerizing patterns.",
    icon: "🧪",
    colors: { primary: "#1F5033", ambient: "rgba(31,80,51,0.06)", glow: "rgba(31,200,80,0.15)", surface: "rgba(22,58,37,0.25)" },
    ambientEffects: ["cauldron-steam", "smoke", "bubbles"],
    interactiveElements: [
      { id: "pl-cauldron", type: "cauldron", name: "Bubbling Cauldron", description: "A large iron cauldron bubbles with bright green potion.", position: { x: 40, y: 60 }, interaction: "Adding the right ingredient creates a flash of light — a vision of the Owlery above." },
      { id: "pl-book", type: "book", name: "Potion Master's Journal", description: "A stained journal with experimental recipes.", position: { x: 72, y: 42 }, interaction: "A recipe for liquid luck falls out. The margins read: 'The Owlery guards the messages of the past.'" },
    ],
    secrets: [
      { id: "pl-secret-1", name: "The Elixir of Shadows", description: "Brew the legendary elixir by combining hidden ingredients.", hint: "The ingredients hide where darkness meets light.", type: "rune-puzzle" },
    ],
    connections: [
      { target: "common-room", label: "Common Room", transition: "corridor", direction: "back" },
    ],
    quote: "I can teach you how to bottle fame, brew glory, even stopper death.",
    starter: false,
    unlockRequires: "The Common Room reveals the way",
  },
  {
    id: "greenhouses",
    name: "The Greenhouses",
    subtitle: "Where Magic Grows",
    description: "Glass walls reveal a world of impossible plants. Venomous tentaculae snap at passing butterflies. Mandrakes scream softly. The air is warm and humid, thick with the scent of magical herbs and blooming flowers.",
    icon: "🌿",
    colors: { primary: "#2A6B44", ambient: "rgba(42,107,68,0.06)", glow: "rgba(52,211,153,0.12)", surface: "rgba(22,58,37,0.25)" },
    ambientEffects: ["leaves", "sparkles", "dust", "weather-window"],
    interactiveElements: [
      { id: "gr-mandrake", type: "statue", name: "Mandrake Pot", description: "A wriggling plant root in an ornate pot.", position: { x: 35, y: 55 }, interaction: "The mandrake sings a low lullaby. Its melody reveals hidden seeds scattered on the floor." },
      { id: "gr-vine", type: "switch", name: "Living Vine", description: "A thick vine that moves on its own.", position: { x: 80, y: 65 }, interaction: "The vine parts to reveal a hidden section — the path to the Forbidden Forest." },
    ],
    secrets: [
      { id: "gr-secret-1", name: "The Philosopher's Sap", description: "A single drop of the legendary sap grants wisdom.", hint: "The oldest plant holds the greatest secret.", type: "artifact" },
    ],
    connections: [
      { target: "courtyard", label: "Courtyard", transition: "door", direction: "back" },
    ],
    starter: false,
    unlockRequires: "The courtyard arch reveals the path",
  },
  {
    id: "forbidden-forest",
    name: "The Forbidden Forest",
    subtitle: "Where Shadows Live",
    description: "Ancient trees form a canopy so thick that only moonlight filters through. Fireflies drift between gnarled roots. The air hums with unseen creatures. Something large moves in the distance. You should feel slightly uneasy.",
    icon: "🌲",
    colors: { primary: "#1F5033", ambient: "rgba(20,60,30,0.08)", glow: "rgba(100,200,100,0.1)", surface: "rgba(15,30,20,0.35)" },
    ambientEffects: ["fireflies", "fog", "leaves", "moonlight"],
    interactiveElements: [
      { id: "ff-tree", type: "statue", name: "Ancient Tree", description: "A massive oak with runes carved into its bark.", position: { x: 35, y: 50 }, interaction: "The runes glow faintly. The tree whispers: 'Deep within my roots lies the entrance to the Secret Chamber.'" },
      { id: "ff-clearing", type: "rune", name: "Moonlit Clearing", description: "A perfect circle of grass bathed in silver light.", position: { x: 60, y: 40 }, interaction: "Standing in the center, you hear the forest's true name — and the way to the Owlery." },
      { id: "ff-ruins", type: "door", name: "Hidden Ruins", description: "Crumbling stone pillars covered in ivy.", position: { x: 80, y: 68 }, interaction: "The pillars rearrange to form an archway — but beyond it, only darkness. The Room of Requirement lies somewhere beyond." },
    ],
    secrets: [
      { id: "ff-secret-1", name: "The Centaur's Prophecy", description: "Find the three moonlit clearings.", hint: "The moon reveals what the sun conceals.", type: "rune-puzzle" },
    ],
    connections: [
      { target: "courtyard", label: "Courtyard", transition: "corridor", direction: "back" },
    ],
    starter: false,
    unlockRequires: "The fireplace reveals the truth",
  },
  {
    id: "owlery",
    name: "The Owlery",
    subtitle: "Messengers of the Sky",
    description: "Wind sweeps through the open tower where hundreds of owls roost. Letters arrive and depart at all hours. Feathers drift on invisible currents. The first light of dawn paints everything in gold.",
    icon: "🦉",
    colors: { primary: "#C9CDD3", ambient: "rgba(255,200,150,0.05)", glow: "rgba(255,180,100,0.15)", surface: "rgba(90,74,58,0.18)" },
    ambientEffects: ["feathers", "wind", "owls"],
    interactiveElements: [
      { id: "ot-owl", type: "statue", name: "Great Eagle Owl", description: "A magnificent eagle owl watches you with ancient eyes.", position: { x: 50, y: 38 }, interaction: "It drops a letter at your feet — addressed to you, from someone who built this place long ago." },
      { id: "ot-perch", type: "switch", name: "Moonwatcher's Perch", description: "A high perch overlooking the grounds.", position: { x: 75, y: 22 }, interaction: "From here, you see hidden paths illuminated by moonlight — and a door that wasn't there before." },
    ],
    secrets: [
      { id: "ot-secret-1", name: "The Owl's Message", description: "An owl carries a message in an ancient code.", hint: "Owls see what others miss.", type: "rune-puzzle" },
    ],
    connections: [
      { target: "grand-staircase", label: "Grand Staircase", transition: "stairs", direction: "down" },
    ],
    starter: false,
    unlockRequires: "The forest clears reveal the way",
  },
  {
    id: "room-of-requirement",
    name: "The Room of Requirement",
    subtitle: "It Only Appears When Needed",
    description: "A room that transforms to meet the needs of whoever enters. Today it appears as a vast gallery of magical artifacts — each one a creation of frontend craftsmanship. Touch an artifact, and the room shifts to reveal the project within.",
    icon: "✨",
    colors: { primary: "#D4AF37", ambient: "rgba(212,175,55,0.08)", glow: "rgba(139,92,246,0.2)", surface: "rgba(20,18,30,0.4)" },
    ambientEffects: ["sparkles", "magic-glow", "dust"],
    interactiveElements: [
      { id: "ror-artifact-1", type: "chest", name: "The First Artifact", description: "A golden orb that contains swirling code.", position: { x: 25, y: 40 }, interaction: "Touching it, the room shifts — you see a website being built, line by line. This is where it all began." },
      { id: "ror-artifact-2", type: "chest", name: "The Second Artifact", description: "A crystal prism that refracts light into patterns.", position: { x: 50, y: 40 }, interaction: "The prism shows a design system — components, tokens, patterns. Architecture made visible." },
      { id: "ror-artifact-3", type: "chest", name: "The Third Artifact", description: "A silver compass that points toward possibilities.", position: { x: 75, y: 40 }, interaction: "The compass spins, then settles. It points to the future — what comes next." },
    ],
    secrets: [
      { id: "ror-secret-1", name: "The Creator's Vision", description: "Only by touching all three artifacts can you see the full picture.", hint: "Every creation tells a story.", type: "artifact" },
    ],
    connections: [
      { target: "secret-chamber", label: "Secret Chamber", transition: "parchment", direction: "forward" },
    ],
    starter: false,
    unlockRequires: "The Room appears only when truly needed",
  },
  {
    id: "secret-chamber",
    name: "The Secret Chamber",
    subtitle: "Beyond the Veil",
    description: "A hidden chamber of impossible geometry. The walls shift between stone and starlight. Ancient runes pulse on every surface. This is where the castle's deepest secrets rest — and where the journey ends.",
    icon: "◈",
    colors: { primary: "#D4AF37", ambient: "rgba(212,175,55,0.08)", glow: "rgba(74,158,255,0.2)", surface: "rgba(15,15,26,0.45)" },
    ambientEffects: ["sparkles", "fog", "stars", "magic-glow"],
    interactiveElements: [
      { id: "sc-altar", type: "rune", name: "Ancient Altar", description: "A stone altar inscribed with runes.", position: { x: 50, y: 50 }, interaction: "The runes rearrange, speaking a word of power. The chamber trembles." },
      { id: "sc-crystal", type: "potion", name: "Memory Crystal", description: "A floating crystal with swirling images.", position: { x: 30, y: 32 }, interaction: "Touching it floods your mind with visions — every room you've visited, every secret you've found." },
    ],
    secrets: [
      { id: "sc-secret-1", name: "The Founder's Legacy", description: "Solve the final rune puzzle to claim the Founder's Legacy.", hint: "All paths lead here. All secrets converge.", type: "rune-puzzle" },
    ],
    connections: [
      { target: "room-of-requirement", label: "Room of Requirement", transition: "parchment", direction: "back" },
    ],
    quote: "Not all who wander are lost.",
    starter: false,
    unlockRequires: "The library reveals the final passage",
  },
];

export const TOTAL_SECRETS = rooms.reduce((sum, r) => sum + r.secrets.length, 0);
export const STARTER_ROOMS = rooms.filter((r) => r.starter).map((r) => r.id);
