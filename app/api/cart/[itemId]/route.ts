import { Role } from "@prisma/client";
import { apiError, body } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cartQuantitySchema } from "@/lib/validation";

export async function PATCH(request: Request, { params }: { params: { itemId: string } }) {
  try {
    const user = await requireUser([Role.CUSTOMER]);
    const data = cartQuantitySchema.parse(await body(request));
    const result = await prisma.cartItem.updateMany({
      where: { id: params.itemId, cart: { userId: user.id } }, data,
    });
    if (!result.count) return Response.json({ error: "Cart item not found" }, { status: 404 });
    return Response.json({ ok: true });
  } catch (error) { return apiError(error); }
}

export async function DELETE(_: Request, { params }: { params: { itemId: string } }) {
  try {
    const user = await requireUser([Role.CUSTOMER]);
    await prisma.cartItem.deleteMany({ where: { id: params.itemId, cart: { userId: user.id } } });
    return Response.json({ ok: true });
  } catch (error) { return apiError(error); }
}
