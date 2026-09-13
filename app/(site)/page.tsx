"use client";

import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import FaqAccordion from "@/components/FaqAccordion";
import { useContent } from "@/components/content/useContent";
import {
  hero,
  stats,
  problems,
  solutions,
  howItWorks,
  industries,
  site,
  courses,
  results,
  packages,
  faqs,
} from "@/lib/content";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <Problems />
      <SolutionsSection />
      <HowItWorksSection />
      <Industries />
      <VideoDemo />
      <Academy />
      <Results />
      <Packages />
      <About />
      <AgentPromo />
      <FaqSection />
      <FinalCta />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                              */
/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section className="bg-paper pt-[160px] md:pt-[180px]">
      <div className="container-wz grid items-center gap-8 py-12 md:grid-cols-[19%_1fr_18%] lg:grid-cols-[19%_1fr_18%]">
        <div className="hidden md:block">
          <Reveal direction="left">
            <div className="relative w-full" style={{ aspectRatio: "1170/1701" }}>
              <Image
                src={hero.imageLeft}
                alt="Fleet vehicles"
                fill
                className="object-cover"
                sizes="19vw"
                priority
              />
            </div>
          </Reveal>
        </div>

        <Reveal className="mx-auto max-w-[810px] text-center md:max-w-full md:px-10">
          <p className="eyebrow mb-5">{hero.eyebrow}</p>
          <h1 className="headline text-[36px] md:text-[44px] lg:text-[52px]">
            {hero.headline}
          </h1>
          <p className="mx-auto mt-6 max-w-[620px] text-[16px] font-light leading-relaxed text-ink/75 md:text-[18px]">
            {hero.subline}
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href={hero.primaryCta.href} className="btn-primary w-full sm:w-auto">
              {hero.primaryCta.label}
            </Link>
            <Link href={hero.secondaryCta.href} className="btn-outline w-full sm:w-auto">
              {hero.secondaryCta.label}
            </Link>
          </div>
        </Reveal>

        <div className="hidden md:block">
          <Reveal direction="right">
            <div className="relative w-full" style={{ aspectRatio: "1008/1659" }}>
              <Image
                src={hero.imageRight}
                alt="Wazambi mobile app"
                fill
                className="object-cover"
                sizes="18vw"
                priority
              />
            </div>
          </Reveal>
        </div>

        <div className="block md:hidden">
          <Reveal>
            <div className="relative w-full" style={{ aspectRatio: "1346/1106" }}>
              <Image
                src={hero.imageMobile}
                alt="Wazambi GPS"
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Stats                                                             */
/* ------------------------------------------------------------------ */

