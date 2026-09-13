"use client";

import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import FaqAccordion from "@/components/FaqAccordion";
import Countdown from "@/components/Countdown";
import AgentApplicationForm from "@/components/AgentApplicationForm";

const methods = [
  {
    number: "01",
    title: "Door-to-Door",
    text: "Visit transport companies, bus operators and other organisations that operate vehicles.",
  },
  {
    number: "02",
    title: "Facebook and WhatsApp",
    text: "Reach customers through Facebook, WhatsApp Status and direct messages.",
  },
  {
    number: "03",
    title: "Cold Calling",
    text: "Call vehicle-operating businesses and arrange follow-up conversations.",
  },
  {
    number: "04",
    title: "Referrals and Connections",
    text: "Vehicle owners, friends and business contacts who can introduce you to customers.",
  },
];

const earnSteps = [
  { title: "Find a customer", text: "You find an individual or business that needs GPS tracking." },
  { title: "Register the customer", text: "You register the customer using your unique Wazambi Agent Code." },
  { title: "We install", text: "The customer pays Wazambi GPS, and our team completes the installation." },
  { title: "You earn commission", text: "After payment and installation are verified, your commission is recorded in your agent account." },
];

const kit = [
  "Two full days of practical sales training",
  "Wazambi GPS product training",
  "Sales scripts and customer presentation guidance",
  "A unique Wazambi Agent Code",
  "Access to the Wazambi Agent Platform",
  "Customer registration and progress tracking",
  "Commission and payout tracking",
  "Continued support from the Wazambi team",
];

const forYou = [
  "You are confident speaking to people",
  "You are willing to visit or call businesses",
  "You have a smartphone and internet access",
  "You can use Facebook and WhatsApp",
  "You are serious about commission-based selling",
  "You can attend both training days",
  "You are prepared to work without constant supervision",
];

const notForYou = [
  "You are looking for a fixed salary",
  "You expect customers to be given to you",
  "You are unwilling to make calls or approach people",
  "You cannot attend the complete training",
  "You are not ready to follow Wazambi's rules",
  "You only want an agent code but do not plan to sell",
];

