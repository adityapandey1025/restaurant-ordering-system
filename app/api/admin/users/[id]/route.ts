import { Role } from "@prisma/client";
import { apiError, body } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { suspendSchema } from "@/lib/validation";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const admin = await requireUser([Role.ADMIN]);
    if (admin.id === params.id) return Response.json({ error: "You cannot suspend your own account" }, { status: 400 });
    return Response.json(await prisma.user.update({
      where: { id: params.id }, data: suspendSchema.parse(await body(request)),
      select: { id: true, isSuspended: true },
    }));
  } catch (error) { return apiError(error); }
}
