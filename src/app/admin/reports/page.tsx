"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/format";
import { Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getDictionary, getLocale } from "@/i18n";
import { prisma } from "@/lib/db";

export default function AdminReportsPage() {
  const router = useRouter();
  const [locale, setLocale] = useState("ar");
  useEffect(() => {
    getLocale().then(l => setLocale(l));
  }, []);
  const dict = getDictionary(locale);

  // Auth check
  const { user } = useAdminAuth();
  if (!user || user.role !== "ADMIN") {
    router.push("/admin/login");
    return null;
  }

  const [registrations, setRegistrations] = useState<Array<{
    id: string;
    registrationNumber: string;
    fullName: string;
    email: string;
    locale: "ar" | "en";
    status: "CONFIRMED" | "CANCELLED";
    createdAt: Date;
    checkedInAt: Date | null;
    ticketStatus: "CONFIRMED" | "CANCELLED" | null;
  }>>([]);
  const [checkIns, setCheckIns] = useState<Array<{
    id: string;
    checkedInAt: Date;
    method: "QR" | "MANUAL";
    operatorName: string | null;
    ipHash: string | null;
    registration: {
      fullName: string;
      registrationNumber: string;
    };
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // Load registrations
        const regRows = await prisma.registration.findMany({
          include: {
            ticket: { select: { status: true, issuedAt: true } },
            checkIn: { select: { checkedInAt: true } },
          },
          orderBy: { createdAt: "desc" },
        });
        setRegistrations(
          regRows.map((r) => ({
            id: r.id,
            registrationNumber: r.registrationNumber,
            fullName: r.fullName,
            email: r.email,
            locale: r.locale as "ar" | "en",
            status: r.status as "CONFIRMED" | "CANCELLED",
            createdAt: r.createdAt,
            checkedInAt: r.checkIn?.checkedInAt ?? null,
            ticketStatus: r.ticket?.status as "CONFIRMED" | "CANCELLED" | null,
          }))
        );

        // Load check-ins
        const checkInRows = await prisma.checkIn.findMany({
          include: {
            registration: {
              select: { fullName: true, registrationNumber: true },
            },
            staffUser: { select: { name: true } },
            adminUser: { select: { name: true } },
          },
          orderBy: { checkedInAt: "desc" },
        });
        setCheckIns(
          checkInRows.map((c) => ({
            id: c.id,
            checkedInAt: c.checkedInAt,
            method: c.method,
            operatorName: c.operatorName ?? c.adminUser?.name ?? null,
            ipHash: c.ipHash,
            registration: {
              fullName: c.registration?.fullName ?? "",
              registrationNumber: c.registration?.registrationNumber ?? "",
            },
          }))
        );
      } catch (error) {
        console.error("[admin-reports] failed to load", error);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  if (isLoading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-cream-100">
        <p className="text-lg text-muted">جاري تحميل البيانات...</p>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-cream-100">
      <div className="container-page p-6 sm:p-8 lg:p-10">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-navy-950">
            {dict.nav.reports}
          </h1>
          <p className="text-muted mt-1">
            {dict.auth.staffNote}
          </p>
        </header>

        {/* Registrations summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl border border-border p-4 sm:p-6 shadow-card">
            <h3 className="text-[0.8rem] font-bold text-navy-900 uppercase tracking-wider mb-3">
              {dict.nav.registrations}
            </h3>
            <p className="text-3xl font-bold text-navy-950">{registrations.length}</p>
            <p className="text-muted mt-2">
              {registrations.filter((r) => r.status === "CONFIRMED").length}
              {dict.common.confirmed}
            </p>
            <p className="text-muted mt-1">
              {registrations.filter((r) => r.status === "CANCELLED").length}
              {dict.common.cancelled}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-border p-4 sm:p-6 shadow-card">
            <h3 className="text-[0.8rem] font-bold text-navy-900 uppercase tracking-wider mb-3">
              {dict.checkIn.checkIns}
            </h3>
            <p className="text-3xl font-bold text-navy-950">{checkIns.length}</p>
            <p className="text-muted mt-2">
              {checkIns.filter((c) => c.method === "QR").length}
              {dict.checkIn.qrMethod}
            </p>
            <p className="text-muted mt-1">
              {checkIns.filter((c) => c.method === "MANUAL").length}
              {dict.checkIn.manualMethod}
            </p>
          </div>
        </div>

        {/* Registrations table */}
        <div className="bg-white rounded-2xl border border-border shadow-card">
          <h2 className="text-[0.85rem] font-bold text-navy-900 uppercase tracking-wider mb-3">
            {dict.nav.registrations}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-2 font-medium text-navy-800">رقم التسجيل</th>
                  <th className="text-left p-2 font-medium text-navy-800">اسم المشارك</th>
                  <th className="text-left p-2 font-medium text-navy-800">البريد الإلكتروني</th>
                  <th className="text-left p-2 font-medium text-navy-800">الحالة</th>
                  <th className="text-left p-2 font-medium text-navy-800">التحقق</th>
                  <th className="text-left p-2 font-medium text-navy-800">تاريخ التسجيل</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg) => (
                  <tr key={reg.id} className="border-b border-border/50">
                    <td className="p-2 font-mono text-navy-900">{reg.registrationNumber}</td>
                    <td className="p-2">{reg.fullName}</td>
                    <td className="p-2 break-words">{reg.email}</td>
                    <td className="p-2">
                      <Badge tone={reg.status === "CONFIRMED" ? "success" : "danger"}>
                        {reg.status === "CONFIRMED" ? "مؤكدة" : "ملغاة"}
                      </Badge>
                    </td>
                    <td className="p-2">
                      {reg.checkedInAt ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                      ) : (
                        <Clock className="h-3.5 w-3.5 text-muted-soft" aria-hidden="true" />
                      )}
                    </td>
                    <td className="p-2">
                      {reg.createdAt ? formatEventDate(locale, reg.createdAt) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Check-ins table */}
        <div className="mt-6 bg-white rounded-2xl border border-border shadow-card">
          <h2 className="text-[0.85rem] font-bold text-navy-900 uppercase tracking-wider mb-3">
            {dict.checkIn.checkInHistory}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-2 font-medium text-navy-800">اسم المشارك</th>
                  <th className="text-left p-2 font-medium text-navy-800">رقم التسجيل</th>
                  <th className="text-left p-2 font-medium text-navy-800">طريقة التحقق</th>
                  <th className="text-left p-2 font-medium text-navy-800">المشرف</th>
                  <th className="text-left p-2 font-medium text-navy-800">تاريخ التحقق</th>
                </tr>
              </thead>
              <tbody>
                {checkIns.map((checkIn) => (
                  <tr key={checkIn.id} className="border-b border-border/50">
                    <td className="p-2">{checkIn.registration.fullName}</td>
                    <td className="p-2 font-mono text-navy-900">{checkIn.registration.registrationNumber}</td>
                    <td className="p-2">
                      <Badge tone={checkIn.method === "QR" ? "success" : "info"}>
                        {checkIn.method === "QR" ? "QR" : "يدوي"}
                      </Badge>
                    </td>
                    <td className="p-2">{checkIn.operatorName || "—"}</td>
                    <td className="p-2">
                      {checkIn.checkedInAt ? formatEventDate(locale, checkIn.checkedInAt) : "—"}
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