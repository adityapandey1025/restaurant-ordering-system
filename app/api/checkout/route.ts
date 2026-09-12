import { OrderStatus, Prisma, Role } from "@prisma/client";
import { apiError } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { PaymentError, PaymentGateway } from "@/lib/payment-gateway";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const user = await requireUser([Role.CUSTOMER]);
    const cart = await prisma.cart.findUnique({
      where: { userId: user.id }, include: { cartItems: { include: { menuItem: true } } },
    });
    if (!cart?.cartItems.length) return Response.json({ error: "Your cart is empty" }, { status: 400 });
    if (cart.cartItems.some((item) => !item.menuItem.isAvailable)) {
      return Response.json({ error: "One or more cart items are no longer available" }, { status: 409 });
    }
    await PaymentGateway.simulateNetwork();
    const order = await prisma.$transaction(async (tx) => {
      const freshCart = await tx.cart.findUnique({
        where: { id: cart.id }, include: { cartItems: { include: { menuItem: true } } },
      });
      if (!freshCart?.cartItems.length) throw new Error("Your cart is empty");
      if (freshCart.cartItems.some((item) => !item.menuItem.isAvailable)) throw new Error("An item became unavailable");
      const total = freshCart.cartItems.reduce((sum, item) => sum.add(item.menuItem.price.mul(item.quantity)), new Prisma.Decimal(0));
      const wallet = await tx.wallet.findUnique({ where: { userId: user.id } });
      if (!wallet) throw new Error("Wallet not found");
      const created = await tx.order.create({
        data: {
          userId: user.id, total, status: OrderStatus.PENDING,
          orderItems: { create: freshCart.cartItems.map((item) => ({ menuItemId: item.menuItemId, quantity: item.quantity, priceAtOrder: item.menuItem.price })) },
        },
      });
      await PaymentGateway.charge(tx, { amount: total, walletId: wallet.id, orderId: created.id });
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      return created;
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    return Response.json({ orderId: order.id }, { status: 201 });
  } catch (error) {
    if (error instanceof PaymentError) return Response.json({ error: error.message, code: error.code }, { status: 402 });
    return apiError(error);
  }
}
