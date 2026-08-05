import { cn } from "@/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-ink-700/70",
        className
      )}
      aria-hidden
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="glass rounded-2xl p-5">
      <Skeleton className="mb-4 h-5 w-1/3" />
      <Skeleton className="mb-3 h-3 w-full" />
      <Skeleton className="mb-3 h-3 w-5/6" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}
