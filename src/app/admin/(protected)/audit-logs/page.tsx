import Link from "next/link";
import { ChevronLeft, ChevronRight, ScrollText } from "lucide-react";
import { getDictionary } from "@/i18n";
import { getLocale } from "@/i18n/server";
import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/db";
import { formatDateTime } from "@/lib/format";
import { Badge, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

export default async function AdminAuditLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  await requireAdmin();
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const labels = dict.admin.audit;
  const params = await searchParams;

  const requested = Number.parseInt(params.page ?? "1", 10);
  const page = Number.isFinite(requested) && requested > 0 ? requested : 1;

  let rows: Awaited<ReturnType<typeof prisma.auditLog.findMany>> = [];
  let count = 0;
  try {
    [rows, count] = await Promise.all([
      prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.auditLog.count(),
    ]);
  } catch (error) {
    console.error("[admin/audit-logs] query failed", error);
  }

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));
  const href = (nextPage: number) =>
    nextPage > 1 ? `/admin/audit-logs?page=${nextPage}` : "/admin/audit-logs";

  return (
    <div className="container-page space-y-5 py-6 sm:py-8">
      <header>
        <h1 className="text-2xl font-bold text-navy-950">{labels.title}</h1>
        <p className="mt-1 text-sm text-muted">{labels.subtitle}</p>
      </header>

      <Card className="overflow-hidden">
        {rows.length === 0 ? (
          <p className="p-6 text-sm text-muted">{labels.empty}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[46rem] text-sm">
              <thead className="bg-cream-50 text-[0.68rem] uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-3 py-2.5 text-start font-medium">{labels.when}</th>
                  <th className="px-3 py-2.5 text-start font-medium">{labels.actor}</th>
                  <th className="px-3 py-2.5 text-start font-medium">{labels.action}</th>
                  <th className="px-3 py-2.5 text-start font-medium">{labels.entity}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-t border-border/60 align-top">
                    <td className="whitespace-nowrap px-3 py-2.5 text-[0.72rem] text-muted">
                      {formatDateTime(locale, row.createdAt)}
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="text-[0.82rem] font-medium text-navy-900">{row.actorName}</span>
                      <Badge
                        tone={
                          row.actorType === "ADMIN"
                            ? "gold"
                            : row.actorType === "STAFF"
                              ? "navy"
                              : "neutral"
                        }
                        className="ms-2"
                      >
                        {row.actorType}
                      </Badge>
                    </td>
                    <td className="px-3 py-2.5 font-mono text-[0.75rem] text-navy-800" dir="ltr">
                      {row.action}
                    </td>
                    <td className="px-3 py-2.5 text-[0.75rem] text-muted">
                      <span className="inline-flex items-center gap-1">
                        <ScrollText className="h-3 w-3" aria-hidden="true" />
                        {row.entityType}
                      </span>
                      {row.entityId ? (
                        <span className="block truncate font-mono text-[0.63rem] text-muted-soft" dir="ltr">
                          {row.entityId}
                        </span>
                      ) : null}
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
              <Link href={href(Math.max(1, page - 1))} aria-disabled={page <= 1}>
                <ChevronLeft className="h-3.5 w-3.5 rtl:hidden" aria-hidden="true" />
                <ChevronRight className="hidden h-3.5 w-3.5 rtl:inline" aria-hidden="true" />
                {labels.previous}
              </Link>
            </Button>
            <span className="tabular-nums">
              {page} / {totalPages}
            </span>
            <Button asChild variant="outline" size="sm">
              <Link href={href(Math.min(totalPages, page + 1))} aria-disabled={page >= totalPages}>
                {labels.next}
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
