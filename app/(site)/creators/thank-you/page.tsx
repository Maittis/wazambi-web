import Link from "next/link";

const nextSteps = [
  {
    title: "Review",
    text: "Our team reviews your content quality, experience, audience and suitability for the program.",
  },
  {
    title: "Approval",
    text: "Only creators whose content meets the program's standards are approved. We only contact approved applicants.",
  },
  {
    title: "Onboarding",
    text: "Approved creators receive approved topics, scripts, brand guidelines and access to real Wazambi photos and videos.",
  },
  {
    title: "Create, publish, submit",
    text: "Publish approved Wazambi content on TikTok, Instagram or Facebook, then submit your published videos for review.",
  },
];

export default function CreatorApplicationThankYouPage() {
  return (
    <>
      <section className="bg-paper pt-[120px] pb-16 md:pt-[140px] md:pb-24">
        <div className="container-wz mx-auto max-w-[760px]">
          <div className="rounded-[20px] border border-navy/10 bg-white p-8 text-center shadow-sm md:p-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-wazambi-gold">
              <svg className="h-10 w-10 text-navy" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="eyebrow mt-8">Application received</p>
            <h1 className="mt-3 headline text-[28px] md:text-[36px]">
              Thank you for applying to the Wazambi Creator Program.
            </h1>
            <p className="mx-auto mt-4 max-w-[560px] text-[15px] font-light text-ink/70 md:text-[16px]">
              Your application has been saved and a confirmation email is on its way to your inbox.
              We only contact creators whose content meets our standards — applying does not
              guarantee approval.
            </p>
          </div>

          <div className="mt-10 rounded-[20px] bg-navy p-8 md:p-10">
            <h2 className="headline text-[20px] text-white md:text-[24px]">What happens next</h2>
            <ol className="mt-6 space-y-6">
              {nextSteps.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-wazambi-gold text-[14px] font-bold text-navy">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-[16px] font-semibold text-white">{s.title}</h3>
                    <p className="mt-1 text-[14px] font-light text-white/70">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-8 rounded-xl border border-wazambi-gold/30 bg-white/5 p-4 text-[13px] font-light text-white/80">
              <strong className="font-semibold text-wazambi-gold">Important:</strong> this is an
              independent, <strong className="font-semibold text-white">performance-based content opportunity</strong>.
              Earnings depend on the approved performance and views of your content. It is not
              salaried employment, and earnings are not guaranteed.
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center gap-3">
            <Link href="/creators/submit-video" className="btn-primary">
              Submit a Video for Review
            </Link>
            <Link href="/" className="btn-secondary">
              Back to Homepage
            </Link>
            <p className="text-[13px] font-light text-ink/55">
              Questions? Contact the Wazambi GPS team and we will help.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}