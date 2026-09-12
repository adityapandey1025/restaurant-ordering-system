"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/cart";

async function request(url: string, method: string, data?: unknown) {
  const response = await fetch(url, { method, headers: data ? { "Content-Type": "application/json" } : undefined, body: data ? JSON.stringify(data) : undefined });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error ?? "Request failed");
  return result;
}

export function AddToCart({ menuItemId, disabled = false }: { menuItemId: string; disabled?: boolean }) {
  const [message, setMessage] = useState("");
  const add = useCartStore((state) => state.add);
  return <div><Button variant="accent" disabled={disabled} onClick={async () => { try { await request("/api/cart", "POST", { menuItemId, quantity: 1 }); add(); setMessage("Added to cart"); } catch (e) { setMessage((e as Error).message); } }}>{disabled ? "Unavailable" : "Add to cart"}</Button>{message && <p className="mt-2 text-xs text-ink/60">{message}</p>}</div>;
}

export function CartControls({ id, quantity }: { id: string; quantity: number }) {
  const router = useRouter();
  return <div className="flex items-center gap-2"><Button variant="outline" size="sm" disabled={quantity <= 1} onClick={async () => { await request(`/api/cart/${id}`, "PATCH", { quantity: quantity - 1 }); router.refresh(); }}>-</Button><span className="w-5 text-center">{quantity}</span><Button variant="outline" size="sm" onClick={async () => { await request(`/api/cart/${id}`, "PATCH", { quantity: quantity + 1 }); router.refresh(); }}>+</Button><Button variant="ghost" size="sm" onClick={async () => { await request(`/api/cart/${id}`, "DELETE"); router.refresh(); }}>Remove</Button></div>;
}

export function CheckoutButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const reset = useCartStore((state) => state.reset);
  return <div><Button size="lg" variant="accent" disabled={loading} onClick={async () => { setLoading(true); setError(""); try { const result = await request("/api/checkout", "POST"); reset(); router.push(`/orders/${result.orderId}`); } catch (e) { setError((e as Error).message); setLoading(false); } }}>{loading ? "Contacting test gateway..." : "Pay with virtual wallet"}</Button>{error && <div className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error} <a className="font-bold underline" href="/wallet">Top up wallet</a></div>}</div>;
}

export function TopUpForm() {
  const [amount, setAmount] = useState(""); const [message, setMessage] = useState(""); const router = useRouter();
  return <form className="flex gap-2" onSubmit={async (event) => { event.preventDefault(); try { await request("/api/wallet/topup", "POST", { amount }); setAmount(""); setMessage("Virtual funds added"); router.refresh(); } catch (e) { setMessage((e as Error).message); } }}><div><Input type="number" min="0.01" step="0.01" placeholder="Amount in INR" value={amount} onChange={(e) => setAmount(e.target.value)} required />{message && <p className="mt-2 text-xs">{message}</p>}</div><Button type="submit" variant="accent">Top up</Button></form>;
}

export function CancelOrder({ id }: { id: string }) {
  const [error, setError] = useState(""); const router = useRouter();
  return <div><Button variant="outline" onClick={async () => { try { await request(`/api/orders/${id}/cancel`, "POST"); router.refresh(); } catch (e) { setError((e as Error).message); } }}>Cancel and refund</Button>{error && <p className="mt-2 text-xs text-red-700">{error}</p>}</div>;
}

export function StatusControl({ id, current, options }: { id: string; current: string; options: string[] }) {
  const [status, setStatus] = useState(options[0] ?? ""); const [error, setError] = useState(""); const router = useRouter();
  if (!options.length) return <span className="text-sm text-ink/50">Final state</span>;
  return <div><div className="flex gap-2"><select className="rounded-xl border bg-white px-3" value={status} onChange={(e) => setStatus(e.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select><Button size="sm" onClick={async () => { try { await request(`/api/staff/orders/${id}/status`, "PATCH", { status }); router.refresh(); } catch (e) { setError((e as Error).message); } }}>Update</Button></div>{error && <p className="mt-1 text-xs text-red-700">{error}</p>}<span className="sr-only">Current status {current}</span></div>;
}

export function SuspendButton({ id, suspended }: { id: string; suspended: boolean }) {
  const router = useRouter(); return <Button variant="outline" size="sm" onClick={async () => { await request(`/api/admin/users/${id}`, "PATCH", { isSuspended: !suspended }); router.refresh(); }}>{suspended ? "Restore" : "Suspend"}</Button>;
}

export function DeleteButton({ url, label = "Delete" }: { url: string; label?: string }) {
  const [error, setError] = useState(""); const router = useRouter(); return <div><Button variant="danger" size="sm" onClick={async () => { if (!confirm(`${label}?`)) return; try { await request(url, "DELETE"); router.refresh(); } catch (e) { setError((e as Error).message); } }}>{label}</Button>{error && <p className="mt-1 max-w-52 text-xs text-red-700">{error}</p>}</div>;
}

export function AvailabilityButton({ id, available }: { id: string; available: boolean }) {
  const router = useRouter(); return <Button variant="outline" size="sm" onClick={async () => { await request(`/api/menu/${id}`, "PATCH", { isAvailable: !available }); router.refresh(); }}>{available ? "Mark unavailable" : "Mark available"}</Button>;
}
