import type { CSSProperties } from "react";
import { cn } from "@/utils";
import { houseMeta } from "@/data/mock";
import type { House } from "@/types";

export function Avatar({
  initials,
  house,
  size = "md",
  className,
  style,
}: {
  initials: string;
  house?: House;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  style?: CSSProperties;
}) {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-lg",
    xl: "h-20 w-20 text-2xl",
  };
  const houseColor = house ? houseMeta[house].color : "#D4AF37";
  return (
    <div
      className={cn("flex shrink-0 items-center justify-center rounded-full border font-semibold", sizes[size], className)}
      style={{
        borderColor: `${houseColor}66`,
        background: `radial-gradient(circle at 30% 25%, ${houseColor}44, ${houseColor}11 70%)`,
        color: "#F2EAD8",
        boxShadow: `inset 0 0 12px ${houseColor}33`,
        ...style,
      }}
      aria-hidden
    >
      {initials}
    </div>
  );
}