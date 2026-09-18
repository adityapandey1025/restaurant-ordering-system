"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const ORDER_STATUSES = ["PENDING", "CONFIRMED", "PREPARING", "READY", "OUT_FOR_DELIVERY", "COMPLETED", "CANCELLED"];
const PAYMENT_STATUSES = ["UNPAID", "PAID", "REFUNDED"];

function titleCase(value: string) {
  return value.toLowerCase().replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function OrderFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSearch = searchParams.get("q") ?? "";
  const currentStatus = searchParams.get("status") ?? "";
  const currentPayment = searchParams.get("payment") ?? "";

  const [search, setSearch] = useState(currentSearch);

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }
      startTransition(() => router.push(`?${params.toString()}`));
    },
    [router, searchParams],
  );

  const hasFilters = currentSearch || currentStatus || currentPayment;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Search */}
      <div className="relative flex-1">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/35" />
        <Input
          placeholder="Search by order ID, customer name, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && updateParams({ q: search })}
          className="pl-10"
        />
      </div>

      {/* Status Filter */}
      <select
        className="h-11 rounded-xl border border-ink/15 bg-white px-3 text-sm font-semibold outline-none transition focus:border-leaf focus:ring-2 focus:ring-leaf/10"
        value={currentStatus}
        onChange={(e) => updateParams({ status: e.target.value })}
      >
        <option value="">All Statuses</option>
        {ORDER_STATUSES.map((s) => (
          <option key={s} value={s}>{titleCase(s)}</option>
        ))}
      </select>

      {/* Payment Filter */}
      <select
        className="h-11 rounded-xl border border-ink/15 bg-white px-3 text-sm font-semibold outline-none transition focus:border-leaf focus:ring-2 focus:ring-leaf/10"
        value={currentPayment}
        onChange={(e) => updateParams({ payment: e.target.value })}
      >
        <option value="">All Payments</option>
        {PAYMENT_STATUSES.map((s) => (
          <option key={s} value={s}>{titleCase(s)}</option>
        ))}
      </select>

      {/* Clear Filters */}
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSearch("");
            updateParams({ q: "", status: "", payment: "" });
          }}
        >
          <X size={14} className="mr-1" /> Clear
        </Button>
      )}

      {isPending && <span className="text-xs text-ink/40">Filtering...</span>}
    </div>
  );
}
