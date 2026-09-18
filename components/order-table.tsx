import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusControl } from "@/components/actions";
import { formatCurrency } from "@/lib/utils";
import type { OrderStatus } from "@prisma/client";
import { ClipboardList } from "lucide-react";

const next: Record<OrderStatus, string[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PREPARING", "CANCELLED"],
  PREPARING: ["READY", "CANCELLED"],
  READY: ["OUT_FOR_DELIVERY", "COMPLETED", "CANCELLED"],
  OUT_FOR_DELIVERY: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

type Row = {
  id: string;
  status: OrderStatus;
  paymentStatus: string;
  total: { toString(): string };
  createdAt: Date;
  user: { name: string; email: string };
  orderItems: { id: string }[];
};

export function OrderTable({
  orders,
  detailsBase = "/staff/orders",
}: {
  orders: Row[];
  detailsBase?: string;
}) {
  if (!orders.length) {
    return (
      <EmptyState
        icon={<ClipboardList size={48} strokeWidth={1.5} />}
        title="No orders yet"
        description="Orders will appear here as they come in."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white">
      <table className="w-full min-w-[820px] text-left text-sm">
        <thead className="bg-ink text-white">
          <tr>
            <th className="p-4">Order</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Payment</th>
            <th>Total</th>
            <th>Time</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b last:border-0 transition hover:bg-ink/[0.02]">
              <td className="p-4">
                <Link className="font-black text-saffron hover:underline" href={`${detailsBase}/${order.id}`}>
                  #{order.id.slice(-6).toUpperCase()}
                </Link>
                <p className="text-xs text-ink/45">{order.orderItems.length} items</p>
              </td>
              <td>
                {order.user.name}
                <p className="text-xs text-ink/45">{order.user.email}</p>
              </td>
              <td><StatusBadge status={order.status} /></td>
              <td><StatusBadge status={order.paymentStatus} /></td>
              <td className="font-bold">{formatCurrency(order.total.toString())}</td>
              <td className="text-xs text-ink/50">{order.createdAt.toLocaleString("en-IN")}</td>
              <td>
                <StatusControl id={order.id} current={order.status} options={next[order.status]} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
