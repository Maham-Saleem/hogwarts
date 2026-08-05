import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils";

export function Pagination({
  page,
  total,
  pageSize,
  onPageChange,
  className,
}: {
  page: number;
  total: number;
  pageSize: number;
  onPageChange: (p: number) => void;
  className?: string;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  const btn =
    "btn-focus inline-flex h-9 w-9 items-center justify-center rounded-lg border border-silver/15 text-sm transition-colors hover:border-gold/40 hover:text-gold-300 disabled:opacity-40 disabled:hover:border-silver/15 disabled:hover:text-inherit";

  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-3 text-xs text-silver-500", className)}>
      <span>
        Showing <span className="text-beige-100">{from}</span>–<span className="text-beige-100">{to}</span> of{" "}
        <span className="text-beige-100">{total}</span>
      </span>
      <nav aria-label="Pagination" className="flex items-center gap-1.5">
        <button className={btn} onClick={() => onPageChange(page - 1)} disabled={page <= 1} aria-label="Previous page">
          <ChevronLeft className="h-4 w-4" />
        </button>
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`e-${i}`} className="px-1">…</span>
          ) : (
            <button
              key={p}
              className={cn(btn, p === page && "border-gold/60 bg-gold/15 text-gold-300")}
              onClick={() => onPageChange(p)}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </button>
          )
        )}
        <button className={btn} onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} aria-label="Next page">
          <ChevronRight className="h-4 w-4" />
        </button>
      </nav>
    </div>
  );
}