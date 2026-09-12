import { Permission, Role } from "@prisma/client";
import { apiError, body } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { requirePermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { menuItemSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const user = await requireUser([Role.ADMIN, Role.STAFF]);
    await requirePermission(user, Permission.MANAGE_MENU);
    const item = await prisma.menuItem.create({ data: menuItemSchema.parse(await body(request)) });
    return Response.json(item, { status: 201 });
  } catch (error) { return apiError(error); }
}
