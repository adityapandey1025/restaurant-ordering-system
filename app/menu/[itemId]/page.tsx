import Image from "next/image";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/actions";
import { Badge } from "@/components/ui/badge";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export default async function MenuItemPage({ params }: { params: { itemId: string } }) {
  const [item, session] = await Promise.all([prisma.menuItem.findUnique({ where: { id: params.itemId }, include: { category: true } }), getSession()]);
  if (!item) notFound();
  return <main className="page"><div className="grid overflow-hidden rounded-[2rem] bg-white shadow-card lg:grid-cols-2"><div className="relative min-h-80"><Image src={item.imageUrl} alt={item.name} fill className="object-cover" priority /></div><div className="flex flex-col justify-center p-8 sm:p-14"><Badge className="w-fit">{item.category.name}</Badge><h1 className="title">{item.name}</h1><p className="mt-5 text-lg leading-8 text-ink/65">{item.description}</p><p className="my-7 text-3xl font-black">{formatCurrency(item.price.toString())}</p>{session?.user.role === "CUSTOMER" ? <AddToCart menuItemId={item.id} disabled={!item.isAvailable} /> : <a href="/login" className="font-bold underline">Sign in as a customer to order</a>}</div></div></main>;
}
