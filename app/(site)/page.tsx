"use client";

import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import FaqAccordion from "@/components/FaqAccordion";
import { useContent } from "@/components/content/useContent";
import {
  hero,
  stats,
  howItWorks,
  site,
  courses,
  results,
  faqs,
} from "@/lib/content";

export default function HomePage() {
  return (
    <>
      <div id="home" />
      <Hero />
      <Stats />
      <Offer />
      <Demo />
      <Academy />
      <CustomerResult />
      <HowItWorks />
      <FaqSection />
      <About />
      <Opportunities />
      <FinalCta />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero — Acquisition.com style: bold headline + face image          */
/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section className="bg-paper">
      <div className="w-full pl-0 pr-0 md:flex md:flex-row md:items-end md:justify-between">
        <div className="hidden w-full md:block md:w-[19%]">
          <Reveal direction="left">
            <div className="relative w-full" style={{ aspectRatio: "1080 / 1623" }}>
              <img
                src="/images/hero/left-fleet.jpg"
                alt="Wazambi GPS vehicle tracking"
                className="absolute inset-0 h-full w-full object-contain"
                loading="eager"
              />
            </div>
          </Reveal>
        </div>

        <div className="w-full px-[15px] pt-[40px] pb-[20px] md:w-[62%] md:self-center md:p-[70px]">
          <Reveal direction="down">
            <div className="mx-auto flex max-w-[810px] flex-col gap-6">
              <h1 className="headline text-center text-[34px] sm:text-[44px] md:text-[40px] lg:text-[50px] xl:text-[58px] 2xl:text-[66px]">
                {hero.headline}
              </h1>
              <h2 className="mx-auto text-center text-[18px] font-normal leading-[1.3] text-ink/80 md:max-w-[600px] md:text-[19px]">
                {hero.subline}
              </h2>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-5 w-full md:mx-auto md:max-w-[420px]">
              <Link
                href={hero.primaryCta.href}
                className="block w-full rounded-[100px] border-[2.5px] border-gold bg-gold px-[10px] py-[16px] text-center font-bold leading-none text-navy transition-all duration-300 hover:bg-white"
              >
                {hero.primaryCta.label}
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="hidden w-full md:block md:w-[18%]">
          <Reveal direction="right">
            <div className="relative w-full" style={{ aspectRatio: "1080 / 1620" }}>
              <img
                src="/images/hero/right-app.jpg"
                alt="Wazambi GPS mobile app"
                className="absolute inset-0 h-full w-full object-contain"
                loading="eager"
              />
            </div>
          </Reveal>
        </div>
      </div>

      <div className="w-full md:hidden">
        <Reveal>
          <div className="relative w-full" style={{ aspectRatio: "1080 / 720" }}>
            <img
              src="/images/hero/mobile-banner.jpg"
              alt="Wazambi GPS fleet tracking"
              className="absolute inset-0 h-full w-full object-contain"
              loading="eager"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Stats — compact Acquisition.com row                               */
/* ------------------------------------------------------------------ */

function Stats() {
  const c = useContent();
  const active = c.stats ?? stats;
  return (
    <section className="border-t border-navy/10 py-6 md:py-8" aria-label="Wazambi results">
      <div className="container-wz">
        <div className="grid grid-cols-2 gap-x-4 gap-y-5 md:grid-cols-4 md:gap-0">
          {active.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 60} className="text-center md:border-r md:last:border-r-0 md:px-4">
              <p className="font-poppins text-[28px] font-extrabold text-navy md:text-[36px]">
                {stat.value}
              </p>
              <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-ink/55 md:text-[12px]">
                {stat.label}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Main offer — Acquisition.com style large card with visual         */
/* ------------------------------------------------------------------ */

function Offer() {
  return (
    <section className="bg-paper py-14 md:py-20">
      <div className="container-wz">
        <div className="overflow-hidden rounded-[20px] bg-navy">
          <div className="grid items-center md:grid-cols-[1fr_1fr]">
            <div className="p-7 md:p-12">
              <span className="inline-block rounded-full bg-gold px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-navy">
                Free Fleet Control Plan
              </span>
              <h2 className="mt-4 headline text-[28px] leading-[1.12] text-white md:text-[38px]">
                Find Out What Your Vehicles Are Costing You.
              </h2>
              <p className="mt-4 text-[15px] font-light leading-[1.7] text-white/75 md:text-[16px]">
                Answer a few questions about your vehicles and receive a clear recommendation
                for improving visibility, fuel control and fleet accountability.
              </p>
              <Link href="/fleet-assessment" className="btn-primary mt-8 inline-block">
                Get My Free Fleet Assessment
              </Link>
            </div>
            <div className="relative hidden bg-navy-light md:block">
              <img
                src="/images/solutions/gps.jpg"
                alt="Wazambi GPS live tracking platform"
                className="aspect-[4/3] w-full object-cover opacity-90"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



/* ------------------------------------------------------------------ */
/*  Product demonstration — dark navy video                           */
/* ------------------------------------------------------------------ */

function Demo() {
  return (
    <section className="bg-navy py-14 md:py-20">
      <div className="container-wz">
        <div className="mx-auto max-w-[680px] text-center">
          <p className="eyebrow text-gold">See Wazambi in Action</p>
          <h2 className="mt-3 headline text-[28px] leading-[1.12] text-white md:text-[38px]">
            See Wazambi Work Before You Buy.
          </h2>
          <p className="mt-3 text-[15px] font-light leading-[1.7] text-white/70 md:text-[17px]">
            Watch how Wazambi helps you see where your vehicles are, where they have been
            and what is happening right now.
          </p>
        </div>
        <Reveal className="mx-auto mt-10 max-w-[860px]" delay={100}>
          <a
            href={site.video.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Play the Wazambi demonstration video"
            className="group relative block w-full overflow-hidden rounded-[16px] bg-black"
          >
            <img
              src={site.video.poster}
              alt="Wazambi GPS demonstration video"
              className="aspect-video w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-[1.02]"
              loading="lazy"
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gold text-navy shadow-[0_0_0_8px_rgba(255,196,0,0.2)] transition-transform duration-300 group-hover:scale-110 md:h-24 md:w-24">
                <svg className="ml-1 h-8 w-8 md:h-9 md:w-9" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </span>
          </a>
        </Reveal>
        <Reveal className="mt-8 text-center">
          <Link href="/fleet-assessment" className="btn-primary">
            Book My Free Demonstration
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Free Fleet Academy — Acquisition.com product card style           */
/* ------------------------------------------------------------------ */

function Academy() {
  return (
    <section className="bg-paper py-14 md:py-20">
      <div className="container-wz">
        <div className="mx-auto max-w-[680px] text-center">
          <p className="eyebrow">Free Fleet Academy</p>
          <h2 className="mt-3 headline text-[28px] leading-[1.12] md:text-[38px]">
            Free Fleet Control Training.
          </h2>
          <p className="mt-3 text-[15px] font-light leading-[1.7] text-ink/65 md:text-[17px]">
            Videos, guides and practical lessons to help you protect your vehicles,
            reduce losses and manage your operation better.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {courses.map((course, i) => (
            <Reveal key={course.slug} delay={i * 80}>
              <Link
                href={`/academy/${course.slug}`}
                className="group block overflow-hidden rounded-[16px] bg-white shadow-card transition-shadow hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)]"
              >
                <div className="relative overflow-hidden bg-navy">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-gold px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-navy">
                    {course.badge}
                  </span>
                </div>
                <div className="p-5 md:p-6">
                  <h3 className="text-[18px] font-extrabold uppercase text-navy md:text-[20px]">
                    {course.title}
                  </h3>
                  <p className="mt-2 text-[14px] font-light leading-[1.65] text-ink/65">
                    {course.description}
                  </p>
                  <span className="mt-4 inline-block text-[13px] font-bold uppercase tracking-wide text-electric-blue">
                    Take This Course →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Customer result — one strong story                                */
/* ------------------------------------------------------------------ */

function CustomerResult() {
  return (
    <section className="bg-white py-14 md:py-20">
      <div className="container-wz">
        <div className="mx-auto max-w-[680px] text-center">
          <p className="eyebrow">Customer Results</p>
          <h2 className="mt-3 headline text-[28px] leading-[1.12] md:text-[38px]">
            What Changes When You Can Finally See Your Fleet?
          </h2>
        </div>
        <Reveal className="mt-10 mx-auto max-w-[860px]">
          <article className="overflow-hidden rounded-[18px] bg-paper shadow-card">
            <div className="grid md:grid-cols-[1fr_1.2fr]">
              <div className="relative">
                <img
                  src={results[0].image}
                  alt={results[0].company}
                  className="aspect-[4/3] w-full object-cover md:aspect-auto md:h-full"
                  loading="lazy"
                />
              </div>
              <div className="p-6 md:p-8">
                <p className="text-[12px] font-semibold uppercase tracking-wide text-electric-blue">
                  {results[0].industry}
                </p>
                <h3 className="mt-2 text-[20px] font-extrabold text-navy md:text-[22px]">
                  {results[0].company}
                </h3>
                <div className="mt-5 space-y-4">
                  <div className="rounded-xl bg-white p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-alert">
                      Before Wazambi
                    </p>
                    <p className="mt-1.5 text-[14px] font-light leading-[1.6] text-ink/75">
                      {results[0].problem}
                    </p>
                  </div>
                  <div className="rounded-xl bg-navy p-4 text-white">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-gold">
                      After Wazambi
                    </p>
                    <p className="mt-1.5 text-[14px] font-light leading-[1.6] text-white/85">
                      {results[0].result}
                    </p>
                  </div>
                </div>
                <Link href="/customer-results" className="btn-outline mt-6 w-full text-center">
                  See Customer Results
                </Link>
              </div>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  How Wazambi works — compact four steps                            */
/* ------------------------------------------------------------------ */

function HowItWorks() {
  return (
    <section className="bg-paper py-14 md:py-20">
      <div className="container-wz">
        <div className="mx-auto max-w-[680px] text-center">
          <p className="eyebrow">How It Works</p>
          <h2 className="mt-3 headline text-[28px] leading-[1.12] md:text-[38px]">
            From Your First Call to Complete Vehicle Visibility.
          </h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-4">
          {howItWorks.map((step, i) => (
            <Reveal key={step.title} delay={i * 80}>
              <div className="rounded-[14px] bg-white p-5 shadow-card md:h-full">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-electric-blue text-[15px] font-black text-white">
                  {i + 1}
                </span>
                <h4 className="mt-4 text-[15px] font-extrabold uppercase leading-tight text-navy">
                  {step.title}
                </h4>
                <p className="mt-2 text-[13px] font-light leading-[1.6] text-ink/65">
                  {step.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8 text-center">
          <p className="text-[14px] font-light text-ink/60">
            Continued support is available after installation.
          </p>
          <Link href="/fleet-assessment" className="btn-primary mt-5 inline-block">
            Start My Assessment
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  FAQ — Acquisition.com clean accordion style                       */
/* ------------------------------------------------------------------ */

function FaqSection() {
  const c = useContent();
  const activeFaqs = c.faqs ?? faqs;
  return (
    <section id="faq" className="bg-white py-14 md:py-20">
      <div className="container-wz">
        <div className="mx-auto max-w-[680px] text-center">
          <p className="eyebrow">Questions</p>
          <h2 className="mt-3 headline text-[28px] leading-[1.12] md:text-[38px]">
            Frequently Asked Questions.
          </h2>
        </div>
        <div className="mt-10">
          <FaqAccordion items={activeFaqs} section="homepage-faq" />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  About — Acquisition.com founders style                            */
/* ------------------------------------------------------------------ */

function About() {
  return (
    <section id="about" className="bg-paper py-14 md:py-24">
      <div className="container-wz">
        <div className="mx-auto max-w-[680px] text-center">
          <p className="eyebrow">Our Company</p>
          <h2 className="mt-3 headline text-[28px] leading-[1.12] md:text-[38px]">
            About Wazambi.
          </h2>
        </div>
        <div className="mt-12 grid items-start gap-10 md:grid-cols-[1fr_1.3fr]">
          <Reveal direction="left">
            <div className="relative mx-auto w-full max-w-[460px] overflow-hidden rounded-[18px] bg-navy">
              <img
                src="/images/about/team.jpg"
                alt="The Wazambi GPS team"
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
              />
            </div>
          </Reveal>
          <Reveal direction="right">
            <div className="space-y-4 text-[15px] font-light leading-[1.8] text-ink/80 md:text-[16px]">
              <p>
                Wazambi GPS was built to help vehicle owners and businesses stop depending on
                phone calls, driver explanations and guesswork. We give customers the visibility
                and records they need to manage vehicles with confidence.
              </p>
              <p>
                Our technicians install real equipment on real vehicles across Zambia, and our
                team provides continued support so every system keeps working long after
                installation.
              </p>
              <p>
                Whether you operate one vehicle or a large fleet, Wazambi helps you see the
                truth about your operation — and act on it.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Opportunities                                                     */
/* ------------------------------------------------------------------ */

function Opportunities() {
  return (
    <section className="bg-white py-14 md:py-20">
      <div className="container-wz">
        <div className="mx-auto max-w-[680px] text-center">
          <p className="eyebrow">Opportunities</p>
          <h2 className="mt-3 headline text-[28px] leading-[1.12] md:text-[38px]">
            Grow With Wazambi.
          </h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <Reveal>
            <div className="flex h-full flex-col rounded-[18px] bg-navy p-6 text-white md:p-8">
              <h3 className="text-[20px] font-extrabold uppercase text-gold">
                Become a Wazambi Agent
              </h3>
              <p className="mt-3 flex-1 text-[14px] font-light leading-[1.7] text-white/80">
                Introduce vehicle owners and fleet businesses to Wazambi and earn through
                the official Agent Program.
              </p>
              <Link href="/agents" className="btn-white mt-8 w-full text-center">
                Become an Agent
              </Link>
            </div>
          </Reveal>
          <Reveal>
            <div className="flex h-full flex-col rounded-[18px] bg-paper p-6 md:p-8">
              <h3 className="text-[20px] font-extrabold uppercase text-electric-blue">
                Create Content for Wazambi
              </h3>
              <p className="mt-3 flex-1 text-[14px] font-light leading-[1.7] text-ink/70">
                Create TikTok, Instagram and Facebook videos about Wazambi GPS and earn
                according to the approved performance of your content.
              </p>
              <Link href="/creators" className="btn-primary mt-8 w-full text-center">
                Become a Wazambi Creator
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Final CTA                                                         */
/* ------------------------------------------------------------------ */

function FinalCta() {
  return (
    <section className="bg-navy py-14 md:py-24">
      <div className="container-wz text-center">
        <Reveal>
          <h2 className="headline text-[30px] leading-[1.12] text-white md:text-[44px]">
            Stop Guessing What Your Vehicles Are Doing.
          </h2>
          <p className="mx-auto mt-5 max-w-[600px] text-[15px] font-light leading-[1.7] text-white/70 md:text-[17px]">
            Tell Wazambi about your vehicles and receive a clear recommendation for
            improving visibility, fuel control and fleet accountability.
          </p>
        </Reveal>
        <Reveal delay={100} className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link href="/fleet-assessment" className="btn-primary w-full text-center sm:w-auto">
            Get My Free Assessment
          </Link>
          <a
            href={`https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(site.whatsapp.message)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-white w-full text-center sm:w-auto"
          >
            Chat With Wazambi
          </a>
        </Reveal>
      </div>
    </section>
  );
}
