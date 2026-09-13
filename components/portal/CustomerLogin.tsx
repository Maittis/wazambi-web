"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  onSuccess: () => void;
}

export default function CustomerLogin({ onSuccess }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/customer/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      onSuccess();
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
          Customer Portal
        </h1>
        <p className="mt-2 text-center text-[13px] font-light text-ink/60">
          Track your vehicles in real time.
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
          <p className="flex items-center justify-between text-[12px] font-light text-ink/50">
            <span>Forgot your password?</span>
            <a href="/portal/forgot" className="font-semibold text-electric-blue">Reset it</a>
          </p>
        </form>
        <p className="mt-6 text-center text-[12px] font-light text-ink/50">
          Logged in as a customer? Ask Wazambi for your login details.
        </p>
      </div>
    </div>
  );
}