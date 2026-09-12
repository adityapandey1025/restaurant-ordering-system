import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";
export default async function AdminPage() { const [orders, users, revenue] = await Promise.all([prisma.order.count(), prisma.user.count(), prisma.order.aggregate({ where: { paymentStatus: "PAID" }, _sum: { total: true } })]); const stats = [["Total orders", orders], ["Users", users], ["Paid revenue", formatCurrency(revenue._sum.total?.toString() ?? 0)]]; return <><p className="eyebrow">System overview</p><h1 className="title">Admin dashboard</h1><div className="mt-8 grid gap-5 sm:grid-cols-3">{stats.map(([label, value]) => <Card className="p-6" key={label}><p className="text-sm text-ink/50">{label}</p><p className="mt-2 text-3xl font-black">{value}</p></Card>)}</div></>; }
