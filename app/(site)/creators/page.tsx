"use client";

import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";
import FaqAccordion from "@/components/FaqAccordion";
import CreatorApplicationForm from "@/components/CreatorApplicationForm";
import FounderVideo from "@/components/FounderVideo";
import { site } from "@/lib/content";

const steps = [
  {
    title: "Apply",
    text: "Submit your application and your main content page for review.",
  },
  {
    title: "Get Approved",
    text: "Wazambi reviews your content quality, experience and suitability for the program.",
  },
  {
    title: "Create Wazambi Content",
    text: "Produce TikTok, Instagram or Facebook videos related to Wazambi GPS products and services.",
  },
  {
    title: "Submit for Review",
    text: "Submit your video so Wazambi can approve it or request changes.",
  },
];

const videoExplains = [
  "What Wazambi GPS is",
  "Why Wazambi is looking for creators",
  "Who the opportunity is for",
  "The type of GPS-related content creators will make",
  "Supported platforms: TikTok, Instagram and Facebook",
  "That creators publish approved Wazambi content",
  "That this is performance-based and not a salary",
  "That earnings depend on approved views and content performance",
  "How Wazambi reviews applicants and what happens after selection",
  "How approved creators submit videos for review",
];

const creatorFaqs = [
  { question: "Do I need a large following to apply?", answer: "No. Value is placed on content quality and consistency, not just subscriber counts." },
  { question: "What kind of content can I create?", answer: "Short videos on TikTok, Instagram Reels, Facebook and WhatsApp Status that educate people about Wazambi GPS using approved topics." },
  { question: "How is my content approved?", answer: "You submit your published content to the Wazambi team, and earnings are recorded based on the approved performance of each piece of content." },
  { question: "When do I get paid?", answer: "Payments are processed for content whose approved performance meets the program's requirements." },
  { question: "Can I apply from anywhere in Zambia?", answer: "Yes. The creator program is not limited to a specific city." },
  { question: "Does applying guarantee acceptance?", answer: "No. Applications are reviewed, and only creators whose content meets the program's standards are accepted." },
  { question: "Is there a fee to apply?", answer: "No. Applying to become a Wazambi Creator is free." },
];

