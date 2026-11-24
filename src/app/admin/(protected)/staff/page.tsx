import { ShieldCheck, UserCog } from "lucide-react";
import { getDictionary } from "@/i18n";
import { getLocale } from "@/i18n/server";
import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/db";
import { formatDateTime } from "@/lib/format";
import { Badge, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StaffForm } from "./staff-form";
import { toggleStaffActiveAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminStaffPage() {
  await requireAdmin();
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const labels = dict.admin.staff;

  let admins: Awaited<ReturnType<typeof prisma.adminUser.findMany>> = [];
  let staff: Awaited<ReturnType<typeof prisma.staffUser.findMany>> = [];
  try {
    [admins, staff] = await Promise.all([
      prisma.adminUser.findMany({ orderBy: { createdAt: "asc" } }),
      prisma.staffUser.findMany({ orderBy: { createdAt: "desc" } }),
    ]);
  } catch (error) {
    console.error("[admin/staff] query failed", error);
  }

  return (
    <div className="container-page space-y-5 py-6 sm:py-8">
      <header>
        <h1 className="text-2xl font-bold text-navy-950">{labels.title}</h1>
        <p className="mt-1 text-sm text-muted">{labels.subtitle}</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <h2 className="flex items-center gap-2 border-b border-border px-4 py-3 text-[0.9rem] font-bold text-navy-900">
              <ShieldCheck className="h-4 w-4 text-gold-600" aria-hidden="true" />
              {labels.admins}
            </h2>
            <ul className="divide-y divide-border/60">
              {admins.map((admin) => (
                <li key={admin.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-[0.85rem] font-semibold text-navy-900">{admin.name}</p>
                    <p className="truncate text-[0.7rem] text-muted" dir="ltr">
                      {admin.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone="gold">{labels.roleAdmin}</Badge>
                    <span className="text-[0.68rem] text-muted-soft">
                      {admin.lastLoginAt ? formatDateTime(locale, admin.lastLoginAt) : labels.never}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="overflow-hidden">
            <h2 className="flex items-center gap-2 border-b border-border px-4 py-3 text-[0.9rem] font-bold text-navy-900">
              <UserCog className="h-4 w-4 text-gold-600" aria-hidden="true" />
              {labels.staff}
            </h2>
            {staff.length === 0 ? (
              <p className="p-4 text-sm text-muted">{labels.empty}</p>
            ) : (
              <ul className="divide-y divide-border/60">
                {staff.map((member) => (
                  <li key={member.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-[0.85rem] font-semibold text-navy-900">{member.name}</p>
                      <p className="truncate text-[0.7rem] text-muted" dir="ltr">
                        {member.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge tone={member.isActive ? "success" : "danger"}>
                        {member.isActive ? labels.active : labels.inactive}
                      </Badge>
                      <span className="text-[0.68rem] text-muted-soft">
                        {member.lastLoginAt ? formatDateTime(locale, member.lastLoginAt) : labels.never}
                      </span>
                      <form action={toggleStaffActiveAction}>
                        <input type="hidden" name="id" value={member.id} />
                        <input type="hidden" name="active" value={member.isActive ? "false" : "true"} />
                        <Button type="submit" variant="outline" size="sm">
                          {member.isActive ? labels.deactivate : labels.activate}
                        </Button>
                      </form>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <StaffForm
          labels={{
            addTitle: labels.addTitle,
            name: labels.name,
            email: labels.email,
            password: labels.password,
            passwordHint: labels.passwordHint,
            generate: labels.generate,
            create: labels.create,
            creating: labels.creating,
            created: labels.created,
            createFailed: labels.createFailed,
            passwordOnce: labels.passwordOnce,
          }}
        />
      </div>
    </div>
  );
}
