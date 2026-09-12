import { OrderTable } from "@/components/order-table";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export default async function AdminOrdersPage() { const orders = await prisma.order.findMany({ include: { user: true, orderItems: true }, orderBy: { createdAt: "desc" } }); return <><p className="eyebrow">System-wide</p><h1 className="title">All orders</h1><div className="mt-8"><OrderTable orders={orders} detailsBase="/staff/orders" /></div></>; }
