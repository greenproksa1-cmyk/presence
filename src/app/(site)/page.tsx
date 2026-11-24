import type { Metadata } from "next";
import { getDictionary, localized } from "@/i18n";
import { getLocale } from "@/i18n/server";
import { getEventSettings, formatEventDate, EVENT_TIMEZONE } from "@/lib/site-content";
import { getSiteUrl } from "@/lib/crypto";
import { Hero } from "@/components/site/hero";
import { AboutSection } from "@/components/site/about-section";
import { EventSection } from "@/components/site/event-section";
import { AudienceSection } from "@/components/site/audience-section";
import { CtaSection } from "@/components/site/cta-section";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const settings = await getEventSettings();
  return {
    title: settings.content.seo.title[locale],
    description: settings.content.seo.description[locale],
    alternates: { canonical: "/" },
  };
}

export default async function HomePage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const settings = await getEventSettings();
  const content = settings.content;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: content.brand.name[locale],
    startDate: settings.eventDate.toISOString(),
    endDate: settings.eventDate.toISOString(),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    timeZone: EVENT_TIMEZONE,
    description: content.seo.description[locale],
    url: getSiteUrl(),
    image: [`${getSiteUrl()}/og.jpg`],
    location: {
      "@type": "Place",
      name: localized(content.event.venueName, locale),
      address: {
        "@type": "PostalAddress",
        streetAddress: localized(content.event.venueAddress, locale),
        addressLocality: locale === "ar" ? "مكة المكرمة" : "Makkah",
        addressCountry: "SA",
      },
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "SAR",
      availability: "https://schema.org/InStock",
      url: `${getSiteUrl()}/register`,
      description: `${formatEventDate(locale, settings.eventDate)} — ${content.event.participationValue[locale]}`,
    },
    organizer: {
      "@type": "Organization",
      name: content.brand.name[locale],
      url: getSiteUrl(),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Static, server-generated event data only. `<` is escaped so the
        // payload can never terminate the script element.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replaceAll("<", "\\u003c"),
        }}
      />
      <Hero settings={settings} locale={locale} dict={dict} />
      <AboutSection settings={settings} locale={locale} dict={dict} />
      <EventSection settings={settings} locale={locale} dict={dict} />
      <AudienceSection settings={settings} locale={locale} dict={dict} />
      <CtaSection settings={settings} locale={locale} note={dict.home.ctaNote} />
    </>
  );
}
