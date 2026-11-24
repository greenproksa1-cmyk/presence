import type { Metadata } from "next";
import Link from "next/link";
import QRCode from "qrcode";
import { ArrowLeft, TicketX } from "lucide-react";
import { getDictionary } from "@/i18n";
import { getLocale } from "@/i18n/server";
import { getEventSettings } from "@/lib/site-content";
import { getTicketByRawToken } from "@/lib/registration-service";
import { ticketUrl } from "@/lib/crypto";
import { isWellFormedTicketToken } from "@/lib/crypto";
import { TicketCard } from "@/components/ticket/ticket-card";
import { TicketActions } from "@/components/ticket/ticket-actions";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "تذكرة الحضور | Attendee ticket",
  robots: { index: false, follow: false, nocache: true },
};

export default async function TicketPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const settings = await getEventSettings();

  let ticket: Awaited<ReturnType<typeof getTicketByRawToken>> = null;
  if (isWellFormedTicketToken(token)) {
    ticket = await getTicketByRawToken(token).catch((error: unknown) => {
      console.error("[ticket] lookup failed", error);
      return null;
    });
  }

  if (!ticket) {
    return (
      <section className="container-page flex min-h-[70vh] items-center justify-center py-12">
        <div className="w-full max-w-md rounded-2xl border border-border bg-white p-8 text-center shadow-card">
          <span className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <TicketX className="h-6 w-6" aria-hidden="true" />
          </span>
          <h1 className="text-xl font-bold text-navy-950">{dict.ticket.notFoundTitle}</h1>
          <p className="mt-2 text-sm leading-7 text-muted">{dict.ticket.notFoundBody}</p>
          <Button asChild variant="outline" className="mt-5">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
              {dict.ticket.backHome}
            </Link>
          </Button>
        </div>
      </section>
    );
  }

  const shareUrl = ticketUrl(token);
  const qrDataUrl = await QRCode.toDataURL(shareUrl, {
    margin: 1,
    width: 336,
    errorCorrectionLevel: "M",
    color: { dark: "#16224a", light: "#ffffff" },
  });

  const cancelled =
    ticket.ticketStatus === "CANCELLED" || ticket.registration.status === "CANCELLED";

  return (
    <section className="container-page space-y-5 py-8 sm:py-12">
      <header className="mx-auto max-w-2xl text-center">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-gold-700">
          {dict.ticket.subtitle}
        </p>
        <h1 className="mt-2 text-2xl font-bold text-navy-950 sm:text-3xl">
          {cancelled ? dict.ticket.cancelledTitle : dict.ticket.pageTitle}
        </h1>
        <p className="mt-2 text-sm leading-7 text-muted">
          {cancelled ? dict.ticket.cancelledBody : dict.ticket.entryNote}
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

        {!cancelled ? (
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
        ) : null}

        <p className="text-center text-[0.72rem] text-muted-soft">{dict.ticket.qrNote}</p>

        <div className="text-center">
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
