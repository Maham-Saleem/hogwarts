import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Discovery } from "@/types";
import { TOTAL_SECRETS } from "@/data/rooms";

interface DiscoveryContextValue {
  discoveries: Discovery[];
  discoveredIds: Set<string>;
  discoveredCount: number;
  totalSecrets: number;
  discover: (roomId: string, secretId: string) => boolean;
  isDiscovered: (secretId: string) => boolean;
  unlockedRooms: string[];
  unlockRoom: (roomId: string) => void;
  isRoomUnlocked: (roomId: string) => boolean;
  inventory: string[];
  addToInventory: (item: string) => void;
  resetProgress: () => void;
}

const DiscoveryCtx = createContext<DiscoveryContextValue | null>(null);

function loadState() {
  try {
    const raw = localStorage.getItem("hogwarts.discoveries");
    return raw ? JSON.parse(raw) : { discoveries: [], unlockedRooms: ["great-hall"], inventory: [] };
  } catch {
    return { discoveries: [], unlockedRooms: ["great-hall"], inventory: [] };
  }
}

export function DiscoveryProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    localStorage.setItem("hogwarts.discoveries", JSON.stringify(state));
  }, [state]);

  const discoveredIds = useMemo(
    () => new Set(state.discoveries.map((d: Discovery) => d.secretId)) as Set<string>,
    [state.discoveries]
  );

  const discover = useCallback(
    (roomId: string, secretId: string) => {
      if (discoveredIds.has(secretId)) return false;
      setState((prev: typeof state) => ({
        ...prev,
        discoveries: [
          ...prev.discoveries,
          { id: `${roomId}-${secretId}`, roomId, secretId, discoveredAt: Date.now() },
        ],
      }));
      return true;
    },
    [discoveredIds]
  );

  const isDiscovered = useCallback((secretId: string) => discoveredIds.has(secretId), [discoveredIds]);

  const unlockRoom = useCallback((roomId: string) => {
    setState((prev: typeof state) => {
      if (prev.unlockedRooms.includes(roomId)) return prev;
      return { ...prev, unlockedRooms: [...prev.unlockedRooms, roomId] };
    });
  }, []);

  const isRoomUnlocked = useCallback(
    (roomId: string) => state.unlockedRooms.includes(roomId),
    [state.unlockedRooms]
  );

  const addToInventory = useCallback((item: string) => {
    setState((prev: typeof state) => {
      if (prev.inventory.includes(item)) return prev;
      return { ...prev, inventory: [...prev.inventory, item] };
    });
  }, []);

  const resetProgress = useCallback(() => {
    setState({ discoveries: [], unlockedRooms: ["great-hall"], inventory: [] });
  }, []);

  const value: DiscoveryContextValue = {
    discoveries: state.discoveries,
    discoveredIds,
    discoveredCount: state.discoveries.length,
    totalSecrets: TOTAL_SECRETS,
    discover,
    isDiscovered,
    unlockedRooms: state.unlockedRooms,
    unlockRoom,
    isRoomUnlocked,
    inventory: state.inventory,
    addToInventory,
    resetProgress,
  };

  return <DiscoveryCtx.Provider value={value}>{children}</DiscoveryCtx.Provider>;
}

export function useDiscovery() {
  const ctx = useContext(DiscoveryCtx);
  if (!ctx) throw new Error("useDiscovery must be used within DiscoveryProvider");
  return ctx;
}
