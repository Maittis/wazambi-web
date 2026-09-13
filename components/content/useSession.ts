"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export type SessionUser =
  | { kind: "staff"; id: number; fullName: string; email: string; role?: string }
  | { kind: "customer"; id: number; fullName: string; email: string };

export function useSession(initialMe?: SessionUser | null) {
  const [me, setMe] = useState<SessionUser | null | undefined>(initialMe);
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        if (!d.ok) {
          setMe(null);
          return;
        }
        if (d.kind === "staff") {
          setMe({ kind: "staff", ...d.staff });
        } else if (d.kind === "customer") {
          setMe({ kind: "customer", ...d.customer });
        } else {
          setMe(null);
        }
      })
      .catch(() => {
        if (!cancelled) setMe(null);
      });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return me;
}

export function dashboardHref(me?: SessionUser | null): string {
  return me?.kind === "customer" ? "/portal" : "/customer-admin";
}