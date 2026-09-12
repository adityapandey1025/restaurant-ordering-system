import { OrderTable } from "@/components/order-table";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export default async function StaffOrdersPage() { const orders = await prisma.order.findMany({ include: { user: true, orderItems: true }, orderBy: [{ status: "asc" }, { createdAt: "asc" }] }); return <><p className="eyebrow">Live queue</p><h1 className="title">Incoming orders</h1><div className="mt-8"><OrderTable orders={orders} /></div></>; }
