import { MenuGrid } from "@/components/menu-grid";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export default async function Home() {
  const [items, session] = await Promise.all([prisma.menuItem.findMany({ include: { category: true }, orderBy: [{ category: { name: "asc" } }, { name: "asc" }] }), getSession()]);
  return <main><section className="relative overflow-hidden bg-ink text-white"><div className="absolute -right-20 -top-20 h-80 w-80 rounded-full border-[60px] border-saffron/20" /><div className="page relative py-16 sm:py-24"><p className="eyebrow">Seasonal Indian kitchen</p><h1 className="mt-3 max-w-3xl text-5xl font-black leading-[0.95] tracking-tight sm:text-7xl">Comfort food,<br /><span className="text-saffron">without the wait.</span></h1><p className="mt-6 max-w-xl text-base text-white/65 sm:text-lg">Browse today&apos;s menu, pay from your virtual test wallet, and follow your order from our kitchen to your table.</p></div></section><section className="page"><div className="mb-8"><p className="eyebrow">Today&apos;s spread</p><h2 className="title">Made fresh, served warm</h2></div><MenuGrid items={items} canOrder={session?.user.role === "CUSTOMER"} /></section></main>;
}
