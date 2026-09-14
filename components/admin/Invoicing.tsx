"use client";

import { useEffect, useState } from "react";
import { Badge, Modal, PrimaryBtn, Select, Td, Th } from "@/components/admin/ui";

type Item = { description: string; qty: number; unitPrice: number };
type Quote = {
  id: number;
  customerId?: number | null;
  number: string;
  items: Item[];
  total: number;
  currency: string;
  status: string;
  validUntil?: string | null;
  notes?: string | null;
  createdAt: string;
};
type Inv = {
  id: number;
  quotationId?: number | null;
  customerId?: number | null;
  number: string;
  items: Item[];
  total: number;
  amountPaid: number;
  status: string;
  dueAt?: string | null;
  createdAt: string;
};
type Deposit = { id: number; invoiceId: number; amount: number; method: string; reference?: string | null; createdAt: string };
type Customer = { id: number; contactName: string; company?: string | null };

const fmt = (n: number) =>
  new Intl.NumberFormat("en-ZM", { style: "currency", currency: "ZMW" }).format(n);

export default function Invoicing({ data }: { data: any }) {
  const customers: Customer[] = data.customers ?? [];
  const [tab, setTab] = useState<"quotes" | "invoices">("quotes");
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [invoices, setInvoices] = useState<Inv[]>([]);
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [openQuote, setOpenQuote] = useState<Quote | null>(null);
  const [openInv, setOpenInv] = useState<Inv | null>(null);
  const [notice, setNotice] = useState("");
  const [err, setErr] = useState("");

  const nameOf = (id?: number | null) => {
    const c = customers.find((x) => x.id === id);
    return c ? c.contactName : "—";
  };

  const loadQuotes = async () => {
    const r = await fetch("/api/quotations");
    if (r.ok) setQuotes((await r.json()).data ?? []);
  };
  const loadInvoices = async () => {
    const r = await fetch("/api/invoices");
    if (r.ok) {
      const j = await r.json();
      setInvoices(j.data ?? []);
      setDeposits(j.deposits ?? []);
    }
  };
  useEffect(() => {
    loadQuotes();
    loadInvoices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const patchQuote = async (id: number, status: string) => {
    const r = await fetch("/api/quotations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (r.ok) {
      setOpenQuote((q) => (q ? { ...q, status } : q));
      await loadQuotes();
    }
  };

  const createInvoice = async (quotationId: number) => {
    setErr("");
    const r = await fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quotationId }),
    });
    const j = await r.json();
    if (!r.ok) {
      setErr(j.error || "Failed");
      return;
    }
    setNotice(`Invoice ${j.data.number} created.`);
    setOpenQuote(null);
    await loadQuotes();
    await loadInvoices();
    setTab("invoices");
  };

  const recordDeposit = async (invoiceId: number, amount: number, method: string, reference: string) => {
    setErr("");
    if (amount <= 0) return;
    const r = await fetch("/api/invoices", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: invoiceId, action: "deposit", amount, method, reference }),
    });
    const j = await r.json();
    if (!r.ok) {
      setErr(j.error || "Failed");
      return;
    }
    setNotice(
      j.status === "paid"
        ? `Invoice fully paid.`
        : `Received ${fmt(amount)}. Remaining ${fmt(invoices.find((i) => i.id === invoiceId)!.total - j.amountPaid)}.`
    );
    setOpenInv((inv) => (inv && inv.id === invoiceId ? { ...inv, amountPaid: j.amountPaid, status: j.status } : inv));
    await loadInvoices();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            onClick={() => setTab("quotes")}
            className={`rounded-lg px-4 py-2 text-[13px] font-semibold ${tab === "quotes" ? "bg-navy text-white" : "bg-white text-navy border border-navy/15"}`}
          >
            Quotations
          </button>
          <button
            onClick={() => setTab("invoices")}
            className={`rounded-lg px-4 py-2 text-[13px] font-semibold ${tab === "invoices" ? "bg-navy text-white" : "bg-white text-navy border border-navy/15"}`}
          >
            Invoices
          </button>
        </div>
        {tab === "quotes" && <PrimaryBtn onClick={() => setShowNew(true)}>New quotation</PrimaryBtn>}
      </div>

      {notice && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] text-emerald-800">{notice}</div>
      )}
      {err && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-800">{err}</div>}

      {tab === "quotes" ? (
        <div className="overflow-x-auto rounded-xl border border-navy/10 bg-white">
          <table className="w-full min-w-[760px]">
            <thead className="bg-paper">
              <tr>
                <Th>Number</Th>
                <Th>Customer</Th>
                <Th>Items</Th>
                <Th>Total</Th>
                <Th>Status</Th>
                <Th>Issued</Th>
                <Th>Action</Th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((q) => (
                <tr key={q.id} className="border-t border-navy/5">
                  <Td className="font-semibold text-ink/90">{q.number}</Td>
                  <Td>{nameOf(q.customerId)}</Td>
                  <Td>{q.items.length}</Td>
                  <Td className="font-semibold">{fmt(q.total)}</Td>
                  <Td><Badge status={q.status} /></Td>
                  <Td className="whitespace-nowrap">{q.createdAt.slice(0, 10)}</Td>
                  <Td>
                    <button onClick={() => setOpenQuote(q)} className="rounded-lg border border-navy/10 px-3 py-1 text-[12px] font-semibold text-navy hover:bg-navy/5">
                      View
                    </button>
                  </Td>
                </tr>
              ))}
              {quotes.length === 0 && (
                <tr><Td colSpan={7} className="text-center text-ink/40">No quotations yet — create one for a customer.</Td></tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-navy/10 bg-white">
          <table className="w-full min-w-[860px]">
            <thead className="bg-paper">
              <tr>
                <Th>Number</Th>
                <Th>Customer</Th>
                <Th>Quote</Th>
                <Th>Total</Th>
                <Th>Paid</Th>
                <Th>Balance</Th>
                <Th>Status</Th>
                <Th>Issued</Th>
                <Th>Action</Th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((i) => {
                const ds = deposits.filter((d) => d.invoiceId === i.id).reduce((s, d) => s + d.amount, 0);
                return (
                  <tr key={i.id} className="border-t border-navy/5">
                    <Td className="font-semibold text-ink/90">{i.number}</Td>
                    <Td>{nameOf(i.customerId)}</Td>
                    <Td>{i.quotationId ? `Q-${i.quotationId}` : "—"}</Td>
                    <Td className="font-semibold">{fmt(i.total)}</Td>
                    <Td className="text-emerald-700">{fmt(Math.max(i.amountPaid, ds))}</Td>
                    <Td className={i.total - i.amountPaid > 0 ? "text-red-700" : "text-ink/60"}>
                      {fmt(Math.max(i.total - i.amountPaid, 0))}
                    </Td>
                    <Td><Badge status={i.status} /></Td>
                    <Td className="whitespace-nowrap">{i.createdAt.slice(0, 10)}</Td>
                    <Td>
                      <button onClick={() => setOpenInv(i)} className="rounded-lg border border-navy/10 px-3 py-1 text-[12px] font-semibold text-navy hover:bg-navy/5">
                        Manage
                      </button>
                    </Td>
                  </tr>
                );
              })}
              {invoices.length === 0 && (
                <tr><Td colSpan={9} className="text-center text-ink/40">No invoices yet — create one from an accepted quotation.</Td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showNew && (
        <NewQuotationModal customers={customers} onClose={() => setShowNew(false)} onCreated={() => { setShowNew(false); loadQuotes(); }} />
      )}

      {openQuote && (
        <Modal title={`${openQuote.number} — ${nameOf(openQuote.customerId)}`} onClose={() => setOpenQuote(null)}>
          <div className="space-y-4">
            <DocItems currency={openQuote.currency} items={openQuote.items} total={openQuote.total} />
            <div>
              <p className="mb-1 text-[12px] font-semibold uppercase text-ink/50">Status</p>
              <Select
                value={openQuote.status}
                onChange={(v) => patchQuote(openQuote.id, v)}
                options={["draft", "sent", "accepted", "declined"]}
              />
              <p className="mt-1 text-[11px] text-ink/40">
                Valid until {openQuote.validUntil ? openQuote.validUntil.slice(0, 10) : "—"} · Issued {openQuote.createdAt.slice(0, 10)}
              </p>
            </div>
            {openQuote.notes && <p className="rounded-lg bg-paper px-3 py-2 text-[13px] text-ink/70">{openQuote.notes}</p>}
            {(openQuote.status === "sent" || openQuote.status === "accepted") && (
              <PrimaryBtn onClick={() => createInvoice(openQuote.id)} className="w-full">
                Create invoice
              </PrimaryBtn>
            )}
          </div>
        </Modal>
      )}

      {openInv && (
        <Modal title={`${openInv.number} — ${nameOf(openInv.customerId)}`} onClose={() => setOpenInv(null)}>
          <div className="space-y-5">
            <DocItems currency="ZMW" items={openInv.items} total={openInv.total} />
            <div className="grid grid-cols-3 gap-2 text-[13px]">
              <div className="rounded-lg bg-paper p-3">
                <p className="text-[11px] uppercase text-ink/50">Total</p>
                <p className="font-bold text-navy">{fmt(openInv.total)}</p>
              </div>
              <div className="rounded-lg bg-emerald-50 p-3">
                <p className="text-[11px] uppercase text-emerald-700">Paid</p>
                <p className="font-bold text-emerald-700">{fmt(openInv.amountPaid)}</p>
              </div>
              <div className="rounded-lg bg-red-50 p-3">
                <p className="text-[11px] uppercase text-red-700">Balance</p>
                <p className="font-bold text-red-700">{fmt(Math.max(openInv.total - openInv.amountPaid, 0))}</p>
              </div>
            </div>
            <DepositForm invoice={openInv} onDeposit={recordDeposit} />
            <div>
              <p className="mb-1 text-[12px] font-semibold uppercase text-ink/50">Status</p>
              <Select
                value={openInv.status}
                onChange={(v) => {
                  fetch("/api/invoices", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: openInv.id, status: v }),
                  }).then(loadInvoices);
                }}
                options={["draft", "sent", "partial", "paid", "overdue"]}
              />
            </div>
            <div>
              <p className="mb-1 text-[12px] font-semibold uppercase text-ink/50">Payment history</p>
              <ul className="space-y-1.5">
                {deposits.filter((d) => d.invoiceId === openInv.id).map((d) => (
                  <li key={d.id} className="flex items-center justify-between rounded-lg bg-paper px-3 py-2 text-[13px]">
                    <span className="capitalize">{d.method.replace(/_/g, " ")}{d.reference ? ` · ${d.reference}` : ""}</span>
                    <span className="font-semibold text-emerald-700">+{fmt(d.amount)}</span>
                  </li>
                ))}
                {deposits.filter((d) => d.invoiceId === openInv.id).length === 0 && (
                  <li className="text-[12px] text-ink/40">No payments recorded yet.</li>
                )}
              </ul>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function DocItems({ items, total, currency }: { items: Item[]; total: number; currency: string }) {
  return (
    <div className="rounded-xl border border-navy/10">
      <table className="w-full">
        <thead className="bg-paper">
          <tr>
            <Th>Item</Th>
            <Th>Qty</Th>
            <Th>Unit</Th>
            <Th>Line</Th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, i) => (
            <tr key={i} className="border-t border-navy/5">
              <Td>{it.description}</Td>
              <Td>{it.qty}</Td>
              <Td>{fmt(it.unitPrice)}</Td>
              <Td className="font-semibold">{fmt(it.qty * it.unitPrice)}</Td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr><Td colSpan={4} className="text-center text-ink/40">No items</Td></tr>
          )}
        </tbody>
        <tfoot>
          <tr className="border-t border-navy/10 bg-paper">
            <Td colSpan={3} className="text-right font-bold uppercase text-ink/50">Total ({currency})</Td>
            <Td className="font-bold text-navy">{fmt(total)}</Td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function DepositForm({ invoice, onDeposit }: { invoice: Inv; onDeposit: (id: number, amount: number, method: string, reference: string) => void }) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("cash");
  const [reference, setReference] = useState("");
  const remaining = Math.max(invoice.total - invoice.amountPaid, 0);
  if (remaining <= 0) return null;
  return (
    <div className="rounded-xl border border-navy/10 p-3">
      <p className="text-[13px] font-semibold text-navy">Record a payment / deposit</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-4">
        <input
          type="number"
          min={1}
          max={remaining}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={`ZMW remaining: ${remaining}`}
          className="rounded-lg border border-navy/15 px-3 py-2 text-[13px] outline-none focus:border-electric-blue"
        />
        <select value={method} onChange={(e) => setMethod(e.target.value)} className="rounded-lg border border-navy/15 px-3 py-2 text-[13px]">
          {["cash", "mobile_money", "bank_transfer", "cheque", "card"].map((m) => (
            <option key={m} value={m}>{m.replace(/_/g, " ")}</option>
          ))}
        </select>
        <input
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder="Reference (optional)"
          className="rounded-lg border border-navy/15 px-3 py-2 text-[13px] outline-none focus:border-electric-blue"
        />
        <PrimaryBtn type="button" onClick={() => onDeposit(invoice.id, Number(amount) || 0, method, reference.trim())}>
          Record
        </PrimaryBtn>
      </div>
    </div>
  );
}

function NewQuotationModal({ customers, onClose, onCreated }: { customers: Customer[]; onClose: () => void; onCreated: () => void }) {
  const [customerId, setCustomerId] = useState("");
  const [rows, setRows] = useState<{ description: string; qty: string; unitPrice: string }[]>([
    { description: "", qty: "1", unitPrice: "" },
  ]);
  const [validUntil, setValidUntil] = useState("");
  const [notes, setNotes] = useState("");
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  const total = rows.reduce((s, r) => s + (Number(r.qty) || 0) * (Number(r.unitPrice) || 0), 0);

  const save = async () => {
    setErr("");
    if (!customerId) return setErr("Choose a customer.");
    const items = rows
      .map((r) => ({ description: r.description.trim(), qty: Number(r.qty) || 1, unitPrice: Number(r.unitPrice) || 0 }))
      .filter((r) => r.description && r.unitPrice > 0);
    if (items.length === 0) return setErr("Add at least one line with a description and price.");
    setSaving(true);
    const res = await fetch("/api/quotations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId: Number(customerId), items, validUntil: validUntil || undefined, notes: notes || undefined }),
    });
    const j = await res.json();
    setSaving(false);
    if (!res.ok) return setErr(j.error || "Failed");
    onCreated();
  };

  return (
    <Modal title="New quotation" onClose={onClose}>
      <div className="space-y-4">
        <label className="block text-[13px] font-medium text-ink/75">
          Customer
          <select value={customerId} onChange={(e) => setCustomerId(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-navy/15 px-3 py-2 text-[13px] outline-none focus:border-electric-blue">
            <option value="">Choose a customer…</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>{c.contactName}{c.company ? ` — ${c.company}` : ""}</option>
            ))}
          </select>
        </label>
        <div>
          <p className="mb-1 text-[13px] font-medium text-ink/75">Line items</p>
          <div className="space-y-2">
            {rows.map((r, i) => (
              <div key={i} className="grid grid-cols-[1fr_70px_110px_32px] gap-2">
                <input value={r.description} onChange={(e) => setRows(rows.map((x, j) => (j === i ? { ...x, description: e.target.value } : x)))} placeholder="Description (e.g. GPS tracking device)" className="rounded-lg border border-navy/15 px-3 py-2 text-[13px] outline-none focus:border-electric-blue" />
                <input type="number" min={1} value={r.qty} onChange={(e) => setRows(rows.map((x, j) => (j === i ? { ...x, qty: e.target.value } : x)))} className="rounded-lg border border-navy/15 px-3 py-2 text-[13px] outline-none focus:border-electric-blue" />
                <input type="number" min={0} value={r.unitPrice} onChange={(e) => setRows(rows.map((x, j) => (j === i ? { ...x, unitPrice: e.target.value } : x)))} placeholder="Unit ZMW" className="rounded-lg border border-navy/15 px-3 py-2 text-[13px] outline-none focus:border-electric-blue" />
                <button type="button" onClick={() => setRows(rows.filter((_, j) => j !== i))} className="text-[16px] text-red-500" aria-label="Remove row">✕</button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setRows([...rows, { description: "", qty: "1", unitPrice: "" }])} className="mt-2 text-[12px] font-semibold text-electric-blue hover:underline">
            + Add line
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-[13px] font-medium text-ink/75">
            Valid until
            <input type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-navy/15 px-3 py-2 text-[13px] outline-none focus:border-electric-blue" />
          </label>
          <div className="flex items-end justify-between rounded-lg bg-paper px-3 py-2">
            <span className="text-[12px] uppercase text-ink/50">Total (ZMW)</span>
            <span className="text-[18px] font-bold text-navy">{new Intl.NumberFormat("en-ZM").format(total)}</span>
          </div>
        </div>
        <label className="block text-[13px] font-medium text-ink/75">
          Notes
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="mt-1.5 block w-full rounded-lg border border-navy/15 px-3 py-2 text-[13px] outline-none focus:border-electric-blue" />
        </label>
        {err && <p className="text-[13px] text-alert">{err}</p>}
        <PrimaryBtn onClick={save} disabled={saving} className="w-full">
          {saving ? "Saving..." : "Issue quotation"}
        </PrimaryBtn>
      </div>
    </Modal>
  );
}