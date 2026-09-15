"use client";

import { useState } from "react";

const steps = ["Personal details", "Experience", "Sales methods", "Commitment"];

const methodOptions = [
  "Door-to-door",
  "Facebook marketing",
  "WhatsApp marketing",
  "Cold calling",
  "Business visits",
  "Referrals",
  "Personal connections",
];

export default function AgentApplicationForm() {
  const [step, setStep] = useState(0);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState({
    fullName: "",
    phone: "",
    email: "",
    town: "",
    over18: "",
    hasSmartphone: "",
    salesExperience: "",
    vehicleConnections: "",
    experience: "",
    methods: [] as string[],
    weeklyApproach: "",
    firstFive: "",
    whyYou: "",
    attend: "",
    travel: "",
    understandCommission: "",
    accept: false,
  });

  const set = (field: string, value: string) => setData((prev) => ({ ...prev, [field]: value }));
  const toggleMethod = (m: string) =>
    setData((prev) => ({
      ...prev,
      methods: prev.methods.includes(m)
        ? prev.methods.filter((x) => x !== m)
        : [...prev.methods, m],
    }));

  const doneSteps = step === steps.length - 1;
  const subSteps = [2, 3, 4, 5, 6];
  const maxProgress = 100;

  const progress = doneSteps ? 100 : Math.round(((step + 1) / steps.length) * 100);

  const handleSubmit = async () => {
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/agent-application", {
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
      <div className="rounded-[16px] bg-paper p-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold">
          <svg className="h-8 w-8 text-navy" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="mt-5 text-[24px] font-bold text-navy">Application received.</h3>
        <p className="mx-auto mt-3 max-w-[520px] text-[15px] font-light text-ink/70">
          Your application will now be reviewed. Applying does not guarantee selection.
          Only shortlisted applicants will be contacted with the next steps.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[600px]">
      <p className="text-center text-[13px] font-medium uppercase tracking-wide text-ink/60">
        {steps[step]} · {progress}% complete
      </p>
      <div className="mb-8 mt-3 h-2 w-full rounded-full bg-navy/10">
        <div className="h-2 rounded-full bg-gold transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <div className="min-h-[340px]">
        {step === 0 && (
          <div className="space-y-4">
            <Field label="Full name *"><input type="text" value={data.fullName} onChange={(e) => set("fullName", e.target.value)} className={inputCls} /></Field>
            <Field label="WhatsApp number *"><input type="tel" value={data.phone} onChange={(e) => set("phone", e.target.value)} className={inputCls} /></Field>
            <Field label="Email address *"><input type="email" value={data.email} onChange={(e) => set("email", e.target.value)} className={inputCls} /></Field>
            <Field label="Town and province *"><input type="text" value={data.town} onChange={(e) => set("town", e.target.value)} className={inputCls} /></Field>
            <YesNo label="Are you 18 years or older?" value={data.over18} onSelect={(v) => set("over18", v)} />
            <YesNo label="Do you own a smartphone with internet access?" value={data.hasSmartphone} onSelect={(v) => set("hasSmartphone", v)} />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <YesNo label="Do you have sales or marketing experience?" value={data.salesExperience} onSelect={(v) => set("salesExperience", v)} />
            <YesNo label="Do you know individuals or businesses that own vehicles?" value={data.vehicleConnections} onSelect={(v) => set("vehicleConnections", v)} />
            <Field label="Briefly explain your experience *"><textarea rows={4} value={data.experience} onChange={(e) => set("experience", e.target.value)} className={inputCls} /></Field>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <p className="text-[15px] font-bold text-navy">Which sales methods will you use? Select all that apply.</p>
            <div className="grid grid-cols-2 gap-2">
              {methodOptions.map((m) => (
                <button key={m} type="button" onClick={() => toggleMethod(m)} className={`rounded-lg border px-3 py-3 text-[13px] font-medium transition-colors ${data.methods.includes(m) ? "border-gold bg-gold text-navy" : "border-navy/15 bg-white text-ink/70"}`}>
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <p className="rounded-lg bg-paper p-4 text-[13px] font-light text-ink/70">
              <strong className="font-semibold text-navy">Training:</strong> 1–2 October 2026.
              You must attend both days and arrange your own transport to the venue.
              Venue: to be confirmed.
            </p>
            <YesNo label="Can you attend both training days?" value={data.attend} onSelect={(v) => set("attend", v)} />
            <YesNo label="Can you travel to the venue at your own cost?" value={data.travel} onSelect={(v) => set("travel", v)} />
            <YesNo label="Do you understand this is commission-based and not salaried employment?" value={data.understandCommission} onSelect={(v) => set("understandCommission", v)} />
            <label className="flex items-start gap-2 text-[13px] text-ink/70">
              <input type="checkbox" checked={data.accept} onChange={(e) => set("accept", e.target.checked ? "true" : "")} className="mt-0.5" />
              I confirm the information I provide is true, that I understand this is a
              commission-based agent opportunity, and that I can attend both training days on 1–2 October 2026.
            </label>
          </div>
        )}
      </div>

      {error && <p className="mt-3 text-[13px] text-alert">{error}</p>}

      <div className="mt-6 flex gap-3">
        {step > 0 && (
          <button type="button" onClick={() => setStep(step - 1)} className="btn-secondary flex-1 text-[14px]">
            ← Back
          </button>
        )}
        {step < steps.length - 1 ? (
          <button
            type="button"
            onClick={() => {
              if (subSteps.includes(step) && data.accept) return;
              setStep(step + 1);
            }}
            className="btn-primary flex-1 text-[14px]"
          >
            Continue →
          </button>
        ) : (
          <button type="button" onClick={handleSubmit} disabled={sending} className="btn-primary flex-1 text-[14px] disabled:opacity-60">
            {sending ? "Submitting..." : "Submit My Application →"}
          </button>
        )}
      </div>
    </div>
  );
}

const inputCls =
  "mt-1.5 block w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-[15px] outline-none focus:border-electric-blue";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-[14px] font-medium text-ink/75">
      {label}
      {children}
    </label>
  );
}

function YesNo({
  label,
  value,
  onSelect,
}: {
  label: string;
  value: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-[15px] font-medium text-ink/80">{label}</p>
      <div className="flex gap-2">
        {["Yes", "No"].map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onSelect(o)}
            className={`rounded-lg border px-6 py-2.5 text-[14px] font-medium transition-colors ${
              value === o
                ? "border-gold bg-gold text-navy"
                : "border-navy/15 bg-white text-ink/70 hover:border-electric-blue"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}