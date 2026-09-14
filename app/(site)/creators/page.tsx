"use client";

import Image from "next/image";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import FaqAccordion from "@/components/FaqAccordion";

const contentTypes = [
  {
    number: "01",
    title: "TikTok",
    text: "Create short, engaging videos that show how Wazambi GPS helps vehicle owners protect and control their fleet.",
    icon: "TikTok",
  },
  {
    number: "02",
    title: "Instagram",
    text: "Reels and Stories that demonstrate live tracking, fuel monitoring and real-world Wazambi results.",
    icon: "Instagram",
  },
  {
    number: "03",
    title: "Facebook",
    text: "Post educational videos and customer stories to vehicle owners, drivers and fleet managers.",
    icon: "Facebook",
  },
  {
    number: "04",
    title: "WhatsApp Status",
    text: "Share approved Wazambi content with your audience through WhatsApp Status and groups.",
    icon: "WhatsApp",
  },
];

const earnSteps = [
  { title: "Apply to the program", text: "Submit your application and links to content you have already created." },
  { title: "Get approved", text: "The Wazambi team reviews your content quality and approves your participation." },
  { title: "Create and publish", text: "Create videos about Wazambi GPS using approved topics, scripts and brand rules." },
  { title: "Submit and earn", text: "Submit your published content. Earnings are paid according to approved performance." },
];

const kit = [
  "Approved content topics and scripts",
  "Wazambi GPS brand and usage guidelines",
  "Access to real Wazambi photos and videos",
  "Product training on tracking and fuel monitoring",
  "A unique Creator Code for tracking your content",
  "Performance tracking on the Wazambi Creator Platform",
  "Payment and earnings tracking",
  "Continued support from the Wazambi team",
];

const forYou = [
  "You create short videos on TikTok, Instagram or Facebook",
  "You have an engaged audience or are building one",
  "You can tell a simple, honest story in a short video",
  "You use a smartphone to create and publish content",
  "You are serious about consistent, quality content",
  "You are ready to follow Wazambi's brand and content rules",
];

const notForYou = [
  "You are not creating content regularly",
  "You only want access without publishing approved content",
  "You are not willing to follow the brand guidelines",
  "You expect payment without approving and publishing content",
  "You are not ready to submit your content for review",
  "You are applying to get a code but do not plan to create",
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
      <section className="bg-paper pt-[160px] pb-16 md:pt-[170px] md:pb-24">
        <div className="container-wz">
          <Reveal className="mx-auto max-w-[820px] text-center">
            <p className="eyebrow">Wazambi Creator Program · Video Content · Commission</p>
            <h1 className="mt-4 headline text-[30px] md:text-[44px]">
              Your phone and your content could earn you money.
            </h1>
            <p className="mx-auto mt-5 max-w-[620px] text-[16px] font-light text-ink/70 md:text-[18px]">
              Create TikTok, Instagram and Facebook videos about Wazambi GPS and earn according to
              the approved performance of your content.
            </p>
            <div className="mt-8">
              <a href="#apply" className="btn-primary">See if I Qualify →</a>
            </div>
            <p className="mx-auto mt-6 max-w-[520px] text-[12px] font-light text-ink/55">
              This is an independent, performance-based content opportunity — not employment.
              Earnings depend on approved, published content and are not guaranteed.
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
              People search for answers on social media. You can be the one providing them.
            </h2>
            <p className="mt-5 text-[15px] font-light leading-relaxed text-white/75 md:text-[17px]">
              Vehicle owners lose money through theft, fuel misuse and unauthorised trips. Wazambi
              GPS helps them protect and control their vehicles. You create the content that shows
              them how. Publish approved videos, and earn according to their performance.
            </p>
            <a href="#apply" className="btn-primary mt-8 inline-block">Apply to Become a Creator →</a>
          </Reveal>
          <Reveal direction="right" delay={150}>
            <div className="relative w-full" style={{ aspectRatio: "1200/700" }}>
              <Image src="/images/about/team.jpg" alt="Wazambi content creators" fill className="object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Content types */}
      <section className="bg-paper py-20 md:py-24">
        <div className="container-wz">
          <SectionHeading
            eyebrow="Where You Create"
            title="Four platforms. One clear message."
            subline="Create content for the platforms you already use every day."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-4">
            {contentTypes.map((c, i) => (
              <Reveal key={c.number} delay={i * 80}>
                <div className="h-full rounded-[14px] bg-white p-6 shadow-card">
                  <span className="font-poppins text-[40px] font-black text-electric-blue">{c.number}</span>
                  <h3 className="mt-2 text-[16px] font-bold uppercase text-navy">{c.title}</h3>
                  <p className="mt-2 text-[14px] font-light text-ink/65">{c.text}</p>
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
            title="Create. Publish. Submit. Earn."
            subline="A clear process from application to approved content and earnings."
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

      {/* Creator kit */}
      <section className="bg-paper py-20 md:py-24">
        <div className="container-wz">
          <SectionHeading
            eyebrow="Your Kit"
            title="What approved creators receive."
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

      {/* Application */}
      <section id="apply" className="bg-paper py-20 md:py-24">
        <div className="container-wz">
          <SectionHeading
            eyebrow="Application"
            title="See if you qualify."
            subline="Complete the application so the Wazambi team can review your content and audience."
          />
          <div className="mx-auto mt-10 max-w-[640px] rounded-lg bg-white p-5 text-center">
            <p className="text-[13px] font-light text-ink/70">
              <strong className="font-semibold text-alert">We are not accepting everyone.</strong>{" "}
              Only creators whose content quality and consistency meet the program's standards will
              be approved.
            </p>
          </div>
          <Reveal className="mt-12" delay={100}>
            <div className="mx-auto max-w-[640px] rounded-lg bg-white p-8 text-center shadow-card">
              <h3 className="text-[18px] font-extrabold uppercase text-navy">Apply to the Wazambi Creator Program</h3>
              <p className="mt-3 text-[14px] font-light text-ink/65">
                Send a direct message from Wazambi GPS on Facebook or WhatsApp with your name, the
                platform you create on and links to your recent content.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <a
                  href="https://wa.me/260000000000"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary"
                >
                  Apply on WhatsApp
                </a>
                <a
                  href="https://www.facebook.com/wazambigps"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline"
                >
                  Apply on Facebook
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-20 md:py-24">
        <div className="container-wz">
          <SectionHeading eyebrow="Questions" title="Frequently asked questions." />
          <div className="mt-10">
            <FaqAccordion items={creatorFaqs} section="creators-faq" />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-navy py-16 md:py-20">
        <div className="container-wz text-center max-w-[600px]">
          <Reveal>
            <h2 className="headline text-[26px] text-white md:text-[36px]">
              Start building a content income stream with Wazambi.
            </h2>
            <a href="#apply" className="btn-primary mt-8 inline-block">Apply to Become a Creator →</a>
          </Reveal>
        </div>
      </section>
    </>
  );
}