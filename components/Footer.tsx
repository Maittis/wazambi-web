"use client";

import Link from "next/link";
import Image from "next/image";
import { site } from "@/lib/content";
import { useSession, dashboardHref } from "@/components/content/useSession";
import type { SessionUser } from "@/components/content/useSession";

const columns = [
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
    ],
  },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms and Conditions", href: "/terms" },
];

export default function Footer({ initialMe }: { initialMe?: SessionUser | null }) {
  const me = useSession(initialMe);
  const dashHref = dashboardHref(me);
  return (
    <footer role="contentinfo" aria-label="Site Footer" className="bg-navy text-white">
      <div className="container-wz py-14">
        <div className="mb-12">
          <Image src={site.logo} alt="Wazambi GPS" width={230} height={49} className="h-[34px] w-auto" />
        </div>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 text-[14px] font-semibold uppercase tracking-[0.08em] text-gold">
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[14px] font-light text-white/80 transition-colors hover:text-white hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h3 className="mb-4 text-[14px] font-semibold uppercase tracking-[0.08em] text-gold">
              Login
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href={me ? dashHref : "/portal"}
                  className="text-[14px] font-light text-white/80 transition-colors hover:text-white hover:underline"
                >
                  {me === undefined ? "Client Login" : me ? "Dashboard" : "Client Login"}
                </Link>
              </li>
              <li>
                <Link
                  href="/customer-admin"
                  className="text-[14px] font-light text-white/80 transition-colors hover:text-white hover:underline"
                >
                  Staff Login
                </Link>
              </li>
              <li>
                <Link
                  href="https://wazambi-gps.vercel.app/"
                  className="text-[14px] font-light text-white/80 transition-colors hover:text-white hover:underline"
                >
                  Agent Login
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-[14px] font-semibold uppercase tracking-[0.08em] text-gold">
              Contact
            </h3>
            <ul className="space-y-2.5 text-[14px] font-light text-white/80">
              <li>Phone and WhatsApp</li>
              <li>academy@wazambigps.com</li>
              <li>Lusaka, Zambia</li>
            </ul>
            <ul className="mt-5 space-y-2.5 text-[14px] font-light">
              <li>
                <a
                  className="text-white/80 hover:text-white hover:underline"
                  href={`https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(site.whatsapp.message)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Chat on WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 border-t border-white/10 pt-8 lg:flex-row lg:justify-between">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-[14px] font-medium text-white hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-[13px] font-light text-white/70">
            © {new Date().getFullYear()} Wazambi GPS. All Rights Reserved.
          </p>
        </div>

        <p className="mt-8 text-center text-[11px] leading-relaxed text-white/45">
          The information contained within this website is the property of Wazambi GPS.
          Any use of the images, content or ideas expressed herein without the express
          written consent of Wazambi GPS is prohibited. Results shown on this website are
          examples and are not a guarantee of your results. Your results will vary depending
          on your vehicles, drivers, operations and how the system is used.
        </p>
      </div>
    </footer>
  );
}