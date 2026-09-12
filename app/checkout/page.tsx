import { Role } from "@prisma/client";
import { CheckoutButton } from "@/components/actions";
import { Card } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";
export default async function CheckoutPage() {
  const user = await requireUser([Role.CUSTOMER]);
  const [cart, wallet] = await Promise.all([prisma.cart.findUnique({ where: { userId: user.id }, include: { cartItems: { include: { menuItem: true } } } }), prisma.wallet.findUnique({ where: { userId: user.id } })]);
  const total = cart?.cartItems.reduce((sum, item) => sum + Number(item.menuItem.price) * item.quantity, 0) ?? 0;
  return <main className="page max-w-3xl"><p className="eyebrow">Test checkout</p><h1 className="title">Virtual wallet payment</h1><Card className="mt-8 p-7"><div className="rounded-2xl bg-saffron/15 p-4 text-sm"><strong>Sandbox only.</strong> No real transaction, card, or UPI payment occurs.</div><div className="my-7 grid grid-cols-2 gap-4"><div><p className="text-sm text-ink/55">Wallet balance</p><p className="text-2xl font-black">{formatCurrency(wallet?.balance.toString() ?? 0)}</p></div><div><p className="text-sm text-ink/55">Amount due</p><p className="text-2xl font-black">{formatCurrency(total)}</p></div></div>{total > 0 ? <CheckoutButton /> : <p>Your cart is empty.</p>}</Card></main>;
}
