import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { StatusControl } from "@/components/actions";
import { prisma } from "@/lib/prisma";
import { formatCurrency, titleCase } from "@/lib/utils";
import type { OrderStatus } from "@prisma/client";

const next: Record<OrderStatus, string[]> = { PENDING: ["CONFIRMED", "CANCELLED"], CONFIRMED: ["PREPARING", "CANCELLED"], PREPARING: ["READY", "CANCELLED"], READY: ["OUT_FOR_DELIVERY", "COMPLETED", "CANCELLED"], OUT_FOR_DELIVERY: ["COMPLETED", "CANCELLED"], COMPLETED: [], CANCELLED: [] };
export const dynamic = "force-dynamic";
export default async function StaffOrderPage({ params }: { params: { id: string } }) { const order = await prisma.order.findUnique({ where: { id: params.id }, include: { user: true, orderItems: { include: { menuItem: true } } } }); if (!order) notFound(); return <><p className="eyebrow">Order detail</p><h1 className="title">#{order.id.slice(-6).toUpperCase()}</h1><div className="mt-5 flex flex-wrap items-center gap-3"><Badge>{titleCase(order.status)}</Badge><Badge>{titleCase(order.paymentStatus)}</Badge><StatusControl id={order.id} current={order.status} options={next[order.status]} /></div><Card className="mt-8 p-6"><h2 className="text-xl font-black">{order.user.name}</h2><p className="text-sm text-ink/50">{order.user.email} · {order.createdAt.toLocaleString("en-IN")}</p><div className="mt-5">{order.orderItems.map((item) => <div className="flex justify-between border-b py-3 last:border-0" key={item.id}><span>{item.quantity} × {item.menuItem.name}</span><strong>{formatCurrency(item.priceAtOrder.mul(item.quantity).toString())}</strong></div>)}</div><div className="mt-4 flex justify-between text-xl font-black"><span>Total</span><span>{formatCurrency(order.total.toString())}</span></div></Card></>; }
