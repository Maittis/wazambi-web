import Reveal from "@/components/Reveal";

export default function PrivacyPolicyPage() {
  return (
    <section className="bg-paper pt-[120px] pb-20 md:pt-[140px]">
      <div className="container-wz max-w-[760px]">
        <Reveal>
          <p className="eyebrow">Legal</p>
          <h1 className="mt-3 headline text-[28px] md:text-[38px]">Privacy Policy</h1>
          <p className="mt-3 text-[14px] font-light text-ink/60">Last updated: September 2026</p>
        </Reveal>
        <Reveal className="mt-10 space-y-6 text-[15px] font-light leading-relaxed text-ink/80" delay={100}>
          <p>
            Wazambi GPS ("we", "us") respects your privacy. This policy explains what information
            we collect through this website, how we use it and the choices you have.
          </p>
          <h2 className="text-[19px] font-bold text-navy">Information we collect</h2>
          <p>
            When you complete a form on this website (assessments, course registrations, contact
            messages or agent applications), we collect the information you provide, such as your
            name, phone number, email address, company and details about your vehicles.
          </p>
          <h2 className="text-[19px] font-bold text-navy">How we use your information</h2>
          <p>
            We use your information to respond to your enquiry, recommend and provide solutions,
            deliver requested guides and materials, arrange installations and provide support.
            We may contact you by phone, WhatsApp or email about your enquiry and relevant services.
          </p>
          <h2 className="text-[19px] font-bold text-navy">Your consent</h2>
          <p>
            By submitting a form that includes a communication consent option, you agree to receive
            communications from Wazambi GPS. You can withdraw your consent or ask us to delete your
            information at any time by contacting us.
          </p>
          <h2 className="text-[19px] font-bold text-navy">Data sharing</h2>
          <p>
            We do not sell your personal information. We only share information with our team members
            who need it to serve you, or where the law requires us to do so.
          </p>
          <h2 className="text-[19px] font-bold text-navy">Contact us</h2>
          <p>
            If you have questions about this policy or your data, contact us at
            academy@wazambigps.com.
          </p>
        </Reveal>
      </div>
    </section>
  );
}