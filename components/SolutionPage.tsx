"use client";

import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import FaqAccordion from "@/components/FaqAccordion";
import { site, courses, results, faqs, industries } from "@/lib/content";
import type { Solution } from "@/lib/content";

type SolutionPageProps = {
  solution: Solution;
};

const solutionFaqs: Record<string, string[]> = {
  "gps-tracking": [
    "What is Wazambi GPS?",
    "How does GPS tracking work?",
    "Can I monitor vehicles from my phone?",
    "Does Wazambi work outside Zambia?",
    "Can I view completed journeys?",
    "How do geofences work?",
    "How does remote immobilisation work?",
    "How long does installation take?",
  ],
  "fuel-monitoring": [
    "What is Wazambi GPS?",
    "Can Wazambi monitor fuel?",
    "Can I view completed journeys?",
    "How do I request a quotation?",
    "How long does installation take?",
    "Does Wazambi provide technical support?",
  ],
  "fleet-management": [
    "What is Wazambi GPS?",
    "How does GPS tracking work?",
    "Can Wazambi monitor cross-border vehicles?",
    "How do geofences work?",
    "How do I request a quotation?",
    "Does Wazambi provide technical support?",
  ],
};

const benefits = [
  "Know exactly where your vehicles are",
  "Stop losing money through hidden problems",
  "Make decisions with real records, not assumptions",
  "Get alerts immediately, not the next day",
  "Protect your vehicles and your business",
  "Manage everything from your phone",
];

type SolutionAccent = Solution["accent"];

const accents: Record<
  SolutionAccent,
  {
    dot: string;
    chip: string;
    bar: string;
    ring: string;
    glow: string;
    tab: string;
  }
> = {
  blue: {
    dot: "bg-electric-blue",
    chip: "border-electric-blue/30 bg-electric-blue/10 text-[#8FB3FF]",
    bar: "border-electric-blue",
    ring: "ring-electric-blue/40",
    glow: "bg-[radial-gradient(circle_at_30%_20%,rgba(30,94,255,0.35),transparent_60%)]",
    tab: "bg-electric-blue",
  },
  flame: {
    dot: "bg-flame",
    chip: "border-flame/30 bg-flame/10 text-[#FFA14D]",
    bar: "border-flame",
    ring: "ring-flame/40",
    glow: "bg-[radial-gradient(circle_at_70%_15%,rgba(255,122,0,0.3),transparent_60%)]",
    tab: "bg-flame",
  },
  steel: {
    dot: "bg-[#2C4A88]",
    chip: "border-[#2C4A88]/40 bg-[#2C4A88]/20 text-[#A9C0E8]",
    bar: "border-[#2C4A88]",
    ring: "ring-[#2C4A88]/40",
    glow: "bg-[radial-gradient(circle_at_40%_25%,rgba(44,74,136,0.5),transparent_60%)]",
    tab: "bg-[#2C4A88]",
  },
};

