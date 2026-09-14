"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Item = { description: string; qty: number; unitPrice: number };
type Inv = {
  id: number;
  number: string;
  items: Item[];
  total: number;
  amountPaid: number;
  status: string;
  dueAt?: string | null;
  paidAt?: string | null;
  createdAt: string;
};
type Quote = { id: number; number: string; items: Item[]; total: number; status: string; createdAt: string };
type Deposit = { id: number; invoiceId: number; amount: number; method: string; createdAt: string };

const fmt = (n: number) =>
  new Intl.NumberFormat("en-ZM", { style: "currency", currency: "ZMW" }).format(n);

const statusChip: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-700",
  partial: "bg-amber-100 text-amber-800",
  sent: "bg-blue-100 text-blue-800",
  draft: "bg-navy/10 text-ink/60",
  overdue: "bg-red-100 text-red-700",
  accepted: "bg-green-100 text-green-700",
  declined: "bg-red-100 text-red-700",
  converted: "bg-navy/10 text-ink/60",
};

export default function PortalInvoices() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Inv[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        if (!d.ok || d.kind !== "customer") {
          router.replace(d.kind === "staff" ? "/customer-admin" : "/portal/login");
          return;
        }
        fetch("/api/customer/invoices")
          .then((r) => r.json())
          .then((j) => {
            if (cancelled || !j.ok) return;
            setInvoices(j.invoices ?? []);
            setQuotes(j.quotations ?? []);
            setDeposits(j.deposits ?? []);
          })
          .catch(() => undefined)
          .finally(() => !cancelled && setLoaded(true));
      })
      .catch(() => {
        if (!cancelled) router.replace("/portal/login");
      });
    return () => {
      cancelled = true;
    };
  }, [router]);

  const openAmount = invoices.filter((i) => i.status !== "paid").reduce((s, i) => s + Math.max(i.total - i.amountPaid, 0), 0);

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <header className="bg-navy text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <div>
            <p className="text-[18px] font-semibold">Invoices and payments</p>
            <p className="text-[13px] font-light text-white/70">Quotations, invoices and deposits for your account</p>
          </div>
          <Link href="/portal" className="rounded-[100px] border-2 border-white/40 px-4 py-1.5 text-[13px] font-semibold transition-colors hover:bg-white hover:text-navy">
            Back to dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-8">
        {!loaded ? (
          <p className="text-[14px] text-ink/50">Loading…</p>
        ) : (
          <div className="space-y-10">
            <section>
              <h2 className="text-[18px] font-bold text-navy">Invoices</h2>
              {invoices.length === 0 ? (
                <div className="mt-4 rounded-2xl bg-white p-8 text-center text-[13px] font-light text-ink/60">
                  No invoices yet. Once Wazambi issues an invoice it will appear here.
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {invoices.map((i) => (
                    <div key={i.id} className="rounded-2xl bg-white p-5 shadow-sm">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-[15px] font-bold text-navy">{i.number}</p>
                          <p className="mt-0.5 text-[12px] font-light text-ink/50">
                            Issued {i.createdAt.slice(0, 10)}
                            {i.dueAt ? ` · Due ${i.dueAt.slice(0, 10)}` : ""}
                          </p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-[11px] font-semibold capitalize ${statusChip[i.status] ?? "bg-navy/10 text-ink/60"}`}>
                          {i.status}
                        </span>
                      </div>
                      <div className="mt-3 space-y-1.5">
                        {i.items.map((it, n) => (
                          <p key={n} className="flex justify-between text-[13px]">
                            <span className="font-light text-ink/70">
                              {it.description} <span className="text-ink/40">× {it.qty}</span>
                            </span>
                            <span className="font-medium text-navy">{fmt(it.qty * it.unitPrice)}</span>
                          </p>
                        ))}
                      </div>
                      <div className="mt-3 flex items-center justify-between border-t border-navy/10 pt-3 text-[13px]">
                        <span>
                          Paid <strong className="text-emerald-700">{fmt(i.amountPaid)}</strong>
                          {i.total - i.amountPaid > 0 && (
                            <span className="ml-2 text-ink/50">
                              Balance <strong className="text-red-700">{fmt(Math.max(i.total - i.amountPaid, 0))}</strong>
                            </span>
                          )}
                        </span>
                        <span className="font-bold text-navy">Total {fmt(i.total)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {openAmount > 0 && (
                <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-[13px] text-amber-800">
                  Open balance across invoices: <strong>{fmt(openAmount)}</strong>. For payment methods (mobile money, bank transfer, cash) contact Wazambi at{" "}
                  <a className="font-semibold text-electric-blue" href="tel:+260976595331">+260 976 595 331</a>.
                </p>
              )}
            </section>

            <section>
              <h2 className="text-[18px] font-bold text-navy">Quotations</h2>
              {quotes.length === 0 ? (
                <div className="mt-4 rounded-2xl bg-white p-8 text-center text-[13px] font-light text-ink/60">
                  No quotations yet.
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {quotes.map((q) => (
                    <div key={q.id} className="rounded-2xl bg-white p-5 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-[15px] font-bold text-navy">{q.number}</p>
                        <span className={`rounded-full px-3 py-1 text-[11px] font-semibold capitalize ${statusChip[q.status] ?? "bg-navy/10 text-ink/60"}`}>
                          {q.status}
                        </span>
                      </div>
                      <div className="mt-2 space-y-1.5">
                        {q.items.map((it, n) => (
                          <p key={n} className="flex justify-between text-[13px]">
                            <span className="font-light text-ink/70">{it.description} <span className="text-ink/40">× {it.qty}</span></span>
                            <span className="font-medium text-navy">{fmt(it.qty * it.unitPrice)}</span>
                          </p>
                        ))}
                      </div>
                      <p className="mt-3 border-t border-navy/10 pt-3 text-right text-[13px] font-bold text-navy">Total {fmt(q.total)}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="text-[18px] font-bold text-navy">Payment history</h2>
              {deposits.length === 0 ? (
                <div className="mt-4 rounded-2xl bg-white p-8 text-center text-[13px] font-light text-ink/60">
                  No payments recorded yet.
                </div>
              ) : (
                <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-navy/10 bg-paper text-left text-[12px] uppercase tracking-wide text-ink/50">
                        <th className="px-5 py-3 font-semibold">Invoice</th>
                        <th className="px-5 py-3 font-semibold">Method</th>
                        <th className="px-5 py-3 font-semibold">Amount</th>
                        <th className="px-5 py-3 font-semibold">When</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deposits.map((d) => (
                        <tr key={d.id} className="border-t border-navy/5">
                          <td className="px-5 py-3 text-[13px] font-medium text-navy">
                            {invoices.find((i) => i.id === d.invoiceId)?.number ?? ""}
                          </td>
                          <td className="px-5 py-3 text-[13px] capitalize">{d.method.replace(/_/g, " ")}</td>
                          <td className="px-5 py-3 text-[13px] font-semibold text-emerald-700">{fmt(d.amount)}</td>
                          <td className="px-5 py-3 text-[13px] text-ink/60">{d.createdAt.slice(0, 10)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}