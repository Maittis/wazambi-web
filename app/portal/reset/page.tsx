"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function ResetForm() {
  const search = useSearchParams();
  const token = search.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Reset failed");
      setMessage(data.message || "Password updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[420px] rounded-2xl bg-white p-8">
      <Image src="/images/wazambi-logo-dark-v2.svg" alt="Wazambi GPS" width={200} height={42} className="mx-auto h-8 w-auto" />
      <h1 className="mt-6 text-center text-[22px] font-bold uppercase text-navy">Choose a new password</h1>
      {!token ? (
        <>
          <p className="mt-6 text-center text-[13px] text-alert">This reset link is invalid.</p>
          <Link href="/portal/forgot" className="btn-primary mt-5 block w-full text-center text-[14px]">
            Request a new link
          </Link>
        </>
      ) : message ? (
        <>
          <p className="mt-6 rounded-xl bg-emerald-50 px-4 py-3 text-[13px] text-emerald-800">{message}</p>
          <Link href="/portal/login" className="btn-primary mt-5 block w-full text-center text-[14px]">
            Back to sign in
          </Link>
        </>
      ) : (
        <form onSubmit={submit} className="mt-8 space-y-4">
          <label className="block text-[13px] font-medium text-ink/75">
            New password (min 8 characters)
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-navy/15 px-4 py-3 text-[14px] outline-none focus:border-electric-blue"
              required
              minLength={8}
            />
          </label>
          <label className="block text-[13px] font-medium text-ink/75">
            Confirm password
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-navy/15 px-4 py-3 text-[14px] outline-none focus:border-electric-blue"
              required
              minLength={8}
            />
          </label>
          {error && <p className="text-[13px] text-alert">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? "Updating..." : "Update password"}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-5">
      <Suspense fallback={<div className="text-white">Loading…</div>}>
        <ResetForm />
      </Suspense>
    </div>
  );
}