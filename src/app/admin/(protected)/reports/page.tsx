import { Download } from "lucide-react";
import { getDictionary } from "@/i18n";
import { getLocale } from "@/i18n/server";
import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/db";
import { Badge, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

interface Bucket {
  key: string;
  count: number;
}

function toBuckets(rows: Array<{ key: string | null; count: number }>, fallback: string): Bucket[] {
  return rows.map((row) => ({ key: row.key ?? fallback, count: row.count }));
}

export default async function AdminReportsPage() {
  await requireAdmin();
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const labels = dict.admin.reports;

  let total = 0;
  let checkedIn = 0;
  let byOrganization: Bucket[] = [];
  let byCountry: Bucket[] = [];
  let byDay: Bucket[] = [];

  try {
    const [registrations, checkIns, orgRows, countryRows, createdAtRows] = await Promise.all([
      prisma.registration.count(),
      prisma.checkIn.count(),
      prisma.registration.groupBy({ by: ["organizationType"], _count: { _all: true } }),
      prisma.registration.groupBy({ by: ["countryCode"], _count: { _all: true } }),
      prisma.registration.findMany({ select: { createdAt: true }, orderBy: { createdAt: "desc" }, take: 2000 }),
    ]);

    total = registrations;
    checkedIn = checkIns;
    byOrganization = toBuckets(
      orgRows.map((row) => ({ key: row.organizationType, count: row._count._all })),
      "other",
    ).sort((a, b) => b.count - a.count);
    byCountry = toBuckets(
      countryRows.map((row) => ({ key: row.countryCode, count: row._count._all })),
      "—",
    ).sort((a, b) => b.count - a.count);

    const perDay = new Map<string, number>();
    for (const row of createdAtRows) {
      const key = row.createdAt.toISOString().slice(0, 10);
      perDay.set(key, (perDay.get(key) ?? 0) + 1);
    }
    byDay = Array.from(perDay.entries())
      .map(([key, count]) => ({ key, count }))
      .sort((a, b) => (a.key < b.key ? 1 : -1))
      .slice(0, 14);
  } catch (error) {
    console.error("[admin/reports] query failed", error);
  }

  const rate = total > 0 ? Math.round((checkedIn / total) * 100) : 0;
  const orgTypes = dict.orgTypes as Record<string, string>;
  const maxDay = Math.max(1, ...byDay.map((bucket) => bucket.count));

  return (
    <div className="container-page space-y-5 py-6 sm:py-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-950">{labels.title}</h1>
          <p className="mt-1 text-sm text-muted">{labels.subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <a href="/api/admin/export?type=registrations">
              <Download className="h-4 w-4" aria-hidden="true" />
              {labels.exportRegistrations}
            </a>
          </Button>
          <Button asChild variant="outline" size="sm">
            <a href="/api/admin/export?type=checkins">
              <Download className="h-4 w-4" aria-hidden="true" />
              {labels.exportCheckIns}
            </a>
          </Button>
        </div>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-[0.72rem] text-muted">{labels.total}</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-navy-950">{total}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[0.72rem] text-muted">{labels.checkedIn}</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-emerald-700">{checkedIn}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[0.72rem] text-muted">{labels.attendanceRate}</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-gold-700">{rate}%</p>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4 sm:p-5">
          <h2 className="text-[0.9rem] font-bold text-navy-900">{labels.byOrganization}</h2>
          {byOrganization.length === 0 ? (
            <p className="mt-2 text-sm text-muted">{labels.empty}</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {byOrganization.map((bucket) => (
                <li key={bucket.key} className="flex items-center gap-2 text-[0.78rem]">
                  <span className="w-36 shrink-0 truncate text-muted">
                    {orgTypes[bucket.key] ?? bucket.key}
                  </span>
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-cream-200">
                    <span
                      className="block h-full rounded-full bg-navy-700"
                      style={{ width: `${Math.round((bucket.count / Math.max(1, total)) * 100)}%` }}
                    />
                  </span>
                  <span className="w-10 text-end tabular-nums text-navy-900">{bucket.count}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-4 sm:p-5">
          <h2 className="text-[0.9rem] font-bold text-navy-900">{labels.byCountry}</h2>
          {byCountry.length === 0 ? (
            <p className="mt-2 text-sm text-muted">{labels.empty}</p>
          ) : (
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {byCountry.slice(0, 24).map((bucket) => (
                <li key={bucket.key}>
                  <Badge tone="navy">
                    <span dir="ltr">{bucket.key}</span>
                    <span className="tabular-nums">{bucket.count}</span>
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card className="p-4 sm:p-5">
        <h2 className="text-[0.9rem] font-bold text-navy-900">{labels.byDay}</h2>
        {byDay.length === 0 ? (
          <p className="mt-2 text-sm text-muted">{labels.empty}</p>
        ) : (
          <div className="mt-4 flex h-40 items-end gap-1.5">
            {byDay
              .slice()
              .reverse()
              .map((bucket) => (
                <div key={bucket.key} className="flex min-w-0 flex-1 flex-col items-center gap-1">
                  <span className="text-[0.6rem] tabular-nums text-muted">{bucket.count}</span>
                  <div
                    className="w-full rounded-t bg-gradient-to-t from-navy-800 to-navy-500"
                    style={{ height: `${Math.max(4, (bucket.count / maxDay) * 100)}%` }}
                    title={`${bucket.key}: ${bucket.count}`}
                  />
                  <span className="text-[0.58rem] text-muted-soft" dir="ltr">
                    {bucket.key.slice(5)}
                  </span>
                </div>
              ))}
          </div>
        )}
      </Card>
    </div>
  );
}
