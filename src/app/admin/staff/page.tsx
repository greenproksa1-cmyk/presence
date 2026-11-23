"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/format";
import { Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getDictionary, getLocale } from "@/i18n";
import { prisma } from "@/lib/db";

export default function AdminStaffPage() {
  const router = useRouter();
  const [locale, setLocale] = useState("ar");
  useEffect(() => {
    getLocale().then(l => setLocale(l));
  }, []);
  const dict = getDictionary(locale);

  // Auth check - staff can only access check-in
  const { user } = useAdminAuth();
  if (!user || user.role !== "STAFF") {
    router.push("/admin/login");
    return null;
  }

  const [staffUsers, setStaffUsers] = useState<Array<{
    id: string;
    name: string;
    email: string;
    isActive: boolean;
    createdAt: Date;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const rows = await prisma.staffUser.findMany({
          orderBy: { createdAt: "desc" },
        });
        setStaffUsers(
          rows.map((s) => ({
            id: s.id,
            name: s.name,
            email: s.email,
            isActive: s.isActive,
            createdAt: s.createdAt,
          }))
        );
      } catch (error) {
        console.error("[admin-staff] failed to load", error);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const handleToggle = async (id: string) => {
    try {
      await prisma.staffUser.update({
        where: { id },
        data: { isActive: { not: { equals: true } } },
      });
      setStaffUsers((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, isActive: !s.isActive } : s
        )
      );
    } catch (error) {
      console.error("[admin-staff] toggle failed", error);
    }
  };

  if (isLoading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-cream-100">
        <p className="text-lg text-muted">جاري التحميل...</p>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-cream-100">
      <div className="container-page p-6 sm:p-8 lg:p-10">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-navy-950">
            {dict.nav.staff}
          </h1>
          <p className="text-muted mt-1">
            {user.role === "STAFF" ? dict.auth.staffNotice : ""}
          </p>
        </header>

        <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-card">
          <h2 className="text-[1rem] font-bold text-navy-900 mb-4">
            {dict.nav.staffManagement}
          </h2>

          {staffUsers.length === 0 && (
            <p className="text-muted">لا يوجد موظفون مسجلون</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {staffUsers.map((s) => (
              <div key={s.id} className="p-4 border border-border rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Badge
                    tone={s.isActive ? "success" : "danger"}
                    className="border-transparent"
                  >
                    <span className={cn(
                      "h-3.5 w-3.5",
                      s.isActive ? "bg-emerald-400" : "bg-red-400",
                    )} aria-hidden="true" />
                  </Badge>
                  <span className="font-medium text-navy-900">{s.name}</span>
                </div>
                <p className="text-[0.75rem] text-muted">
                  {s.email}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[0.65rem] font-medium">
                    {s.isActive ? "نشط" : "معطل"}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggle(s.id)}
                    className="gap-1"
                  >
                    {s.isActive ? "تعطيل" : "تنشيط"}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <Button
              variant="gold"
              size="sm"
              onClick={() =>
                router.push("/admin/staff/new")
              }
              className="w-full gap-2"
            >
              <Users className="h-4 w-4" aria-hidden="true" />
              {dict.common.addNew}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}