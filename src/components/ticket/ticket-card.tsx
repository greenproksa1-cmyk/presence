import Image from "next/image";
import { CalendarDays, MapPin, QrCode, ShieldCheck } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionary";
import type { EventSettingsView, Locale } from "@/lib/types";
import type { TicketView } from "@/lib/registration-service";
import { localized } from "@/i18n";
import { formatEventDate } from "@/lib/site-content";
import { formatDateTime } from "@/lib/format";
import { Badge } from "@/components/ui/card";
import { cn } from "@/lib/format";

export function TicketCard({
  view,
  settings,
  locale,
  dict,
  qrDataUrl,
  id,
  className,
  children,
}: {
  view: TicketView;
  settings: EventSettingsView;
  locale: Locale;
  dict: Dictionary;
  qrDataUrl: string;
  id?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const content = settings.content;
  const cancelled =
    view.ticketStatus === "CANCELLED" || view.registration.status === "CANCELLED";

  return (
    <article
      id={id}
      className={cn(
        "print-area relative overflow-hidden rounded-[1.4rem] border border-border bg-white shadow-card",
        className,
      )}
      aria-label={`${dict.ticket.pageTitle} — ${view.registration.registrationNumber}`}
    >
      <div className="relative overflow-hidden bg-navy-900 px-6 py-5 text-white sm:px-8">
        <div className="pointer-events-none absolute inset-0 pattern-dark opacity-60" />
        <div className="relative flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-white/20">
              <Image
                src={settings.logoUrl}
                alt=""
                width={48}
                height={48}
                unoptimized
                className="h-full w-full object-contain p-1"
              />
            </span>
            <div>
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-gold-300">
                {content.brand.tagline[locale]}
              </p>
              <h2 className="mt-1 text-[0.98rem] font-bold leading-5 text-white">
                {content.brand.name[locale]}
              </h2>
            </div>
          </div>
          <Badge
            tone={cancelled ? "danger" : "success"}
            className="border-transparent bg-white/10 text-white backdrop-blur"
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                cancelled ? "bg-red-400" : "bg-emerald-400",
              )}
              aria-hidden="true"
            />
            {cancelled ? dict.ticket.cancelled : dict.ticket.confirmed}
          </Badge>
        </div>
      </div>

      <div className="h-1 bg-gradient-to-r from-gold-500 via-gold-300 to-gold-500" aria-hidden="true" />

      <div className="relative grid gap-6 p-6 sm:grid-cols-[minmax(0,1fr)_11rem] sm:p-8">
        <div className="min-w-0">
          <div>
            <p className="text-[0.65rem] font-medium tracking-wide text-muted-soft">
              {dict.ticket.attendee}
            </p>
            <p className="mt-1 break-words text-[1.35rem] font-bold leading-snug text-navy-950">
              {view.registration.fullName}
            </p>
            <p className="mt-1 text-[0.8rem] text-muted">
              {view.registration.jobTitle}
              {view.registration.company ? ` · ${view.registration.company}` : ""}
            </p>
          </div>

          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-[0.63rem] font-medium tracking-wide text-muted-soft">
                {dict.ticket.registrationNo}
              </dt>
              <dd
                dir="ltr"
                className="mt-1 inline-block rounded-md bg-cream-200 px-2 py-1 font-mono text-[0.82rem] font-bold tracking-wide text-navy-900"
              >
                {view.registration.registrationNumber}
              </dd>
            </div>
            <div>
              <dt className="text-[0.63rem] font-medium tracking-wide text-muted-soft">
                {dict.ticket.status}
              </dt>
              <dd className="mt-1.5">
                <Badge tone={cancelled ? "danger" : "success"}>
                  {cancelled ? dict.ticket.cancelled : dict.ticket.confirmed}
                </Badge>
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="flex items-center gap-1.5 text-[0.63rem] font-medium tracking-wide text-muted-soft">
                <CalendarDays className="h-3 w-3" aria-hidden="true" />
                {dict.ticket.date}
              </dt>
              <dd className="mt-1 text-[0.82rem] font-semibold leading-6 text-navy-900">
                {formatEventDate(locale, settings.eventDate)}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="flex items-center gap-1.5 text-[0.63rem] font-medium tracking-wide text-muted-soft">
                <MapPin className="h-3 w-3" aria-hidden="true" />
                {dict.ticket.venue}
              </dt>
              <dd className="mt-1 text-[0.82rem] font-semibold leading-6 text-navy-900">
                {localized(content.event.venueName, locale)}
                <span className="mt-0.5 block text-[0.72rem] font-normal text-muted">
                  {localized(content.event.venueAddress, locale)}
                </span>
              </dd>
            </div>
          </dl>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div
            className={cn(
              "relative rounded-2xl border border-border bg-white p-3 shadow-sm",
              cancelled && "opacity-40 grayscale",
            )}
          >
            {/* QR is generated server-side as a data URL, so no personal data
                leaves the page and it keeps working when printed or screenshotted. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrDataUrl}
              alt={`QR ${view.registration.registrationNumber}`}
              width={168}
              height={168}
              className="h-[10.5rem] w-[10.5rem]"
            />
            {cancelled ? (
              <span className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/70 text-[0.8rem] font-bold text-red-700">
                {dict.ticket.cancelled}
              </span>
            ) : null}
          </div>
          <p className="mt-2.5 inline-flex items-center gap-1 text-center text-[0.63rem] leading-5 text-muted-soft">
            <QrCode className="h-3 w-3" aria-hidden="true" />
            {dict.ticket.scanHint}
          </p>
        </div>
      </div>

      <div className="relative border-t border-dashed border-border-strong px-6 py-4 sm:px-8">
        <span className="absolute -start-2.5 -top-2.5 h-5 w-5 rounded-full border border-border bg-cream-100" aria-hidden="true" />
        <span className="absolute -end-2.5 -top-2.5 h-5 w-5 rounded-full border border-border bg-cream-100" aria-hidden="true" />
        <div className="flex flex-wrap items-center justify-between gap-2 text-[0.66rem] text-muted-soft">
          <p className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-gold-600" aria-hidden="true" />
            {localized(content.event.note, locale)}
          </p>
          <p>
            {dict.ticket.issuedAt}: {formatDateTime(locale, view.issuedAt)}
          </p>
        </div>
      </div>

      {children}
    </article>
  );
}
