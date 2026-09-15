import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { courses } from "@/lib/content";

export default function AcademyPage() {
  return (
    <>
      <section className="bg-paper pt-[120px] pb-16 md:pt-[140px] md:pb-24">
        <div className="container-wz text-center max-w-[820px]">
          <Reveal>
            <p className="eyebrow">Wazambi Fleet Academy</p>
            <h1 className="mt-4 headline text-[30px] md:text-[42px]">
              Free practical training for vehicle owners and fleet managers.
            </h1>
            <p className="mx-auto mt-5 max-w-[660px] text-[16px] font-light text-ink/70 md:text-[18px]">
              Learn how to track vehicles, reduce fuel loss and improve fleet control.
              Watch a free lesson and receive a practical PDF guide through email.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="container-wz">
          <div className="grid gap-8 md:grid-cols-3">
            {courses.map((course, i) => (
              <Reveal key={course.code} delay={i * 15}>
                <div className="flex h-full flex-col rounded-[14px] bg-paper p-7">
                  <div className="relative mb-5 w-full" style={{ aspectRatio: "520/460" }}>
                    <Image
                      src={course.image}
                      alt={course.title}
                      fill
                      className="object-contain"
                      sizes="(max-width:768px) 100vw, 33vw"
                    />
                    <span className="absolute right-3 top-3 rounded-full bg-gold px-3 py-1 text-[12px] font-bold text-navy">
                      {course.badge}
                    </span>
                  </div>
                  <h2 className="text-[19px] font-extrabold uppercase text-navy">{course.title}</h2>
                  <p className="mt-3 text-[15px] font-light leading-relaxed text-ink/65">{course.description}</p>
                  <ul className="mt-4 flex-1 space-y-1.5">
                    {course.whatYouLearn.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-[13px] text-ink/65">
                        <span className="mt-1 h-[6px] w-[6px] shrink-0 rounded-full bg-gold" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <h3 className="mt-6 text-[12px] font-semibold uppercase tracking-wide text-wazambi-gold-deep">
                    You will learn
                  </h3>
                  <Link href={`/academy/${course.slug}`} className="btn-primary mt-4 w-full text-center">
                    Start Free Course
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy py-16 md:py-20">
        <div className="container-wz text-center">
          <Reveal>
            <h2 className="headline text-[26px] text-white md:text-[36px]">
              Prefer a real solution for your fleet?
            </h2>
            <p className="mx-auto mt-4 max-w-[620px] text-[16px] font-light text-white/75">
              The free courses are education. For live tracking, fuel control and fleet
              management on your vehicles, start with a free assessment.
            </p>
            <div className="mt-8">
              <Link href="/fleet-assessment" className="btn-primary">
                Get a Free Fleet Assessment
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}