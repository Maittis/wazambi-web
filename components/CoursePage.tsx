"use client";

import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import FaqAccordion from "@/components/FaqAccordion";
import MultiStepLeadForm from "@/components/MultiStepLeadForm";
import { site, faqs } from "@/lib/content";
import type { Course } from "@/lib/content";

const courseFaqTitles: Record<string, string[]> = {
  "gps-tracking": [
    "What is Wazambi GPS?",
    "How does GPS tracking work?",
    "Can I monitor vehicles from my phone?",
    "Can I view completed journeys?",
    "How do I access the Fleet Academy?",
  ],
  "fuel-monitoring": [
    "What is Wazambi GPS?",
    "Can Wazambi monitor fuel?",
    "Can I view completed journeys?",
    "How do I access the Fleet Academy?",
    "How do I request a quotation?",
  ],
  "fleet-management": [
    "What is Wazambi GPS?",
    "How does GPS tracking work?",
    "Can I view completed journeys?",
    "How do I access the Fleet Academy?",
  ],
};

export default function CoursePage({ course }: { course: Course }) {
  const relatedFaqs = faqs.filter((f) =>
    (courseFaqTitles[course.slug] ?? []).includes(f.question)
  );

  return (
    <>
      <section className="bg-paper pt-[160px] pb-20 md:pt-[170px]">
        <div className="container-wz">
          <Reveal className="mx-auto max-w-[760px] text-center">
            <p className="eyebrow">Wazambi Fleet Academy · {course.badge}</p>
            <h1 className="mt-4 headline text-[28px] md:text-[40px]">{course.headline}</h1>
            <p className="mx-auto mt-5 max-w-[620px] text-[16px] font-light text-ink/70 md:text-[17px]">
              {course.description}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="container-wz">
          <Reveal className="mx-auto max-w-[820px]">
            <div className="relative w-full overflow-hidden rounded-[14px]" style={{ aspectRatio: "16/9" }}>
              <Image
                src={site.video.poster}
                alt={course.title}
                fill
                className="object-cover"
                sizes="(max-width:900px) 100vw, 820px"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <a
                  href={site.video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-gold transition-transform hover:scale-110"
                >
                  <svg className="ml-1 h-7 w-7 text-navy" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-paper py-16 md:py-20">
        <div className="container-wz">
          <SectionHeading
            eyebrow="What You Will Learn"
            title={`In the ${course.title}.`}
            subline="Practical lessons you can apply to your vehicles today."
          />
          <div className="mx-auto mt-10 grid max-w-[800px] gap-4 sm:grid-cols-2">
            {course.whatYouLearn.map((item, i) => (
              <Reveal key={i} delay={i * 25}>
                <div className="flex items-start gap-3 rounded-[10px] bg-white p-5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-wazambi-gold text-[14px] font-bold text-navy">
                    {i + 1}
                  </span>
                  <span className="mt-1 text-[15px] font-medium text-navy">{item}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="get-guide" className="bg-white py-16 md:py-24">
        <div className="container-wz">
          <SectionHeading
            eyebrow={`Free ${course.title}`}
            title="Get your free guide delivered to your email."
            subline={`Receive "${course.guideName}" instantly after registration.`}
          />
          <Reveal className="mt-12" delay={100}>
            <MultiStepLeadForm
              courseCode={course.code}
              guideName={course.guideName}
              courseUrl={`/academy/${course.slug}`}
            />
          </Reveal>
        </div>
      </section>

      <section className="bg-paper py-16 md:py-20">
        <div className="container-wz">
          <SectionHeading
            eyebrow="Frequently Asked Questions"
            title="Common questions."
          />
          <div className="mt-10">
            <FaqAccordion items={relatedFaqs} section={`course-${course.slug}-faq`} />
          </div>
        </div>
      </section>

      <section className="bg-navy py-16 md:py-20">
        <div className="container-wz text-center">
          <Reveal>
            <h2 className="headline text-[26px] text-white md:text-[36px]">
              Need a real solution for your fleet?
            </h2>
            <p className="mx-auto mt-4 max-w-[620px] text-[16px] font-light text-white/75">
              Complete a free fleet assessment and we will recommend the right Wazambi solution
              based on your vehicles and biggest challenges.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/fleet-assessment" className="btn-primary w-full sm:w-auto">
                Get a Free Fleet Assessment
              </Link>
              <Link href="/academy" className="btn-outline w-full border-white text-white hover:bg-white hover:text-navy sm:w-auto">
                Explore All Courses
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}