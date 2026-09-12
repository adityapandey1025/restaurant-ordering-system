import Link from "next/link";

export function DashboardNav({ role }: { role: "admin" | "staff" }) {
  const links = role === "admin" ? [["Overview", "/admin"], ["Users", "/admin/users"], ["Staff", "/admin/staff"], ["Orders", "/admin/orders"], ["Menu", "/admin/menu"]] : [["Overview", "/staff"], ["Orders", "/staff/orders"], ["Menu", "/staff/menu"]];
  return <nav className="admin-nav">{links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav>;
}
