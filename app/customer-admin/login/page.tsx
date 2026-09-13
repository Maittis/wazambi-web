"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  const isLoggedIn = () =>
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((d) => d.ok === true)
      .catch(() => false);

  if (!checked) {
    isLoggedIn().then((ok) => {
      if (ok) router.replace("/customer-admin");
      setChecked(true);
    });
  }

  if (!checked) return <div className="min-h-screen bg-navy" />;

  return <LoginForm />;
}