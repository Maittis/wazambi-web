"use client";

import { useState } from "react";

export default function ContactForm() {
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const set = (field: string, value: string) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Something went wrong");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSending(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-[14px] bg-paper p-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold">
          <svg className="h-7 w-7 text-navy" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="mt-5 text-[22px] font-bold text-navy">Message received.</h3>
        <p className="mt-2 text-[15px] font-light text-ink/70">
          Thank you. The Wazambi team will get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <label className="block text-[14px] font-medium text-ink/75">
          Full Name *
          <input type="text" value={data.fullName} onChange={(e) => set("fullName", e.target.value)} className="mt-1.5 block w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-[15px] outline-none focus:border-electric-blue" required />
        </label>
        <label className="block text-[14px] font-medium text-ink/75">
          Email Address *
          <input type="email" value={data.email} onChange={(e) => set("email", e.target.value)} className="mt-1.5 block w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-[15px] outline-none focus:border-electric-blue" required />
        </label>
      </div>
      <label className="block text-[14px] font-medium text-ink/75">
        Phone Number
        <input type="tel" value={data.phone} onChange={(e) => set("phone", e.target.value)} className="mt-1.5 block w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-[15px] outline-none focus:border-electric-blue" />
      </label>
      <label className="block text-[14px] font-medium text-ink/75">
        Subject
        <input type="text" value={data.subject} onChange={(e) => set("subject", e.target.value)} className="mt-1.5 block w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-[15px] outline-none focus:border-electric-blue" />
      </label>
      <label className="block text-[14px] font-medium text-ink/75">
        Your Message *
        <textarea rows={5} value={data.message} onChange={(e) => set("message", e.target.value)} className="mt-1.5 block w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-[15px] outline-none focus:border-electric-blue" required />
      </label>
      {error && <p className="text-[13px] text-alert">{error}</p>}
      <button type="submit" disabled={sending} className="btn-primary w-full text-center disabled:opacity-60">
        {sending ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}