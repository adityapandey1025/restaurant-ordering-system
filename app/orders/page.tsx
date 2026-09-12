import Link from "next/link";
import { Role } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, titleCase } from "@/lib/utils";

export const dynamic = "force-dynamic";
export default async function OrdersPage() {
  const user = await requireUser([Role.CUSTOMER]);
  const orders = await prisma.order.findMany({ where: { userId: user.id }, include: { orderItems: true }, orderBy: { createdAt: "desc" } });
  return <main className="page"><p className="eyebrow">Your kitchen trail</p><h1 className="title">Orders</h1><div className="mt-8 grid gap-4">{orders.map((order) => <Link key={order.id} href={`/orders/${order.id}`}><Card className="flex items-center justify-between p-5 transition hover:-translate-y-0.5"><div><Badge>{titleCase(order.status)}</Badge><p className="mt-2 font-black">Order #{order.id.slice(-6).toUpperCase()}</p><p className="text-xs text-ink/50">{order.orderItems.length} items · {order.createdAt.toLocaleString("en-IN")}</p></div><p className="text-xl font-black">{formatCurrency(order.total.toString())}</p></Card></Link>)}{!orders.length && <p className="text-ink/50">No orders yet.</p>}</div></main>;
}
