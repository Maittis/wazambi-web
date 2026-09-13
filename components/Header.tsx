"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { navLinks, mobileNav, site } from "@/lib/content";
import { useContent } from "@/components/content/useContent";
import { useSession } from "@/components/content/useSession";
import type { SessionUser } from "@/components/content/useSession";

const dropdowns: Record<string, { label: string; href: string }[]> = {
  Solutions: [
    { label: "GPS Tracking", href: "/gps-tracking" },
    { label: "Fuel Monitoring", href: "/fuel-monitoring" },
    { label: "Fleet Management", href: "/fleet-management" },
  ],
  "Fleet Academy": [
    { label: "GPS Tracking Course", href: "/academy/gps-tracking" },
    { label: "Fuel Monitoring Course", href: "/academy/fuel-monitoring" },
    { label: "Fleet Management Course", href: "/academy/fleet-management" },
  ],
};

export default function Header({ initialMe }: { initialMe?: SessionUser | null }) {
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const me = useSession(initialMe);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

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

  const hasDropdown = (label: string) => label in dropdowns;

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[99]">
        <AnnouncementBar />
        <div className="bg-navy">
          <div className="container-wz flex items-center justify-between py-4">
            <Link href="/" className="shrink-0">
              <Image
                src={site.logo}
                alt="Wazambi GPS"
                width={230}
                height={49}
                priority
                className="h-[34px] w-auto md:h-[38px]"
              />
            </Link>

            <nav
              className="hidden lg:flex items-center gap-7"
              aria-label="Main navigation"
            >
              {navLinks.map((link) => (
                <div
                  key={link.href}
                  className="relative group"
                  onMouseEnter={() => hasDropdown(link.label) && setOpenDropdown(link.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className={`text-[15px] font-medium text-white transition-colors hover:text-gold ${
                      pathname === link.href ? "text-gold" : ""
                    }`}
                  >
                    {link.label}
                    {hasDropdown(link.label) && (
                      <svg
                        className={`ml-1 inline-block transition-transform ${openDropdown === link.label ? "rotate-180" : ""}`}
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    )}
                  </Link>
                  {hasDropdown(link.label) && (
                    <div
                      className={`absolute left-0 top-full rounded-2xl bg-white px-8 py-4 shadow-nav min-w-[240px] ${
                        openDropdown === link.label ? "block" : "hidden"
                      }`}
                    >
                      {dropdowns[link.label].map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block w-full py-2.5 text-[15px] font-medium text-black hover:text-electric-blue hover:underline"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              {me === undefined ? null : me ? (
                <>
                  <Link
                    href="/customer-admin"
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
                <>
                  <Link
                    href="/customer-admin"
                    className="hidden lg:inline-block rounded-[100px] border-2 border-white/40 px-5 py-2.5 text-center font-poppins text-[14px] font-bold leading-none text-white transition-all duration-300 hover:bg-white hover:text-navy"
                  >
                    Client Login
                  </Link>
                  <Link
                    href="/fleet-assessment"
                    className="hidden lg:inline-block btn-primary text-[14px]"
                  >
                    Get a Free Assessment
                  </Link>
                </>
              )}
              <button
                type="button"
                aria-label="Open main menu"
                aria-expanded={open}
                onClick={() => setOpen(true)}
                className="lg:hidden text-white"
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

      <div style={{ height: 0 }} />

      <MobileMenu open={open} onClose={() => setOpen(false)} me={me} onLogout={logout} />
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
        className="flex items-center justify-center gap-2.5 px-4 py-2.5 text-white hover:underline"
      >
        <span className="rounded-full bg-gold px-2 py-0.5 text-[11px] font-bold text-navy">
          {ann.badge ?? site.announcement.badge}
        </span>
        <span className="text-[13px] md:text-[15px] font-medium">
          <strong>{ann.text}</strong>
        </span>
        <svg width="26" height="14" viewBox="0 0 32 16" fill="none">
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
}: {
  open: boolean;
  onClose: () => void;
  me: { fullName: string; role: string } | null | undefined;
  onLogout: () => Promise<void> | void;
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
      <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
        <Image src={site.logo} alt="Wazambi GPS" width={180} height={38} className="h-[26px] w-auto" />
        <button
          type="button"
          aria-label="Close main menu"
          onClick={onClose}
          className="text-white"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <nav className="overflow-y-auto max-h-[calc(100vh-72px)] px-5 py-6" aria-label="Mobile navigation">
        <ul className="space-y-1">
          {mobileNav.map((link) => {
            const isGrouped = link.parent === "Fleet Academy";
            const parentKey = link.parent ?? link.label;
            if (isGrouped || parentKey !== link.label) {
              const isFirstForGroup =
                mobileNav.filter((l) => l.parent === parentKey).findIndex((l) => l.href === link.href) === 0;
              if (!isFirstForGroup) return null;
              const groupItems = mobileNav.filter((l) => l.parent === parentKey);
              const showCountBadge = parentKey === "Fleet Academy";
              return (
                <li key={parentKey} className="mb-3">
                  <button
                    type="button"
                    onClick={() => setExpanded((prev) => ({ ...prev, [parentKey]: !prev[parentKey] }))}
                    className="flex w-full items-center justify-between py-3.5 text-[17px] font-semibold uppercase tracking-wide"
                    aria-expanded={!!expanded[parentKey]}
                  >
                    {parentKey}
                    <svg
                      className={`transition-transform ${expanded[parentKey] ? "rotate-180" : ""}`}
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
                  <p className="sr-only">{showCountBadge ? "Free courses" : ""}</p>
                  {expanded[parentKey] && (
                    <ul className="mb-2 space-y-1 border-l border-white/10 pl-4">
                      {groupItems.map((item) => (
                        <li key={item.href}>
                          <Link href={item.href} className="block py-2 text-[15px] text-white/85">
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            }
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block py-3.5 text-[17px] font-medium text-white/95"
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 space-y-3 pb-10">
          {me ? (
            <>
              <Link
                href="/customer-admin"
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
              <div className="flex gap-3">
                <Link href="/customer-admin" onClick={onClose} className="btn-outline flex-1 border-white/40 text-white hover:bg-white hover:text-navy">
                  Client Login
                </Link>
                <Link href="/agents" className="btn-outline flex-1 border-white/40 text-white hover:bg-white hover:text-navy">
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