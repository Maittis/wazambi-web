"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const steps = ["Your details", "Your content", "Your experience", "Commitment"];

const STORAGE_KEY = "wazambiCreatorApplication";

const platformOptions = [
  "TikTok",
  "Instagram",
  "Facebook",
  "WhatsApp Status",
];

const frequencyOptions = [
  "Almost daily",
  "2–3 times a week",
  "Once a week",
  "A few times a month",
];

const defaultData = {
  fullName: "",
  phone: "",
  email: "",
  town: "",
  platforms: [] as string[],
  mainContentUrl: "",
  audienceSize: "",
  contentFrequency: "",
  sampleContent: "",
  experience: "",
  whyYou: "",
  understandPerformance: "",
  understandReview: "",
  accept: false,
};

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
  const togglePlatform = (p: string) =>
    setData((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(p)
        ? prev.platforms.filter((x) => x !== p)
        : [...prev.platforms, p],
    }));

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
      if (data.platforms.length === 0) return "Select at least one platform you create content on.";
      if (!data.mainContentUrl.trim()) return "Please enter the link to your main content page or profile.";
      return "";
    }
    if (step === 2) {
      if (!data.sampleContent.trim()) return "Please describe or link a few examples of your content.";
      return "";
    }
    if (step === 3 && !data.accept) return "Please confirm the information before applying.";
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
          Only creators whose content meets the program&apos;s standards will be contacted.
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

      <div className="min-h-[340px]">
        {step === 0 && (
          <div className="space-y-4">
            <Field label="Full name *"><input type="text" value={data.fullName} onChange={(e) => set("fullName", e.target.value)} className={inputCls} /></Field>
            <Field label="WhatsApp number *"><input type="tel" value={data.phone} onChange={(e) => set("phone", e.target.value)} className={inputCls} /></Field>
            <Field label="Email address *"><input type="email" value={data.email} onChange={(e) => set("email", e.target.value)} className={inputCls} /></Field>
            <Field label="Town and province"><input type="text" value={data.town} onChange={(e) => set("town", e.target.value)} className={inputCls} /></Field>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <p className="text-[15px] font-bold text-navy">Which platforms do you create content on? Select all that apply.</p>
            <div className="grid grid-cols-2 gap-2">
              {platformOptions.map((p) => (
                <button key={p} type="button" onClick={() => togglePlatform(p)} className={`rounded-lg border px-3 py-3 text-[13px] font-medium transition-colors ${data.platforms.includes(p) ? "border-wazambi-gold bg-wazambi-gold text-navy" : "border-navy/15 bg-white text-ink/70"}`}>
                  {p}
                </button>
              ))}
            </div>
            <Field label="Link to your main content page or profile * (the page reviewers will look at)">
              <input type="url" value={data.mainContentUrl} onChange={(e) => set("mainContentUrl", e.target.value)} className={inputCls} placeholder="https://tiktok.com/@yourpage" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Approximate audience size"><input type="text" value={data.audienceSize} onChange={(e) => set("audienceSize", e.target.value)} className={inputCls} placeholder="e.g. 5,000 followers" /></Field>
              <Field label="How often do you post?">
                <select value={data.contentFrequency} onChange={(e) => set("contentFrequency", e.target.value)} className={inputCls}>
                  <option value="">Select…</option>
                  {frequencyOptions.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </Field>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <Field label="Examples of your content *">
              <textarea rows={3} value={data.sampleContent} onChange={(e) => set("sampleContent", e.target.value)} className={inputCls} placeholder="Paste links or describe up to 3 recent videos you are proud of." />
            </Field>
            <Field label="Content creation experience"><textarea rows={3} value={data.experience} onChange={(e) => set("experience", e.target.value)} className={inputCls} /></Field>
            <Field label="Why do you want to create content for Wazambi GPS?"><textarea rows={3} value={data.whyYou} onChange={(e) => set("whyYou", e.target.value)} className={inputCls} /></Field>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <p className="rounded-lg bg-paper p-4 text-[13px] font-light text-ink/70">
              Approved creators publish Wazambi content on TikTok, Instagram or Facebook and submit
              their published videos. Earnings depend on the approved performance and views of each
              piece of content.
            </p>
            <YesNo label="Do you understand earnings depend on approved views and content performance?" value={data.understandPerformance} onSelect={(v) => set("understandPerformance", v)} />
            <YesNo label="Do you understand you must submit your published content for review?" value={data.understandReview} onSelect={(v) => set("understandReview", v)} />
            <label className="flex items-start gap-2 text-[13px] text-ink/70">
              <input type="checkbox" checked={data.accept} onChange={(e) => set("accept", e.target.checked ? "true" : "")} className="mt-0.5" />
              I confirm the information I provide is true, that I understand this is a
              performance-based content opportunity and not salaried employment, and that earnings
              are not guaranteed.
            </label>
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