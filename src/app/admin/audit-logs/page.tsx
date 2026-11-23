"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/format";
import { Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getDictionary, getLocale } from "@/i18n";
import { prisma } from "@/lib/db";

export default function AdminAuditLogsPage() {
  const router = useRouter();
  const [locale, setLocale] = useState("ar");
  useEffect(() => {
    getLocale().then(l => setLocale(l));
  }, []);
  const dict = getDictionary(locale);

  // Auth check - admin only
  const { user } = useAdminAuth();
  if (!user || user.role !== "ADMIN") {
    router.push("/admin/login");
    return null;
  }

  const [auditLogs, setAuditLogs] = useState<Array<{
    id: string;
    action: string;
    entityType: string;
    entityId: string | null;
    actorType: "ADMIN" | "STAFF" | "SYSTEM";
    actorName: string;
    details: any;
    createdAt: Date;
    ipHash: string | null;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const rows = await prisma.auditLog.findMany({
          include: {
            adminUser: { select: { name: true } },
            staffUser: { select: { name: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 100,
        });
        setAuditLogs(
          rows.map((a) => ({
            id: a.id,
            action: a.action,
            entityType: a.entityType,
            entityId: a.entityId ?? "—",
            actorType: a.actorType,
            actorName: a.actorName ?? "النظام",
            details: a.details ?? {},
            createdAt: a.createdAt,
            ipHash: a.ipHash,
          }))
        );
      } catch (error) {
        console.error("[admin-audit-logs] failed to load", error);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

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
            {dict.nav.auditLogs}
          </h1>
          <p className="text-muted mt-1">
            {dict.auth.staffNote}
          </p>
        </header>

        <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-card">
          <p className="text-[0.7rem] text-muted mb-4">
            {auditLogs.length} {dict.nav.logEntry}
          </p>

          {auditLogs.length === 0 && (
            <p className="text-muted">لا توجد سجلات تدقيق</p>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-2 font-medium text-navy-800">العملية</th>
                  <th className="text-left p-2 font-medium text-navy-800">الكائن</th>
                  <th className="text-left p-2 font-medium text-navy-800">النوع</th>
                  <th className="text-left p-2 font-medium text-navy-800">المستخدم</th>
                  <th className="text-left p-2 font-medium text-navy-800">التاريخ</th>
                  <th className="text-left p-2 font-medium text-navy-800">عنوان IP</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id} className="border-b border-border/50">
                    <td className="p-2">{log.action}</td>
                    <td className="p-2 break-words">{log.entityType}</td>
                    <td className="p-2">
                      <Badge tone={log.actorType === "ADMIN" ? "navy" : log.actorType === "STAFF" ? "gold" : "muted"}>
                        {log.actorType}
                      </Badge>
                    </td>
                    <td className="p-2">{log.actorName}</td>
                    <td className="p-2">
                      {log.createdAt ? formatEventDate(locale, log.createdAt) : "—"}
                    </td>
                    <td className="p-2">
                      {log.ipHash ? "مخفي" : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}