const selection = [
  { title: "Apply", text: "Complete the online application." },
  { title: "Qualify", text: "Answer questions about your experience, availability and plan for finding customers." },
  { title: "Get Reviewed", text: "The Wazambi team reviews applications and contacts shortlisted applicants." },
  { title: "Sign the Agreement", text: "Successful applicants receive the Wazambi GPS Agent Partner Agreement." },
  { title: "Attend Training", text: "Attend both training days on 1–2 October 2026." },
  { title: "Become an Agent", text: "After completing training, receive your agent code and platform access." },
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

export default function AgentsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-paper pt-[160px] pb-16 md:pt-[170px] md:pb-24">
        <div className="container-wz">
          <Reveal className="mx-auto max-w-[820px] text-center">
            <p className="eyebrow">Wazambi GPS Agent Program · Two Days · In Person</p>
            <h1 className="mt-4 headline text-[30px] md:text-[44px]">
              What if your phone and connections could help you earn commission every month?
            </h1>
            <p className="mx-auto mt-5 max-w-[620px] text-[16px] font-light text-ink/70 md:text-[18px]">
              Wazambi GPS is selecting only <strong className="font-semibold text-navy">100 independent sales agents</strong> across Zambia for a two-day live training on 1–2 October 2026.
            </p>
            <div className="mt-10">
              <Countdown />
              <p className="mt-2 text-[12px] font-medium uppercase tracking-wide text-alert">
                Applications close on 20 September 2026
              </p>
            </div>
            <div className="mt-8">
              <a href="#apply" className="btn-primary">See if I Qualify →</a>
            </div>
            <p className="mx-auto mt-6 max-w-[520px] text-[12px] font-light text-ink/55">
              This is an independent, commission-based opportunity — not salaried employment.
              Earnings depend on verified sales and are not guaranteed.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Opportunity */}
      <section className="bg-navy py-20 md:py-24">
        <div className="container-wz grid items-center gap-12 md:grid-cols-2">
          <Reveal direction="left">
            <p className="eyebrow text-gold">The Opportunity</p>
            <h2 className="mt-3 headline text-[26px] text-white md:text-[36px]">
              Most people have connections. Very few turn those connections into income.
            </h2>
            <p className="mt-5 text-[15px] font-light leading-relaxed text-white/75 md:text-[17px]">
              Vehicle owners lose money through theft, fuel misuse and unauthorised trips.
              Wazambi GPS helps them protect and control their vehicles. You find the customer.
              We install the GPS. You earn commission.
            </p>
            <a href="#apply" className="btn-primary mt-8 inline-block">Apply for One of 100 Agent Places →</a>
          </Reveal>
          <Reveal direction="right" delay={150}>
            <div className="relative w-full" style={{ aspectRatio: "1200/700" }}>
              <Image src="/images/agents/agents.jpg" alt="Wazambi agents" fill className="object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Sales methods */}
      <section className="bg-paper py-20 md:py-24">
        <div className="container-wz">
          <SectionHeading
            eyebrow="Four Ways to Find Your Customers"
            title="The four sales methods."
            subline="Practical methods taught during the training and proven in the field."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-4">
            {methods.map((m, i) => (
              <Reveal key={m.number} delay={i * 80}>
                <div className="h-full rounded-[14px] bg-white p-6 shadow-card">
                  <span className="font-poppins text-[40px] font-black text-electric-blue">{m.number}</span>
                  <h3 className="mt-2 text-[16px] font-bold uppercase text-navy">{m.title}</h3>
                  <p className="mt-2 text-[14px] font-light text-ink/65">{m.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How you earn */}
      <section className="bg-white py-20 md:py-24">
        <div className="container-wz">
          <SectionHeading
            eyebrow="How You Earn"
            title="You find the customer. We install the GPS. You earn."
            subline="A clear process from finding a customer to receiving your commission."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-4">
            {earnSteps.map((s, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="relative h-full rounded-[14px] bg-paper p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-electric-blue text-[18px] font-black text-white">
                    {i + 1}
                  </div>
                  <h3 className="text-[15px] font-bold uppercase text-navy">{s.title}</h3>
                  <p className="mt-2 text-[14px] font-light text-ink/65">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Agent kit */}
      <section className="bg-paper py-20 md:py-24">
        <div className="container-wz">
          <SectionHeading
            eyebrow="Your Kit"
            title="What selected agents receive."
          />
          <div className="mx-auto mt-12 grid max-w-[800px] gap-3 sm:grid-cols-2">
            {kit.map((item, i) => (
              <Reveal key={i} delay={i * 40}>
                <div className="flex items-start gap-3">
                  <svg className="mt-1 h-5 w-5 shrink-0 text-electric-blue" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[15px] text-ink/75">{item}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Who this is for */}
      <section className="bg-white py-20 md:py-24">
        <div className="container-wz grid gap-10 md:grid-cols-2">
          <Reveal>
            <div className="rounded-[14px] bg-paper p-8">
              <h3 className="text-[20px] font-extrabold uppercase text-navy">This is for you if:</h3>
              <ul className="mt-5 space-y-3">
                {forYou.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[15px] text-ink/75">
                    <span className="mt-1 font-bold text-electric-blue">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="rounded-[14px] bg-navy p-8 text-white">
              <h3 className="text-[20px] font-extrabold uppercase text-gold">This is not for you if:</h3>
              <ul className="mt-5 space-y-3">
                {notForYou.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[15px] text-white/80">
                    <span className="mt-1 font-bold text-alert">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Selection */}
      <section className="bg-paper py-20 md:py-24">
        <div className="container-wz">
          <SectionHeading
            eyebrow="Selection"
            title="How the selection process works."
            subline="Applying does not guarantee selection. Only the strongest 100 applicants will be accepted."
          />
          <div className="mt-14 grid gap-5 md:grid-cols-3 lg:grid-cols-6">
            {selection.map((s, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="h-full rounded-[12px] bg-white p-5 text-center">
                  <span className="font-poppins text-[32px] font-black text-gold">{i + 1}</span>
                  <h3 className="mt-1 text-[14px] font-bold uppercase text-navy">{s.title}</h3>
                  <p className="mt-2 text-[12px] font-light text-ink/60">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Application */}
      <section id="apply" className="bg-white py-20 md:py-24">
        <div className="container-wz">
          <SectionHeading
            eyebrow="Application"
            title="See if you qualify."
            subline="Complete the application honestly. Your answers will help us select the 100 people most likely to succeed."
          />
          <div className="mx-auto mt-10 max-w-[640px] rounded-lg bg-paper p-5 text-center">
            <p className="text-[13px] font-light text-ink/70">
              <strong className="font-semibold text-alert">We are not accepting everyone.</strong>{" "}
              Only the strongest 100 applicants will receive the Agent Partner Agreement and an
              invitation to training.
            </p>
          </div>
          <Reveal className="mt-12" delay={100}>
            <AgentApplicationForm />
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-paper py-20 md:py-24">
        <div className="container-wz">
          <SectionHeading eyebrow="Questions" title="Frequently asked questions." />
          <div className="mt-10">
            <FaqAccordion items={agentFaqs} section="agents-faq" />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-navy py-16 md:py-20">
        <div className="container-wz text-center max-w-[600px]">
          <Reveal>
            <h2 className="headline text-[26px] text-white md:text-[36px]">
              0 agent places. One opportunity to build a new income stream.
            </h2>
            <div className="mt-8">
              <Countdown />
            </div>
            <p className="mt-3 text-[13px] font-medium uppercase tracking-wide text-gold">
              Applications close on 20 September 2026
            </p>
            <a href="#apply" className="btn-primary mt-8 inline-block">See if I Qualify →</a>
          </Reveal>
        </div>
      </section>
    </>
  );
}