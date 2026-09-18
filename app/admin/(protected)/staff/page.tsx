import { DeleteButton } from "@/components/actions";
import { StaffForm } from "@/components/management-forms";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export default async function StaffPage() { const staff = await prisma.user.findMany({ where: { role: "STAFF" }, include: { staffPermissions: true } }); return <><p className="eyebrow">Team access</p><h1 className="title">Staff &amp; permissions</h1><div className="mt-8"><StaffForm /></div><div className="mt-8 grid gap-3">{staff.map((person) => <div className="flex flex-col justify-between gap-3 rounded-2xl bg-white p-5 sm:flex-row sm:items-center" key={person.id}><div><h2 className="font-black">{person.name}</h2><p className="text-sm text-ink/50">{person.email}</p><div className="mt-2 flex gap-2">{person.staffPermissions.map((permission) => <Badge key={permission.id}>{permission.permission}</Badge>)}</div></div><DeleteButton url={`/api/admin/staff/${person.id}`} label="Remove staff" /></div>)}</div></>; }
