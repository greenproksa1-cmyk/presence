import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clipboard, Eye, Users, Settings, } from "lucide-react";
import { getDictionary, getLocale } from "@/i18n";
import { getEventSettings } from "@/lib/site-content";
import { prisma } from "@/lib/db";

export async function generateMetadata() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  return {
    title: dict.nav.dashboard,
    description: "Admin dashboard for Makkah Food Catering & Supply Forum",
  };
}

export default async function AdminDashboard() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  // Fetch data from DB
  const registrations = await prisma.registration.findMany({
    include: {
      ticket: { select: { status: true } },
      checkIn: { select: { checkedInAt: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const eventSettings = await getEventSettings();

  return (
    <section className="min-h-screen bg-cream-100">
      <div className="container-page p-6 sm:p-8 lg:p-10">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-navy-950">
            {dict.nav.dashboard}
          </h1>
          <p className="text-muted mt-1">
            {dict.auth.staffNotice}
          </p>
        </header>

        <section>
          <h2 className="text-[1rem] font-bold text-navy-900 mb-4">
            {dict.nav.registrations}
          </h2>
          {registrations.length === 0 && (
            <p className="text-muted">لا توجد Registrations بعد</p>
          )}
          <div className="bg-white rounded-2xl border border-border p-4 sm:p-6 shadow-card">
            <p className="text-muted">
              إجمالي: {registrations.length} تسجيل
            </p>
          </div>
        </section>
      </div>
    </section>
  );
}