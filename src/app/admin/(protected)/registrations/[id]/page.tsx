import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, QrCode } from "lucide-react";
import { getDictionary } from "@/i18n";
import { getLocale } from "@/i18n/server";
import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/db";
import { formatDateTime } from "@/lib/format";
import { decryptTicketToken, ticketUrl } from "@/lib/crypto";
import { formatEventDate } from "@/lib/site-content";
import { Badge, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cancelRegistrationAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function RegistrationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const { id } = await params;

  const registration = await prisma.registration
    .findUnique({
      where: { id },
      include: {
        ticket: true,
        checkIn: true,
        emailLogs: { orderBy: { createdAt: "desc" }, take: 5 },
      },
    })
    .catch((error: unknown) => {
      console.error("[admin/registration] query failed", error);
      return null;
    });

  if (!registration) notFound();

  const orgTypes = dict.orgTypes as Record<string, string>;
  const rawToken = registration.ticket
    ? decryptTicketToken(registration.ticket.tokenCipher)
    : null;
  const cancelled = registration.status === "CANCELLED";

  const rows: Array<{ label: string; value: string; ltr?: boolean }> = [
    { label: dict.register.fullName, value: registration.fullName },
    { label: dict.register.email, value: registration.email, ltr: true },
    { label: dict.register.phone, value: registration.phone, ltr: true },
    { label: dict.register.country, value: registration.countryCode, ltr: true },
    { label: dict.register.city, value: registration.city },
    { label: dict.register.company, value: registration.company },
    { label: dict.register.jobTitle, value: registration.jobTitle },
    {
      label: dict.register.organizationType,
      value: orgTypes[registration.organizationType] ?? registration.organizationType,
    },
    { label: dict.register.interest, value: registration.interest ?? "—" },
    { label: dict.admin.registrations.date, value: formatDateTime(locale, registration.createdAt) },
    {
      label: dict.admin.checkIn.at,
      value: registration.checkIn ? formatDateTime(locale, registration.checkIn.checkedInAt) : "—",
    },
    { label: dict.home.eventDateLabel, value: formatEventDate(locale, registration.createdAt) },
  ];

  return (
    <div className="container-page space-y-5 py-6 sm:py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/admin/registrations"
            className="inline-flex items-center gap-1 text-[0.75rem] font-medium text-muted hover:text-gold-700"
          >
            <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
            {dict.admin.registrations.title}
          </Link>
          <h1 className="mt-1 text-2xl font-bold text-navy-950">{registration.fullName}</h1>
          <p className="mt-0.5 font-mono text-sm text-muted" dir="ltr">
            {registration.registrationNumber}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={cancelled ? "danger" : "success"}>
            {cancelled
              ? dict.admin.registrations.filterCancelled
              : dict.admin.registrations.filterConfirmed}
          </Badge>
          <Badge tone={registration.checkIn ? "gold" : "neutral"}>
            {registration.checkIn
              ? dict.admin.registrations.filterCheckedIn
              : dict.admin.registrations.checkIn}
          </Badge>
          {rawToken ? (
            <Button asChild variant="outline" size="sm">
              <Link href={`/ticket/${rawToken}`} target="_blank" rel="noopener noreferrer">
                <QrCode className="h-4 w-4" aria-hidden="true" />
                {dict.ticket.viewTicket}
              </Link>
            </Button>
          ) : null}
          {!cancelled ? (
            <form action={cancelRegistrationAction}>
              <input type="hidden" name="id" value={registration.id} />
              <Button type="submit" variant="danger" size="sm">
                {dict.admin.registrations.cancelAction}
              </Button>
            </form>
          ) : null}
        </div>
      </div>

      <Card className="p-4 sm:p-6">
        <dl className="grid gap-4 sm:grid-cols-2">
          {rows.map((row, index) => (
            <div key={`${row.label}-${index}`}>
              <dt className="text-[0.68rem] font-medium text-muted-soft">{row.label}</dt>
              <dd
                className="mt-0.5 break-words text-[0.85rem] font-medium text-navy-900"
                dir={row.ltr ? "ltr" : undefined}
              >
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </Card>

      <Card className="p-4 sm:p-6">
        <h2 className="flex items-center gap-2 text-[0.9rem] font-bold text-navy-900">
          <Mail className="h-4 w-4 text-gold-600" aria-hidden="true" />
          Email
        </h2>
        {registration.emailLogs.length === 0 ? (
          <p className="mt-2 text-sm text-muted">—</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {registration.emailLogs.map((log) => (
              <li
                key={log.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 text-[0.75rem]"
              >
                <span className="text-navy-900">{log.template}</span>
                <span className="text-muted">{formatDateTime(locale, log.createdAt)}</span>
                <Badge tone={log.status === "SENT" ? "success" : log.status === "FAILED" ? "danger" : "neutral"}>
                  {log.status}
                </Badge>
              </li>
            ))}
          </ul>
        )}
        {rawToken ? (
          <p className="mt-3 break-all text-[0.68rem] text-muted-soft" dir="ltr">
            {ticketUrl(rawToken)}
          </p>
        ) : null}
      </Card>
    </div>
  );
}
