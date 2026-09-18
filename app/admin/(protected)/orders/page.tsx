import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { OrderFilters } from "@/components/order-filters";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { ClipboardList } from "lucide-react";
import type { OrderStatus, PaymentStatus, Prisma } from "@prisma/client";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; payment?: string }>;
}) {
  const params = await searchParams;
  const query = params.q ?? "";
  const statusFilter = params.status ?? "";
  const paymentFilter = params.payment ?? "";

  const where: Prisma.OrderWhereInput = {};

  if (statusFilter) {
    where.status = statusFilter as OrderStatus;
  }
  if (paymentFilter) {
    where.paymentStatus = paymentFilter as PaymentStatus;
  }
  if (query) {
    where.OR = [
      { id: { contains: query, mode: "insensitive" } },
      { user: { name: { contains: query, mode: "insensitive" } } },
      { user: { email: { contains: query, mode: "insensitive" } } },
    ];
  }

  const orders = await prisma.order.findMany({
    where,
    include: { user: true, orderItems: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <>
      <p className="eyebrow">System-wide</p>
      <h1 className="title">All Orders</h1>

      <div className="mt-6">
        <Suspense>
          <OrderFilters />
        </Suspense>
      </div>

      <div className="mt-6">
        {orders.length > 0 ? (
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
                      <Link className="font-black text-saffron hover:underline" href={`/admin/orders/${order.id}`}>
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
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="rounded-full bg-ink/5 px-3 py-1.5 text-xs font-semibold text-ink transition hover:bg-ink/10"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={<ClipboardList size={48} strokeWidth={1.5} />}
            title="No orders found"
            description={query || statusFilter || paymentFilter ? "Try adjusting your search or filters." : "Orders will appear here when customers start placing them."}
          />
        )}
      </div>
    </>
  );
}
