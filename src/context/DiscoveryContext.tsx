import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Discovery, RoomId } from "@/types";
import { TOTAL_SECRETS } from "@/data/rooms";

interface DiscoveryContextValue {
  discoveries: Discovery[];
  discoveredIds: Set<string>;
  discoveredCount: number;
  totalSecrets: number;
  discover: (roomId: string, secretId: string) => boolean;
  isDiscovered: (secretId: string) => boolean;
  unlockedRooms: RoomId[];
  unlockRoom: (roomId: RoomId) => void;
  isRoomUnlocked: (roomId: RoomId) => boolean;
  inventory: string[];
  addToInventory: (item: string) => void;
  visitedRooms: Set<RoomId>;
  visitRoom: (roomId: RoomId) => void;
  resetProgress: () => void;
}

const Ctx = createContext<DiscoveryContextValue | null>(null);

interface PersistedState {
  discoveries: Discovery[];
  unlockedRooms: RoomId[];
  inventory: string[];
  visitedRooms: RoomId[];
}

function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem("hogwarts.explore");
    return raw ? JSON.parse(raw) : { discoveries: [], unlockedRooms: ["entrance-hall", "great-hall", "library", "grand-staircase", "common-room"] as RoomId[], inventory: [], visitedRooms: [] as RoomId[] };
  } catch {
    return { discoveries: [], unlockedRooms: ["entrance-hall", "great-hall", "library", "grand-staircase", "common-room"], inventory: [], visitedRooms: [] };
  }
}

export function DiscoveryProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(loadState);

  useEffect(() => {
    localStorage.setItem("hogwarts.explore", JSON.stringify(state));
  }, [state]);

  const discoveredIds = useMemo(() => new Set(state.discoveries.map((d: Discovery) => d.secretId)) as Set<string>, [state.discoveries]);
  const visitedRooms = useMemo(() => new Set(state.visitedRooms || []) as Set<RoomId>, [state.visitedRooms]);

  const discover = useCallback((roomId: string, secretId: string) => {
    if (discoveredIds.has(secretId)) return false;
    setState((p) => ({ ...p, discoveries: [...p.discoveries, { id: `${roomId}-${secretId}`, roomId, secretId, discoveredAt: Date.now() }] }));
    return true;
  }, [discoveredIds]);

  const isDiscovered = useCallback((secretId: string) => discoveredIds.has(secretId), [discoveredIds]);

  const unlockRoom = useCallback((roomId: RoomId) => {
    setState((p) => p.unlockedRooms.includes(roomId) ? p : { ...p, unlockedRooms: [...p.unlockedRooms, roomId] });
  }, []);

  const isRoomUnlocked = useCallback((roomId: RoomId) => state.unlockedRooms.includes(roomId), [state.unlockedRooms]);

  const addToInventory = useCallback((item: string) => {
    setState((p) => p.inventory.includes(item) ? p : { ...p, inventory: [...p.inventory, item] });
  }, []);

  const visitRoom = useCallback((roomId: RoomId) => {
    setState((p) => (p.visitedRooms || []).includes(roomId) ? p : { ...p, visitedRooms: [...(p.visitedRooms || []), roomId] });
  }, []);

  const resetProgress = useCallback(() => {
    setState({ discoveries: [], unlockedRooms: ["entrance-hall", "great-hall", "library", "grand-staircase", "common-room"], inventory: [], visitedRooms: [] });
  }, []);

  return (
    <Ctx.Provider value={{
      discoveries: state.discoveries, discoveredIds, discoveredCount: state.discoveries.length, totalSecrets: TOTAL_SECRETS,
      discover, isDiscovered, unlockedRooms: state.unlockedRooms as RoomId[], unlockRoom, isRoomUnlocked,
      inventory: state.inventory, addToInventory, visitedRooms, visitRoom, resetProgress,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useDiscovery() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useDiscovery must be used within DiscoveryProvider");
  return ctx;
}
