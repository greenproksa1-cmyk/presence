import Link from "next/link";
import { LogOut, ShieldCheck } from "lucide-react";
import type { AuthUser } from "@/lib/session";
import type { Dictionary } from "@/i18n/dictionary";
import type { Locale } from "@/lib/types";
import { Badge } from "@/components/ui/card";
import { LanguageSwitch } from "@/components/site/language-switch";
import { AdminNav } from "@/components/admin/admin-nav";
import { signOutAction } from "@/app/admin/actions";

export interface AdminNavItem {
  href: string;
  label: string;
}

export function AdminShell({
  user,
  locale,
  dict,
  items,
  children,
}: {
  user: AuthUser;
  locale: Locale;
  dict: Dictionary;
  items: AdminNavItem[];
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-cream-100/95 backdrop-blur">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-navy-900 text-gold-300">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[0.9rem] font-bold text-navy-950">
                {dict.admin.consoleLabel}
              </p>
              <p className="truncate text-[0.7rem] text-muted">
                {dict.admin.signedInAs}: {user.name}
              </p>
            </div>
            <Badge tone={user.role === "ADMIN" ? "gold" : "navy"}>
              {user.role === "ADMIN" ? dict.admin.staff.roleAdmin : dict.admin.staff.roleStaff}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitch locale={locale} label={dict.switchLabel} compact />
            <Link
              href="/"
              className="rounded-lg px-2.5 py-2 text-[0.78rem] font-medium text-navy-800 hover:bg-white"
            >
              {dict.auth.backToSite}
            </Link>
            <form action={signOutAction}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border-strong bg-white px-2.5 py-2 text-[0.78rem] font-semibold text-navy-800 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700"
              >
                <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                {dict.nav.signOut}
              </button>
            </form>
          </div>
        </div>

        <div className="container-page">
          <AdminNav items={items} label={dict.admin.consoleLabel} />
        </div>
      </header>

      <main id="main" tabIndex={-1} className="flex-1">
        {children}
      </main>

      <footer className="border-t border-border py-4">
        <div className="container-page flex flex-wrap items-center justify-between gap-2 text-[0.7rem] text-muted-soft">
          <span>{dict.footer.builtNote}</span>
          <span>{dict.footer.accessNote}</span>
        </div>
      </footer>
    </div>
  );
}
