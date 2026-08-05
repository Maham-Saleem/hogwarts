import { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { ReactNode } from "react";
import type { RoomId, GameState } from "@/types";
import { rooms, STARTER_ROOMS, TOTAL_SECRETS } from "@/data/rooms";

interface DiscoveryContextValue {
  discoveries: { roomId: string; secretId: string; discoveredAt: number }[];
  unlockedRooms: RoomId[];
  inventory: string[];
  visitedRooms: RoomId[];
  discoveredCount: number;
  totalSecrets: number;
  hasDiscovered: (roomId: string, secretId: string) => boolean;
  addDiscovery: (roomId: string, secretId: string) => void;
  visitRoom: (roomId: RoomId) => void;
  isRoomUnlocked: (roomId: RoomId) => boolean;
  getRoomUnlockHint: (roomId: RoomId) => string | undefined;
  unlockRoom: (roomId: RoomId) => void;
  addToInventory: (item: string) => void;
  hasInInventory: (item: string) => boolean;
}

const DiscoveryContext = createContext<DiscoveryContextValue | null>(null);

const STORAGE_KEY = "explore-hogwarts-discoveries";

function loadState(): Partial<GameState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore parse errors
  }
  return {};
}

export function DiscoveryProvider({ children }: { children: ReactNode }) {
  const saved = loadState();
  const [discoveries, setDiscoveries] = useState<{ roomId: string; secretId: string; discoveredAt: number }[]>(saved.discoveries || []);
  const [unlockedRooms, setUnlockedRooms] = useState<RoomId[]>(() => {
    const savedRooms = saved.unlockedRooms || [];
    return [...new Set([...STARTER_ROOMS, ...savedRooms])] as RoomId[];
  });
  const [inventory, setInventory] = useState<string[]>(saved.inventory || []);
  const [visitedRooms, setVisitedRooms] = useState<RoomId[]>(saved.visitedRooms || []);

  useEffect(() => {
    const state: GameState = { discoveries, unlockedRooms, inventory, visitedRooms, interactedElements: [] };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [discoveries, unlockedRooms, inventory, visitedRooms]);

  const hasDiscovered = useCallback(
    (roomId: string, secretId: string) => discoveries.some((d) => d.roomId === roomId && d.secretId === secretId),
    [discoveries]
  );

  const addDiscovery = useCallback((roomId: string, secretId: string) => {
    setDiscoveries((prev) => {
      if (prev.some((d) => d.roomId === roomId && d.secretId === secretId)) return prev;
      return [...prev, { roomId, secretId, discoveredAt: Date.now() }];
    });
  }, []);

  const visitRoom = useCallback((roomId: RoomId) => {
    setVisitedRooms((prev) => (prev.includes(roomId) ? prev : [...prev, roomId]));
  }, []);

  const isRoomUnlocked = useCallback((roomId: RoomId) => unlockedRooms.includes(roomId), [unlockedRooms]);

  const getRoomUnlockHint = useCallback((roomId: RoomId) => {
    const room = rooms.find((r) => r.id === roomId);
    return room?.unlockRequires;
  }, []);

  const unlockRoom = useCallback((roomId: RoomId) => {
    setUnlockedRooms((prev) => {
      if (prev.includes(roomId)) return prev;
      return [...prev, roomId];
    });
  }, []);

  const addToInventory = useCallback((item: string) => {
    setInventory((prev) => (prev.includes(item) ? prev : [...prev, item]));
  }, []);

  const hasInInventory = useCallback((item: string) => inventory.includes(item), [inventory]);

  return (
    <DiscoveryContext.Provider
      value={{
        discoveries,
        unlockedRooms,
        inventory,
        visitedRooms,
        discoveredCount: discoveries.length,
        totalSecrets: TOTAL_SECRETS,
        hasDiscovered,
        addDiscovery,
        visitRoom,
        isRoomUnlocked,
        getRoomUnlockHint,
        unlockRoom,
        addToInventory,
        hasInInventory,
      }}
    >
      {children}
    </DiscoveryContext.Provider>
  );
}

export function useDiscovery() {
  const ctx = useContext(DiscoveryContext);
  if (!ctx) throw new Error("useDiscovery must be used within DiscoveryProvider");
  return ctx;
}
