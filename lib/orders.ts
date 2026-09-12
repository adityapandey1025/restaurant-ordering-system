import { OrderStatus, PaymentStatus, Prisma, TransactionType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
  PENDING: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
  CONFIRMED: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
  PREPARING: [OrderStatus.READY, OrderStatus.CANCELLED],
  READY: [OrderStatus.OUT_FOR_DELIVERY, OrderStatus.COMPLETED, OrderStatus.CANCELLED],
  OUT_FOR_DELIVERY: [OrderStatus.COMPLETED, OrderStatus.CANCELLED],
  COMPLETED: [],
  CANCELLED: [],
};

export async function transitionOrder(orderId: string, next: OrderStatus) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { id: orderId }, include: { user: { include: { wallet: true } } } });
    if (!order) throw new Error("Order not found");
    if (!allowedTransitions[order.status].includes(next)) throw new Error(`Cannot move an order from ${order.status} to ${next}`);

    const refundable = next === OrderStatus.CANCELLED && order.paymentStatus === PaymentStatus.PAID &&
      (order.status === OrderStatus.PENDING || order.status === OrderStatus.CONFIRMED);

    if (refundable) {
      if (!order.user.wallet) throw new Error("Wallet not found");
      await tx.wallet.update({ where: { id: order.user.wallet.id }, data: { balance: { increment: order.total } } });
      await tx.platformLedger.update({ where: { id: "PLATFORM" }, data: { balance: { decrement: order.total } } });
      await tx.transaction.create({
        data: { walletId: order.user.wallet.id, orderId, amount: order.total, type: TransactionType.REFUND },
      });
    }

    return tx.order.update({
      where: { id: orderId },
      data: { status: next, paymentStatus: refundable ? PaymentStatus.REFUNDED : undefined },
    });
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
}
