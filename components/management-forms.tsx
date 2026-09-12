"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

async function send(url: string, data: unknown) {
  const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
  const result = await response.json(); if (!response.ok) throw new Error(result.error); return result;
}

export function MenuItemForm({ categories }: { categories: { id: string; name: string }[] }) {
  const [message, setMessage] = useState(""); const router = useRouter();
  return <form className="grid gap-3 rounded-2xl bg-white p-5 sm:grid-cols-2" onSubmit={async (e) => { e.preventDefault(); const form = new FormData(e.currentTarget); try { await send("/api/menu", { name: form.get("name"), description: form.get("description"), price: form.get("price"), categoryId: form.get("categoryId"), imageUrl: form.get("imageUrl"), isAvailable: true }); e.currentTarget.reset(); setMessage("Menu item added"); router.refresh(); } catch (err) { setMessage((err as Error).message); } }}><Input name="name" placeholder="Item name" required /><Input name="price" type="number" step="0.01" min="0.01" placeholder="Price" required /><Input name="description" placeholder="Description" required className="sm:col-span-2" /><Input name="imageUrl" type="url" placeholder="Image URL" required /><select name="categoryId" className="h-11 rounded-xl border bg-white px-3" required>{categories.map((category) => <option value={category.id} key={category.id}>{category.name}</option>)}</select><Button type="submit">Add item</Button>{message && <p className="self-center text-sm">{message}</p>}</form>;
}

export function CategoryForm() {
  const [message, setMessage] = useState(""); const router = useRouter();
  return <form className="flex gap-2" onSubmit={async (e) => { e.preventDefault(); const form = new FormData(e.currentTarget); try { await send("/api/categories", { name: form.get("name") }); e.currentTarget.reset(); setMessage("Added"); router.refresh(); } catch (err) { setMessage((err as Error).message); } }}><Input name="name" placeholder="New category" required /><Button type="submit" variant="accent">Add</Button>{message && <span className="self-center text-xs">{message}</span>}</form>;
}

export function StaffForm() {
  const [message, setMessage] = useState(""); const router = useRouter();
  return <form className="grid gap-3 rounded-2xl bg-white p-5 sm:grid-cols-2" onSubmit={async (e) => { e.preventDefault(); const form = new FormData(e.currentTarget); const permissions = form.getAll("permissions"); try { await send("/api/admin/staff", { name: form.get("name"), email: form.get("email"), password: form.get("password"), permissions }); e.currentTarget.reset(); setMessage("Staff account created"); router.refresh(); } catch (err) { setMessage((err as Error).message); } }}><Input name="name" placeholder="Name" required /><Input name="email" type="email" placeholder="Email" required /><Input name="password" type="password" minLength={8} placeholder="Temporary password" required /><div className="flex items-center gap-4 text-sm"><label><input type="checkbox" name="permissions" value="MANAGE_MENU" defaultChecked /> Menu</label><label><input type="checkbox" name="permissions" value="MANAGE_ORDERS" defaultChecked /> Orders</label></div><Button>Create staff</Button>{message && <p className="self-center text-sm">{message}</p>}</form>;
}
