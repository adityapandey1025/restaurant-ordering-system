import { Permission, Role } from "@prisma/client";
import { apiError, body } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { requirePermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { menuItemUpdateSchema } from "@/lib/validation";

import { revalidateTag } from "next/cache";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await requireUser([Role.ADMIN, Role.STAFF]);
    await requirePermission(user, Permission.MANAGE_MENU);
    const updated = await prisma.menuItem.update({ where: { id }, data: menuItemUpdateSchema.parse(await body(request)) });
    revalidateTag("menu");
    return Response.json(updated);
  } catch (error) { return apiError(error); }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await requireUser([Role.ADMIN, Role.STAFF]);
    await requirePermission(user, Permission.MANAGE_MENU);
    const orderItems = await prisma.orderItem.count({ where: { menuItemId: id } });
    if (orderItems) return Response.json({ error: "Items used in order history cannot be deleted; mark it unavailable instead" }, { status: 409 });
    await prisma.menuItem.delete({ where: { id } });
    revalidateTag("menu");
    return Response.json({ ok: true });
  } catch (error) { return apiError(error); }
}
