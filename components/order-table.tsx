import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { StatusControl } from "@/components/actions";
import { formatCurrency, titleCase } from "@/lib/utils";
import type { OrderStatus } from "@prisma/client";

const next: Record<OrderStatus, string[]> = { PENDING: ["CONFIRMED", "CANCELLED"], CONFIRMED: ["PREPARING", "CANCELLED"], PREPARING: ["READY", "CANCELLED"], READY: ["OUT_FOR_DELIVERY", "COMPLETED", "CANCELLED"], OUT_FOR_DELIVERY: ["COMPLETED", "CANCELLED"], COMPLETED: [], CANCELLED: [] };
type Row = { id: string; status: OrderStatus; paymentStatus: string; total: { toString(): string }; createdAt: Date; user: { name: string; email: string }; orderItems: { id: string }[] };
export function OrderTable({ orders, detailsBase = "/staff/orders" }: { orders: Row[]; detailsBase?: string }) {
  return <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-ink text-white"><tr><th className="p-4">Order</th><th>Customer</th><th>Status</th><th>Total</th><th>Action</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id} className="border-b last:border-0"><td className="p-4"><Link className="font-black underline" href={`${detailsBase}/${order.id}`}>#{order.id.slice(-6)}</Link><p className="text-xs text-ink/45">{order.orderItems.length} items</p></td><td>{order.user.name}<p className="text-xs text-ink/45">{order.user.email}</p></td><td><Badge>{titleCase(order.status)}</Badge></td><td className="font-bold">{formatCurrency(order.total.toString())}</td><td><StatusControl id={order.id} current={order.status} options={next[order.status]} /></td></tr>)}</tbody></table></div>;
}
