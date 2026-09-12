import { Role } from "@prisma/client";
import { apiError, body } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cartItemSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const user = await requireUser([Role.CUSTOMER]);
    const data = cartItemSchema.parse(await body(request));
    const item = await prisma.menuItem.findUnique({ where: { id: data.menuItemId } });
    if (!item?.isAvailable) return Response.json({ error: "This item is unavailable" }, { status: 409 });
    const cart = await prisma.cart.upsert({ where: { userId: user.id }, create: { userId: user.id }, update: {} });
    const cartItem = await prisma.cartItem.upsert({
      where: { cartId_menuItemId: { cartId: cart.id, menuItemId: data.menuItemId } },
      create: { cartId: cart.id, ...data },
      update: { quantity: { increment: data.quantity } },
    });
    return Response.json(cartItem, { status: 201 });
  } catch (error) { return apiError(error); }
}
