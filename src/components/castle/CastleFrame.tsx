import type { ReactNode } from "react";
import type { CastleLocation } from "@/App";
import { DustParticles } from "@/components/ambient/DustParticles";
import { FloatingCandles } from "@/components/ambient/FloatingCandles";

interface CastleFrameProps {
  children: ReactNode;
  location: CastleLocation;
}

export function CastleFrame({ children, location }: CastleFrameProps) {
  const isInCastle = location.type !== "approach";

  return (
    <div className="relative min-h-screen w-full overflow-hidden" style={{ backgroundColor: "#0E0D0B" }}>
      {/* Stone wall background — always present inside castle */}
      {isInCastle && (
        <>
          <div className="absolute inset-0" style={{
            background: "linear-gradient(180deg, rgba(30,28,26,0.12) 0%, rgba(22,20,18,0.08) 50%, rgba(16,14,12,0.1) 100%)",
          }} />
          <div className="absolute inset-0 texture-stone" />
        </>
      )}

      {/* Persistent ambient effects inside castle */}
      {isInCastle && (
        <div className="absolute inset-0 pointer-events-none z-[1]">
          <DustParticles />
          <FloatingCandles />
        </div>
      )}

      {/* Architectural frame — stone walls on sides, vaulted ceiling */}
      {isInCastle && (
        <div className="absolute inset-0 pointer-events-none z-[2]">
          {/* Left stone wall */}
          <div className="absolute top-0 bottom-0 left-0 w-[4%] sm:w-[6%]" style={{
            background: "linear-gradient(90deg, rgba(30,28,26,0.25), transparent)",
          }} />
          {/* Right stone wall */}
          <div className="absolute top-0 bottom-0 right-0 w-[4%] sm:w-[6%]" style={{
            background: "linear-gradient(270deg, rgba(30,28,26,0.25), transparent)",
          }} />
          {/* Vaulted ceiling shadow */}
          <div className="absolute top-0 left-0 right-0 h-[12%] sm:h-[15%]" style={{
            background: "linear-gradient(180deg, rgba(0,0,0,0.4), transparent)",
          }} />
          {/* Floor shadow */}
          <div className="absolute bottom-0 left-0 right-0 h-[8%] sm:h-[10%]" style={{
            background: "linear-gradient(0deg, rgba(0,0,0,0.35), transparent)",
          }} />
          {/* Vignette */}
          <div className="absolute inset-0" style={{
            boxShadow: "inset 0 0 100px rgba(0,0,0,0.4)",
          }} />
        </div>
      )}

      {/* Content — the room/camera view */}
      <div className="relative z-[3] min-h-screen">
        {children}
      </div>
    </div>
  );
}
