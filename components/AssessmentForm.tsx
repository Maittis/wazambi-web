"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  assessmentType: "fleet" | "fuel";
};

const steps = [
  { label: "Your details" },
  { label: "Your vehicles" },
  { label: "Your challenge" },
];

const fleetSizeOptions = ["1-4", "5-10", "11-20", "21-50", "50+"];
const serviceOptions = ["GPS Tracking", "Fuel Monitoring", "Fleet Management", "Not sure yet"];
const challengeOptions = [
  "Vehicle theft",
  "Fuel theft or high fuel costs",
  "Unauthorised vehicle use",
  "Dangerous driving",
  "Managing several vehicles",
  "Vehicle maintenance",
  "Unreliable GPS tracking",
  "Still exploring",
];

export default function AssessmentForm({ assessmentType }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "+260",
    company: "",
    fleetSize: "",
    serviceInterest: "",
    mainChallenge: "",
    notes: "",
    consent: true,
  });

  const set = (field: string, value: string | boolean) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const progress = Math.round(((step + 1) / steps.length) * 100);

  const handleSubmit = async () => {
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, assessmentType }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Something went wrong");
      router.push(`/academy/thank-you?course=${assessmentType === "fuel" ? "fuel_assessment" : "fleet_assessment"}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto max-w-[540px]">
      <div className="mb-6 flex items-center justify-between text-[13px] font-medium text-ink/60">
        <span>Step {step + 1} of {steps.length} · {steps[step].label}</span>
        <span>{progress}% complete</span>
      </div>
      <div className="mb-8 h-2 w-full rounded-full bg-navy/10">
        <div className="h-2 rounded-full bg-electric-blue transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <div className="min-h-[280px]">
        {step === 0 && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <label className="text-[14px] font-medium text-ink/75">
                First Name *
                <input type="text" value={data.firstName} onChange={(e) => set("firstName", e.target.value)} className="mt-1.5 block w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-[15px] outline-none focus:border-electric-blue" required />
              </label>
              <label className="text-[14px] font-medium text-ink/75">
                Last Name *
                <input type="text" value={data.lastName} onChange={(e) => set("lastName", e.target.value)} className="mt-1.5 block w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-[15px] outline-none focus:border-electric-blue" required />
              </label>
            </div>
            <label className="block text-[14px] font-medium text-ink/75">
              Email Address *
              <input type="email" value={data.email} onChange={(e) => set("email", e.target.value)} className="mt-1.5 block w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-[15px] outline-none focus:border-electric-blue" required />
            </label>
            <label className="block text-[14px] font-medium text-ink/75">
              Phone Number (Zambia +260) *
              <input type="tel" value={data.phone} onChange={(e) => set("phone", e.target.value)} className="mt-1.5 block w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-[15px] outline-none focus:border-electric-blue" required />
            </label>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <label className="block text-[14px] font-medium text-ink/75">
              Company / Organisation
              <input type="text" value={data.company} onChange={(e) => set("company", e.target.value)} className="mt-1.5 block w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-[15px] outline-none focus:border-electric-blue" />
            </label>
            <div>
              <p className="mb-3 text-[15px] font-bold text-navy">How many vehicles do you manage? *</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {fleetSizeOptions.map((o) => (
                  <button key={o} type="button" onClick={() => set("fleetSize", o)} className={`rounded-lg border px-4 py-3 text-[14px] font-medium transition-colors ${data.fleetSize === o ? "border-electric-blue bg-electric-blue text-white" : "border-navy/15 bg-white text-ink/70 hover:border-electric-blue"}`}>
                    {o}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-[15px] font-bold text-navy">Which solution interests you? *</p>
              <div className="grid grid-cols-2 gap-2">
                {serviceOptions.map((o) => (
                  <button key={o} type="button" onClick={() => set("serviceInterest", o)} className={`rounded-lg border px-4 py-3 text-[14px] font-medium transition-colors ${data.serviceInterest === o ? "border-electric-blue bg-electric-blue text-white" : "border-navy/15 bg-white text-ink/70 hover:border-electric-blue"}`}>
                    {o}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <p className="mb-3 text-[15px] font-bold text-navy">What is your biggest challenge? *</p>
              <div className="grid grid-cols-2 gap-2">
                {challengeOptions.map((o) => (
                  <button key={o} type="button" onClick={() => set("mainChallenge", o)} className={`rounded-lg border px-3 py-3 text-[13px] font-medium transition-colors ${data.mainChallenge === o ? "border-electric-blue bg-electric-blue text-white" : "border-navy/15 bg-white text-ink/70 hover:border-electric-blue"}`}>
                    {o}
                  </button>
                ))}
              </div>
            </div>
            <label className="block text-[14px] font-medium text-ink/75">
              Anything else we should know?
              <textarea rows={3} value={data.notes} onChange={(e) => set("notes", e.target.value)} className="mt-1.5 block w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-[15px] outline-none focus:border-electric-blue" />
            </label>
            <label className="flex items-start gap-2 text-[13px] text-ink/65">
              <input type="checkbox" checked={data.consent} onChange={(e) => set("consent", e.target.checked)} className="mt-0.5" />
              I agree to receive communications from Wazambi GPS. You can unsubscribe at any time.
            </label>
          </div>
        )}
      </div>

      {error && <p className="mb-4 text-[13px] text-alert">{error}</p>}

      <div className="flex gap-3">
        {step > 0 && (
          <button type="button" onClick={() => setStep(step - 1)} className="btn-outline flex-1 text-[14px]">
            ← Back
          </button>
        )}
        {step < steps.length - 1 ? (
          <button type="button" onClick={() => setStep(step + 1)} className="btn-primary flex-1 text-[14px]">
            Continue →
          </button>
        ) : (
          <button type="button" onClick={handleSubmit} disabled={sending} className="btn-primary flex-1 text-[14px] disabled:opacity-60">
            {sending ? "Sending..." : "Submit My Assessment"}
          </button>
        )}
      </div>
    </div>
  );
}