import { Role } from "@prisma/client";
import { apiError, body } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validation";

import { revalidateTag } from "next/cache";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await requireUser([Role.ADMIN]);
    const updated = await prisma.category.update({ where: { id }, data: categorySchema.parse(await body(request)) });
    revalidateTag("categories");
    revalidateTag("menu");
    return Response.json(updated);
  } catch (error) { return apiError(error); }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await requireUser([Role.ADMIN]);
    if (await prisma.menuItem.count({ where: { categoryId: id } })) {
      return Response.json({ error: "Move or delete category items first" }, { status: 409 });
    }
    await prisma.category.delete({ where: { id } });
    revalidateTag("categories");
    revalidateTag("menu");
    return Response.json({ ok: true });
  } catch (error) { return apiError(error); }
}
