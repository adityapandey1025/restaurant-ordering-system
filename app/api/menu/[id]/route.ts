import { Permission, Role } from "@prisma/client";
import { apiError, body } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { requirePermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { menuItemUpdateSchema } from "@/lib/validation";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireUser([Role.ADMIN, Role.STAFF]);
    await requirePermission(user, Permission.MANAGE_MENU);
    return Response.json(await prisma.menuItem.update({ where: { id: params.id }, data: menuItemUpdateSchema.parse(await body(request)) }));
  } catch (error) { return apiError(error); }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireUser([Role.ADMIN, Role.STAFF]);
    await requirePermission(user, Permission.MANAGE_MENU);
    const orderItems = await prisma.orderItem.count({ where: { menuItemId: params.id } });
    if (orderItems) return Response.json({ error: "Items used in order history cannot be deleted; mark it unavailable instead" }, { status: 409 });
    await prisma.menuItem.delete({ where: { id: params.id } });
    return Response.json({ ok: true });
  } catch (error) { return apiError(error); }
}
