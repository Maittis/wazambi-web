import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import ContactForm from "@/components/ContactForm";
import { site } from "@/lib/content";

export default function ContactPage() {
  return (
    <>
      <section className="bg-navy pt-[120px] pb-16 md:pt-[140px]">
        <div className="container-wz text-center">
          <Reveal>
            <p className="eyebrow text-gold">Contact Us</p>
            <h1 className="mt-3 headline text-[30px] text-white md:text-[42px]">
              Talk to the Wazambi team.
            </h1>
            <p className="mx-auto mt-4 max-w-[560px] text-[16px] font-light text-white/75">
              Questions, quotations, support or installs — we are happy to help.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="container-wz grid gap-12 lg:grid-cols-[40%_1fr]">
          <Reveal>
            <h2 className="text-[22px] font-bold uppercase text-navy">Get in touch</h2>
            <ul className="mt-6 space-y-4 text-[15px] font-light text-ink/75">
              <li>
                <strong className="font-semibold text-navy">Phone and WhatsApp:</strong>
                <br />
                <a
                  href={`https://wa.me/${site.whatsapp.number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-electric-blue hover:underline"
                >
                  Chat with Wazambi on WhatsApp
                </a>
              </li>
              <li>
                <strong className="font-semibold text-navy">Email:</strong>
                <br />
                <a href="mailto:academy@wazambigps.com" className="text-electric-blue hover:underline">
                  academy@wazambigps.com
                </a>
              </li>
              <li>
                <strong className="font-semibold text-navy">Office:</strong>
                <br />
                Lusaka, Zambia
              </li>
              <li>
                <strong className="font-semibold text-navy">Support:</strong>
                <br />
                Technical support available for all installed customers.
              </li>
            </ul>
          </Reveal>
          <Reveal delay={100}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}