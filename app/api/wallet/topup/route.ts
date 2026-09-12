import { Prisma, Role, TransactionType } from "@prisma/client";
import { apiError, body } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { topUpSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const user = await requireUser([Role.CUSTOMER]);
    const { amount } = topUpSchema.parse(await body(request));
    const decimal = new Prisma.Decimal(amount);
    const wallet = await prisma.$transaction(async (tx) => {
      const updated = await tx.wallet.update({ where: { userId: user.id }, data: { balance: { increment: decimal } } });
      await tx.transaction.create({ data: { walletId: updated.id, type: TransactionType.TOPUP, amount: decimal } });
      return updated;
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    return Response.json({ balance: wallet.balance.toString() });
  } catch (error) { return apiError(error); }
}
