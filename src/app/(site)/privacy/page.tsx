import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { getDictionary, localized } from "@/i18n";
import { getLocale } from "@/i18n/server";
import { getEventSettings, formatEventDateCompact } from "@/lib/site-content";
import { PageHero } from "@/components/site/page-hero";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/format";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const settings = await getEventSettings();
  return {
    title: settings.content.privacy.title[locale],
    description: settings.content.privacy.intro[locale],
    alternates: { canonical: "/privacy" },
  };
}

export default async function PrivacyPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const settings = await getEventSettings();
  const privacy = settings.content.privacy;
  const updated = settings.updatedAt ?? new Date("2026-11-23T00:00:00+03:00");
  const hasContact = Boolean(settings.contactEmail || settings.contactPhone);

  return (
    <>
      <PageHero
        eyebrow={dict.privacy.eyebrow}
        title={localized(privacy.title, locale)}
        description={localized(privacy.intro, locale)}
        homeLabel={dict.nav.home}
        currentLabel={dict.nav.privacy}
      >
        <p className="mt-4 text-[0.72rem] text-muted-soft">
          {dict.privacy.lastUpdated}: {formatEventDateCompact(locale, updated)}
        </p>
      </PageHero>

      <section className="section-pad bg-white">
        <div className="container-page grid gap-10 lg:grid-cols-[15rem_1fr] lg:gap-14">
          <nav aria-label={localized(privacy.title, locale)} className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-gold-700">
              {localized(privacy.title, locale)}
            </p>
            <ol className="mt-3 space-y-1.5">
              {privacy.sections.map((section, index) => (
                <li key={section.title.en}>
                  <a
                    href={`#section-${index + 1}`}
                    className="flex gap-2 rounded-lg px-2 py-1.5 text-[0.78rem] leading-6 text-muted transition-colors hover:bg-cream-100 hover:text-navy-900"
                  >
                    <span className="font-mono text-[0.7rem] text-gold-600">{index + 1}.</span>
                    {localized(section.title, locale)}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="max-w-3xl space-y-10">
            {privacy.sections.map((section, index) => (
              <article key={section.title.en} id={`section-${index + 1}`} className="scroll-mt-28">
                <h2 className="flex items-baseline gap-2.5 text-[1.15rem] font-bold text-navy-950">
                  <span className="font-mono text-[0.8rem] text-gold-600">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {localized(section.title, locale)}
                </h2>
                <div className="mt-3 space-y-3 border-s-2 border-gold-200 ps-4 text-[0.9rem] leading-8 text-muted">
                  {(section.body[locale] || section.body.ar).map((paragraph) => (
                    <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                  ))}
                </div>
              </article>
            ))}

            <div className="rounded-2xl border border-border bg-cream-50 p-6">
              <h2 className="text-[1rem] font-bold text-navy-900">{dict.privacy.contactTitle}</h2>
              <p className="mt-1.5 text-[0.85rem] leading-7 text-muted">
                {hasContact ? dict.privacy.contactBody : dict.footer.noContact}
              </p>
              {hasContact ? (
                <div className="mt-4 flex flex-wrap gap-3 text-[0.82rem]">
                  {settings.contactEmail ? (
                    <a
                      href={`mailto:${settings.contactEmail}`}
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2")}
                    >
                      <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                      <span dir="ltr">{settings.contactEmail}</span>
                    </a>
                  ) : null}
                  {settings.contactPhone ? (
                    <a
                      href={`tel:${settings.contactPhone.replace(/[^\d+]/g, "")}`}
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2")}
                      dir="ltr"
                    >
                      <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                      {settings.contactPhone}
                    </a>
                  ) : null}
                </div>
              ) : null}
            </div>

            <Link
              href="/"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-1.5")}
            >
              <ArrowLeft className="h-3.5 w-3.5 flip-icon" aria-hidden="true" />
              {dict.privacy.backHome}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
