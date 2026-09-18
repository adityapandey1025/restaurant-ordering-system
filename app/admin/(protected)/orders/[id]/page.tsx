import { notFound } from "next/navigation";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card } from "@/components/ui/card";
import { StatusControl } from "@/components/actions";
import { prisma } from "@/lib/prisma";
import { formatCurrency, titleCase } from "@/lib/utils";
import type { OrderStatus } from "@prisma/client";
import { ArrowLeft, Clock, Mail, User } from "lucide-react";

const next: Record<OrderStatus, string[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PREPARING", "CANCELLED"],
  PREPARING: ["READY", "CANCELLED"],
  READY: ["OUT_FOR_DELIVERY", "COMPLETED", "CANCELLED"],
  OUT_FOR_DELIVERY: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

const steps = ["PENDING", "CONFIRMED", "PREPARING", "READY", "OUT_FOR_DELIVERY", "COMPLETED"];

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { user: true, orderItems: { include: { menuItem: true } } },
  });
  if (!order) notFound();

  const stepIndex = steps.indexOf(order.status);
  const isCancelled = order.status === "CANCELLED";

  return (
    <>
      {/* Back Link */}
      <Link
        href="/admin/orders"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-ink/60 transition hover:text-ink"
      >
        <ArrowLeft size={16} /> Back to orders
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="eyebrow">Order detail</p>
          <h1 className="title">#{order.id.slice(-6).toUpperCase()}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={order.status} />
          <StatusBadge status={order.paymentStatus} />
          <StatusControl id={order.id} current={order.status} options={next[order.status]} />
        </div>
      </div>

      {/* Order Progress Timeline */}
      <Card className="mt-8 p-6">
        <h2 className="font-black">Order Progress</h2>
        {isCancelled ? (
          <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-800">
            This order was cancelled{order.paymentStatus === "REFUNDED" ? " and refunded to the customer's wallet" : ""}.
          </div>
        ) : (
          <div className="mt-5 grid gap-2 sm:grid-cols-6">
            {steps.map((step, i) => (
              <div
                key={step}
                className={`rounded-xl p-3 text-center text-xs font-bold transition ${
                  i <= stepIndex ? "bg-leaf text-white" : "bg-ink/5 text-ink/35"
                }`}
              >
                {titleCase(step)}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Customer Info */}
      <Card className="mt-5 p-6">
        <h2 className="mb-4 font-black">Customer Details</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-leaf/10 text-leaf">
              <User size={18} />
            </div>
            <div>
              <p className="text-xs text-ink/50">Name</p>
              <p className="font-bold">{order.user.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600">
              <Mail size={18} />
            </div>
            <div>
              <p className="text-xs text-ink/50">Email</p>
              <p className="font-bold">{order.user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-saffron/10 text-saffron">
              <Clock size={18} />
            </div>
            <div>
              <p className="text-xs text-ink/50">Order Time</p>
              <p className="font-bold">{order.createdAt.toLocaleString("en-IN")}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Order Items */}
      <Card className="mt-5 p-6">
        <h2 className="mb-4 font-black">Ordered Items</h2>
        <div>
          {order.orderItems.map((item) => (
            <div className="flex items-center justify-between border-b py-4 last:border-0" key={item.id}>
              <div>
                <p className="font-bold">{item.menuItem.name}</p>
                <p className="text-sm text-ink/50">
                  {item.quantity} × {formatCurrency(item.priceAtOrder.toString())}
                </p>
              </div>
              <strong className="text-lg">
                {formatCurrency(item.priceAtOrder.mul(item.quantity).toString())}
              </strong>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-4 text-xl font-black">
          <span>Total</span>
          <span className="text-saffron">{formatCurrency(order.total.toString())}</span>
        </div>
      </Card>
    </>
  );
}
