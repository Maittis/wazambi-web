"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      router.push("/customer-admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-5">
      <div className="w-full max-w-[420px] rounded-2xl bg-white p-8">
        <Image src="/images/wazambi-logo-dark-v2.svg" alt="Wazambi GPS" width={200} height={42} className="h-8 w-auto mx-auto" />
        <h1 className="mt-6 text-center text-[22px] font-bold uppercase text-navy">
          Customer Dashboard
        </h1>
        <p className="mt-2 text-center text-[13px] font-light text-ink/60">
          Manage website leads, assessments and customer content.
        </p>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <label className="block text-[13px] font-medium text-ink/75">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-navy/15 px-4 py-3 text-[14px] outline-none focus:border-electric-blue"
              required
            />
          </label>
          <label className="block text-[13px] font-medium text-ink/75">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-navy/15 px-4 py-3 text-[14px] outline-none focus:border-electric-blue"
              required
            />
          </label>
          {error && <p className="text-[13px] text-alert">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p className="mt-6 text-center text-[12px] font-light text-ink/50">
          Demo staff accounts: owner@wazambigps.com / sales@wazambigps.com / content@wazambigps.com
          (password: wazambi123)
        </p>
      </div>
    </div>
  );
}