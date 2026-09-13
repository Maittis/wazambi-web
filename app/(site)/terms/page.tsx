import Reveal from "@/components/Reveal";

export default function TermsPage() {
  return (
    <section className="bg-paper pt-[160px] pb-20 md:pt-[170px]">
      <div className="container-wz max-w-[760px]">
        <Reveal>
          <p className="eyebrow">Legal</p>
          <h1 className="mt-3 headline text-[28px] md:text-[38px]">Terms and Conditions</h1>
          <p className="mt-3 text-[14px] font-light text-ink/60">Last updated: September 2026</p>
        </Reveal>
        <Reveal className="mt-10 space-y-6 text-[15px] font-light leading-relaxed text-ink/80" delay={100}>
          <h2 className="text-[19px] font-bold text-navy">Use of this website</h2>
          <p>
            This website provides information about Wazambi GPS products and services, and allows
            visitors to request assessments, guides, quotations and support. By using this website
            you agree to these terms.
          </p>
          <h2 className="text-[19px] font-bold text-navy">No guarantee of results</h2>
          <p>
            Results shown on this website are examples and are not a guarantee of your results.
            Your results will vary depending on your vehicles, drivers, operations and how the
            system is used.
          </p>
          <h2 className="text-[19px] font-bold text-navy">Quotations and services</h2>
          <p>
            Quotations are provided based on the information you share. Final service terms,
            installation details and pricing will be confirmed in writing before installations
            begin.
          </p>
          <h2 className="text-[19px] font-bold text-navy">Intellectual property</h2>
          <p>
            The content, images and materials on this website are the property of Wazambi GPS and
            may not be copied or used without permission.
          </p>
          <h2 className="text-[19px] font-bold text-navy">Contact</h2>
          <p>
            For questions about these terms, contact academy@wazambigps.com.
          </p>
        </Reveal>
      </div>
    </section>
  );
}