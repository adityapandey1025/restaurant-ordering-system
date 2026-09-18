"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/cart";
import { useToast } from "@/components/ui/toast";
import { Loader2 } from "lucide-react";

async function request(url: string, method: string, data?: unknown) {
  const response = await fetch(url, { method, headers: data ? { "Content-Type": "application/json" } : undefined, body: data ? JSON.stringify(data) : undefined });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error ?? "Request failed");
  return result;
}

export function AddToCart({ menuItemId, disabled = false }: { menuItemId: string; disabled?: boolean }) {
  const [loading, setLoading] = useState(false);
  const add = useCartStore((state) => state.add);
  const { toast } = useToast();

  return (
    <Button
      variant="accent"
      disabled={disabled || loading}
      onClick={async () => {
        setLoading(true);
        try {
          await request("/api/cart", "POST", { menuItemId, quantity: 1 });
          add();
          toast("Added to cart");
        } catch (e) {
          toast((e as Error).message, "error");
        } finally {
          setLoading(false);
        }
      }}
    >
      {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
      {disabled ? "Unavailable" : "Add to cart"}
    </Button>
  );
}

export function CartControls({ id, quantity }: { id: string; quantity: number }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const update = async (newQuantity: number) => {
    setLoading(true);
    try {
      await request(`/api/cart/${id}`, "PATCH", { quantity: newQuantity });
      router.refresh();
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      setLoading(false);
    }
  };

  const remove = async () => {
    setLoading(true);
    try {
      await request(`/api/cart/${id}`, "DELETE");
      router.refresh();
      toast("Item removed from cart");
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" disabled={quantity <= 1 || loading} onClick={() => update(quantity - 1)}>-</Button>
      <span className="w-5 text-center">{quantity}</span>
      <Button variant="outline" size="sm" disabled={loading} onClick={() => update(quantity + 1)}>+</Button>
      <Button variant="ghost" size="sm" disabled={loading} onClick={remove}>Remove</Button>
    </div>
  );
}

export function CheckoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const reset = useCartStore((state) => state.reset);
  const { toast } = useToast();

  return (
    <Button
      size="lg"
      variant="accent"
      className="w-full sm:w-auto"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        try {
          const result = await request("/api/checkout", "POST");
          reset();
          router.push(`/orders/${result.orderId}`);
          toast("Order placed successfully!");
        } catch (e) {
          toast((e as Error).message, "error");
          setLoading(false);
        }
      }}
    >
      {loading ? <Loader2 size={18} className="animate-spin mr-2" /> : null}
      {loading ? "Processing..." : "Pay with virtual wallet"}
    </Button>
  );
}

export function TopUpForm() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  return (
    <form className="flex gap-2" onSubmit={async (event) => {
      event.preventDefault();
      setLoading(true);
      try {
        await request("/api/wallet/topup", "POST", { amount });
        setAmount("");
        router.refresh();
        toast(`Added ₹${amount} to wallet`);
      } catch (e) {
        toast((e as Error).message, "error");
      } finally {
        setLoading(false);
      }
    }}>
      <Input type="number" min="0.01" step="0.01" placeholder="Amount in INR" value={amount} onChange={(e) => setAmount(e.target.value)} required disabled={loading} />
      <Button type="submit" variant="accent" disabled={loading}>
        {loading ? <Loader2 size={16} className="animate-spin" /> : "Top up"}
      </Button>
    </form>
  );
}

export function CancelOrder({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  return (
    <Button variant="outline" disabled={loading} onClick={async () => {
      setLoading(true);
      try {
        await request(`/api/orders/${id}/cancel`, "POST");
        router.refresh();
        toast("Order cancelled successfully");
      } catch (e) {
        toast((e as Error).message, "error");
      } finally {
        setLoading(false);
      }
    }}>
      {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
      Cancel and refund
    </Button>
  );
}

export function StatusControl({ id, current, options }: { id: string; current: string; options: string[] }) {
  const [status, setStatus] = useState(options[0] ?? "");
  const [loading, setLoading] = useState(false);

  // Sync state when options change (due to a successful update and router.refresh())
  useEffect(() => {
    setStatus(options[0] ?? "");
  }, [current, options]);

  const router = useRouter();
  const { toast } = useToast();

  if (!options.length) return <span className="text-sm font-semibold text-ink/50">Final state</span>;

  return (
    <div className="flex gap-2">
      <select className="h-10 rounded-xl border border-ink/15 bg-white px-3 text-sm outline-none transition focus:border-leaf focus:ring-2 focus:ring-leaf/10" value={status} onChange={(e) => setStatus(e.target.value)} disabled={loading}>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
      <Button size="default" disabled={loading} onClick={async () => {
        setLoading(true);
        try {
          await request(`/api/staff/orders/${id}/status`, "PATCH", { status });
          router.refresh();
          toast(`Order status updated to ${status}`);
        } catch (e) {
          toast((e as Error).message, "error");
        } finally {
          setLoading(false);
        }
      }}>
        {loading ? <Loader2 size={16} className="animate-spin" /> : "Update"}
      </Button>
    </div>
  );
}

export function SuspendButton({ id, suspended }: { id: string; suspended: boolean }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  return (
    <Button variant="outline" size="sm" disabled={loading} onClick={async () => {
      setLoading(true);
      try {
        await request(`/api/admin/users/${id}`, "PATCH", { isSuspended: !suspended });
        router.refresh();
        toast(`User ${suspended ? "restored" : "suspended"}`);
      } catch (e) {
        toast((e as Error).message, "error");
      } finally {
        setLoading(false);
      }
    }}>
      {loading ? <Loader2 size={14} className="animate-spin mr-1" /> : null}
      {suspended ? "Restore" : "Suspend"}
    </Button>
  );
}

export function DeleteButton({ url, label = "Delete" }: { url: string; label?: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  return (
    <Button variant="danger" size="sm" disabled={loading} onClick={async () => {
      if (!confirm(`Are you sure you want to ${label.toLowerCase()}?`)) return;
      setLoading(true);
      try {
        await request(url, "DELETE");
        router.refresh();
        toast("Successfully deleted");
      } catch (e) {
        toast((e as Error).message, "error");
      } finally {
        setLoading(false);
      }
    }}>
      {loading ? <Loader2 size={14} className="animate-spin mr-1" /> : null}
      {label}
    </Button>
  );
}

export function AvailabilityButton({ id, available }: { id: string; available: boolean }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  return (
    <Button variant="outline" size="sm" disabled={loading} onClick={async () => {
      setLoading(true);
      try {
        await request(`/api/menu/${id}`, "PATCH", { isAvailable: !available });
        router.refresh();
        toast(`Menu item marked as ${available ? "unavailable" : "available"}`);
      } catch (e) {
        toast((e as Error).message, "error");
      } finally {
        setLoading(false);
      }
    }}>
      {loading ? <Loader2 size={14} className="animate-spin mr-1" /> : null}
      {available ? "Mark unavailable" : "Mark available"}
    </Button>
  );
}
