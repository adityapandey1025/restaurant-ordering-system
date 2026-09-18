import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { prisma } from "@/lib/prisma";
import { formatCurrency, titleCase } from "@/lib/utils";
import { requireUser } from "@/lib/auth";
import { Role } from "@prisma/client";
import { ArrowLeft, Clock, MapPin } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 5;

const steps = ["PENDING", "CONFIRMED", "PREPARING", "READY", "OUT_FOR_DELIVERY", "COMPLETED"];
const stepDescriptions: Record<string, string> = {
  PENDING: "Waiting for restaurant to confirm your order",
  CONFIRMED: "Order accepted by restaurant",
  PREPARING: "Kitchen is preparing your food",
  READY: "Food is ready for pickup/delivery",
  OUT_FOR_DELIVERY: "Driver is on the way",
  COMPLETED: "Enjoy your meal!",
};

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser([Role.CUSTOMER]);
  const order = await prisma.order.findUnique({
    where: { id, userId: user.id },
    include: { orderItems: { include: { menuItem: true } } },
  });

  if (!order) notFound();

  const stepIndex = steps.indexOf(order.status);
  const isCancelled = order.status === "CANCELLED";
  const activeStep = steps[stepIndex];

  return (
    <main className="page max-w-3xl">
      <Link href="/orders" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-ink/60 transition hover:text-ink">
        <ArrowLeft size={16} /> Back to order history
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="eyebrow">Track Order</p>
          <h1 className="title">#{order.id.slice(-6).toUpperCase()}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge status={order.status} />
          <StatusBadge status={order.paymentStatus} />
        </div>
      </div>

      {/* Progress Timeline */}
      <Card className="mt-8 p-6 sm:p-10">
        <h2 className="mb-6 text-xl font-black">Order Status</h2>
        
        {isCancelled ? (
          <div className="rounded-2xl bg-red-50 p-6 text-center text-red-800">
            <h3 className="mb-2 text-lg font-bold">Order Cancelled</h3>
            <p>This order has been cancelled.</p>
            {order.paymentStatus === "REFUNDED" && (
              <p className="mt-2 text-sm">The amount has been refunded to your virtual wallet.</p>
            )}
          </div>
        ) : (
          <div className="relative">
            {/* Progress Bar Background */}
            <div className="absolute left-[15px] top-2 h-[calc(100%-16px)] w-0.5 bg-ink/10 sm:left-2 sm:top-[15px] sm:h-0.5 sm:w-[calc(100%-32px)]" />
            
            {/* Progress Bar Active */}
            <div 
              className="absolute left-[15px] top-2 w-0.5 bg-leaf transition-all duration-500 sm:left-2 sm:top-[15px] sm:h-0.5 sm:w-auto"
              style={{
                height: `calc(${(stepIndex / (steps.length - 1)) * 100}% - 16px)`,
                minHeight: '0%',
                maxHeight: 'calc(100% - 16px)',
              }}
            />
            {/* Mobile Progress Active Width correction (sm and up handles height via style, above is just a fallback for desktop. Let's fix this properly below.) */}
            <style dangerouslySetInnerHTML={{__html:`
              @media (min-width: 640px) {
                .progress-active { height: 2px !important; width: calc(${(stepIndex / (steps.length - 1)) * 100}% - 32px) !important; max-height: none !important; }
              }
              @media (max-width: 639px) {
                .progress-active { width: 2px !important; height: calc(${(stepIndex / (steps.length - 1)) * 100}% - 16px) !important; max-width: none !important; }
              }
            `}} />
            <div className="absolute left-[15px] top-2 bg-leaf transition-all duration-500 sm:left-2 sm:top-[15px] progress-active" />

            {/* Steps */}
            <div className="relative flex flex-col gap-8 sm:flex-row sm:justify-between sm:gap-0">
              {steps.map((step, i) => {
                const isActive = i <= stepIndex;
                const isCurrent = i === stepIndex;
                return (
                  <div key={step} className="flex items-start gap-4 sm:flex-col sm:items-center sm:gap-3">
                    <div className="relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white">
                      <div
                        className={`h-4 w-4 rounded-full transition-colors duration-300 ${
                          isActive ? "bg-leaf" : "bg-ink/20"
                        } ${isCurrent ? "pulse-dot ring-4 ring-leaf/20" : ""}`}
                      />
                    </div>
                    <div className="sm:text-center">
                      <p className={`text-sm font-bold ${isActive ? "text-ink" : "text-ink/40"}`}>
                        {titleCase(step)}
                      </p>
                      {isCurrent && (
                        <p className="mt-1 max-w-[140px] text-xs text-ink/60">
                          {stepDescriptions[step]}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Card>

      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        {/* Order Details */}
        <Card className="p-6">
          <h2 className="mb-4 font-black">Order Details</h2>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Clock size={16} className="text-ink/40" />
              <div className="text-sm">
                <p className="text-ink/50">Placed at</p>
                <p className="font-semibold">{order.createdAt.toLocaleString("en-IN")}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={16} className="text-ink/40" />
              <div className="text-sm">
                <p className="text-ink/50">Delivery Type</p>
                <p className="font-semibold">Takeaway / Dine-in</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Receipt */}
        <Card className="p-6">
          <h2 className="mb-4 font-black">Receipt</h2>
          <div>
            {order.orderItems.map((item) => (
              <div className="flex items-center justify-between border-b py-3 last:border-0" key={item.id}>
                <div>
                  <p className="font-semibold">{item.menuItem.name}</p>
                  <p className="text-xs text-ink/50">
                    {item.quantity} × {formatCurrency(item.priceAtOrder.toString())}
                  </p>
                </div>
                <strong className="text-sm">
                  {formatCurrency(item.priceAtOrder.mul(item.quantity).toString())}
                </strong>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-4 text-lg font-black">
            <span>Total</span>
            <span className="text-saffron">{formatCurrency(order.total.toString())}</span>
          </div>
        </Card>
      </div>
    </main>
  );
}
