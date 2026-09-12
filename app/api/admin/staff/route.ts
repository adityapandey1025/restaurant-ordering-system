import bcrypt from "bcrypt";
import { Role } from "@prisma/client";
import { apiError, body } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { staffSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    await requireUser([Role.ADMIN]);
    const data = staffSchema.parse(await body(request));
    const passwordHash = await bcrypt.hash(data.password, 12);
    const staff = await prisma.user.create({
      data: {
        name: data.name, email: data.email, passwordHash, role: Role.STAFF,
        wallet: { create: {} }, cart: { create: {} },
        staffPermissions: { create: data.permissions.map((permission) => ({ permission })) },
      },
      select: { id: true, name: true, email: true, role: true },
    });
    return Response.json(staff, { status: 201 });
  } catch (error) { return apiError(error); }
}
