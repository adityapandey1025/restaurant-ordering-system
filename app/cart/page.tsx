import Link from "next/link";
import { Role } from "@prisma/client";
import { CartControls } from "@/components/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";
export default async function CartPage() {
  const user = await requireUser([Role.CUSTOMER]);
  const cart = await prisma.cart.findUnique({ where: { userId: user.id }, include: { cartItems: { include: { menuItem: true } } } });
  const items = cart?.cartItems ?? [];
  const total = items.reduce((sum, item) => sum + Number(item.menuItem.price) * item.quantity, 0);
  return <main className="page"><p className="eyebrow">Your selection</p><h1 className="title">Cart</h1>{!items.length ? <Card className="mt-8 p-10 text-center"><p>Your cart is empty.</p><Button asChild className="mt-4"><Link href="/">Browse menu</Link></Button></Card> : <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]"><div className="space-y-3">{items.map((item) => <Card className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center" key={item.id}><div><h2 className="text-lg font-black">{item.menuItem.name}</h2><p className="text-sm text-ink/60">{formatCurrency(item.menuItem.price.toString())} each</p></div><CartControls id={item.id} quantity={item.quantity} /></Card>)}</div><Card className="h-fit p-6"><p className="text-sm text-ink/60">Order total</p><p className="mt-1 text-3xl font-black">{formatCurrency(total)}</p><p className="my-4 text-xs text-ink/50">Payment uses test wallet funds only.</p><Button asChild variant="accent" className="w-full"><Link href="/checkout">Continue to checkout</Link></Button></Card></div>}</main>;
}
