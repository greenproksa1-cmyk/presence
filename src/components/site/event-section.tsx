import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ExternalLink, MapPin, Ticket } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionary";
import type { EventSettingsView, Locale } from "@/lib/types";
import { localized } from "@/i18n";
import { formatEventDate } from "@/lib/site-content";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/format";

export function EventSection({
  settings,
  locale,
  dict,
}: {
  settings: EventSettingsView;
  locale: Locale;
  dict: Dictionary;
}) {
  const event = settings.content.event;

  const rows = [
    {
      icon: CalendarDays,
      label: dict.home.eventDateLabel,
      value: formatEventDate(locale, settings.eventDate),
    },
    {
      icon: MapPin,
      label: dict.home.venueLabel,
      value: `${localized(event.venueName, locale)} — ${localized(event.venueAddress, locale)}`,
    },
    {
      icon: Ticket,
      label: event.participationLabel[locale],
      value: localized(event.participationValue, locale),
    },
  ];

  return (
    <section id="event" className="section-pad bg-cream-100">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-[1.9rem] border border-navy-800 bg-navy-900 text-white shadow-card">
          <div className="pointer-events-none absolute inset-0 pattern-dark opacity-40" />
          <div className="relative grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="p-7 sm:p-10 lg:p-12">
              <p className="eyebrow mb-3 text-gold-300">
                <span className="h-px w-6 bg-gold-400" aria-hidden="true" />
                {localized(event.title, locale)}
              </p>
              <h2 className="max-w-md text-[1.7rem] leading-[1.45] text-white sm:text-[2rem]">
                {localized(event.venueName, locale)}
              </h2>
              <p className="mt-2 max-w-lg text-[0.9rem] leading-7 text-white/65">
                {localized(event.venueAddress, locale)}
              </p>

              <dl className="mt-8 space-y-4">
                {rows.map((row) => (
                  <div key={row.label} className="flex items-start gap-3.5">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gold-300">
                      <row.icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div>
                      <dt className="text-[0.65rem] font-medium tracking-wide text-white/45">
                        {row.label}
                      </dt>
                      <dd className="mt-1 text-[0.85rem] font-medium leading-6 text-white/90">
                        {row.value}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={settings.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ variant: "gold", size: "sm" }),
                    "gap-2",
                  )}
                >
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  {dict.home.mapCta}
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
                <Link
                  href="/register"
                  className="inline-flex h-9 items-center gap-2 rounded-xl border border-white/15 px-4 text-[0.8rem] font-semibold text-white transition-colors hover:bg-white/10"
                >
                  {localized(settings.content.hero.primaryCta, locale)}
                </Link>
              </div>

              <p className="mt-6 border-t border-white/10 pt-5 text-[0.72rem] leading-6 text-white/55">
                {localized(event.note, locale)}
              </p>
            </div>

            <div className="relative min-h-[19rem] lg:min-h-full">
              <Image
                src={settings.venueImageUrl}
                alt={localized(event.venueName, locale)}
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/55 via-transparent to-transparent lg:bg-gradient-to-l" />
              <div className="absolute bottom-5 end-5 rounded-xl border border-white/20 bg-navy-950/80 px-4 py-3 backdrop-blur">
                <p className="text-[0.62rem] font-medium tracking-wide text-gold-300">
                  {dict.home.locationTitle}
                </p>
                <p className="mt-1 text-[0.8rem] font-semibold text-white">
                  {dict.home.locationHint}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
