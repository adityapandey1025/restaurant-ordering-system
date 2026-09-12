import { Role } from "@prisma/client";
import { DashboardNav } from "@/components/dashboard-nav";
import { requireUser } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) { await requireUser([Role.ADMIN]); return <main className="page"><DashboardNav role="admin" />{children}</main>; }
