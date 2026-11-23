"use client";

import { useState, useEffect } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { cn } from "@/lib/format";
import { Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { Select } from "@/components/ui/field";
import { getDictionary, getLocale } from "@/i18n";
import { prisma } from "@/lib/db";

export default function AdminRegistrationsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [locale, setLocale] = useState("ar");
  useEffect(() => {
    getLocale().then(l => setLocale(l));
  }, []);
  const dict = getDictionary(locale);

  // Auth check - in a full app this would use a proper session check
  const [isLoading, setIsLoading] = useState(true);
  const [registrations, setRegistrations] = useState<Array<{
    id: string;
    registrationNumber: string;
    fullName: string;
    email: string;
    phone: string;
    locale: "ar" | "en";
    status: "CONFIRMED" | "CANCELLED";
    createdAt: Date;
    checkedInAt: Date | null;
    ticketStatus: "CONFIRMED" | "CANCELLED" | null;
  }>>([]);

  const [filterStatus, setFilterStatus] = useState<"all" | "confirmed" | "cancelled" | "checkedin">("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const query: any = {
          orderBy: { createdAt: "desc" },
          include: {
            ticket: { select: { status: true, issuedAt: true } },
            checkIn: { select: { checkedInAt: true } },
          },
        };

        if (filterStatus === "confirmed") {
          query.where = { status: "CONFIRMED" };
        } else if (filterStatus === "cancelled") {
          query.where = { status: "CANCELLED" };
        } else if (filterStatus === "checkedin") {
          query.where = { checkIn: { not: null } };
        }

        if (searchTerm) {
          query.where = {
            OR: [
              { registrationNumber: { contains: searchTerm, mode: "insensitive" } },
              { fullName: { contains: searchTerm, mode: "insensitive" } },
              { email: { contains: searchTerm, mode: "insensitive" } },
            ],
          };
        }

        const rows = await prisma.registration.findMany(query);
        setRegistrations(
          rows.map((r) => ({
            id: r.id,
            registrationNumber: r.registrationNumber,
            fullName: r.fullName,
            email: r.email,
            phone: r.phone,
            locale: r.locale as "ar" | "en",
            status: r.status as "CONFIRMED" | "CANCELLED",
            createdAt: r.createdAt,
            checkedInAt: r.checkIn?.checkedInAt ?? null,
            ticketStatus: r.ticket?.status as "CONFIRMED" | "CANCELLED" | null,
          }))
        );
      } catch (error) {
        console.error("[admin-registrations] failed to load", error);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [filterStatus, searchTerm]);

  const handleCancel = async (id: string, regNumber: string) => {
    try {
      await prisma.$transaction(async (tx) => {
        await tx.registration.update({
          where: { id },
          data: { status: "CANCELLED", cancelledAt: new Date() },
        });
        await tx.ticket.updateMany({
          where: { registrationId: id },
          data: { status: "CANCELLED" },
        });
      });
      setRegistrations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "CANCELLED", ticketStatus: "CANCELLED" } : r))
      );
      toast.success("تم إلغاء التسجيل");
    } catch (error) {
      console.error("[admin-registrations] cancel failed", error);
      toast.error("فشل إلغاء التسجيل");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل تريد حذف هذا السجل نهائياً؟")) return;
    try {
      await prisma.registration.delete({ where: { id } });
      setRegistrations(prev => prev.filter((r) => r.id !== id));
      toast.success("تم حذف السجل");
    } catch (error) {
      console.error("[admin-registrations] delete failed", error);
      toast.error("فشل حذف السجل");
    }
  };

  if (isLoading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-cream-100">
        <p className="text-lg text-muted">جاري تحميل البيانات...</p>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-cream-100">
      <div className="container-page flex flex-col gap-4">
        {/* Filters and search */}
        <div className="bg-white rounded-2xl border border-border p-4 sm:p-6 shadow-card">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select
              onValueChange={setFilterStatus}
              defaultValue="all"
            >
              <option value="all">{dict.common.all}</option>
              <option value="confirmed">{dict.common.confirmed}</option>
              <option value="cancelled">{dict.common.cancelled}</option>
              <option value="checkedin">{dict.common.checkedIn}</option>
            </Select>

            <Input
              placeholder={dict.common.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={false}
            />

            <Button
              variant="gold"
              size="sm"
              onClick={() => router.push("/admin/registrations")}
              className="gap-1.5"
            >
              {dict.common.reset}
            </Button>
          </div>
        </div>

        {/* Registrations table */}
        <div className="bg-white rounded-2xl border border-border shadow-card">
          {isLoading ? (
            <p className="p-4 text-muted">جاري التحميل...</p>
          ) : registrations.length === 0 ? (
            <p className="p-4 text-muted">لا توجدRegistrations</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-2 font-medium text-navy-800">رقم التسجيل</th>
                    <th className="text-left p-2 font-medium text-navy-800">اسم المشارك</th>
                    <th className="text-left p-2 font-medium text-navy-800">البريد الإلكتروني</th>
                    <th className="text-left p-2 font-medium text-navy-800">رقم الجوال</th>
                    <th className="text-left p-2 font-medium text-navy-800">نوع الجهة</th>
                    <th className="text-left p-2 font-medium text-navy-800">تاريخ التسجيل</th>
                    <th className="text-left p-2 font-medium text-navy-800">الحالة</th>
                    <th className="text-left p-2 font-medium text-navy-800">التحقق</th>
                    <th className="text-left p-2 font-medium text-navy-800">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((reg) => (
                    <tr key={reg.id} className="border-b border-border/50">
                      <td className="p-2 font-mono text-navy-900">{reg.registrationNumber}</td>
                      <td className="p-2">{reg.fullName}</td>
                      <td className="p-2 break-words">{reg.email}</td>
                      <td className="p-2">{reg.phone || "—"}</td>
                      <td className="p-2">
                        {dict.orgTypes[reg.organizationType as keyof typeof dict.orgTypes]}
                      </td>
                      <td className="p-2">
                        {formatEventDate(locale, reg.createdAt)}
                      </td>
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/admin/registrations/${reg.id}`)}
                          className="gap-0.5 text-sm"
                        >
                          تفاصيل
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleCancel(reg.id, reg.registrationNumber)}
                          className="gap-0.5 text-sm"
                        >
                          إلغاء
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination and notes omitted for brevity */}
      </div>
    </section>
  );
}