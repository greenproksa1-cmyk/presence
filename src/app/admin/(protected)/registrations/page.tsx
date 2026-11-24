import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { Check, ChevronLeft, ChevronRight, Clock, Download, Search } from "lucide-react";
import { getDictionary } from "@/i18n";
import { getLocale } from "@/i18n/server";
import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/db";
import { formatDateTime } from "@/lib/format";
import { Badge, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/field";
import { cancelRegistrationAction } from "./actions";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

type RegistrationRow = Prisma.RegistrationGetPayload<{
  include: {
    ticket: { select: { status: true } };
    checkIn: { select: { checkedInAt: true } };
  };
}>;

interface SearchParams {
  q?: string;
  status?: string;
  page?: string;
}

export default async function AdminRegistrationsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await requireAdmin();
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const params = await searchParams;

  const q = (params.q ?? "").trim().slice(0, 120);
  const status = params.status ?? "all";
  const requestedPage = Number.parseInt(params.page ?? "1", 10);
  const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const where: Prisma.RegistrationWhereInput = {};
  if (status === "confirmed") where.status = "CONFIRMED";
  else if (status === "cancelled") where.status = "CANCELLED";
  else if (status === "checkedin") where.checkIn = { isNot: null };

  if (q) {
    where.OR = [
      { registrationNumber: { contains: q.toUpperCase(), mode: "insensitive" } },
      { fullName: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { phone: { contains: q } },
      { company: { contains: q, mode: "insensitive" } },
    ];
  }

  let rows: RegistrationRow[] = [];
  let count = 0;
  try {
    [rows, count] = await Promise.all([
      prisma.registration.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        include: {
          ticket: { select: { status: true } },
          checkIn: { select: { checkedInAt: true } },
        },
      }),
      prisma.registration.count({ where }),
    ]);
  } catch (error) {
    console.error("[admin/registrations] query failed", error);
  }

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));
  const orgTypes = dict.orgTypes as Record<string, string>;
  const buildHref = (nextPage: number) => {
    const search = new URLSearchParams();
    if (q) search.set("q", q);
    if (status !== "all") search.set("status", status);
    if (nextPage > 1) search.set("page", String(nextPage));
    const qs = search.toString();
    return `/admin/registrations${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="container-page space-y-5 py-6 sm:py-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-950">{dict.admin.registrations.title}</h1>
          <p className="mt-1 text-sm text-muted">{dict.admin.registrations.subtitle}</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <a href="/api/admin/export?type=registrations">
            <Download className="h-4 w-4" aria-hidden="true" />
            {dict.admin.registrations.exportCsv}
          </a>
        </Button>
      </header>

      <Card className="p-3 sm:p-4">
        <form method="get" action="/admin/registrations" className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_12rem_auto]">
          <div className="relative">
            <Search
              className="pointer-events-none absolute inset-y-0 start-3 my-auto h-4 w-4 text-muted-soft"
              aria-hidden="true"
            />
            <Input
              name="q"
              defaultValue={q}
              placeholder={dict.admin.registrations.searchPlaceholder}
              className="ps-9"
              aria-label={dict.admin.registrations.searchPlaceholder}
            />
          </div>
          <Select name="status" defaultValue={status} aria-label={dict.admin.registrations.status}>
            <option value="all">{dict.admin.registrations.filterAll}</option>
            <option value="confirmed">{dict.admin.registrations.filterConfirmed}</option>
            <option value="cancelled">{dict.admin.registrations.filterCancelled}</option>
            <option value="checkedin">{dict.admin.registrations.filterCheckedIn}</option>
          </Select>
          <Button type="submit" variant="primary">
            {dict.common.apply}
          </Button>
        </form>
      </Card>

      <Card className="overflow-hidden">
        {rows.length === 0 ? (
          <p className="p-6 text-sm text-muted">{dict.admin.registrations.empty}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[60rem] text-sm">
              <thead className="bg-cream-50 text-[0.68rem] uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-3 py-2.5 text-start font-medium">{dict.admin.registrations.name}</th>
                  <th className="px-3 py-2.5 text-start font-medium">{dict.admin.registrations.email}</th>
                  <th className="px-3 py-2.5 text-start font-medium">{dict.admin.registrations.phone}</th>
                  <th className="px-3 py-2.5 text-start font-medium">{dict.admin.registrations.company}</th>
                  <th className="px-3 py-2.5 text-start font-medium">{dict.admin.registrations.type}</th>
                  <th className="px-3 py-2.5 text-start font-medium">{dict.admin.registrations.date}</th>
                  <th className="px-3 py-2.5 text-start font-medium">{dict.admin.registrations.status}</th>
                  <th className="px-3 py-2.5 text-start font-medium">{dict.admin.registrations.checkIn}</th>
                  <th className="px-3 py-2.5 text-start font-medium">{dict.admin.registrations.actions}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-t border-border/60 align-top">
                    <td className="px-3 py-3">
                      <Link
                        href={`/admin/registrations/${row.id}`}
                        className="font-medium text-navy-900 hover:text-gold-700"
                      >
                        {row.fullName}
                      </Link>
                      <span className="mt-0.5 block font-mono text-[0.68rem] text-muted-soft" dir="ltr">
                        {row.registrationNumber}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-muted" dir="ltr">
                      {row.email}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-muted" dir="ltr">
                      {row.phone}
                    </td>
                    <td className="px-3 py-3 text-muted">{row.company}</td>
                    <td className="px-3 py-3 text-[0.75rem] text-muted">
                      {orgTypes[row.organizationType] ?? row.organizationType}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-[0.72rem] text-muted">
                      {formatDateTime(locale, row.createdAt)}
                    </td>
                    <td className="px-3 py-3">
                      <Badge tone={row.status === "CONFIRMED" ? "success" : "danger"}>
                        {row.status === "CONFIRMED"
                          ? dict.admin.registrations.filterConfirmed
                          : dict.admin.registrations.filterCancelled}
                      </Badge>
                    </td>
                    <td className="px-3 py-3">
                      {row.checkIn ? (
                        <span className="inline-flex items-center gap-1 text-[0.72rem] text-emerald-700">
                          <Check className="h-3.5 w-3.5" aria-hidden="true" />
                          {formatDateTime(locale, row.checkIn.checkedInAt)}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[0.72rem] text-muted-soft">
                          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                          —
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/registrations/${row.id}`}>
                            {dict.admin.registrations.details}
                          </Link>
                        </Button>
                        {row.status === "CONFIRMED" ? (
                          <form action={cancelRegistrationAction}>
                            <input type="hidden" name="id" value={row.id} />
                            <Button type="submit" variant="danger" size="sm">
                              {dict.admin.registrations.cancelAction}
                            </Button>
                          </form>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-3 py-2.5 text-[0.72rem] text-muted">
          <span>
            {dict.admin.registrations.showing} {rows.length} / {count}
          </span>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={buildHref(Math.max(1, page - 1))} aria-disabled={page <= 1}>
                <ChevronLeft className="h-3.5 w-3.5 rtl:hidden" aria-hidden="true" />
                <ChevronRight className="hidden h-3.5 w-3.5 rtl:inline" aria-hidden="true" />
                {dict.admin.registrations.previous}
              </Link>
            </Button>
            <span className="tabular-nums">
              {page} / {totalPages}
            </span>
            <Button asChild variant="outline" size="sm">
              <Link href={buildHref(Math.min(totalPages, page + 1))} aria-disabled={page >= totalPages}>
                {dict.admin.registrations.next}
                <ChevronRight className="h-3.5 w-3.5 rtl:hidden" aria-hidden="true" />
                <ChevronLeft className="hidden h-3.5 w-3.5 rtl:inline" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
