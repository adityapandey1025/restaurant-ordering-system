import { Role, TransactionType } from "@prisma/client";
import { TopUpForm } from "@/components/actions";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, titleCase } from "@/lib/utils";

export const dynamic = "force-dynamic";
export default async function WalletPage() {
  const user = await requireUser([Role.CUSTOMER]);
  const wallet = await prisma.wallet.findUnique({ where: { userId: user.id }, include: { transactions: { include: { order: true }, orderBy: { createdAt: "desc" } } } });
  if (!wallet) return null;
  return <main className="page"><p className="eyebrow">Test / virtual wallet</p><h1 className="title">{formatCurrency(wallet.balance.toString())}</h1><p className="mt-3 text-sm text-ink/60">Demo funds only. No real transactions or payment instruments.</p><Card className="mt-8 flex flex-col justify-between gap-6 bg-ink p-6 text-white sm:flex-row sm:items-center"><div><h2 className="text-xl font-black">Add virtual funds</h2><p className="text-sm text-white/60">Enter any positive test amount.</p></div><TopUpForm /></Card><h2 className="mt-12 text-2xl font-black">Transaction ledger</h2><div className="mt-4 overflow-hidden rounded-2xl border border-ink/10 bg-white">{wallet.transactions.length ? wallet.transactions.map((transaction) => <div key={transaction.id} className="flex items-center justify-between border-b border-ink/10 p-4 last:border-0"><div><Badge>{titleCase(transaction.type)}</Badge><p className="mt-1 text-xs text-ink/45">{transaction.createdAt.toLocaleString("en-IN")}{transaction.orderId ? ` · Order ${transaction.orderId.slice(-6)}` : ""}</p></div><p className={`font-black ${transaction.type === TransactionType.ORDER_PAYMENT ? "text-red-700" : "text-leaf"}`}>{transaction.type === TransactionType.ORDER_PAYMENT ? "-" : "+"}{formatCurrency(transaction.amount.toString())}</p></div>) : <p className="p-6 text-ink/50">No transactions yet.</p>}</div></main>;
}
