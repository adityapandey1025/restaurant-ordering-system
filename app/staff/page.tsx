import Link from "next/link";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export default async function StaffDashboard() { const [pending, preparing, ready] = await Promise.all([prisma.order.count({ where: { status: "PENDING" } }), prisma.order.count({ where: { status: "PREPARING" } }), prisma.order.count({ where: { status: "READY" } })]); return <><p className="eyebrow">Kitchen pulse</p><h1 className="title">Staff dashboard</h1><div className="mt-8 grid gap-5 sm:grid-cols-3">{[["Waiting", pending], ["Preparing", preparing], ["Ready", ready]].map(([label, count]) => <Card className="p-6" key={label}><p className="text-sm text-ink/50">{label}</p><p className="text-4xl font-black">{count}</p></Card>)}</div><Link className="mt-7 inline-block font-bold underline" href="/staff/orders">Open order queue</Link></>; }
