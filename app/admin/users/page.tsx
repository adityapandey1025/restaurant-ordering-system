import { SuspendButton } from "@/components/actions";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export default async function UsersPage() { const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } }); return <><p className="eyebrow">Accounts</p><h1 className="title">Users</h1><div className="mt-8 overflow-x-auto rounded-2xl bg-white"><table className="w-full min-w-[650px] text-left text-sm"><thead className="bg-ink text-white"><tr><th className="p-4">Name</th><th>Email</th><th>Role</th><th>Status</th><th>Action</th></tr></thead><tbody>{users.map((user) => <tr className="border-b last:border-0" key={user.id}><td className="p-4 font-bold">{user.name}</td><td>{user.email}</td><td><Badge>{user.role}</Badge></td><td>{user.isSuspended ? "Suspended" : "Active"}</td><td><SuspendButton id={user.id} suspended={user.isSuspended} /></td></tr>)}</tbody></table></div></>; }
