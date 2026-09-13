import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wazambi GPS | GPS Tracking, Fuel Monitoring & Fleet Management",
  description:
    "Wazambi GPS helps vehicle owners and businesses track vehicles live, control fuel misuse and manage fleets — all from your phone. Get a free fleet assessment.",
  keywords: ["GPS tracking Zambia", "fuel monitoring", "fleet management", "vehicle tracking", "Wazambi"],
  openGraph: {
    title: "Wazambi GPS | GPS Tracking, Fuel Monitoring & Fleet Management",
    description:
      "Track every vehicle live, control fuel misuse, monitor drivers and manage your fleet — all from your phone.",
    type: "website",
    locale: "en_US",
    url: "https://wazambigps.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-poppins`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-navy focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}