"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import FaqAccordion from "@/components/FaqAccordion";
import AgentApplicationForm from "@/components/AgentApplicationForm";
import { site } from "@/lib/content";

const explainers = [
  {
    title: "Who can apply",
    text: "18 years or older, owns a smartphone, and is serious about commission-based selling.",
    icon: (
      <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.8" className="h-6 w-6">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "What agents do",
    text: "Find vehicle owners and fleets that need GPS tracking. We install. You earn.",
    icon: (
      <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.8" className="h-6 w-6">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3v18M3 12h18" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "How agents find customers",
    text: "Door-to-door, Facebook, WhatsApp, cold calls and referrals — all taught in training.",
    icon: (
      <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.8" className="h-6 w-6">
        <circle cx="11" cy="11" r="7" />
        <path d="M16 16l5 5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Support Wazambi provides",
    text: "Two days of training, sales scripts, your agent platform, a unique code and ongoing help.",
    icon: (
      <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.8" className="h-6 w-6">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4.5" />
        <path d="M9 3.7c2.8 1 4.5 3.4 4.5 6.3m0 4c0 2.9-1.7 5.3-4.5 6.3m6-15.2c-2.8 1-4.5 3.4-4.5 6.3m0 2.6c0 2.9 1.7 5.3 4.5 6.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "How selection works",
    text: "Apply, qualify, get reviewed, sign the agreement and attend both training days.",
    icon: (
      <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.8" className="h-6 w-6">
        <rect x="6" y="3" width="12" height="18" rx="2" />
        <path d="M9 8h6M9 12h6M9 16h4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "After acceptance",
    text: "Receive your agent code and platform access, then start registering customers and earning.",
    icon: (
      <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.8" className="h-6 w-6">
        <circle cx="12" cy="9" r="6" />
        <path d="M8.5 14L7 21l5-2.5L17 21l-1.5-7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const agentFaqs = [
  { question: "Is this a salaried job?", answer: "No. This is an independent, commission-based agent opportunity." },
  { question: "Do I need sales experience?", answer: "Experience is helpful, but serious applicants who can communicate well and are willing to learn may still qualify." },
  { question: "Will Wazambi give me customers?", answer: "No. Agents are responsible for finding their own customers using the methods taught during training." },
  { question: "When do I receive my commission?", answer: "Your commission is recorded after the customer pays and the installation is verified. Withdrawal becomes available after reaching the required verified installations." },
  { question: "Must I attend both training days?", answer: "Yes. Applicants who cannot attend the complete training should not apply." },
  { question: "Does applying guarantee acceptance?", answer: "No. Applications are reviewed, and only 100 people will be selected." },
  { question: "Do I need to pay to apply?", answer: "No. Applying to become a Wazambi GPS Agent is free." },
];

function FounderVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  return (
    <div className="relative w-full overflow-hidden rounded-[20px] bg-black shadow-2xl ring-1 ring-gold/40">
      <video
        ref={ref}
        src={site.agentsVideo.url}
        poster={site.agentsVideo.poster}
        controls
        playsInline
        preload="none"
        className="aspect-video w-full object-cover"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      {!playing && (
        <button
          type="button"
          aria-label="Play the founder welcome video"
          onClick={() => ref.current?.play()}
          className="pointer-events-none absolute inset-0 flex items-center justify-center bg-navy/30"
        >
          <span className="pointer-events-auto flex h-20 w-20 items-center justify-center rounded-full bg-gold text-navy shadow-xl transition-transform hover:scale-105 md:h-24 md:w-24">
            <svg className="ml-1 h-8 w-8 md:h-9 md:w-9" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6.3 2.84A1.5 1.5 0 008.3 4.1l10 5.9a1.5 1.5 0 010 2.6l-10 5.9a1.5 1.5 0 01-2.3-1.3V3.74a1.5 1.5 0 01.3-.9z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}

export default function AgentsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy pt-[110px] pb-16 md:pt-[130px] md:pb-20">
        <div className="pointer-events-none absolute -right-32 top-0 h-[420px] w-[420px] rounded-full bg-wazambi-gold/15 blur-[120px]" />
        <div className="container-wz grid items-center gap-12 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="eyebrow text-wazambi-gold">
              <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-wazambi-gold align-middle" />
              Wazambi GPS Agent Program · Two Days · In Person
            </p>
            <h1 className="mt-5 headline text-[30px] leading-[1.15] text-white md:text-[46px]">
              What if your phone and your connections could help you{" "}
              <span className="text-wazambi-gold">earn commission</span> every month?
            </h1>
            <p className="mt-5 max-w-[560px] text-[16px] font-light text-white/75 md:text-[18px]">
              Wazambi GPS is selecting only{" "}
              <strong className="font-semibold text-white">100 independent sales agents</strong> across
              Zambia for a two-day live training on 1–2 October 2026.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a href="#apply" className="btn-primary">
                See if I Qualify →
              </a>
              <a
                href="#watch"
                className="inline-flex items-center gap-2 rounded-full border border-wazambi-gold/60 px-7 py-3 text-[14px] font-bold uppercase tracking-wide text-wazambi-gold transition-colors hover:bg-wazambi-gold hover:text-navy"
              >
                Watch the Video
              </a>
            </div>
            <p className="mt-6 max-w-[560px] text-[12px] font-light text-white/55">
              This is an independent, commission-based opportunity — not salaried employment.
              Earnings depend on verified sales and are not guaranteed.
            </p>
          </div>
          <div className="relative mt-6 md:mt-0">
            <div className="overflow-hidden rounded-[18px] ring-1 ring-wazambi-gold/50">
              <Image
                src="/images/agents/agents.jpg"
                alt="Wazambi GPS agent program"
                width={900}
                height={560}
                className="h-auto w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 left-5 rounded-full bg-wazambi-gold px-5 py-2 text-[12px] font-bold uppercase tracking-wide text-navy shadow-lg">
              100 Agent Places · In-Person Training
            </div>
            <div className="absolute right-4 top-4 rounded-full border border-white/20 bg-navy/60 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur">
              1–2 Oct 2026
            </div>
          </div>
        </div>
      </section>

      {/* Founder welcome video */}
      <section id="watch" className="scroll-mt-24 bg-navy pb-20 md:pb-24">
        <div className="container-wz">
          <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <FounderVideo />
            <div>
              <p className="eyebrow text-wazambi-gold">A Message from the Founder</p>
              <h2 className="mt-3 headline text-[24px] text-white md:text-[34px]">
                Watch this before you apply.
              </h2>
              <p className="mt-4 max-w-[520px] text-[15px] font-light leading-relaxed text-white/75">
                In this short video, the Wazambi founder explains what the agent program is, who it is
                for, and the four-step system agents use to turn their connections into customers.
              </p>
              <p className="mt-4 max-w-[520px] text-[14px] font-light leading-relaxed text-white/65">
                If this does not match how you want to work, this program is probably not for you. If
                it does, follow the next section and apply.
              </p>
              <a href="#apply" className="btn-primary mt-7 inline-block">
                Start My Agent Application →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How the program works */}
      <section className="bg-white py-20 md:py-24">
        <div className="container-wz">
          <SectionHeading
            eyebrow="How the Agent Program Works"
            title="Simple to understand."
            highlight="Real earning potential."
            subline="Six short answers to the questions that matter most before you apply."
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {explainers.map((e, i) => (
              <div key={e.title} className="h-full rounded-[16px] border border-navy/10 bg-paper p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-wazambi-gold text-navy">
                  {e.icon}
                </div>
                <h3 className="mt-4 text-[15px] font-bold uppercase tracking-wide text-navy">
                  {e.title}
                </h3>
                <p className="mt-2 text-[14px] font-light leading-relaxed text-ink/70">{e.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application */}
      <section id="apply" className="scroll-mt-24 bg-paper py-20 md:py-24">
        <div className="container-wz">
          <SectionHeading
            eyebrow="Application"
            title="See if you qualify."
            subline="Complete the application honestly. Your answers help us select the 100 people most likely to succeed."
          />
          <div className="mx-auto mt-10 max-w-[640px] rounded-lg border border-alert/20 bg-alert/5 p-5 text-center">
            <p className="text-[13px] font-light text-ink/70">
              <strong className="font-semibold text-alert">We are not accepting everyone.</strong>{" "}
              Only the strongest 100 applicants will receive the Agent Partner Agreement and an
              invitation to training.
            </p>
          </div>
          <div className="mt-12">
            <AgentApplicationForm />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-20 md:py-24">
        <div className="container-wz">
          <SectionHeading eyebrow="Questions" title="Frequently asked questions." />
          <div className="mt-10">
            <FaqAccordion items={agentFaqs} section="agents-faq" />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-navy py-16 md:py-20">
        <div className="container-wz mx-auto max-w-[620px] text-center">
          <p className="eyebrow text-wazambi-gold">Applications close soon</p>
          <h2 className="mt-3 headline text-[26px] text-white md:text-[36px]">
            100 agent places. One chance to build a new income stream.
          </h2>
          <p className="mt-4 text-[15px] font-light text-white/70">
            Your Wazambi Agent Code is issued only after your application is approved.
          </p>
          <a href="#apply" className="btn-primary mt-8 inline-block">
            See if I Qualify →
          </a>
        </div>
      </section>
    </>
  );
}