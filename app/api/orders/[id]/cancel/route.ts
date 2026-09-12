import { OrderStatus, Role } from "@prisma/client";
import { apiError } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { transitionOrder } from "@/lib/orders";
import { prisma } from "@/lib/prisma";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireUser([Role.CUSTOMER]);
    const order = await prisma.order.findFirst({ where: { id: params.id, userId: user.id } });
    if (!order) return Response.json({ error: "Order not found" }, { status: 404 });
    if (order.status !== OrderStatus.PENDING && order.status !== OrderStatus.CONFIRMED) {
      return Response.json({ error: "Orders can only be cancelled before preparation" }, { status: 409 });
    }
    return Response.json(await transitionOrder(order.id, OrderStatus.CANCELLED));
  } catch (error) { return apiError(error); }
}