export default function CreatorsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy pt-[110px] pb-16 md:pt-[130px] md:pb-20">
        <div className="pointer-events-none absolute -right-32 top-0 h-[420px] w-[420px] rounded-full bg-wazambi-gold/15 blur-[120px]" />
        <div className="container-wz grid items-center gap-12 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="eyebrow text-wazambi-gold">
              <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-wazambi-gold align-middle" />
              Wazambi Creator Program · Video Content · Performance-Based
            </p>
            <h1 className="mt-5 headline text-[30px] leading-[1.15] text-white md:text-[46px]">
              Your phone and your content could{" "}
              <span className="text-wazambi-gold">earn you money</span>.
            </h1>
            <p className="mt-5 max-w-[560px] text-[16px] font-light text-white/75 md:text-[18px]">
              Create TikTok, Instagram and Facebook videos about Wazambi GPS and earn according to
              the approved performance of your content.
            </p>
            <div className="mt-9">
              <a href="#watch" className="btn-primary">
                See if I Qualify →
              </a>
            </div>
            <p className="mt-6 max-w-[560px] text-[12px] font-light text-white/55">
              This is an independent, performance-based content opportunity. It is not salaried
              employment.
            </p>
          </div>
          <div className="relative mt-6 md:mt-0">
            <div className="overflow-hidden rounded-[18px] ring-1 ring-wazambi-gold/50">
              <Image
                src="/images/about/team.jpg"
                alt="Wazambi content creators"
                width={900}
                height={560}
                priority
                className="h-auto w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 left-5 rounded-full bg-wazambi-gold px-5 py-2 text-[12px] font-bold uppercase tracking-wide text-navy shadow-lg">
              Content + Performance-Based
            </div>
            <div className="absolute right-4 top-4 rounded-full border border-white/20 bg-navy/60 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur">
              TikTok · Instagram · Facebook
            </div>
          </div>
        </div>
      </section>

      {/* Founder welcome video */}
      <section id="watch" className="scroll-mt-24 bg-navy pb-20 md:pb-24">
        <div className="container-wz">
          <SectionHeading
            eyebrow="A Message from the Founder"
            title="Watch this before you apply."
            tone="dark"
          />
          <div className="mt-12 grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <FounderVideo url={site.creatorsVideo.url} poster={site.creatorsVideo.poster} />
            <div>
              <p className="text-[14px] font-semibold uppercase tracking-wide text-wazambi-gold">
                This video explains
              </p>
              <ul className="mt-4 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                {videoExplains.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[13px] font-light text-white/75">
                    <span className="mt-0.5 text-wazambi-gold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <a href="#apply" className="btn-primary mt-8 inline-block">
                Start My Creator Application →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How the creator program works */}
      <section className="bg-slate-50 py-20 md:py-24">
        <div className="container-wz">
          <SectionHeading
            eyebrow="How the Creator Program Works"
            title="Four simple steps."
            highlight="Content. Performance. Earnings."
            subline="A clear path from application to publishing approved Wazambi content."
          />
          <div className="mt-14 grid gap-5 md:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.title} className="relative h-full rounded-[16px] border border-navy/10 bg-paper p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-wazambi-gold font-poppins text-[18px] font-black text-navy">
                  {i + 1}
                </div>
                <h3 className="text-[15px] font-bold uppercase tracking-wide text-navy">{s.title}</h3>
                <p className="mt-2 text-[14px] font-light leading-relaxed text-ink/70">{s.text}</p>
              </div>
            ))}
          </div>
          <div className="mx-auto mt-10 max-w-[720px] rounded-[14px] border border-wazambi-gold/40 bg-wazambi-gold/10 p-6 text-center">
            <p className="text-[14px] font-light leading-relaxed text-ink/75">
              Approved creators <strong className="font-semibold text-navy">earn according to the approved performance and views</strong>{" "}
              of their content. This is not salaried employment, and earnings are not guaranteed.
            </p>
          </div>
        </div>
      </section>

      {/* Image-led strip */}
      <section className="relative overflow-hidden bg-navy">
        <div className="relative h-[260px] md:h-[340px]">
          <Image
            src="/images/hero/left-fleet.jpg"
            alt="Fleet vehicles tracked by Wazambi GPS in Zambia"
            fill
            className="object-cover"
            priority={false}
          />
          <div className="absolute inset-0 bg-navy/60" />
          <div className="container-wz relative z-10 flex h-full flex-col justify-center py-12">
            <p className="eyebrow text-wazambi-gold">What creators earn</p>
            <h2 className="mt-4 max-w-[600px] headline text-[24px] text-white md:text-[36px]">
              Create once. <span className="text-wazambi-gold">Get paid for performance.</span>
            </h2>
            <p className="mt-4 max-w-[520px] text-[15px] font-light text-white/70">
              Approved content earns based on views and engagement — not one-off fees. The better
              your content performs, the more you earn.
            </p>
            <a href="#apply" className="btn-primary mt-7 w-fit">
              Start My Application →
            </a>
          </div>
        </div>
      </section>

      {/* Application */}
      <section id="apply" className="scroll-mt-24 bg-paper py-20 md:py-24">
        <div className="container-wz">
          <SectionHeading
            eyebrow="Application"
            title="See if you qualify."
            subline="Complete the application so the Wazambi team can review your content quality, experience and suitability."
          />
          <div className="mx-auto mt-10 max-w-[640px] rounded-lg border border-alert/20 bg-alert/5 p-5 text-center">
            <p className="text-[13px] font-light text-ink/70">
              <strong className="font-semibold text-alert">We are not accepting everyone.</strong>{" "}
              Only creators whose content quality and consistency meet the program&apos;s standards
              will be approved.
            </p>
          </div>
          <div className="mt-12">
            <CreatorApplicationForm />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50 py-20 md:py-24">
        <div className="container-wz">
          <SectionHeading eyebrow="Questions" title="Frequently asked questions." />
          <div className="mt-10">
            <FaqAccordion items={creatorFaqs} section="creators-faq" />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-navy py-16 md:py-20">
        <div className="container-wz mx-auto max-w-[620px] text-center">
          <h2 className="headline text-[26px] text-white md:text-[36px]">
            Start building a content income with Wazambi.
          </h2>
          <p className="mt-4 text-[15px] font-light text-white/70">
            Your Wazambi Creator Code is issued only after your application is approved.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="#apply" className="btn-primary">
              See if I Qualify →
            </a>
            <a
              href="/creators/submit-video"
              className="inline-block rounded-[100px] border-[2.5px] border-white/40 px-7 py-3.5 text-center font-poppins text-[15px] font-bold leading-none text-white transition-colors hover:border-white hover:bg-white hover:text-navy"
            >
              Approved? Submit a Video →
            </a>
          </div>
          <p className="mt-5 text-[12px] font-light text-white/45">
            Already approved? Use your WZC code and registered phone to access the submission form.
          </p>
        </div>
      </section>
    </>
  );
}