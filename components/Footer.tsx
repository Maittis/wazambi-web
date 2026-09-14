"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { site } from "@/lib/content";
import { useSession, dashboardHref } from "@/components/content/useSession";
import type { SessionUser } from "@/components/content/useSession";

const footerGroups = [
  {
    title: "Solutions",
    links: [
      { label: "GPS Tracking", href: "/gps-tracking" },
      { label: "Fuel Monitoring", href: "/fuel-monitoring" },
      { label: "Fleet Management", href: "/fleet-management" },
    ],
  },
  {
    title: "Fleet Academy",
    links: [
      { label: "GPS Tracking Course", href: "/academy/gps-tracking" },
      { label: "Fuel Monitoring Course", href: "/academy/fuel-monitoring" },
      { label: "Fleet Management Course", href: "/academy/fleet-management" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Wazambi", href: "/#about" },
      { label: "Customer Results", href: "/customer-results" },
      { label: "Contact Us", href: "/contact" },
      { label: "Become an Agent", href: "/agents" },
      { label: "Content Creator Program", href: "/creators" },
    ],
  },
];

const contactItems = [
  { label: "Phone and WhatsApp", href: `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(site.whatsapp.message)}` },
  { label: "academy@wazambigps.com", href: "mailto:academy@wazambigps.com" },
  { label: "Ndola, Zambia", href: null },
  { label: "Lusaka, Zambia", href: null },
];

const socials = [
  { label: "Facebook", href: "https://www.facebook.com/" },
  { label: "TikTok", href: "https://www.tiktok.com/" },
  { label: "Instagram", href: "https://www.instagram.com/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/" },
];

export default function Footer({ initialMe }: { initialMe?: SessionUser | null }) {
  const me = useSession(initialMe);
  const dashHref = dashboardHref(me);
  return (
    <footer role="contentinfo" aria-label="Site Footer" className="bg-navy text-white">
      <div className="container-wz py-12 md:py-16">
        <div className="mb-10 md:mb-12">
          <Image src={site.logo} alt="Wazambi GPS" width={230} height={49} className="h-[30px] w-auto md:h-[34px]" />
        </div>

        <div className="grid gap-0 md:grid-cols-2 lg:grid-cols-5">
          {/* Accordion groups on mobile */}
          {footerGroups.map((col) => (
            <FooterAccordion key={col.title} col={col} />
          ))}

          {/* Access */}
          <FooterAccordion
            col={{
              title: "Access",
              links: [
                { label: "Client Login", href: me ? dashHref : "/portal" },
                { label: "Staff Login", href: "/customer-admin" },
                { label: "Agent Login", href: "https://wazambi-gps.vercel.app/" },
              ],
            }}
          />

          {/* Contact — always visible, no accordion needed on mobile */}
          <div className="py-6 md:py-0 lg:col-span-1">
            <h3 className="mb-4 text-[13px] font-semibold uppercase tracking-[0.08em] text-gold">
              Contact
            </h3>
            <ul className="space-y-2.5 text-[13px] font-light text-white/80">
              {contactItems.map((item) =>
                item.href ? (
                  <li key={item.label}>
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline">
                      {item.label}
                    </a>
                  </li>
                ) : (
                  <li key={item.label}>{item.label}</li>
                )
              )}
            </ul>
          </div>
        </div>

        {/* Social + legal */}
        <div className="mt-10 flex flex-col items-center gap-4 border-t border-white/10 pt-8 lg:flex-row lg:justify-between">
          <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-[13px] text-white/70">
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-[12px] text-white/60">
            <li><Link href="/privacy-policy" className="hover:text-white hover:underline">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white hover:underline">Terms &amp; Conditions</Link></li>
            <li>&copy; {new Date().getFullYear()} Wazambi GPS. All Rights Reserved.</li>
          </ul>
        </div>

        <p className="mt-8 text-center text-[11px] leading-[1.6] text-white/45">
          The information contained within this website is the property of Wazambi GPS. Any use of the
          images, content or ideas expressed herein without the express written consent of Wazambi GPS
          is prohibited. Results shown on this website are examples and are not a guarantee of your results.
        </p>
      </div>
    </footer>
  );
}

function FooterAccordion({ col }: { col: { title: string; links: { label: string; href: string }[] } }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10 py-5 md:border-none md:py-0 lg:col-span-1">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between md:pointer-events-none"
        aria-expanded={open}
      >
        <h3 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-gold">{col.title}</h3>
        <svg
          className={`md:hidden transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <ul className={`mt-3 space-y-2 md:mt-4 ${open ? "block" : "hidden md:block"}`}>
        {col.links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="block text-[13px] font-light text-white/80 transition-colors hover:text-white hover:underline"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}