export default function SolutionPage({ solution }: SolutionPageProps) {
  const a = accents[solution.accent];
  const relatedCourse = courses.find((c) => c.slug === solution.slug);
  const relatedFaqTitles = solutionFaqs[solution.slug] ?? [];
  const relatedFaqs = faqs.filter((f) => relatedFaqTitles.includes(f.question));
  const relatedResult = results.find((r) => r.industry.toLowerCase().includes(solution.slug.split("-")[0])) ?? results[0];
  const relatedIndustries = industries.slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy pt-[120px] pb-14 md:pt-[140px] md:pb-20">
        <div aria-hidden className={`pointer-events-none absolute inset-0 ${a.glow}`} />
        <div className="container-wz relative grid items-center gap-10 md:grid-cols-[1fr_38%]">
          <Reveal>
            <p className="eyebrow text-gold">
              <span className={`mr-2 inline-block h-2 w-2 rounded-full ${a.dot}`} />
              Wazambi {solution.title}
            </p>
            <h1 className="mt-3 headline text-[32px] text-white md:text-[44px]">
              {solution.fullHeadline}
            </h1>
            <p className="mt-5 max-w-[560px] text-[16px] font-light text-white/80 md:text-[18px]">
              {solution.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {solution.features.slice(0, 4).map((f) => (
                <span
                  key={f}
                  className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide ${a.chip}`}
                >
                  {f}
                </span>
              ))}
            </div>
            <div className="mt-7 flex flex-col gap-4 sm:flex-row">
              <Link href="/fleet-assessment" className="btn-primary w-full sm:w-auto">
                Get a Free Fleet Assessment
              </Link>
              <Link
                href={`#features`}
                className="btn-outline w-full border-white text-white hover:bg-white hover:text-navy sm:w-auto"
              >
                See Features
              </Link>
            </div>
          </Reveal>
          <Reveal direction="right" delay={200}>
            <div
              className={`relative mx-auto w-full overflow-hidden rounded-[20px] ring-4 ${a.ring}`}
              style={{ aspectRatio: "520/460" }}
            >
              <Image src={solution.image} alt={solution.title} fill className="object-cover" sizes="38vw" />
              <span
                className={`absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[11px] font-bold uppercase tracking-wide text-white shadow-lg ${a.tab}`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
                {solution.kicker}
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Problem */}
      <section className="bg-paper py-16 md:py-20">
        <div className="container-wz max-w-[800px] text-center">
          <SectionHeading
            eyebrow="The Problem"
            title="Most vehicle owners cannot see what is actually happening."
            subline="Without real records and live visibility, every fleet decision is based on guesswork — and guesswork is expensive."
          />
        </div>
      </section>

      {/* Education */}
      <section id="features" className="bg-white py-16 md:py-20">
        <div className="container-wz">
          <SectionHeading
            eyebrow="How It Works"
            title={`${solution.title} gives you the records you need to make the right decisions.`}
            subline="Every vehicle sends information to your Wazambi platform in real time — so you always know what is happening."
          />
          <div className="mx-auto mt-8 grid max-w-[1000px] gap-6 md:grid-cols-2">
            {solution.features.map((f, i) => (
              <Reveal key={f} delay={i * 25}>
                <div className={`flex items-start gap-4 rounded-[10px] border-l-4 bg-paper p-5 ${a.bar}`}>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-wazambi-gold text-[16px] font-black text-navy">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-[15px] font-bold text-navy">{f}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-paper py-16 md:py-20">
        <div className="container-wz">
          <SectionHeading
            eyebrow="Benefits"
            title="What you get with Wazambi."
            subline="More than software — a complete system for protecting and controlling your vehicles."
          />
          <div className="mx-auto mt-8 grid max-w-[800px] gap-3 sm:grid-cols-2">
            {benefits.map((b, i) => (
              <Reveal key={i} delay={i * 25}>
                <div className="flex items-start gap-3">
                  <svg className="mt-1 h-5 w-5 shrink-0 text-wazambi-gold-deep" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[15px] text-ink/75">{b}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Installation */}
      <section className="bg-white py-16 md:py-20">
        <div className="container-wz text-center">
          <SectionHeading
            eyebrow="Installation"
            title="Professional installation — usually within one hour."
            subline="Our trained technicians install the equipment on your vehicles, test everything and show you how to use your platform before they leave."
          />
          <Reveal className="mt-8">
            <Link href="/fleet-assessment" className="btn-primary">
              Book an Installation
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Industries */}
      <section className="bg-paper py-16 md:py-20">
        <div className="container-wz">
          <SectionHeading
            eyebrow="Who We Help"
            title={`Wazambi ${solution.title} works for every fleet.`}
            subline="From a single vehicle to hundreds — the same system applies."
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {relatedIndustries.map((item, i) => (
              <Reveal key={i} delay={i * 25}>
                <div className="rounded-[10px] bg-white p-5">
                  <p className="text-[14px] font-bold uppercase text-navy">{item.title}</p>
                  <p className="mt-1 text-[13px] font-light text-ink/60">{item.problem}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Result */}
      <section className="bg-white py-16 md:py-20">
        <div className="container-wz">
          <SectionHeading
            eyebrow="Customer Results"
            title="Real fleets. Real problems. Better control."
          />
          <Reveal className="mx-auto mt-8 max-w-[800px]" delay={100}>
            <div className="flex flex-col overflow-hidden rounded-[14px] bg-paper md:flex-row">
              <div className="relative w-full shrink-0 md:w-[280px]">
                <Image
                  src={relatedResult.image}
                  alt={relatedResult.customer}
                  fill
                  className="object-cover"
                  sizes="280px"
                />
              </div>
              <div className="p-8">
                <p className="text-[12px] font-semibold uppercase tracking-wide text-wazambi-gold-deep">{relatedResult.industry}</p>
                <p className="mt-1 text-[16px] font-bold text-navy">{relatedResult.company}</p>
                <p className="mt-3 text-[14px] font-light leading-relaxed text-ink/65">{relatedResult.problem}</p>
                <p className="mt-2 text-[14px] font-semibold text-ink/85">{relatedResult.result}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Free Course */}
      {relatedCourse && (
        <section className="bg-paper py-16 md:py-20">
          <div className="container-wz text-center">
            <SectionHeading
              eyebrow="Free Course"
              title={`Learn more about ${solution.title.toLowerCase()}.`}
              subline="Watch a free practical lesson and receive a downloadable guide."
            />
            <Reveal className="mx-auto mt-8 max-w-[320px]" delay={100}>
              <div className="flex flex-col rounded-[14px] bg-white p-7 shadow-card">
                <div className="relative mx-auto mb-5 w-full" style={{ aspectRatio: "520/460" }}>
                  <Image src={relatedCourse.image} alt={relatedCourse.title} fill className="object-cover" />
                </div>
                <h3 className="text-[17px] font-bold uppercase text-navy">{relatedCourse.title}</h3>
                <p className="mt-2 text-[14px] font-light text-ink/65">{relatedCourse.headline}</p>
                <Link href={`/academy/${relatedCourse.slug}`} className="btn-primary mt-5 w-full text-center">
                  Start Free Course
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="bg-white py-16 md:py-20">
        <div className="container-wz">
          <SectionHeading
            eyebrow="Frequently Asked Questions"
            title={`Questions about ${solution.title.toLowerCase()}.`}
          />
          <div className="mt-8">
            <FaqAccordion items={relatedFaqs} section={`${solution.slug}-faq`} />
          </div>
        </div>
      </section>

      {/* Assessment */}
      <section className="bg-paper py-16 md:py-20">
        <div className="container-wz text-center">
          <SectionHeading
            eyebrow="Free Assessment"
            title="Find the right solution for your fleet."
            subline="Complete a free fleet assessment and the Wazambi team will recommend the best solution based on your vehicles and challenges."
          />
          <Reveal className="mt-7">
            <Link href="/fleet-assessment" className="btn-primary">
              Get a Free Fleet Assessment
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-navy py-16 md:py-20">
        <div className="container-wz text-center">
          <Reveal>
            <h2 className="headline text-[28px] text-white md:text-[38px]">
              Stop guessing what your vehicles are doing.
            </h2>
            <p className="mx-auto mt-5 max-w-[660px] text-[16px] font-light text-white/75 md:text-[18px]">
              Tell us about your vehicles and Wazambi will recommend the right {solution.title.toLowerCase()} solution.
            </p>
            <div className="mt-7 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/fleet-assessment" className="btn-primary w-full sm:w-auto">
                Get My Free Assessment
              </Link>
              <a
                href={`https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(site.whatsapp.message)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline w-full border-white text-white hover:bg-white hover:text-navy sm:w-auto"
              >
                Chat with Wazambi
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}