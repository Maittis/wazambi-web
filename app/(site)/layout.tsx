import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSessionStaff } from "@/lib/auth";

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  let initialMe: { id: number; fullName: string; email: string; role: string } | null = null;
  try {
    const staff = await getSessionStaff();
    if (staff) {
      initialMe = { id: staff.id, fullName: staff.fullName, email: staff.email, role: staff.role };
    }
  } catch {
    initialMe = null;
  }
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-navy focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to main content
      </a>
      <Header initialMe={initialMe} />
      <main id="main-content">{children}</main>
      <Footer initialMe={initialMe} />
    </>
  );
}