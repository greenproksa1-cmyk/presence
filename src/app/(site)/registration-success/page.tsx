import type { Metadata } from "next";
import Link from "next/link";
import QRCode from "qrcode";
import { ArrowLeft, CheckCircle2, TicketX } from "lucide-react";
import { getDictionary } from "@/i18n";
import { getLocale } from "@/i18n/server";
import { getEventSettings } from "@/lib/site-content";
import { getTicketByRawToken } from "@/lib/registration-service";
import { getRecentTicket } from "@/lib/recent-ticket";
import { ticketUrl } from "@/lib/crypto";
import { TicketCard } from "@/components/ticket/ticket-card";
import { TicketActions } from "@/components/ticket/ticket-actions";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "تم التسجيل | Registration complete",
  robots: { index: false, follow: false, nocache: true },
};

export default async function RegistrationSuccessPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const settings = await getEventSettings();
  const recent = await getRecentTicket();

  let ticket: Awaited<ReturnType<typeof getTicketByRawToken>> = null;
  if (recent?.token) {
    ticket = await getTicketByRawToken(recent.token).catch((error: unknown) => {
      console.error("[registration-success] lookup failed", error);
      return null;
    });
  }

  if (!ticket || !recent) {
    return (
      <section className="container-page flex min-h-[70vh] items-center justify-center py-12">
        <div className="w-full max-w-md rounded-2xl border border-border bg-white p-8 text-center shadow-card">
          <span className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cream-200 text-navy-800">
            <TicketX className="h-6 w-6" aria-hidden="true" />
          </span>
          <h1 className="text-xl font-bold text-navy-950">{dict.ticket.notFoundTitle}</h1>
          <p className="mt-2 text-sm leading-7 text-muted">{dict.success.missingTicket}</p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Button asChild variant="gold">
              <Link href="/register">{dict.success.registerAnother}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">{dict.ticket.backHome}</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  const shareUrl = ticketUrl(recent.token);
  const qrDataUrl = await QRCode.toDataURL(shareUrl, {
    margin: 1,
    width: 336,
    errorCorrectionLevel: "M",
    color: { dark: "#16224a", light: "#ffffff" },
  });

  return (
    <section className="container-page space-y-5 py-8 sm:py-12">
      <header className="mx-auto max-w-2xl text-center">
        <span className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
        </span>
        <h1 className="text-2xl font-bold text-navy-950 sm:text-3xl">{dict.success.title}</h1>
        <p className="mt-2 text-sm leading-7 text-muted">{dict.success.description}</p>
        <p className="mt-3 inline-block rounded-md bg-cream-200 px-2.5 py-1 font-mono text-[0.8rem] font-bold text-navy-900" dir="ltr">
          {ticket.registration.registrationNumber}
        </p>
      </header>

      <div className="mx-auto max-w-2xl space-y-4">
        <TicketCard
          view={ticket}
          settings={settings}
          locale={locale}
          dict={dict}
          qrDataUrl={qrDataUrl}
          id="ticket-card"
        />

        <TicketActions
          cardId="ticket-card"
          registrationNumber={ticket.registration.registrationNumber}
          shareUrl={shareUrl}
          shareMessage={`${dict.ticket.shareMessage} — ${ticket.registration.registrationNumber}`}
          labels={{
            copyNumber: dict.ticket.copyNumber,
            copied: dict.ticket.copied,
            print: dict.ticket.print,
            downloadPdf: dict.ticket.downloadPdf,
            generatingPdf: dict.ticket.generatingPdf,
            pdfError: dict.ticket.pdfError,
            shareWhatsApp: dict.ticket.shareWhatsApp,
            pdfFileName: dict.ticket.pdfFileName,
          }}
        />

        <p className="text-center text-[0.75rem] leading-6 text-muted">{dict.success.emailNote}</p>

        <div className="flex flex-wrap justify-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={shareUrl}>{dict.success.viewTicket}</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/register">{dict.success.registerAnother}</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
              {dict.ticket.backHome}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
