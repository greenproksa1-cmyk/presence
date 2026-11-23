import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, MapPin, QrCode, ShieldCheck, Ticket } from "lucide-react";
import { getDictionary, getLocale, localized } from "@/i18n";
import { getEventSettings, formatEventDate } from "@/lib/site-content";
import { getCountryOptions } from "@/lib/countries";
import { ORGANIZATION_TYPES } from "@/lib/types";
import { PageHero } from "@/components/site/page-hero";
import { RegistrationForm } from "@/components/site/registration-form";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "التسجيل | Register",
  robots: { index: true, follow: true },
};

export default async function RegisterPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const settings = await getEventSettings();
  const content = settings.content;
  const countries = getCountryOptions(locale);
  const orgTypes = ORGANIZATION_TYPES.map((value) => ({
    value,
    label: dict.orgTypes[value],
  }));
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || null;
  const startedAt = Date.now();

  return (
    <>
      <PageHero
        eyebrow={dict.nav.register}
        title={dict.register.title}
        description={dict.register.description}
        locale={locale}
        homeLabel={dict.nav.home}
        currentLabel={dict.nav.register}
        compact
      >
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[0.75rem] font-medium text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Ticket className="h-3.5 w-3.5 text-gold-600" aria-hidden="true" />
            {localized(content.event.participationValue, locale)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <QrCode className="h-3.5 w-3.5 text-gold-600" aria-hidden="true" />
            {dict.home.instantTicket}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-gold-600" aria-hidden="true" />
            {dict.register.secureNote}
          </span>
        </div>
      </PageHero>

      <section className="bg-cream-100 py-8 sm:py-12">
        <div className="container-page grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
          <Card className="overflow-hidden">
            <div className="border-b border-border bg-white px-6 py-4 sm:px-8">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-[0.78rem] font-semibold text-navy-900">
                  {dict.register.requiredHint}
                </p>
                <span className="rounded-full bg-cream-200 px-2.5 py-1 text-[0.68rem] font-medium text-muted">
                  {content.brand.tagline[locale]}
                </span>
              </div>
            </div>
            <div className="p-6 sm:p-8">
              <RegistrationForm
                locale={locale}
                dict={dict}
                countries={countries}
                orgTypes={orgTypes}
                turnstileSiteKey={turnstileSiteKey}
                startedAt={startedAt}
              />
            </div>
          </Card>

          <aside className="space-y-4 lg:sticky lg:top-28">
            <div className="overflow-hidden rounded-2xl border border-navy-800 bg-navy-900 text-white shadow-card">
              <div className="border-b border-white/10 p-5">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-gold-300">
                  {localized(content.event.title, locale)}
                </p>
                <p className="mt-2 text-[1.02rem] font-bold leading-7 text-white">
                  {localized(content.brand.name, locale)}
                </p>
              </div>
              <dl className="space-y-4 p-5">
                <div className="flex items-start gap-3">
                  <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" aria-hidden="true" />
                  <div>
                    <dt className="text-[0.65rem] text-white/45">{dict.home.eventDateLabel}</dt>
                    <dd className="mt-0.5 text-[0.8rem] font-medium leading-6 text-white/90">
                      {formatEventDate(locale, settings.eventDate)}
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" aria-hidden="true" />
                  <div>
                    <dt className="text-[0.65rem] text-white/45">{dict.home.venueLabel}</dt>
                    <dd className="mt-0.5 text-[0.8rem] font-medium leading-6 text-white/90">
                      {localized(content.event.venueName, locale)}
                      <span className="mt-0.5 block text-[0.7rem] font-normal text-white/50">
                        {localized(content.event.venueAddress, locale)}
                      </span>
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Ticket className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" aria-hidden="true" />
                  <div>
                    <dt className="text-[0.65rem] text-white/45">
                      {localized(content.event.participationLabel, locale)}
                    </dt>
                    <dd className="mt-0.5 text-[0.8rem] font-medium text-white/90">
                      {localized(content.event.participationValue, locale)}
                    </dd>
                  </div>
                </div>
              </dl>
            </div>

            <div className="rounded-2xl border border-border bg-white p-5">
              <h2 className="text-[0.85rem] font-bold text-navy-900">
                {dict.home.instantTicket}
              </h2>
              <p className="mt-1.5 text-[0.75rem] leading-6 text-muted">
                {localized(content.cta.description, locale)}
              </p>
              <div className="mt-3 rounded-lg border border-border bg-cream-50 p-3">
                <p className="flex items-center gap-2 text-[0.72rem] font-medium text-navy-800">
                  <QrCode className="h-3.5 w-3.5 text-gold-600" aria-hidden="true" />
                  {localized(content.event.note, locale)}
                </p>
              </div>
              <Link
                href="/privacy"
                className="mt-4 inline-flex items-center gap-1.5 text-[0.72rem] font-medium text-navy-700 underline underline-offset-4 hover:text-gold-700"
              >
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                {dict.footer.privacy}
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
