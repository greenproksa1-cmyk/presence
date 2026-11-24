import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, QrCode, ShieldCheck, Ticket } from "lucide-react";
import { getDictionary, localized } from "@/i18n";
import { getLocale } from "@/i18n/server";
import { getEventSettings, formatEventDate } from "@/lib/site-content";
import { PageHero } from "@/components/site/page-hero";
import { AudienceSection } from "@/components/site/audience-section";
import { EventSection } from "@/components/site/event-section";
import { CtaSection } from "@/components/site/cta-section";
import { contentIcon } from "@/components/site/icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/format";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const settings = await getEventSettings();
  const about = settings.content.about;
  return {
    title: locale === "ar" ? "عن المنتدى" : "About the forum",
    description: about.lead[locale],
    alternates: { canonical: "/about" },
  };
}

export default async function AboutPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const settings = await getEventSettings();
  const content = settings.content;
  const about = content.about;

  return (
    <>
      <PageHero
        eyebrow={dict.about.eyebrow}
        title={localized(about.title, locale)}
        description={localized(about.lead, locale)}
        homeLabel={dict.nav.home}
        currentLabel={dict.nav.about}
      >
        <div className="mt-6 flex flex-wrap gap-2.5 text-[0.75rem]">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 font-medium text-navy-800">
            <Ticket className="h-3.5 w-3.5 text-gold-600" aria-hidden="true" />
            {localized(content.event.participationValue, locale)}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 font-medium text-navy-800">
            <QrCode className="h-3.5 w-3.5 text-gold-600" aria-hidden="true" />
            {dict.home.instantTicket}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 font-medium text-navy-800">
            <ShieldCheck className="h-3.5 w-3.5 text-gold-600" aria-hidden="true" />
            {dict.home.officialPlatform}
          </span>
        </div>
      </PageHero>

      <section className="section-pad bg-white">
        <div className="container-page grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-16">
          <div>
            <div className="space-y-5 text-[0.95rem] leading-8 text-muted">
              {(about.paragraphs[locale] || about.paragraphs.ar).map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-9 grid gap-3 sm:grid-cols-3">
              {about.points.map((point) => {
                const Icon = contentIcon(point.icon);
                return (
                  <div key={point.title.en} className="rounded-xl border border-border bg-cream-50 p-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-100 text-gold-800">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <h2 className="mt-3 text-[0.85rem] font-bold text-navy-900">
                      {localized(point.title, locale)}
                    </h2>
                    <p className="mt-1 text-[0.73rem] leading-6 text-muted">
                      {localized(point.body, locale)}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-9 rounded-2xl border border-border bg-cream-50 p-5">
              <p className="text-[0.7rem] font-semibold uppercase tracking-wide text-gold-700">
                {dict.home.eventDateLabel}
              </p>
              <p className="mt-1.5 text-[1rem] font-bold text-navy-900">
                {formatEventDate(locale, settings.eventDate)}
              </p>
              <p className="mt-1 text-[0.85rem] text-muted">
                {localized(content.event.venueName, locale)} —{" "}
                {localized(content.event.venueAddress, locale)}
              </p>
              <div className="mt-4 flex flex-wrap gap-2.5">
                <Link
                  href="/register"
                  className={cn(buttonVariants({ variant: "gold", size: "sm" }), "gap-1.5")}
                >
                  {localized(content.hero.primaryCta, locale)}
                  <ArrowLeft className="h-3.5 w-3.5 flip-icon" aria-hidden="true" />
                </Link>
                <a
                  href={settings.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}
                >
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  {dict.home.mapCta}
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="relative overflow-hidden rounded-[1.6rem] border border-border">
              <Image
                src={settings.aboutImageUrl}
                alt={dict.home.aboutImageAlt}
                width={1100}
                height={1300}
                sizes="(max-width: 1024px) 92vw, 44vw"
                className="aspect-[4/5] w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/85 to-transparent p-5 pt-20">
                <p className="text-[0.68rem] font-medium tracking-wide text-gold-200">
                  {content.brand.tagline[locale]}
                </p>
                <p className="mt-1 text-[0.95rem] font-bold text-white">
                  {content.brand.shortName[locale]}
                </p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-[1.4rem] border border-border">
              <Image
                src={settings.venueImageUrl}
                alt={localized(content.event.venueName, locale)}
                width={1100}
                height={620}
                sizes="(max-width: 1024px) 92vw, 44vw"
                className="aspect-[16/9] w-full object-cover"
              />
              <div className="absolute start-4 top-4 rounded-full bg-white/92 px-3 py-1.5 text-[0.68rem] font-bold text-navy-900 backdrop-blur">
                {dict.home.locationTitle}
              </div>
            </div>
          </div>
        </div>
      </section>

      <AudienceSection settings={settings} locale={locale} dict={dict} />
      <EventSection settings={settings} locale={locale} dict={dict} />
      <CtaSection settings={settings} locale={locale} note={dict.home.ctaNote} />

      <section className="bg-white py-12">
        <div className="container-page flex flex-col items-start justify-between gap-5 rounded-2xl border border-border bg-cream-50 p-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-[1.05rem] font-bold text-navy-900">
              {localized(content.privacy.title, locale)}
            </h2>
            <p className="mt-1 max-w-xl text-[0.82rem] leading-7 text-muted">
              {localized(content.privacy.intro, locale)}
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/privacy">
              {dict.footer.privacy}
              <ArrowLeft className="h-4 w-4 flip-icon" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
