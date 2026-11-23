import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  MapPin,
  QrCode,
  ShieldCheck,
  Ticket,
} from "lucide-react";
import type { Dictionary } from "@/i18n/dictionary";
import type { Locale } from "@/lib/types";
import type { EventSettingsView } from "@/lib/types";
import { localized } from "@/i18n";
import { formatEventDate, formatEventDateCompact } from "@/lib/site-content";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/site/logo";
import { cn } from "@/lib/format";

export function Hero({
  settings,
  locale,
  dict,
}: {
  settings: EventSettingsView;
  locale: Locale;
  dict: Dictionary;
}) {
  const content = settings.content;
  const hero = content.hero;
  const event = content.event;

  return (
    <section className="relative overflow-hidden border-b border-border bg-cream-100">
      <div className="pointer-events-none absolute inset-0 pattern-light opacity-50" />
      <div className="pointer-events-none absolute -top-24 end-[-10%] h-72 w-72 rounded-full border border-gold-200/50" />
      <div className="container-page relative grid gap-12 py-12 sm:py-16 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-16 lg:py-20">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-navy-100 bg-white/80 px-3.5 py-1.5 text-[0.7rem] font-semibold text-navy-700">
            <ShieldCheck className="h-3.5 w-3.5 text-gold-600" aria-hidden="true" />
            {dict.home.officialPlatform}
          </p>

          <div className="mt-6 flex items-center gap-3">
            <Logo src={settings.logoUrl} size={58} priority />
            <div>
              <p className="text-[0.72rem] font-semibold tracking-[0.12em] text-gold-700 uppercase">
                {content.brand.tagline.en}
              </p>
              <p className="mt-0.5 text-[0.78rem] font-medium text-muted">
                {content.brand.name[locale]}
              </p>
            </div>
          </div>

          <h1 className="mt-6 text-[2.2rem] leading-[1.28] text-navy-950 sm:text-[2.8rem] lg:text-[3.3rem]">
            <span>{localized(hero.titleBefore, locale)}</span>{" "}
            <span className="relative inline-block text-gold-600">
              {localized(hero.titleHighlight, locale)}
              <svg
                className="absolute -bottom-1 left-0 h-2 w-full text-gold-300"
                viewBox="0 0 200 8"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M2 5.5C55 2 140 2 198 4.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>{" "}
            <span>{localized(hero.titleAfter, locale)}</span>
          </h1>

          <p className="mt-5 max-w-xl text-[0.98rem] leading-8 text-muted sm:text-[1.02rem]">
            {localized(hero.description, locale)}
          </p>

          <dl className="mt-7 grid max-w-xl gap-3 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-xl border border-border bg-white/75 p-3.5">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold-50 text-gold-700">
                <CalendarDays className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <dt className="text-[0.68rem] font-medium text-muted-soft">
                  {dict.home.eventDateLabel}
                </dt>
                <dd className="mt-0.5 text-[0.82rem] font-semibold leading-6 text-navy-900">
                  {formatEventDate(locale, settings.eventDate)}
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-border bg-white/75 p-3.5">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold-50 text-gold-700">
                <MapPin className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <dt className="text-[0.68rem] font-medium text-muted-soft">
                  {dict.home.venueLabel}
                </dt>
                <dd className="mt-0.5 text-[0.82rem] font-semibold leading-6 text-navy-900">
                  {localized(event.venueName, locale)}
                </dd>
              </div>
            </div>
          </dl>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/register"
              className={cn(
                buttonVariants({ variant: "gold", size: "lg" }),
                "h-12 gap-2 px-6 text-[0.92rem]",
              )}
            >
              <Ticket className="h-4.5 w-4.5" aria-hidden="true" />
              {localized(hero.primaryCta, locale)}
              <ArrowLeft className="h-4 w-4 flip-icon" aria-hidden="true" />
            </Link>
            <a
              href="#event"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-12 px-5 text-[0.9rem]",
              )}
            >
              {localized(hero.secondaryCta, locale)}
            </a>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.72rem] font-medium text-muted">
            <span className="inline-flex items-center gap-1.5">
              <QrCode className="h-3.5 w-3.5 text-gold-600" aria-hidden="true" />
              {dict.home.instantTicket}
            </span>
            <span className="h-3 w-px bg-border-strong" aria-hidden="true" />
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
              {dict.home.freeAttendance}
            </span>
            <span className="h-3 w-px bg-border-strong" aria-hidden="true" />
            <span>{localized(event.participationValue, locale)}</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[30rem] lg:max-w-none">
          <div
            className="absolute -bottom-4 -start-4 h-full w-full rounded-[1.9rem] border border-gold-300/70"
            aria-hidden="true"
          />
          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/60 bg-navy-900 shadow-card">
            <Image
              src={settings.heroImageUrl}
              alt={dict.home.heroImageAlt}
              width={1000}
              height={1250}
              priority
              sizes="(max-width: 1024px) 90vw, 44vw"
              className="aspect-[4/5] w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/85 via-navy-950/25 to-transparent p-4 pt-16">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-[0.65rem] font-medium tracking-wide text-gold-200">
                    {localized(event.dateNote, locale)}
                  </p>
                  <p className="mt-1 text-[1.05rem] font-bold text-white">
                    {formatEventDateCompact(locale, settings.eventDate)}
                  </p>
                </div>
                <span className="rounded-full bg-gold-400 px-3 py-1 text-[0.66rem] font-bold text-navy-950">
                  {localized(event.participationValue, locale)}
                </span>
              </div>
            </div>
          </div>

          <div className="relative -mt-6 me-4 ms-auto w-[86%] rounded-2xl border border-border bg-white p-3.5 shadow-card">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-50 text-navy-800">
                <MapPin className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[0.78rem] font-bold text-navy-900">
                  {localized(event.venueName, locale)}
                </p>
                <p className="mt-0.5 line-clamp-1 text-[0.68rem] text-muted">
                  {localized(event.venueAddress, locale)}
                </p>
              </div>
              <ArrowUpRight className="ms-auto h-4 w-4 shrink-0 text-gold-600 flip-icon" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
