import Reveal from "@/components/Reveal";
import AssessmentForm from "@/components/AssessmentForm";

export default function FuelAssessmentPage() {
  return (
    <section className="bg-paper pt-[160px] pb-24 md:pt-[170px]">
      <div className="container-wz">
        <Reveal className="mx-auto max-w-[620px] text-center">
          <p className="eyebrow">Free Fuel Assessment</p>
          <h1 className="mt-4 headline text-[28px] md:text-[38px]">
            Find out how much fuel your operation is losing.
          </h1>
          <p className="mx-auto mt-4 max-w-[520px] text-[15px] font-light text-ink/70 md:text-[16px]">
            Complete the assessment and the Wazambi team will show you how fuel monitoring
            records refuelling, consumption and suspicious drops.
          </p>
        </Reveal>
        <Reveal className="mt-12" delay={100}>
          <AssessmentForm assessmentType="fuel" />
        </Reveal>
      </div>
    </section>
  );
}