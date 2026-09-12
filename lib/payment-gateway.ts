import { PaymentStatus, Prisma, TransactionStatus, TransactionType } from "@prisma/client";

type TransactionClient = Prisma.TransactionClient;

export class PaymentError extends Error {
  constructor(message: string, public code: "INSUFFICIENT_BALANCE" | "GATEWAY_FAILURE") {
    super(message);
  }
}

export const PaymentGateway = {
  async simulateNetwork() {
    const delay = Number(process.env.PAYMENT_DELAY_MS ?? 1000);
    await new Promise((resolve) => setTimeout(resolve, Number.isFinite(delay) ? delay : 1000));
    const rate = Math.min(1, Math.max(0, Number(process.env.PAYMENT_FAILURE_RATE ?? 0)));
    if (Math.random() < rate) throw new PaymentError("The simulated gateway declined this payment. Please retry.", "GATEWAY_FAILURE");
  },

  async charge(tx: TransactionClient, request: { amount: Prisma.Decimal; walletId: string; orderId: string }) {
    const updated = await tx.wallet.updateMany({
      where: { id: request.walletId, balance: { gte: request.amount } },
      data: { balance: { decrement: request.amount } },
    });
    if (updated.count !== 1) throw new PaymentError("Your virtual wallet has insufficient balance.", "INSUFFICIENT_BALANCE");

    await Promise.all([
      tx.platformLedger.upsert({
        where: { id: "PLATFORM" },
        create: { id: "PLATFORM", balance: request.amount },
        update: { balance: { increment: request.amount } },
      }),
      tx.transaction.create({
        data: {
          walletId: request.walletId,
          orderId: request.orderId,
          amount: request.amount,
          type: TransactionType.ORDER_PAYMENT,
          status: TransactionStatus.COMPLETED,
        },
      }),
      tx.order.update({ where: { id: request.orderId }, data: { paymentStatus: PaymentStatus.PAID } }),
    ]);
  },
};
