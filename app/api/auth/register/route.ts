import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { apiError, body } from "@/lib/api";
import { registerSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const data = registerSchema.parse(await body(request));
    const passwordHash = await bcrypt.hash(data.password, 12);
    const user = await prisma.user.create({
      data: { name: data.name, email: data.email, passwordHash, wallet: { create: {} }, cart: { create: {} } },
      select: { id: true, name: true, email: true, role: true },
    });
    return Response.json(user, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
