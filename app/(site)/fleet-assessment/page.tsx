import Reveal from "@/components/Reveal";
import AssessmentForm from "@/components/AssessmentForm";

export default function FleetAssessmentPage() {
  return (
    <section className="bg-paper pt-[160px] pb-24 md:pt-[170px]">
      <div className="container-wz">
        <Reveal className="mx-auto max-w-[620px] text-center">
          <p className="eyebrow">Free Fleet Assessment</p>
          <h1 className="mt-4 headline text-[28px] md:text-[38px]">
            Get a recommended solution for your fleet.
          </h1>
          <p className="mx-auto mt-4 max-w-[520px] text-[15px] font-light text-ink/70 md:text-[16px]">
            Tell us about your vehicles and challenges. The Wazambi team will recommend
            the right solution and send you a clear quotation.
          </p>
        </Reveal>
        <Reveal className="mt-12" delay={100}>
          <AssessmentForm assessmentType="fleet" />
        </Reveal>
      </div>
    </section>
  );
}