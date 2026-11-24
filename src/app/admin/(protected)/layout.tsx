import { redirect } from "next/navigation";
import { getDictionary } from "@/i18n";
import { getLocale } from "@/i18n/server";
import { getAuth } from "@/lib/session";
import { can } from "@/lib/rbac";
import { AdminShell, type AdminNavItem } from "@/components/admin/admin-shell";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const auth = await getAuth();
  if (!auth.user) redirect("/admin/login");

  const locale = await getLocale();
  const dict = getDictionary(locale);
  const user = auth.user;

  const allItems: Array<AdminNavItem & { permission: Parameters<typeof can>[1] }> = [
    { href: "/admin/dashboard", label: dict.nav.dashboard, permission: "dashboard:view" },
    { href: "/admin/registrations", label: dict.nav.registrations, permission: "registrations:view" },
    { href: "/admin/check-in", label: dict.nav.checkIn, permission: "checkin:use" },
    { href: "/admin/staff", label: dict.nav.staff, permission: "staff:manage" },
    { href: "/admin/reports", label: dict.nav.reports, permission: "reports:view" },
    { href: "/admin/settings", label: dict.nav.settings, permission: "settings:manage" },
    { href: "/admin/audit-logs", label: dict.nav.auditLogs, permission: "audit:view" },
  ];

  const items = allItems
    .filter((item) => can(user, item.permission))
    .map(({ href, label }) => ({ href, label }));

  return (
    <AdminShell user={user} locale={locale} dict={dict} items={items}>
      {children}
    </AdminShell>
  );
}
