import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-gradient-to-b from-gold-300 to-gold-500 text-ink-950 font-semibold shadow-glow-sm hover:shadow-glow hover:from-gold-200 hover:to-gold-400",
  secondary: "bg-ink-700 text-beige-100 border border-silver/15 hover:border-gold/40 hover:text-gold-100",
  ghost: "text-silver-400 hover:text-beige-100 hover:bg-ink-700/70",
  danger: "bg-gradient-to-b from-wine-300 to-wine-500 text-beige-100 hover:shadow-glow-wine",
  outline: "border border-gold/40 text-gold-300 hover:bg-gold/10 hover:border-gold/70",
};

const SIZES: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-4 py-2.5 text-sm gap-2",
  lg: "px-6 py-3 text-base gap-2.5",
  icon: "p-2",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(
        "btn-focus inline-flex items-center justify-center rounded-lg transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50",
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : icon}
      {children}
    </button>
  );
}
