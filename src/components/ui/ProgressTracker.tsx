import { useDiscovery } from "@/context/DiscoveryContext";

export function ProgressTracker() {
  const { discoveredCount, totalSecrets } = useDiscovery();

  return (
    <div className="fixed bottom-4 left-4 z-40 hidden md:block">
      <div
        className="px-3 py-2 rounded-sm"
        style={{
          background: "linear-gradient(135deg, rgba(30,28,26,0.8), rgba(20,18,16,0.9))",
          border: "1px solid rgba(60,56,52,0.12)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        }}
      >
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "rgba(212,175,55,0.3)" }} />
          <span className="font-cinzel text-[9px] tracking-wider" style={{ color: "rgba(160,150,130,0.3)" }}>
            {discoveredCount}/{totalSecrets}
          </span>
        </div>
      </div>
    </div>
  );
}
