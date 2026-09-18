import Link from "next/link";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { prisma } from "@/lib/prisma";
import { formatCurrency, titleCase } from "@/lib/utils";
import { ArrowRight, ChefHat, ClipboardList, ShoppingBag, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalOrders,
    todayOrders,
    pendingOrders,
    activeOrders,
    totalUsers,
    totalMenuItems,
    revenue,
    recentOrders,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { createdAt: { gte: today } } }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.count({ where: { status: { in: ["CONFIRMED", "PREPARING", "READY", "OUT_FOR_DELIVERY"] } } }),
    prisma.user.count(),
    prisma.menuItem.count(),
    prisma.order.aggregate({ where: { paymentStatus: "PAID" }, _sum: { total: true } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: true, orderItems: true },
    }),
  ]);

  const stats = [
    { label: "Total Orders", value: totalOrders, icon: ClipboardList, color: "text-blue-600 bg-blue-50" },
    { label: "Today's Orders", value: todayOrders, icon: ShoppingBag, color: "text-saffron bg-saffron/10" },
    { label: "Pending", value: pendingOrders, icon: ClipboardList, color: "text-amber-600 bg-amber-50" },
    { label: "Active Orders", value: activeOrders, icon: ChefHat, color: "text-violet-600 bg-violet-50" },
    { label: "Total Users", value: totalUsers, icon: Users, color: "text-leaf bg-leaf/10" },
    { label: "Menu Items", value: totalMenuItems, icon: ChefHat, color: "text-cyan-600 bg-cyan-50" },
    { label: "Paid Revenue", value: formatCurrency(revenue._sum.total?.toString() ?? 0), icon: ShoppingBag, color: "text-emerald-600 bg-emerald-50" },
  ];

  return (
    <>
      <p className="eyebrow">System overview</p>
      <h1 className="title">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="stat-card">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-ink/50">{label}</p>
              <div className={`grid h-10 w-10 place-items-center rounded-xl ${color}`}>
                <Icon size={18} />
              </div>
            </div>
            <p className="mt-3 text-3xl font-black">{value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Manage Orders", href: "/admin/orders", desc: "View, search & update orders" },
          { label: "Menu & Categories", href: "/admin/menu", desc: "Add or edit menu items" },
          { label: "Staff & Permissions", href: "/admin/staff", desc: "Manage team access" },
          { label: "All Users", href: "/admin/users", desc: "Customer & staff accounts" },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="group flex items-center justify-between rounded-2xl border border-ink/10 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-card"
          >
            <div>
              <h3 className="font-black">{action.label}</h3>
              <p className="mt-1 text-xs text-ink/50">{action.desc}</p>
            </div>
            <ArrowRight size={18} className="text-ink/30 transition group-hover:translate-x-1 group-hover:text-saffron" />
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-black">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm font-semibold text-saffron hover:underline">
            View all →
          </Link>
        </div>
        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="border-b border-ink/10 bg-ink/[0.03]">
                <tr>
                  <th className="p-4 font-bold">Order</th>
                  <th className="font-bold">Customer</th>
                  <th className="font-bold">Status</th>
                  <th className="font-bold">Payment</th>
                  <th className="font-bold">Total</th>
                  <th className="font-bold">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Card className="p-8 text-center text-ink/50">No orders yet.</Card>
        )}
      </div>
    </>
  );
}
