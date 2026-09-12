import { Permission, Role, type User } from "@prisma/client";
import { AuthError } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function requirePermission(user: User, permission: Permission) {
  if (user.role === Role.ADMIN) return;
  if (user.role !== Role.STAFF) throw new AuthError("You do not have permission", 403);
  const assigned = await prisma.staffPermission.findUnique({
    where: { staffId_permission: { staffId: user.id, permission } },
  });
  if (!assigned) throw new AuthError("This staff permission is not assigned", 403);
}
