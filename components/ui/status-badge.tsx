import { cn } from "@/lib/utils";
import type { OrderStatus, PaymentStatus } from "@prisma/client";
import { titleCase } from "@/lib/utils";

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PREPARING: "bg-violet-100 text-violet-800",
  READY: "bg-saffron/15 text-saffron",
  OUT_FOR_DELIVERY: "bg-cyan-100 text-cyan-800",
  COMPLETED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-red-100 text-red-800",
  UNPAID: "bg-amber-100 text-amber-800",
  PAID: "bg-emerald-100 text-emerald-800",
  REFUNDED: "bg-violet-100 text-violet-800",
};

export function StatusBadge({
  status,
  className,
}: {
  status: OrderStatus | PaymentStatus | string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider",
        statusColors[status] ?? "bg-ink/10 text-ink",
        className,
      )}
    >
      {titleCase(status)}
    </span>
  );
}
