import { NextResponse } from "next/server";
import { getAuth } from "@/lib/session";
import { prisma } from "@/lib/db";
import { registrationsToCsv } from "@/lib/csv";

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<NextResponse> {
  const auth = await getAuth();
  if (!auth.user || auth.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const type = new URL(request.url).searchParams.get("type") ?? "registrations";

  try {
    const rows = await prisma.registration.findMany({
      where: type === "checkins" ? { checkIn: { isNot: null } } : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        ticket: { select: { status: true } },
        checkIn: { select: { checkedInAt: true } },
      },
    });

    const csv = registrationsToCsv(
      rows.map((row) => ({
        registrationNumber: row.registrationNumber,
        fullName: row.fullName,
        email: row.email,
        phone: row.phone,
        countryCode: row.countryCode,
        city: row.city,
        company: row.company,
        jobTitle: row.jobTitle,
        organizationType: row.organizationType,
        interest: row.interest,
        locale: row.locale,
        status: row.status,
        ticketStatus: row.ticket?.status ?? null,
        createdAt: row.createdAt,
        checkedInAt: row.checkIn?.checkedInAt ?? null,
      })),
    );

    const date = new Date().toISOString().slice(0, 10);
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${type}-${date}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[admin/export] failed", error);
    return new NextResponse("Export failed", { status: 500 });
  }
}
