import { Permission, Role } from "@prisma/client";
import { apiError, body } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { transitionOrder } from "@/lib/orders";
import { requirePermission } from "@/lib/permissions";
import { orderStatusSchema } from "@/lib/validation";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await requireUser([Role.ADMIN, Role.STAFF]);
    await requirePermission(user, Permission.MANAGE_ORDERS);
    const { status } = orderStatusSchema.parse(await body(request));
    return Response.json(await transitionOrder(id, status));
  } catch (error) { return apiError(error); }
}
