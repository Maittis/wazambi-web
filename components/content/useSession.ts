"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export type SessionUser = { id: number; fullName: string; email: string; role: string };

export function useSession(initialMe?: SessionUser | null) {
  const [me, setMe] = useState<SessionUser | null | undefined>(initialMe);
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setMe(d.ok ? d.staff : null);
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