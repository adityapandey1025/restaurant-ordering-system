import { AvailabilityButton, DeleteButton } from "@/components/actions";
import { MenuItemForm, CategoryForm } from "@/components/management-forms";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

import { getCachedMenuItems, getCachedCategories } from "@/lib/cache";

export async function MenuManagement({ isAdmin }: { isAdmin: boolean }) {
  const [items, categories] = await Promise.all([getCachedMenuItems(), getCachedCategories()]);
  return <><div className="grid gap-5 lg:grid-cols-[2fr_1fr]"><div><h2 className="mb-3 text-xl font-black">Add menu item</h2><MenuItemForm categories={categories} /></div>{isAdmin && <div><h2 className="mb-3 text-xl font-black">Categories</h2><Card className="p-5"><CategoryForm /><div className="mt-4 flex flex-wrap gap-2">{categories.map((category) => <Badge key={category.id}>{category.name}</Badge>)}</div></Card></div>}</div><h2 className="mb-3 mt-10 text-xl font-black">Current menu</h2><div className="grid gap-3">{items.map((item) => <Card className="flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center" key={item.id}><div><div className="flex items-center gap-2"><h3 className="font-black">{item.name}</h3><Badge>{item.isAvailable ? "Available" : "Unavailable"}</Badge></div><p className="text-sm text-ink/50">{item.category.name} · {formatCurrency(item.price.toString())}</p></div><div className="flex gap-2"><AvailabilityButton id={item.id} available={item.isAvailable} /><DeleteButton url={`/api/menu/${item.id}`} /></div></Card>)}</div></>;
}
