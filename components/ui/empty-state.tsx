import { cn } from "@/lib/utils";
import { PackageOpen } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-3xl border border-dashed border-ink/15 bg-white/60 px-8 py-16 text-center", className)}>
      <div className="mb-4 text-ink/20">
        {icon ?? <PackageOpen size={48} strokeWidth={1.5} />}
      </div>
      <h3 className="text-lg font-black text-ink/70">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-ink/45">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
