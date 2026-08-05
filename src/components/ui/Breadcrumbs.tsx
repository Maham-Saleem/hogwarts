import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/utils";

interface Crumb {
  label: string;
  to?: string;
}

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center gap-1.5 text-sm", className)}>
      <Link to="/" className="btn-focus flex items-center gap-1 rounded text-silver-500 transition hover:text-gold-300">
        <Home className="h-3.5 w-3.5" aria-hidden />
        <span className="sr-only">Home</span>
      </Link>
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <span key={item.label} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 text-silver-600" aria-hidden />
            {item.to && !last ? (
              <Link to={item.to} className="btn-focus rounded text-silver-400 transition hover:text-gold-300">
                {item.label}
              </Link>
            ) : (
              <span className={cn("text-silver-400", last && "font-medium text-gold-300")} aria-current={last ? "page" : undefined}>
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}