"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Reveal from "@/components/Reveal";
import { courses } from "@/lib/content";

function ThankYouContent() {
  const params = useSearchParams();
  const course = params.get("course");
  const guideName =
    courses.find((c) => c.code === course)?.guideName ?? "your Wazambi guide";

  return (
    <section className="bg-paper pt-[160px] pb-24 md:pt-[170px]">
      <div className="container-wz max-w-[640px] text-center">
        <Reveal>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold">
            <svg className="h-8 w-8 text-navy" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="eyebrow mt-8">Wazambi Fleet Academy</p>
          <h1 className="mt-3 headline text-[28px] md:text-[36px]">
            Check your inbox — your guide is on the way.
          </h1>
          <p className="mx-auto mt-5 max-w-[520px] text-[16px] font-light text-ink/70 md:text-[17px]">
            We have sent <strong className="font-semibold text-ink">{guideName}</strong> to the
            email you provided. If you do not see it within a few minutes, check your spam
            folder or contact our team.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/fleet-assessment" className="btn-primary w-full sm:w-auto">
              Get a Free Fleet Assessment
            </Link>
            <Link href="/academy" className="btn-outline w-full sm:w-auto">
              Explore More Courses
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div className="pt-[160px] pb-24" />}>
      <ThankYouContent />
    </Suspense>
  );
}