import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { results } from "@/lib/content";

export default function CustomerResultsPage() {
  return (
    <>
      <section className="bg-paper pt-[160px] pb-16 md:pt-[170px] md:pb-24">
        <div className="container-wz text-center max-w-[760px]">
          <Reveal>
            <p className="eyebrow">Customer Results</p>
            <h1 className="mt-4 headline text-[30px] md:text-[42px]">
              Real fleets. Real problems. Better control.
            </h1>
            <p className="mx-auto mt-5 max-w-[620px] text-[16px] font-light text-ink/70 md:text-[18px]">
              Genuine customer stories from businesses that use Wazambi to protect vehicles,
              reduce fuel loss and manage their fleets with records.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="container-wz">
          <div className="space-y-12">
            {results.map((r, i) => (
              <Reveal key={i}>
                <div className="grid overflow-hidden rounded-[14px] bg-paper md:grid-cols-[300px_1fr]">
                  <div className="relative w-full" style={{ aspectRatio: "520/460" }}>
                    <Image src={r.image} alt={r.customer} fill className="object-contain" sizes="300px" />
                  </div>
                  <div className="p-8 md:p-10">
                    <p className="text-[12px] font-semibold uppercase tracking-wide text-electric-blue">
                      {r.industry}
                    </p>
                    <h2 className="mt-1 text-[22px] font-bold text-navy">{r.company}</h2>
                    <div className="mt-5 space-y-4 text-[15px] font-light leading-relaxed text-ink/75 md:text-[16px]">
                      <p>
                        <strong className="font-semibold text-ink">Who:</strong> {r.customer}
                      </p>
                      <p>
                        <strong className="font-semibold text-ink">The problem:</strong> {r.problem}
                      </p>
                      <p>
                        <strong className="font-semibold text-ink">The Wazambi solution:</strong> {r.solution}
                      </p>
                      <p>
                        <strong className="font-semibold text-ink">The result:</strong> {r.result}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-16">
            <div className="rounded-[14px] bg-navy p-10 text-center">
              <h2 className="headline text-[24px] text-white md:text-[32px]">
                Want results like these on your fleet?
              </h2>
              <p className="mx-auto mt-3 max-w-[560px] text-[15px] font-light text-white/75">
                Start with a free fleet assessment and find out what Wazambi can do for your
                vehicles and your operation.
              </p>
              <Link href="/fleet-assessment" className="btn-primary mt-7 inline-block">
                Get a Free Fleet Assessment
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}