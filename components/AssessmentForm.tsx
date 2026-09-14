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
const solutionOptions = ["GPS Tracking", "Fuel Monitoring", "Fleet Management"];
const helpOption = "I need help choosing";
const challengeOptions = [
  "Fuel theft or high fuel costs",
  "Unauthorised vehicle use",
  "Vehicle theft or security",
  "Managing several vehicles",
  "Driver behaviour",
  "Vehicle maintenance",
  "Unreliable GPS tracking",
  "Cross-border visibility",
  "Reports and accountability",
];
const exploringOption = "I am still exploring";

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
    serviceInterests: [] as string[],
    needsHelpChoosing: false,
    mainChallenges: [] as string[],
    stillExploring: false,
    notes: "",
    consent: true,
  });

  const set = (field: string, value: string | boolean) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const toggleSolution = (o: string) => {
    const has = data.serviceInterests.includes(o);
    setData((prev) => ({
      ...prev,
      serviceInterests: has ? prev.serviceInterests.filter((x) => x !== o) : [...prev.serviceInterests, o],
      needsHelpChoosing: false,
    }));
  };

  const toggleHelp = () => {
    const next = !data.needsHelpChoosing;
    setData((prev) => ({
      ...prev,
      needsHelpChoosing: next,
      serviceInterests: next ? [] : prev.serviceInterests,
    }));
  };

  const toggleChallenge = (o: string) => {
    const has = data.mainChallenges.includes(o);
    setData((prev) => ({
      ...prev,
      mainChallenges: has ? prev.mainChallenges.filter((x) => x !== o) : [...prev.mainChallenges, o],
      stillExploring: false,
    }));
  };

  const toggleExploring = () => {
    const next = !data.stillExploring;
    setData((prev) => ({
      ...prev,
      stillExploring: next,
      mainChallenges: next ? [] : prev.mainChallenges,
    }));
  };

  const goNext = () => {
    if (step === 1 && data.serviceInterests.length === 0 && !data.needsHelpChoosing) {
      setError("Please select at least one solution before continuing.");
      return;
    }
    if (step === 2 && data.mainChallenges.length === 0 && !data.stillExploring) {
      setError("Please select at least one challenge before continuing.");
      return;
    }
    setError("");
    setStep(step + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
            <fieldset>
              <legend className="mb-3 text-[15px] font-bold text-navy">
                Which solutions are you interested in? Select all that apply. *
              </legend>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {solutionOptions.map((o) => {
                  const selected = data.serviceInterests.includes(o);
                  return (
                    <button
                      key={o}
                      type="button"
                      role="checkbox"
                      aria-checked={selected}
                      onClick={() => toggleSolution(o)}
                      className={`flex items-center justify-between gap-2 rounded-lg border-2 px-4 py-3 text-left text-[14px] font-medium transition-colors ${
                        selected
                          ? "border-gold bg-gold/10 text-navy"
                          : "border-navy/15 bg-white text-ink/70 hover:border-gold"
                      }`}
                    >
                      <span>{o}</span>
                      <span
                        aria-hidden="true"
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                          selected ? "border-gold bg-gold text-navy" : "border-navy/20 bg-white text-transparent"
                        }`}
                      >
                        <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <span className="sr-only">{selected ? "Selected" : ""}</span>
                    </button>
                  );
                })}
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={data.needsHelpChoosing}
                  onClick={toggleHelp}
                  className={`flex items-center justify-between gap-2 rounded-lg border-2 px-4 py-3 text-left text-[14px] font-medium transition-colors sm:col-span-2 ${
                    data.needsHelpChoosing
                      ? "border-gold bg-gold/10 text-navy"
                      : "border-navy/15 bg-white text-ink/70 hover:border-gold"
                  }`}
                >
                  <span>{helpOption}</span>
                  <span
                    aria-hidden="true"
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                      data.needsHelpChoosing ? "border-gold bg-gold text-navy" : "border-navy/20 bg-white text-transparent"
                    }`}
                  >
                    <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="sr-only">{data.needsHelpChoosing ? "Selected" : ""}</span>
                </button>
              </div>
            </fieldset>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <fieldset>
              <legend className="mb-3 text-[15px] font-bold text-navy">
                What are your biggest challenges? Select all that apply. *
              </legend>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {challengeOptions.map((o) => {
                  const selected = data.mainChallenges.includes(o);
                  return (
                    <button
                      key={o}
                      type="button"
                      role="checkbox"
                      aria-checked={selected}
                      onClick={() => toggleChallenge(o)}
                      className={`flex items-center justify-between gap-2 rounded-lg border-2 px-4 py-3 text-left text-[14px] font-medium transition-colors ${
                        selected
                          ? "border-gold bg-gold/10 text-navy"
                          : "border-navy/15 bg-white text-ink/70 hover:border-gold"
                      }`}
                    >
                      <span>{o}</span>
                      <span
                        aria-hidden="true"
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                          selected ? "border-gold bg-gold text-navy" : "border-navy/20 bg-white text-transparent"
                        }`}
                      >
                        <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <span className="sr-only">{selected ? "Selected" : ""}</span>
                    </button>
                  );
                })}
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={data.stillExploring}
                  onClick={toggleExploring}
                  className={`flex items-center justify-between gap-2 rounded-lg border-2 px-4 py-3 text-left text-[14px] font-medium transition-colors sm:col-span-2 ${
                    data.stillExploring
                      ? "border-gold bg-gold/10 text-navy"
                      : "border-navy/15 bg-white text-ink/70 hover:border-gold"
                  }`}
                >
                  <span>{exploringOption}</span>
                  <span
                    aria-hidden="true"
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                      data.stillExploring ? "border-gold bg-gold text-navy" : "border-navy/20 bg-white text-transparent"
                    }`}
                  >
                    <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="sr-only">{data.stillExploring ? "Selected" : ""}</span>
                </button>
              </div>
            </fieldset>
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

      {error && (
        <p role="alert" className="mb-4 text-[13px] text-alert">{error}</p>
      )}

      <div className="flex gap-3">
        {step > 0 && (
          <button type="button" onClick={() => setStep(step - 1)} className="btn-outline flex-1 text-[14px]">
            ← Back
          </button>
        )}
        {step < steps.length - 1 ? (
          <button type="button" onClick={goNext} className="btn-primary flex-1 text-[14px]">
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