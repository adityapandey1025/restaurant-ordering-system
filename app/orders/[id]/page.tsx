import { notFound } from "next/navigation";
import { OrderStatus, Role } from "@prisma/client";
import { CancelOrder } from "@/components/actions";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, titleCase } from "@/lib/utils";

export const revalidate = 5;
const steps = ["PENDING", "CONFIRMED", "PREPARING", "READY", "OUT_FOR_DELIVERY", "COMPLETED"];
export default async function OrderPage({ params }: { params: { id: string } }) {
  const user = await requireUser([Role.CUSTOMER]);
  const order = await prisma.order.findFirst({ where: { id: params.id, userId: user.id }, include: { orderItems: { include: { menuItem: true } } } });
  if (!order) notFound();
  const index = steps.indexOf(order.status);
  return <main className="page max-w-4xl"><p className="eyebrow">Live order</p><h1 className="title">#{order.id.slice(-6).toUpperCase()}</h1><div className="mt-5 flex gap-2"><Badge>{titleCase(order.status)}</Badge><Badge>{titleCase(order.paymentStatus)}</Badge></div><Card className="mt-8 p-6"><h2 className="font-black">Order progress</h2>{order.status === OrderStatus.CANCELLED ? <p className="mt-4 text-red-700">This order was cancelled{order.paymentStatus === "REFUNDED" ? " and refunded to your virtual wallet" : ""}.</p> : <div className="mt-5 grid gap-2 sm:grid-cols-6">{steps.map((step, i) => <div key={step} className={`rounded-xl p-3 text-center text-xs font-bold ${i <= index ? "bg-leaf text-white" : "bg-ink/5 text-ink/35"}`}>{titleCase(step)}</div>)}</div>}<p className="mt-4 text-xs text-ink/45">This page refreshes from the server every few seconds.</p></Card><Card className="mt-5 p-6"><h2 className="mb-4 font-black">Items</h2>{order.orderItems.map((item) => <div className="flex justify-between border-b py-3 last:border-0" key={item.id}><span>{item.quantity} × {item.menuItem.name}</span><strong>{formatCurrency(item.priceAtOrder.mul(item.quantity).toString())}</strong></div>)}<div className="mt-4 flex justify-between text-xl"><strong>Total</strong><strong>{formatCurrency(order.total.toString())}</strong></div></Card>{(order.status === OrderStatus.PENDING || order.status === OrderStatus.CONFIRMED) && <div className="mt-5"><CancelOrder id={order.id} /></div>}</main>;
}
