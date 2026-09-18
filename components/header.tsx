"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Menu, ShoppingBag, Utensils, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";

export function Header() {
  const { data } = useSession();
  const cartCount = useCartStore((state) => state.count);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-cream/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-black tracking-tight" onClick={closeMenu}>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-saffron text-ink">
            <Utensils size={18} />
          </span>
          Table &amp; Tiffin
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-4 sm:flex">
          <Link className="text-sm font-medium hover:text-saffron transition" href="/">Menu</Link>
          {data?.user.role === "CUSTOMER" && (
            <>
              <Link className="text-sm font-medium hover:text-saffron transition" href="/orders">Orders</Link>
              <Link className="text-sm font-medium hover:text-saffron transition" href="/wallet">Wallet</Link>
            </>
          )}
          {data?.user.role === "ADMIN" && <Link className="text-sm font-medium hover:text-saffron transition" href="/admin">Admin</Link>}
          {data?.user.role === "STAFF" && <Link className="text-sm font-medium hover:text-saffron transition" href="/staff">Staff</Link>}
          
          <div className="ml-2 flex items-center gap-3 border-l border-ink/10 pl-5">
            {data?.user.role === "CUSTOMER" && (
              <Link href="/cart" aria-label="Cart" className="relative p-1 text-ink transition hover:text-saffron">
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-leaf text-[10px] font-bold text-white">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>
            )}
            {data ? (
              <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>Logout</Button>
            ) : (
              <Button asChild size="sm" variant="default"><Link href="/login">Sign in</Link></Button>
            )}
          </div>
        </nav>

        {/* Mobile Toggle & Quick Cart */}
        <div className="flex items-center gap-3 sm:hidden">
          {data?.user.role === "CUSTOMER" && (
            <Link href="/cart" aria-label="Cart" className="relative p-1 text-ink">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-leaf text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          )}
          <button onClick={toggleMenu} className="p-1 text-ink" aria-label="Toggle menu">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="slide-down absolute left-0 right-0 border-b border-ink/10 bg-cream px-4 py-4 shadow-xl sm:hidden">
          <nav className="flex flex-col gap-4">
            <Link className="text-lg font-bold" href="/" onClick={closeMenu}>Menu</Link>
            {data?.user.role === "CUSTOMER" && (
              <>
                <Link className="text-lg font-bold" href="/orders" onClick={closeMenu}>Orders</Link>
                <Link className="text-lg font-bold" href="/wallet" onClick={closeMenu}>Wallet</Link>
              </>
            )}
            {data?.user.role === "ADMIN" && <Link className="text-lg font-bold" href="/admin" onClick={closeMenu}>Admin Dashboard</Link>}
            {data?.user.role === "STAFF" && <Link className="text-lg font-bold" href="/staff" onClick={closeMenu}>Staff Dashboard</Link>}
            
            <div className="mt-4 border-t border-ink/10 pt-4">
              {data ? (
                <Button className="w-full" variant="outline" onClick={() => signOut({ callbackUrl: "/" })}>Logout</Button>
              ) : (
                <Button className="w-full" asChild><Link href="/login" onClick={closeMenu}>Sign in</Link></Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
