"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Shield, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-ink/10 bg-ink p-8 text-white shadow-card sm:p-10">
          {/* Header */}
          <div className="mb-8 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-saffron">
              <Shield size={22} className="text-ink" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-saffron">Administration</p>
              <h1 className="text-2xl font-black">Staff Portal</h1>
            </div>
          </div>

          {/* Form */}
          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              setError("");
              const form = new FormData(e.currentTarget);
              const email = String(form.get("email"));
              const password = String(form.get("password"));
              const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
              });
              if (result?.error) {
                setError("Invalid admin credentials");
                setLoading(false);
              } else {
                router.push("/admin");
                router.refresh();
              }
            }}
          >
            <label>
              <span className="mb-1.5 block text-sm font-bold text-white/70">Email</span>
              <Input
                type="email"
                name="email"
                required
                className="border-white/15 bg-white/10 text-white placeholder:text-white/30 focus:border-saffron focus:ring-saffron/20"
              />
            </label>
            <label>
              <span className="mb-1.5 block text-sm font-bold text-white/70">Password</span>
              <Input
                type="password"
                name="password"
                minLength={8}
                required
                className="border-white/15 bg-white/10 text-white placeholder:text-white/30 focus:border-saffron focus:ring-saffron/20"
              />
            </label>
            {error && (
              <p className="rounded-xl bg-red-500/20 p-3 text-sm text-red-300">{error}</p>
            )}
            <Button className="w-full" variant="accent" disabled={loading}>
              {loading ? "Signing in..." : "Sign in to admin"}
            </Button>
          </form>

          <div className="mt-6 flex items-center gap-2 rounded-xl bg-white/5 px-4 py-3 text-xs text-white/50">
            <Utensils size={14} />
            <span>This portal is for restaurant staff and administrators only.</span>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-ink/50">
          Customer?{" "}
          <a href="/login" className="font-bold text-saffron underline">
            Sign in here
          </a>
        </p>
      </div>
    </main>
  );
}
