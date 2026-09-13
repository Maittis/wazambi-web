import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { courses } from "@/lib/content";

const resources = [
  {
    title: "GPS Tracking Guide",
    description: "Learn how live tracking, geofences, trip history and alerts protect your vehicles.",
    href: "/academy/gps-tracking",
    image: "/images/courses/gps.jpg",
  },
  {
    title: "Fuel Control Guide",
    description: "Understand how to monitor fuel levels, refuelling and suspicious drops with records.",
    href: "/academy/fuel-monitoring",
    image: "/images/courses/fuel.jpg",
  },
  {
    title: "Fleet Management Guide",
    description: "Bring vehicles, drivers, maintenance and reporting into one clear system.",
    href: "/academy/fleet-management",
    image: "/images/courses/fleet.jpg",
  },
];

export default function ResourcesPage() {
  return (
    <>
      <section className="bg-paper pt-[160px] pb-16 md:pt-[170px] md:pb-20">
        <div className="container-wz">
          <Reveal className="mx-auto max-w-[700px] text-center">
            <p className="eyebrow">Free Resources</p>
            <h1 className="mt-4 headline text-[30px] md:text-[40px]">
              Free fleet resources, videos and guides.
            </h1>
            <p className="mx-auto mt-4 max-w-[580px] text-[16px] font-light text-ink/70">
              Practical education for vehicle owners and fleet managers — before you buy anything.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="container-wz">
          <div className="grid gap-8 md:grid-cols-3">
            {resources.map((item, i) => (
              <Reveal key={item.title} delay={i * 100}>
                <Link href={item.href} className="group block">
                  <div className="rounded-[14px] bg-paper p-7 transition-shadow group-hover:shadow-card">
                    <div className="relative mb-5 w-full" style={{ aspectRatio: "520/460" }}>
                      <Image src={item.image} alt={item.title} fill className="object-contain" sizes="(max-width:768px) 100vw, 33vw" />
                    </div>
                    <h2 className="text-[18px] font-bold uppercase text-navy">{item.title}</h2>
                    <p className="mt-2 text-[14px] font-light text-ink/65">{item.description}</p>
                    <span className="mt-4 inline-block text-[13px] font-bold uppercase text-electric-blue group-hover:underline">
                      Get the free guide →
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy py-16 md:py-20">
        <div className="container-wz text-center max-w-[640px]">
          <SectionHeading
            eyebrow="Ready for more?"
            title="See a live demonstration."
            tone="light"
          />
          <Reveal className="mt-8">
            <Link href="/fleet-assessment" className="btn-primary">
              Request a Live Demonstration
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}