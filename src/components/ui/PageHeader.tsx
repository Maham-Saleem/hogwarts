import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Breadcrumbs } from "./Breadcrumbs";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  crumb?: { items: { label: string; to?: string }[] };
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, icon, crumb, actions }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
    >
      <div className="min-w-0">
        {crumb && <Breadcrumbs items={crumb.items} className="mb-2" />}
        <div className="flex items-center gap-3">
          {icon && <span className="text-gold-400">{icon}</span>}
          <div>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-beige-100 sm:text-3xl">
              {title}
            </h1>
            {subtitle && <p className="mt-1 text-sm text-silver-500">{subtitle}</p>}
          </div>
        </div>
        <div className="gold-divider mt-4 max-w-md" />
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </motion.div>
  );
}