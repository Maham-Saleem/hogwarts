import type { ReactNode, ThHTMLAttributes } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/utils";

export type SortDirection = "asc" | "desc";

export interface Column<T> {
  key: string;
  header: ReactNode;
  sortable?: boolean;
  className?: string;
  headerClassName?: string;
  render: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  onSort?: (key: string, dir: SortDirection) => void;
  sortKey?: string;
  sortDir?: SortDirection;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({
  columns,
  data,
  rowKey,
  onSort,
  sortKey,
  sortDir,
  onRowClick,
  emptyMessage = "No records found.",
}: DataTableProps<T>) {
  return (
    <div className="scroll-thin overflow-x-auto">
      <table className="w-full min-w-[600px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-silver/10 bg-ink-900/40">
            {columns.map((col) => (
              <th key={col.key} scope="col" className={cn("px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-silver-500", col.headerClassName)}>
                <div className="flex items-center gap-1.5">
                  <span>{col.header}</span>
                  {col.sortable && onSort && (
                    <button
                      onClick={() => {
                        const next: SortDirection = sortKey === col.key && sortDir === "asc" ? "desc" : "asc";
                        onSort(col.key, next);
                      }}
                      aria-label={`Sort by ${typeof col.header === "string" ? col.header : col.key}`}
                      className="btn-focus rounded p-0.5 text-silver-500 transition hover:text-gold-300"
                    >
                      {sortKey === col.key ? (
                        sortDir === "asc" ? <ArrowUp className="h-3.5 w-3.5 text-gold-300" /> : <ArrowDown className="h-3.5 w-3.5 text-gold-300" />
                      ) : (
                        <ArrowDown className="h-3.5 w-3.5 opacity-50" />
                      )}
                    </button>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={rowKey(row)}
              onClick={() => onRowClick?.(row)}
              className={cn("border-b border-silver/5 transition-colors hover:bg-ink-700/40", onRowClick && "cursor-pointer")}
            >
              {columns.map((col) => (
                <td key={col.key} className={cn("px-4 py-3 align-middle text-beige-100/90", col.className)}>
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-silver-500">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

type ThProps = ThHTMLAttributes<HTMLTableCellElement>;
export function Th({ children, className, ...rest }: ThProps) {
  return (
    <th className={cn("px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-silver-500", className)} {...rest}>
      {children}
    </th>
  );
}