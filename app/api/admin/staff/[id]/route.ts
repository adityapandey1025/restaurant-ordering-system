import { Role } from "@prisma/client";
import { apiError, body } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { staffUpdateSchema } from "@/lib/validation";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const admin = await requireUser([Role.ADMIN]);
    if (admin.id === params.id) return Response.json({ error: "You cannot change your own role here" }, { status: 400 });
    const data = staffUpdateSchema.parse(await body(request));
    const staff = await prisma.$transaction(async (tx) => {
      await tx.staffPermission.deleteMany({ where: { staffId: params.id } });
      return tx.user.update({
        where: { id: params.id },
        data: {
          role: data.role,
          staffPermissions: data.role === Role.STAFF ? { create: data.permissions.map((permission) => ({ permission })) } : undefined,
        },
      });
    });
    return Response.json({ id: staff.id, role: staff.role });
  } catch (error) { return apiError(error); }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await requireUser([Role.ADMIN]);
    const staff = await prisma.user.findUnique({ where: { id: params.id } });
    if (!staff || staff.role !== Role.STAFF) return Response.json({ error: "Staff account not found" }, { status: 404 });
    await prisma.user.delete({ where: { id: params.id } });
    return Response.json({ ok: true });
  } catch (error) { return apiError(error); }
}
