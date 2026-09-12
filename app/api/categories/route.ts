import { Role } from "@prisma/client";
import { apiError, body } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    await requireUser([Role.ADMIN]);
    return Response.json(await prisma.category.create({ data: categorySchema.parse(await body(request)) }), { status: 201 });
  } catch (error) { return apiError(error); }
}
