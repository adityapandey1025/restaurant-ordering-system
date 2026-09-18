import { Role } from "@prisma/client";
import { apiError, body } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validation";

import { revalidateTag } from "next/cache";

export async function POST(request: Request) {
  try {
    await requireUser([Role.ADMIN]);
    const category = await prisma.category.create({ data: categorySchema.parse(await body(request)) });
    revalidateTag("categories");
    revalidateTag("menu");
    return Response.json(category, { status: 201 });
  } catch (error) { return apiError(error); }
}
