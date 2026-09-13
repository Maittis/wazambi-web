"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Reveal from "@/components/Reveal";

type Props = {
  courseCode: string;
  guideName: string;
  courseUrl: string;
};

const steps = [
  { label: "Name", fields: ["firstName", "lastName"] as const },
  { label: "Email", fields: ["email"] as const },
  { label: "Phone", fields: ["phone"] as const },
  { label: "Company", fields: ["company", "position"] as const },
  { label: "Fleet Size", fields: ["fleetSize"] as const },
  { label: "Challenge", fields: ["mainChallenge"] as const },
];

const fleetSizeOptions = ["1-4", "5-10", "11-20", "21-50", "50+"];
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

export default function MultiStepLeadForm({ courseCode, guideName, courseUrl }: Props) {
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
    position: "",
    fleetSize: "",
    mainChallenge: "",
    consent: true,
  });

  const current = steps[step];
  const progress = Math.round(((step + 1) / steps.length) * 100);
  const totalSteps = steps.length;

  const set = (field: string, value: string | boolean) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const next = () => {
    if (step < steps.length - 1) setStep(step + 1);
  };

  const back = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, courseCode, courseUrl }),
      });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error || "Something went wrong");
      }
      router.push(`/academy/thank-you?course=${courseCode}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto max-w-[520px]">
      <div className="mb-6 flex items-center justify-between text-[13px] font-medium text-ink/60">
        <span>Step {step + 1} of {totalSteps}</span>
        <span>{progress}% complete</span>
      </div>
      <div className="mb-8 h-2 w-full rounded-full bg-navy/10">
        <div
          className="h-2 rounded-full bg-electric-blue transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="min-h-[320px]">
        {step === 0 && (
          <Fields>
            <label className="text-[14px] font-medium text-ink/75">
              First Name *
              <input type="text" value={data.firstName} onChange={(e) => set("firstName", e.target.value)} className="mt-1.5 block w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-[15px] outline-none focus:border-electric-blue" required />
            </label>
            <label className="text-[14px] font-medium text-ink/75">
              Last Name *
              <input type="text" value={data.lastName} onChange={(e) => set("lastName", e.target.value)} className="mt-1.5 block w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-[15px] outline-none focus:border-electric-blue" required />
            </label>
          </Fields>
        )}

        {step === 1 && (
          <Fields>
            <label className="text-[14px] font-medium text-ink/75">
              Email Address *
              <input type="email" value={data.email} onChange={(e) => set("email", e.target.value)} className="mt-1.5 block w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-[15px] outline-none focus:border-electric-blue" required />
            </label>
          </Fields>
        )}

        {step === 2 && (
          <Fields>
            <label className="text-[14px] font-medium text-ink/75">
              Phone Number *
              <input type="tel" value={data.phone} onChange={(e) => set("phone", e.target.value)} className="mt-1.5 block w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-[15px] outline-none focus:border-electric-blue" required />
            </label>
            <p className="mt-1 text-[12px] text-ink/50">Zambia +260 is selected by default.</p>
          </Fields>
        )}

        {step === 3 && (
          <Fields>
            <label className="text-[14px] font-medium text-ink/75">
              Company / Organisation
              <input type="text" value={data.company} onChange={(e) => set("company", e.target.value)} className="mt-1.5 block w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-[15px] outline-none focus:border-electric-blue" />
            </label>
            <label className="text-[14px] font-medium text-ink/75">
              Position
              <input type="text" value={data.position} onChange={(e) => set("position", e.target.value)} className="mt-1.5 block w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-[15px] outline-none focus:border-electric-blue" />
            </label>
          </Fields>
        )}

        {step === 4 && (
          <Fields>
            <p className="mb-3 text-[15px] font-bold text-navy">How many vehicles do you manage? *</p>
            <div className="grid grid-cols-2 gap-2">
              {fleetSizeOptions.map((o) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => set("fleetSize", o)}
                  className={`rounded-lg border px-4 py-3 text-[14px] font-medium transition-colors ${
                    data.fleetSize === o
                      ? "border-electric-blue bg-electric-blue text-white"
                      : "border-navy/15 bg-white text-ink/70 hover:border-electric-blue"
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
          </Fields>
        )}

        {step === 5 && (
          <Fields>
            <p className="mb-3 text-[15px] font-bold text-navy">What is your biggest fleet challenge? *</p>
            <div className="grid grid-cols-2 gap-2">
              {challengeOptions.map((o) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => set("mainChallenge", o)}
                  className={`rounded-lg border px-4 py-3 text-[14px] font-medium transition-colors ${
                    data.mainChallenge === o
                      ? "border-electric-blue bg-electric-blue text-white"
                      : "border-navy/15 bg-white text-ink/70 hover:border-electric-blue"
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
            <label className="mt-6 flex items-start gap-2 text-[13px] text-ink/65">
              <input
                type="checkbox"
                checked={data.consent}
                onChange={(e) => set("consent", e.target.checked)}
                className="mt-0.5"
              />
              I agree to receive communications from Wazambi GPS. You can unsubscribe at any time.
            </label>
          </Fields>
        )}
      </div>

      {error && <p className="mb-4 text-[13px] text-alert">{error}</p>}

      <div className="flex gap-3">
        {step > 0 && (
          <button type="button" onClick={back} className="btn-outline flex-1 text-[14px]">
            ← Back
          </button>
        )}
        {step < steps.length - 1 ? (
          <button type="button" onClick={next} className="btn-primary flex-1 text-[14px]">
            Continue →
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={sending}
            className="btn-primary flex-1 text-[14px] disabled:opacity-60"
          >
            {sending ? "Sending..." : `Send My Free Guide (${guideName.replace(".pdf", "")})`}
          </button>
        )}
      </div>
    </div>
  );
}

function Fields({ children }: { children: React.ReactNode }) {
  return <div className="space-y-5">{children}</div>;
}