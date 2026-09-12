"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const [error, setError] = useState(""); const [loading, setLoading] = useState(false); const router = useRouter();
  return <Card className="mx-auto max-w-md p-7 sm:p-10"><p className="eyebrow">Welcome</p><h1 className="mt-2 text-3xl font-black">{mode === "login" ? "Sign in" : "Create your account"}</h1><form className="mt-7 space-y-4" onSubmit={async (event) => { event.preventDefault(); setLoading(true); setError(""); const form = new FormData(event.currentTarget); const email = String(form.get("email")); const password = String(form.get("password")); if (mode === "register") { const response = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.get("name"), email, password }) }); if (!response.ok) { const result = await response.json(); setError(result.error); setLoading(false); return; } } const result = await signIn("credentials", { email, password, redirect: false }); if (result?.error) { setError("Invalid credentials or suspended account"); setLoading(false); } else { router.push("/"); router.refresh(); } }}>{mode === "register" && <label><span className="field-label">Name</span><Input name="name" required minLength={2} /></label>}<label><span className="field-label">Email</span><Input type="email" name="email" required /></label><label><span className="field-label">Password</span><Input type="password" name="password" minLength={8} required /></label>{error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}<Button className="w-full" variant="accent" disabled={loading}>{loading ? "Please wait..." : mode === "login" ? "Sign in" : "Register"}</Button></form><p className="mt-5 text-sm text-ink/60">{mode === "login" ? "New here?" : "Already registered?"} <Link className="font-bold underline" href={mode === "login" ? "/register" : "/login"}>{mode === "login" ? "Create an account" : "Sign in"}</Link></p></Card>;
}
