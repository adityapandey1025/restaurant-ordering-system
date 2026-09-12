"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { ShoppingBag, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const { data } = useSession();
  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-cream/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-black tracking-tight"><span className="grid h-9 w-9 place-items-center rounded-full bg-saffron"><Utensils size={18} /></span>Table &amp; Tiffin</Link>
        <nav className="flex items-center gap-1 sm:gap-3">
          <Link className="hidden text-sm font-medium sm:block" href="/">Menu</Link>
          {data?.user.role === "CUSTOMER" && <><Link className="hidden text-sm font-medium sm:block" href="/orders">Orders</Link><Link className="hidden text-sm font-medium sm:block" href="/wallet">Wallet</Link><Link href="/cart" aria-label="Cart"><ShoppingBag size={20} /></Link></>}
          {data?.user.role === "ADMIN" && <Link className="text-sm font-medium" href="/admin">Admin</Link>}
          {data?.user.role === "STAFF" && <Link className="text-sm font-medium" href="/staff">Staff</Link>}
          {data ? <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>Logout</Button> : <Button asChild size="sm"><Link href="/login">Sign in</Link></Button>}
        </nav>
      </div>
    </header>
  );
}
