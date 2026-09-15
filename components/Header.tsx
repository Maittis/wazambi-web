"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { site, solutions, courses } from "@/lib/content";
import { useContent } from "@/components/content/useContent";
import { useSession, dashboardHref } from "@/components/content/useSession";
import type { SessionUser } from "@/components/content/useSession";

const menuGroups = [
  {
    label: "Solutions",
    items: [
      { label: "GPS Tracking", href: "/gps-tracking" },
      { label: "Fuel Monitoring", href: "/fuel-monitoring" },
      { label: "Fleet Management", href: "/fleet-management" },
    ],
  },
  {
    label: "Fleet Academy",
    items: [
      { label: "GPS Tracking Course", href: "/academy/gps-tracking" },
      { label: "Fuel Monitoring Course", href: "/academy/fuel-monitoring" },
      { label: "Fleet Management Course", href: "/academy/fleet-management" },
    ],
  },
  {
    label: "Opportunities",
    items: [
      { label: "Become an Agent", href: "/agents" },
      { label: "Content Creator Program", href: "/creators" },
    ],
  },
  {
    label: "About Wazambi",
    items: [
      { label: "Our Company", href: "/#about" },
      { label: "Customer Results", href: "/customer-results" },
      { label: "Contact Us", href: "/contact" },
      { label: "FAQs", href: "/#faq" },
    ],
  },
];

const desktopNav = [
  { label: "Become an Agent", href: "/agents" },
  { label: "Contact Us", href: "/contact" },
];

