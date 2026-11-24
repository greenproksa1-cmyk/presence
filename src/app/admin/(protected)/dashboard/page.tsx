import Link from "next/link";
import { ArrowUpRight, CalendarCheck, CircleSlash, Ticket, Users } from "lucide-react";
import { getDictionary } from "@/i18n";
import { getLocale } from "@/i18n/server";
import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/db";
import { formatDateTime } from "@/lib/format";
import { Badge, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

async function loadDashboard() {
  const [total, confirmed, cancelled, checkedIn, recent] = await Promise.all([
    prisma.registration.count(),
    prisma.registration.count({ where: { status: "CONFIRMED" } }),
    prisma.registration.count({ where: { status: "CANCELLED" } }),
    prisma.checkIn.count(),
    prisma.registration.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: {
        ticket: { select: { status: true } },
        checkIn: { select: { checkedInAt: true } },
      },
    }),
  ]);
  return { total, confirmed, cancelled, checkedIn, recent };
}

export default async function AdminDashboardPage() {
  await requireAdmin();
  const locale = await getLocale();
  const dict = getDictionary(locale);

  let data: Awaited<ReturnType<typeof loadDashboard>> | null = null;
  try {
    data = await loadDashboard();
  } catch (error) {
    console.error("[admin/dashboard] query failed", error);
  }

  const total = data?.total ?? 0;
  const checkedIn = data?.checkedIn ?? 0;
  const rate = total > 0 ? Math.round((checkedIn / total) * 100) : 0;

  const stats = [
    {
      label: dict.admin.dashboard.totalRegistrations,
      value: total,
      icon: Users,
      tone: "text-navy-900",
    },
    {
      label: dict.admin.dashboard.confirmed,
      value: data?.confirmed ?? 0,
      icon: Ticket,
      tone: "text-emerald-700",
    },
    {
      label: dict.admin.dashboard.cancelled,
      value: data?.cancelled ?? 0,
      icon: CircleSlash,
      tone: "text-red-700",
    },
    {
      label: dict.admin.dashboard.checkedIn,
      value: checkedIn,
      icon: CalendarCheck,
      tone: "text-gold-700",
    },
  ];

  return (
    <div className="container-page space-y-6 py-6 sm:py-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-950">{dict.admin.dashboard.title}</h1>
          <p className="mt-1 text-sm text-muted">{dict.admin.dashboard.subtitle}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="gold" size="sm">
            <Link href="/admin/check-in">{dict.admin.dashboard.openCheckIn}</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <a href="/api/admin/export?type=registrations">{dict.admin.dashboard.exportData}</a>
          </Button>
        </div>
      </header>

      {!data ? (
        <Card className="border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {dict.admin.dashboard.empty}
        </Card>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[0.72rem] font-medium text-muted">{stat.label}</p>
              <stat.icon className={`h-4 w-4 ${stat.tone}`} aria-hidden="true" />
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums text-navy-950">{stat.value}</p>
          </Card>
        ))}
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[0.75rem] font-semibold text-navy-900">
            {dict.admin.dashboard.attendanceRate}
          </p>
          <span className="text-sm font-bold tabular-nums text-gold-700">{rate}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-cream-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-300"
            style={{ width: `${Math.min(100, Math.max(0, rate))}%` }}
          />
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
          <h2 className="text-[0.9rem] font-bold text-navy-900">{dict.admin.dashboard.recent}</h2>
          <Link
            href="/admin/registrations"
            className="inline-flex items-center gap-1 text-[0.75rem] font-semibold text-navy-800 hover:text-gold-700"
          >
            {dict.admin.dashboard.viewAll}
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        {data && data.recent.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream-50 text-[0.7rem] uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-2 text-start font-medium">{dict.admin.registrations.name}</th>
                  <th className="px-4 py-2 text-start font-medium">{dict.admin.registrations.company}</th>
                  <th className="px-4 py-2 text-start font-medium">{dict.admin.registrations.date}</th>
                  <th className="px-4 py-2 text-start font-medium">{dict.admin.registrations.checkIn}</th>
                </tr>
              </thead>
              <tbody>
                {data.recent.map((row) => (
                  <tr key={row.id} className="border-t border-border/60">
                    <td className="px-4 py-2.5">
                      <Link
                        href={`/admin/registrations/${row.id}`}
                        className="font-medium text-navy-900 hover:text-gold-700"
                      >
                        {row.fullName}
                      </Link>
                      <span className="block font-mono text-[0.68rem] text-muted-soft" dir="ltr">
                        {row.registrationNumber}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-muted">{row.company}</td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-[0.75rem] text-muted">
                      {formatDateTime(locale, row.createdAt)}
                    </td>
                    <td className="px-4 py-2.5">
                      <Badge tone={row.checkIn ? "success" : "neutral"}>
                        {row.checkIn ? dict.admin.registrations.filterCheckedIn : dict.admin.registrations.filterAll}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="p-4 text-sm text-muted">{dict.admin.dashboard.empty}</p>
        )}
      </Card>
    </div>
  );
}
