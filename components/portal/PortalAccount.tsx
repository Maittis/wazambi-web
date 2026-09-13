"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PortalAccount() {
  const router = useRouter();
  const [me, setMe] = useState<{ fullName: string } | null | undefined>(undefined);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((d) => {
        if (!d.ok || d.kind !== "customer") {
          router.replace("/portal/login");
          return;
        }
        setMe(d.customer);
      })
      .catch(() => router.replace("/portal/login"));
  }, [router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOk(false);
    if (next !== confirm) {
      setError("New passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/customer/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update password");
      setOk(true);
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  if (!me) {
    return <div className="min-h-screen bg-[#F5F7FA]" />;
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <header className="bg-navy text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <p className="text-[18px] font-semibold">Account settings</p>
          <Link href="/portal" className="rounded-[100px] border-2 border-white/40 px-4 py-1.5 text-[13px] font-semibold transition-colors hover:bg-white hover:text-navy">
            Back to vehicles
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-xl px-5 py-10">
        <div className="rounded-2xl bg-white p-6">
          <h1 className="text-[18px] font-bold text-navy">Change password</h1>
          <p className="mt-1 text-[13px] font-light text-ink/60">
            Logged in as {me.fullName}. Use your new password at your next sign-in.
          </p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block text-[13px] font-medium text-ink/75">
              Current password
              <input
                type="password"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                className="mt-1.5 block w-full rounded-lg border border-navy/15 px-4 py-3 text-[14px] outline-none focus:border-electric-blue"
                required
              />
            </label>
            <label className="block text-[13px] font-medium text-ink/75">
              New password (min 8 characters)
              <input
                type="password"
                value={next}
                onChange={(e) => setNext(e.target.value)}
                className="mt-1.5 block w-full rounded-lg border border-navy/15 px-4 py-3 text-[14px] outline-none focus:border-electric-blue"
                required
              />
            </label>
            <label className="block text-[13px] font-medium text-ink/75">
              Confirm new password
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="mt-1.5 block w-full rounded-lg border border-navy/15 px-4 py-3 text-[14px] outline-none focus:border-electric-blue"
                required
              />
            </label>
            {error && <p className="text-[13px] text-alert">{error}</p>}
            {ok && <p className="text-[13px] font-medium text-emerald-600">Password updated.</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
              {loading ? "Updating..." : "Update password"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}