function Stats() {
  const content = useContent();
  const activeStats = content.stats ?? stats;
  return (
    <section className="bg-white py-10 md:py-16">
      <div className="container-wz">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {activeStats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 80} className="border-l-[3px] border-electric-blue pl-4 md:pl-5">
              <p className="font-poppins text-[30px] font-extrabold text-navy md:text-[40px]">
                {stat.value}
              </p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-ink/60 md:text-[12px]">
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
/*  Problems                                                          */
/* ------------------------------------------------------------------ */

function Problems() {
  return (
    <section className="bg-paper py-20 md:py-28">
      <div className="container-wz">
        <SectionHeading
          eyebrow="The Problems"
          title="Your fleet can only improve when you can see what is really happening."
          subline="Most vehicle owners and fleet managers lose money, time and control without realising it — because they cannot see what is happening across their vehicles."
        />
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {problems.map((item, i) => (
            <Reveal key={item.number} delay={i * 100}>
              <Link href={item.link} className="group block h-full rounded-[14px] bg-white p-7 shadow-card transition-shadow hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)]">
                <span className="font-poppins text-[46px] font-black text-electric-blue">
                  {item.number}
                </span>
                <h3 className="mt-2 text-[19px] font-bold uppercase text-navy">
                  {item.title}
                </h3>
                <p className="mt-3 text-[15px] font-light leading-relaxed text-ink/65">
                  {item.description}
                </p>
                <span className="mt-5 inline-block text-[13px] font-bold uppercase text-electric-blue group-hover:underline">
                  Find Out More →
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Solutions                                                         */
/* ------------------------------------------------------------------ */

function SolutionsSection() {
  return (
    <section id="solutions" className="bg-white py-20 md:py-28">
      <div className="container-wz">
        <SectionHeading
          eyebrow="Wazambi Solutions"
          title="Three systems. One clear view of your fleet."
          subline="Every solution is designed to give you control, save money and protect your vehicles — without relying on calls, messages or driver explanations."
        />
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {solutions.map((sol, i) => (
            <Reveal key={sol.slug} delay={i * 120}>
              <div className="flex h-full flex-col rounded-[14px] bg-paper p-7">
                <div className="relative mb-5 w-full" style={{ aspectRatio: "520/460" }}>
                  <Image
                    src={sol.image}
                    alt={sol.title}
                    fill
                    className="object-cover"
                    sizes="(max-width:768px) 100vw, 33vw"
                  />
                </div>
                <h3 className="text-[21px] font-extrabold uppercase text-navy">{sol.title}</h3>
                <p className="mt-3 text-[15px] font-light leading-relaxed text-ink/65">{sol.shortHeadline}</p>
                <ul className="mt-5 space-y-2">
                  {sol.features.slice(0, 5).map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[14px] text-ink/70">
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-electric-blue" />
                      {f}
                    </li>
                  ))}
                  {sol.features.length > 5 && (
                    <li className="pl-4 text-[13px] font-medium text-electric-blue">+ {sol.features.length - 5} more</li>
                  )}
                </ul>
                <div className="mt-6">
                  <Link
                    href={`/${sol.slug}`}
                    className="btn-primary w-full text-center"
                  >
                    Explore {sol.title}
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  How It Works                                                      */
/* ------------------------------------------------------------------ */

function HowItWorksSection() {
  return (
    <section className="bg-paper py-20 md:py-28">
      <div className="container-wz">
        <SectionHeading
          eyebrow="How It Works"
          title="From fleet assessment to complete control."
          subline="Six steps to full visibility, better decisions and lower operating costs."
        />
        <div className="mt-16 grid gap-6 md:grid-cols-3 lg:grid-cols-6">
          {howItWorks.map((step, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-electric-blue text-[22px] font-black text-white">
                  {i + 1}
                </div>
                <h4 className="text-[14px] font-bold uppercase text-navy">{step.title}</h4>
                <p className="mt-2 text-[13px] font-light leading-relaxed text-ink/65">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-12 text-center">
          <Link href="/fleet-assessment" className="btn-primary">
            Start My Free Assessment
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Industries                                                        */
/* ------------------------------------------------------------------ */

function Industries() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container-wz">
        <SectionHeading
          eyebrow="Who We Help"
          title="Built for people and businesses that depend on vehicles."
          subline="Whether you operate one vehicle or one hundred, Wazambi helps you stay in control."
        />
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((item, i) => (
            <Reveal key={i} delay={i * 60}>
              <div className="h-full rounded-[12px] border border-navy/10 p-6 transition-shadow hover:shadow-card">
                <h4 className="text-[15px] font-bold uppercase text-navy">{item.title}</h4>
                <p className="mt-2 text-[14px] font-light leading-relaxed text-ink/65">{item.problem}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Video Demo                                                        */
/* ------------------------------------------------------------------ */

function VideoDemo() {
  return (
    <section className="bg-navy py-20 md:py-28">
      <div className="container-wz">
        <SectionHeading
          eyebrow="See Wazambi in Action"
          title="See what is happening without calling the driver."
          subline="Watch how live tracking, route playback, fuel monitoring and fleet reports work on the Wazambi platform."
          tone="light"
        />
        <Reveal className="mx-auto mt-12 max-w-[920px]" delay={200}>
          <div className="relative w-full overflow-hidden rounded-[14px]" style={{ aspectRatio: "16/9" }}>
            <Image
              src={site.video.poster}
              alt="Wazambi GPS demonstration"
              fill
              className="object-cover"
              sizes="(max-width:900px) 100vw, 920px"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <a
                href={site.video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-20 w-20 items-center justify-center rounded-full bg-gold/90 transition-transform hover:scale-110 md:h-24 md:w-24"
              >
                <svg
                  className="ml-1 h-7 w-7 text-navy transition-transform group-hover:scale-110 md:h-8 md:w-8"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </a>
            </div>
          </div>
        </Reveal>
        <Reveal className="mt-10 text-center">
          <Link href="/fleet-assessment" className="btn-primary">
            Request a Live Demonstration
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Fleet Academy                                                     */
/* ------------------------------------------------------------------ */

function Academy() {
  return (
    <section className="bg-paper py-20 md:py-28">
      <div className="container-wz">
        <SectionHeading
          eyebrow="Free Fleet Education"
          title="Learn how to protect your vehicles and control your fleet."
          subline="Access practical videos and downloadable guides created for vehicle owners, transporters and fleet managers."
        />
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {courses.map((course, i) => (
            <Reveal key={course.code} delay={i * 100}>
              <div className="flex h-full flex-col rounded-[14px] bg-white p-7 shadow-card transition-shadow hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)]">
                <div className="relative mb-5 w-full" style={{ aspectRatio: "520/460" }}>
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover"
                    sizes="(max-width:768px) 100vw, 33vw"
                  />
                  <span className="absolute right-3 top-3 rounded-full bg-gold px-3 py-1 text-[12px] font-bold text-navy">
                    {course.badge}
                  </span>
                </div>
                <h3 className="text-[19px] font-extrabold uppercase text-navy">{course.title}</h3>
                <p className="mt-3 text-[15px] font-light leading-relaxed text-ink/65">{course.headline}</p>
                <ul className="mt-4 space-y-1.5">
                  {course.whatYouLearn.slice(0, 4).map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[13px] text-ink/65">
                      <span className="mt-1 h-[6px] w-[6px] shrink-0 rounded-full bg-gold" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Link href={`/academy/${course.slug}`} className="btn-primary w-full text-center">
                    Start Free Course
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-12 text-center">
          <Link href="/academy" className="btn-outline">
            Explore the Free Courses
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Customer Results                                                  */
/* ------------------------------------------------------------------ */

function Results() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container-wz">
        <SectionHeading
          eyebrow="Customer Results"
          title="Real fleets. Real problems. Better control."
          subline="See how businesses across Zambia use Wazambi to protect vehicles, reduce losses and run smarter operations."
        />
        <div className="mt-16 grid gap-7 md:grid-cols-3">
          {results.map((r, i) => (
            <Reveal key={i} delay={i * 100}>
              <div className="overflow-hidden rounded-[14px] bg-paper">
                <div className="relative w-full" style={{ aspectRatio: "520/460" }}>
                  <Image src={r.image} alt={r.customer} fill className="object-cover" sizes="33vw" />
                </div>
                <div className="p-6">
                  <p className="text-[12px] font-semibold uppercase tracking-wide text-electric-blue">{r.industry}</p>
                  <p className="mt-1 text-[14px] font-bold text-navy">{r.company}</p>
                  <p className="mt-3 text-[14px] font-light leading-relaxed text-ink/65">
                    <strong className="font-semibold text-ink/85">Problem:</strong> {r.problem}
                  </p>
                  <p className="mt-2 text-[14px] font-light leading-relaxed text-ink/65">
                    <strong className="font-semibold text-ink/85">Solution:</strong> {r.solution}
                  </p>
                  <p className="mt-2 text-[14px] font-light leading-relaxed text-ink/65">
                    <strong className="font-semibold text-ink/85">Result:</strong> {r.result}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-12 text-center">
          <Link href="/customer-results" className="btn-outline">
            See More Customer Results
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Packages                                                          */
/* ------------------------------------------------------------------ */

function Packages() {
  return (
    <section className="bg-paper py-20 md:py-28">
      <div className="container-wz">
        <SectionHeading
          eyebrow="Choose Your Solution"
          title="Choose the level of control your fleet needs."
          subline="Start with GPS tracking or take full control — every package is designed to work on your vehicles, your way."
        />
        <div className="mt-16 grid gap-7 md:grid-cols-3">
          {packages.map((pkg, i) => {
            const isCenter = i === 1;
            return (
              <Reveal key={i} delay={i * 100}>
                <div
                  className={`flex h-full flex-col rounded-[14px] p-7 transition-shadow ${
                    isCenter
                      ? "bg-navy text-white shadow-[0_8px_30px_rgba(10,22,51,0.3)]"
                      : "bg-white text-navy shadow-card"
                  }`}
                >
                  <h3 className="text-[19px] font-extrabold uppercase">{pkg.name}</h3>
                  <p className={`mt-2 text-[14px] font-light ${isCenter ? "text-white/75" : "text-ink/65"}`}>
                    {pkg.tagline}
                  </p>
                  <ul className="mt-6 flex-1 space-y-2.5">
                    {pkg.features.map((f) => (
                      <li key={f} className={`flex items-start gap-2 text-[14px] ${isCenter ? "text-white/85" : "text-ink/70"}`}>
                        <svg className={`mt-0.5 h-4 w-4 shrink-0 ${isCenter ? "text-gold" : "text-electric-blue"}`} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={pkg.href}
                    className={`mt-8 text-center ${isCenter ? "btn-white" : "btn-primary"} w-full`}
                  >
                    {pkg.cta}
                  </Link>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  About                                                             */
/* ------------------------------------------------------------------ */

function About() {
  return (
    <section id="about" className="bg-white py-20 md:py-28">
      <div className="container-wz">
        <SectionHeading
          eyebrow="About Wazambi GPS"
          title="Local installation. Professional fleet support."
          subline="Wazambi GPS is a Zambian company helping vehicle owners and businesses monitor, protect and control their vehicles."
        />
        <div className="mt-14 grid items-center gap-10 md:grid-cols-2">
          <Reveal direction="left">
            <div className="relative mx-auto w-full max-w-[460px]" style={{ aspectRatio: "560/560" }}>
              <Image src="/images/about/team.jpg" alt="Wazambi GPS team" fill className="object-cover" />
            </div>
          </Reveal>
          <Reveal direction="right">
            <div className="space-y-4 text-[15px] font-light leading-relaxed text-ink/75 md:text-[17px]">
              <p>
                Wazambi GPS provides GPS tracking, fuel monitoring and fleet-management solutions
                to vehicle owners and businesses across Zambia.
              </p>
              <p>
                Our team installs equipment, trains customers and provides ongoing technical support
                so every fleet can see what is happening — live, from any device.
              </p>
              <p>
                We believe vehicle owners and businesses deserve clear records, honest communication
                and systems that help them reduce losses and run better operations.
              </p>
              <p>
                With local installation, continued support and a practical approach to fleet management,
                Wazambi GPS helps you make decisions with facts, not assumptions.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Agent Program                                                     */
/* ------------------------------------------------------------------ */

function AgentPromo() {
  return (
    <section className="bg-navy py-20 md:py-24">
      <div className="container-wz grid items-center gap-10 md:grid-cols-[1fr_auto]">
        <Reveal>
          <p className="eyebrow text-gold">Wazambi Agent Program</p>
          <h2 className="mt-3 headline text-[26px] text-white md:text-[36px]">
            Your connections could become an income opportunity.
          </h2>
          <p className="mt-4 max-w-[600px] text-[15px] font-light text-white/75 md:text-[17px]">
            Wazambi is selecting independent agents who can introduce vehicle owners and businesses
            that need GPS and fleet-management solutions.
          </p>
        </Reveal>
        <Reveal delay={200} className="shrink-0">
          <Link href="/agents" className="btn-primary whitespace-nowrap">
            See if I Qualify →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  FAQ                                                               */
/* ------------------------------------------------------------------ */

function FaqSection() {
  const content = useContent();
  const activeFaqs = content.faqs ?? faqs;
  return (
    <section className="bg-paper py-20 md:py-28">
      <div className="container-wz">
        <SectionHeading
          eyebrow="Frequently Asked Questions"
          title="Questions and answers about Wazambi GPS."
          subline="Everything you need to know before you get started."
        />
        <div className="mt-12">
          <FaqAccordion items={activeFaqs} section="homepage-faq" />
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
    <section className="bg-navy py-20 md:py-28">
      <div className="container-wz text-center">
        <Reveal>
          <h2 className="headline text-[28px] text-white md:text-[42px]">
            Stop guessing what your vehicles are doing.
          </h2>
          <p className="mx-auto mt-5 max-w-[680px] text-[16px] font-light text-white/75 md:text-[18px]">
            Tell us about your vehicles and Wazambi will recommend a solution based on your operations
            and biggest challenges.
          </p>
        </Reveal>
        <Reveal delay={100} className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
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
        </Reveal>
      </div>
    </section>
  );
}