"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setMessage(data.message || "If that account exists, a reset link is on its way.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-5">
      <div className="w-full max-w-[420px] rounded-2xl bg-white p-8">
        <Image src="/images/wazambi-logo-dark-v2.svg" alt="Wazambi GPS" width={200} height={42} className="mx-auto h-8 w-auto" />
        <h1 className="mt-6 text-center text-[22px] font-bold uppercase text-navy">Reset password</h1>
        <p className="mt-2 text-center text-[13px] font-light text-ink/60">
          We will email you a link to choose a new password.
        </p>
        {message ? (
          <>
            <p className="mt-6 rounded-xl bg-emerald-50 px-4 py-3 text-[13px] text-emerald-800">{message}</p>
            <Link href="/portal/login" className="btn-primary mt-5 block w-full text-center text-[14px]">
              Back to sign in
            </Link>
          </>
        ) : (
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
            {error && <p className="text-[13px] text-alert">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}