export default function Header({ initialMe }: { initialMe?: SessionUser | null }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const me = useSession(initialMe);
  const dashHref = dashboardHref(me);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const logout = async () => {
    setOpen(false);
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.assign("/");
  };

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div className="sticky top-0 z-[99]">
        <AnnouncementBar />
        <div className={`bg-navy transition-all duration-300 ${scrolled ? "shadow-[0_6px_18px_rgba(0,0,0,0.18)]" : ""}`}>
          <div className={`container-wz flex items-center justify-between transition-all duration-300 ${scrolled ? "py-2.5" : "py-4"}`}>
            <Link href="/" className="shrink-0" aria-label="Wazambi GPS home">
              <Image
                src={site.logo}
                alt="Wazambi GPS"
                width={591}
                height={591}
                priority
                className={`w-auto transition-all duration-300 ${scrolled ? "h-[36px]" : "h-[46px]"}`}
              />
            </Link>

            <nav className="hidden lg:flex items-center gap-7" aria-label="Main navigation">
              <div className="relative group">
                <button
                  type="button"
                  className="flex items-center gap-1.5 text-[15px] font-medium text-white transition-colors hover:text-gold"
                >
                  Solutions
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 absolute top-full left-1/2 -translate-x-1/2 pt-3">
                  <div className="bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.15)] w-[740px] p-8">
                    <h3 className="text-[20px] font-extrabold uppercase text-navy">Wazambi Solutions</h3>
                    <p className="mt-1 text-[15px] font-normal leading-[1.3] text-ink/70">
                      Three Ways to Take Control of Your Vehicles.
                    </p>
                    <p className="mt-0.5 text-[14px] text-ink/50">
                      Choose the problem you want Wazambi to help you solve.
                    </p>
                    <div className="mt-6 grid grid-cols-3 gap-4">
                      {solutions.map((sol) => (
                        <Link
                          key={sol.slug}
                          href={`/${sol.slug}`}
                          className="block rounded-xl p-5 bg-[#f5f5f3] hover:bg-paper transition-colors"
                        >
                          <h4 className="text-[15px] font-extrabold uppercase text-navy">{sol.title}</h4>
                          <p className="mt-2 text-[13px] leading-[1.55] text-ink/65">{sol.shortHeadline}</p>
                          <span className="mt-3 block text-[12px] font-bold uppercase tracking-wide text-wazambi-gold-deep">
                            Explore {sol.title} →
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative group">
                <button
                  type="button"
                  className="flex items-center gap-1.5 text-[15px] font-medium text-white transition-colors hover:text-gold"
                >
                  Free Courses
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 absolute top-full left-1/2 -translate-x-1/2 pt-3">
                  <div className="bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.15)] w-[740px] p-8">
                    <h3 className="text-[20px] font-extrabold uppercase text-navy">Free Fleet Academy</h3>
                    <p className="mt-1 text-[15px] font-normal leading-[1.3] text-ink/70">
                      Free Fleet Control Training.
                    </p>
                    <p className="mt-0.5 text-[14px] text-ink/50">
                      Videos, guides and practical lessons to help you protect your vehicles, reduce
                      losses and manage your operation better.
                    </p>
                    <div className="mt-6 grid grid-cols-3 gap-4">
                      {courses.map((course) => (
                        <Link
                          key={course.slug}
                          href={`/academy/${course.slug}`}
                          className="block rounded-xl p-5 bg-[#f5f5f3] hover:bg-paper transition-colors"
                        >
                          <span className="inline-block rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-navy">
                            {course.badge}
                          </span>
                          <h4 className="mt-2 text-[15px] font-extrabold uppercase text-navy">{course.title}</h4>
                          <p className="mt-2 text-[13px] leading-[1.55] text-ink/65">{course.description}</p>
                          <span className="mt-3 block text-[12px] font-bold uppercase tracking-wide text-wazambi-gold-deep">
                            Take This Course →
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {desktopNav.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-[15px] font-medium text-white transition-colors hover:text-gold ${
                    pathname === link.href ? "text-gold" : ""
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              {me === undefined ? null : me ? (
                <>
                  <Link
                    href={dashHref}
                    className="hidden lg:inline-block rounded-[100px] border-2 border-white/40 px-5 py-2.5 text-center font-poppins text-[14px] font-bold leading-none text-white transition-all duration-300 hover:bg-white hover:text-navy"
                  >
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={logout}
                    className="hidden lg:inline-block font-poppins text-[14px] font-bold text-white transition-colors hover:text-gold"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <Link
                  href="/fleet-assessment"
                  className="hidden lg:inline-block btn-primary text-[14px]"
                >
                  Get a Free Assessment
                </Link>
              )}
              <button
                type="button"
                aria-label="Open main menu"
                aria-expanded={open}
                onClick={() => setOpen(true)}
                className="lg:hidden text-white p-1"
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <MobileMenu open={open} onClose={() => setOpen(false)} me={me} onLogout={logout} dashHref={dashHref} />
    </>
  );
}

function AnnouncementBar() {
  const content = useContent();
  const ann = content.announcement ?? site.announcement;
  return (
    <div className="bg-electric-blue text-center">
      <Link
        href={ann.link}
        className="flex items-center justify-center gap-2 px-4 py-2.5 text-white hover:underline"
      >
        <span className="shrink-0 rounded-full bg-gold px-2 py-0.5 text-[11px] font-bold text-navy">
          {ann.badge ?? site.announcement.badge}
        </span>
        <span className="text-[12px] md:text-[15px] font-medium leading-tight">
          <strong>{ann.text}</strong>
        </span>
        <svg className="shrink-0" width="22" height="12" viewBox="0 0 32 16" fill="none" aria-hidden="true">
          <path
            d="M31.7 8.7a1 1 0 0 0 0-1.4L25.3.9a1 1 0 0 0-1.4 1.4L29.6 8l-5.7 5.7a1 1 0 0 0 1.4 1.4l6.4-6.4ZM0 9h31V7H0v2Z"
            fill="currentColor"
          />
        </svg>
      </Link>
    </div>
  );
}

function MobileMenu({
  open,
  onClose,
  me,
  onLogout,
  dashHref,
}: {
  open: boolean;
  onClose: () => void;
  me: SessionUser | null | undefined;
  onLogout: () => Promise<void> | void;
  dashHref: string;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (open) setExpanded({});
  }, [open]);

  return (
    <div
      className={`fixed inset-0 z-[120] bg-navy text-white transition-opacity duration-300 ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile menu"
    >
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
        <Image src={site.logo} alt="Wazambi GPS" width={180} height={38} className="h-[26px] w-auto" />
        <button
          type="button"
          aria-label="Close main menu"
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <nav className="overflow-y-auto max-h-[calc(100vh-72px)] px-6 py-5 pb-10" aria-label="Mobile navigation">
        <ul className="space-y-1">
          {menuGroups.map((group) => {
            const isOpen = !!expanded[group.label];
            return (
              <li key={group.label} className="border-b border-white/10">
                <button
                  type="button"
                  onClick={() => setExpanded((prev) => ({ ...prev, [group.label]: !prev[group.label] }))}
                  className="flex w-full items-center justify-between py-4 text-[16px] font-bold uppercase tracking-wide"
                  aria-expanded={isOpen}
                >
                  {group.label}
                  <svg
                    className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                <ul
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-[300px] pb-3" : "max-h-0"
                  }`}
                >
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className="block rounded-lg py-3 pl-3 text-[15px] text-white/85 hover:bg-white/10 hover:text-white"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 space-y-3 pb-6">
          {me ? (
            <>
              <Link
                href={dashHref}
                onClick={onClose}
                className="btn-primary block w-full text-center"
              >
                Go to Dashboard
              </Link>
              <button
                type="button"
                onClick={onLogout}
                className="btn-outline block w-full border-white/40 text-white hover:bg-white hover:text-navy"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/fleet-assessment" onClick={onClose} className="btn-primary block w-full text-center">
                Get a Free Assessment
              </Link>
              <div className="flex gap-3 pt-4">
                <Link href="/portal" onClick={onClose} className="btn-outline flex-1 border-white/40 text-white hover:bg-white hover:text-navy">
                  Client Login
                </Link>
                <Link href="https://wazambi-gps.vercel.app/" className="btn-outline flex-1 border-white/40 text-white hover:bg-white hover:text-navy">
                  Agent Login
                </Link>
              </div>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}