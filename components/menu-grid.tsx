import Image from "next/image";
import Link from "next/link";
import type { Category, MenuItem } from "@prisma/client";
import { AddToCart } from "@/components/actions";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

type Item = MenuItem & { category: Category };
export function MenuGrid({ items, canOrder }: { items: Item[]; canOrder: boolean }) {
  return <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{items.map((item) => <Card key={item.id} className="group overflow-hidden"><Link href={`/menu/${item.id}`} className="block"><div className="relative aspect-[4/3] overflow-hidden bg-ink/5"><Image src={item.imageUrl} alt={item.name} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 640px) 100vw, 25vw" /></div></Link><div className="p-5"><div className="mb-3 flex items-center justify-between"><Badge>{item.category.name}</Badge><span className="font-black">{formatCurrency(item.price.toString())}</span></div><Link href={`/menu/${item.id}`}><h2 className="text-xl font-black">{item.name}</h2></Link><p className="my-3 line-clamp-2 min-h-10 text-sm text-ink/60">{item.description}</p>{canOrder ? <AddToCart menuItemId={item.id} disabled={!item.isAvailable} /> : <Link href="/login" className="text-sm font-bold text-leaf underline">Sign in to order</Link>}</div></Card>)}</div>;
}
