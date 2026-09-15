"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const steps = ["Personal details", "Content details"];

const STORAGE_KEY = "wazambiCreatorApplication";

const platformOptions = ["TikTok", "Instagram", "Facebook"];

const durationOptions = [
  "Less than 6 months",
  "6–12 months",
  "1–2 years",
  "More than 2 years",
];

const defaultData = {
  fullName: "",
  phone: "",
  email: "",
  town: "",
  mainPlatform: "",
  mainContentUrl: "",
  contentDuration: "",
  canRecordEdit: "",
  whyYou: "",
  consent: false,
  acceptTerms: false,
};

const reviewedNote =
  "We use this link to review your existing followers, previous content, video quality, content consistency, engagement and relevant experience.";

function restoreSaved(): { data: typeof defaultData; step: number } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const step =
      typeof parsed?.step === "number" && parsed.step >= 0 && parsed.step < steps.length
        ? parsed.step
        : 0;
    return { data: { ...defaultData, ...(parsed?.data ?? {}) }, step };
  } catch {
    return null;
  }
}

export default function CreatorApplicationForm() {
  const router = useRouter();
  const [restored, setRestored] = useState(false);
  const [step, setStep] = useState(0);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<typeof defaultData>(defaultData);

  useEffect(() => {
    const saved = restoreSaved();
    if (saved) {
      setData(saved.data);
      setStep(saved.step);
    }
    setRestored(true);
  }, []);

  useEffect(() => {
    if (!restored) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ data, step }));
    } catch {
      /* storage unavailable */
    }
  }, [data, step, restored]);

  const set = (field: string, value: string) => setData((prev) => ({ ...prev, [field]: value }));
  const toggle = (field: string, value: string) =>
    setData((prev) => ({ ...prev, [field]: prev[field as keyof typeof prev] === value ? "" : value }));

  const doneSteps = step === steps.length - 1;
  const progress = doneSteps ? 100 : Math.round(((step + 1) / steps.length) * 100);

  const validateStep = (): string => {
    if (step === 0) {
      if (!data.fullName.trim()) return "Please enter your full name.";
      if (!data.phone.trim()) return "Please enter your WhatsApp number.";
      if (!data.email.trim()) return "Please enter your email address.";
      return "";
    }
    if (step === 1) {
      if (!data.mainPlatform.trim()) return "Select your main platform.";
      if (!data.mainContentUrl.trim()) return "Please enter the link to your strongest existing content page.";
      if (!data.contentDuration.trim()) return "Select how long you have been creating content.";
      if (!data.canRecordEdit.trim()) return "Please answer whether you can record and edit your own videos.";
      if (!data.whyYou.trim()) return "Please tell us why you would like to create content for Wazambi.";
      if (!data.consent) return "Please give your consent to be contacted and reviewed.";
      if (!data.acceptTerms) return "Please accept the Creator Program terms.";
      return "";
    }
    return "";
  };

  const handleSubmit = async () => {
    const msg = validateStep();
    if (msg) {
      setError(msg);
      return;
    }
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/creator-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Something went wrong");
      if (typeof window !== "undefined") {
        try {
          sessionStorage.removeItem(STORAGE_KEY);
        } catch {
          /* ignore */
        }
      }
      setDone(true);
      router.replace("/creators/thank-you");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSending(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-[16px] bg-paper p-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-wazambi-gold">
          <svg className="h-8 w-8 text-navy" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="mt-5 text-[24px] font-bold text-navy">Application received.</h3>
        <p className="mx-auto mt-3 max-w-[520px] text-[15px] font-light text-ink/70">
          Your application will now be reviewed. Applying does not guarantee approval.
          Only creators whose content meets our standards will be contacted.
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
        <div className="h-2 rounded-full bg-wazambi-gold transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <div className="min-h-[300px]">
        {step === 0 && (
          <div className="space-y-4">
            <Field label="Full name *"><input type="text" value={data.fullName} onChange={(e) => set("fullName", e.target.value)} className={inputCls} /></Field>
            <Field label="Phone / WhatsApp number *"><input type="tel" value={data.phone} onChange={(e) => set("phone", e.target.value)} className={inputCls} /></Field>
            <Field label="Email address *"><input type="email" value={data.email} onChange={(e) => set("email", e.target.value)} className={inputCls} /></Field>
            <Field label="City or town"><input type="text" value={data.town} onChange={(e) => set("town", e.target.value)} className={inputCls} /></Field>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <div>
              <p className="mb-2 text-[15px] font-medium text-ink/80">What is your main platform? *</p>
              <div className="flex flex-wrap gap-2">
                {platformOptions.map((p) => (
                  <button key={p} type="button" onClick={() => toggle("mainPlatform", p)} className={`rounded-lg border px-5 py-2.5 text-[13px] font-medium transition-colors ${data.mainPlatform === p ? "border-wazambi-gold bg-wazambi-gold text-navy" : "border-navy/15 bg-white text-ink/70"}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <Field label="Link to your strongest existing content page *">
              <input type="url" value={data.mainContentUrl} onChange={(e) => set("mainContentUrl", e.target.value)} className={inputCls} placeholder="https://tiktok.com/@yourpage" />
            </Field>
            <p className="text-[12px] font-light leading-relaxed text-ink/55">{reviewedNote}</p>

            <div>
              <p className="mb-2 text-[15px] font-medium text-ink/80">How long have you been creating content? *</p>
              <div className="flex flex-wrap gap-2">
                {durationOptions.map((d) => (
                  <button key={d} type="button" onClick={() => toggle("contentDuration", d)} className={`rounded-lg border px-4 py-2.5 text-[13px] font-medium transition-colors ${data.contentDuration === d ? "border-wazambi-gold bg-wazambi-gold text-navy" : "border-navy/15 bg-white text-ink/70"}`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <YesNo label="Can you record and edit your own videos? *" value={data.canRecordEdit} onSelect={(v) => set("canRecordEdit", v)} />

            <Field label="Why would you like to create content for Wazambi? *">
              <textarea rows={3} value={data.whyYou} onChange={(e) => set("whyYou", e.target.value)} className={inputCls} />
            </Field>

            <div className="space-y-3 rounded-lg bg-paper p-4">
              <label className="flex items-start gap-2 text-[13px] text-ink/70">
                <input type="checkbox" checked={data.consent} onChange={(e) => setData((p) => ({ ...p, consent: e.target.checked }))} className="mt-0.5" />
                I consent to Wazambi reviewing my public content page and contacting me about my application.
              </label>
              <label className="flex items-start gap-2 text-[13px] text-ink/70">
                <input type="checkbox" checked={data.acceptTerms} onChange={(e) => setData((p) => ({ ...p, acceptTerms: e.target.checked }))} className="mt-0.5" />
                I accept the Creator Program terms: this is a performance-based content opportunity,
                not salaried employment, and earnings depend on approved content performance and are not guaranteed.
              </label>
            </div>
          </div>
        )}
      </div>

      {error && <p className="mt-3 text-[13px] text-alert">{error}</p>}

      <div className="mt-6 flex gap-3">
        {step > 0 && (
          <button type="button" onClick={() => { setError(""); setStep(step - 1); }} className="btn-secondary flex-1 text-[14px]">
            ← Back
          </button>
        )}
        {step < steps.length - 1 ? (
          <button
            type="button"
            onClick={() => {
              const msg = validateStep();
              if (msg) {
                setError(msg);
                return;
              }
              setError("");
              setStep(step + 1);
            }}
            className="btn-primary flex-1 text-[14px]"
          >
            Continue →
          </button>
        ) : (
          <button type="button" onClick={handleSubmit} disabled={sending} className="btn-primary flex-1 text-[13px] uppercase tracking-wide disabled:opacity-60">
            {sending ? "Submitting..." : "Submit My Creator Application"}
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
                ? "border-wazambi-gold bg-wazambi-gold text-navy"
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