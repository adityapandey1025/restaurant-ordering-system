import { MenuManagement } from "@/components/menu-management";
export const dynamic = "force-dynamic";
export default function StaffMenuPage() { return <><p className="eyebrow">Catalog</p><h1 className="title">Manage menu</h1><div className="mt-8"><MenuManagement isAdmin={false} /></div></>; }
