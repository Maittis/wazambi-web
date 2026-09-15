"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CustomerLogin from "@/components/portal/CustomerLogin";

export default function PortalLoginPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        if (d.ok && d.kind === "customer") router.replace("/portal");
        if (d.ok && d.kind === "staff") router.replace("/admin");
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setChecking(false);
      });
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (checking) {
    return <div className="min-h-screen bg-navy" />;
  }

  return <CustomerLogin onSuccess={() => router.replace("/portal")} />;
}