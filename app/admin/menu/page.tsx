import { MenuManagement } from "@/components/menu-management";
export const dynamic = "force-dynamic";
export default function AdminMenuPage() { return <><p className="eyebrow">Catalog</p><h1 className="title">Menu &amp; categories</h1><div className="mt-8"><MenuManagement isAdmin /></div></>; }
