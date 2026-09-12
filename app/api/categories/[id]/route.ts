import { Role } from "@prisma/client";
import { apiError, body } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validation";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    await requireUser([Role.ADMIN]);
    return Response.json(await prisma.category.update({ where: { id: params.id }, data: categorySchema.parse(await body(request)) }));
  } catch (error) { return apiError(error); }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await requireUser([Role.ADMIN]);
    if (await prisma.menuItem.count({ where: { categoryId: params.id } })) {
      return Response.json({ error: "Move or delete category items first" }, { status: 409 });
    }
    await prisma.category.delete({ where: { id: params.id } });
    return Response.json({ ok: true });
  } catch (error) { return apiError(error); }
}
