import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Loader2, ShieldAlert, Sparkles } from "lucide-react";
import { cn } from "@/utils";

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn("flex flex-col items-center justify-center px-6 py-16 text-center", className)}
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-gold/20 bg-gold/5 text-gold-300">
        {icon ?? <Sparkles className="h-7 w-7" aria-hidden />}
      </div>
      <h4 className="font-heading text-lg text-beige-100">{title}</h4>
      {description && <p className="mt-2 max-w-sm text-sm text-silver-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  );
}

export function LoadingState({ label = "Conjuring data..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <Loader2 className="h-7 w-7 animate-spin text-gold-400" aria-hidden />
      <p className="text-sm text-silver-500">{label}</p>
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-wine-300/30 bg-wine-300/10 text-wine-300">
        <ShieldAlert className="h-7 w-7" aria-hidden />
      </div>
      <h4 className="font-heading text-lg text-beige-100">{title}</h4>
      {message && <p className="mt-2 max-w-sm text-sm text-silver-500">{message}</p>}
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-focus mt-5 rounded-lg border border-gold/40 px-4 py-2 text-sm text-gold-300 transition hover:bg-gold/10"
        >
          Try again
        </button>
      )}
    </div>
  );
}