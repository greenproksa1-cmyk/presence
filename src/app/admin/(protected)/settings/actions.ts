"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { parseSiteContent } from "@/lib/site-content";
import { recordAudit } from "@/lib/audit";
import { getRequestMeta } from "@/lib/request";

export interface SettingsFormState {
  ok?: boolean;
  error?: boolean;
}

export const initialSettingsFormState: SettingsFormState = {};

function text(formData: FormData, key: string, fallback: string): string {
  const value = formData.get(key);
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function checkbox(formData: FormData, key: string): boolean {
  const value = formData.get(key);
  return value === "on" || value === "true" || value === "1";
}

function parseEventDate(raw: string, fallback: Date): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return fallback;
  const parsed = new Date(`${raw}T00:00:00+03:00`);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
}

export async function updateSettingsAction(
  _previous: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  const admin = await requireAdmin();

  try {
    const current = await prisma.eventSettings.findUnique({ where: { id: "main" } });
    const content = parseSiteContent(current?.content);

    content.brand.name = {
      ar: text(formData, "brandNameAr", content.brand.name.ar),
      en: text(formData, "brandNameEn", content.brand.name.en),
    };
    content.brand.shortName = {
      ar: text(formData, "brandShortAr", content.brand.shortName.ar),
      en: text(formData, "brandShortEn", content.brand.shortName.en),
    };
    content.brand.tagline = {
      ar: text(formData, "brandTaglineAr", content.brand.tagline.ar),
      en: text(formData, "brandTaglineEn", content.brand.tagline.en),
    };
    content.hero.description = {
      ar: text(formData, "heroDescriptionAr", content.hero.description.ar),
      en: text(formData, "heroDescriptionEn", content.hero.description.en),
    };

    const data = {
      eventDate: parseEventDate(String(formData.get("eventDate") ?? ""), new Date()),
      logoUrl: text(formData, "logoUrl", "/brand/logo-mark.svg"),
      heroImageUrl: text(formData, "heroImageUrl", "/images/hero.jpg"),
      aboutImageUrl: text(formData, "aboutImageUrl", "/images/about.jpg"),
      venueImageUrl: text(formData, "venueImageUrl", "/images/venue.jpg"),
      mapUrl: text(formData, "mapUrl", ""),
      contactEmail: String(formData.get("contactEmail") ?? "").trim().slice(0, 160),
      contactPhone: String(formData.get("contactPhone") ?? "").trim().slice(0, 40),
      whatsappNumber: String(formData.get("whatsappNumber") ?? "").trim().slice(0, 40),
      emailEnabled: checkbox(formData, "emailEnabled"),
      whatsappEnabled: checkbox(formData, "whatsappEnabled"),
      content: content as unknown as Prisma.InputJsonValue,
    };

    await prisma.eventSettings.upsert({
      where: { id: "main" },
      create: { id: "main", ...data },
      update: data,
    });

    const meta = await getRequestMeta();
    await recordAudit({
      actor: admin,
      action: "settings.updated",
      entityType: "event_settings",
      entityId: "main",
      ip: meta.ip,
      userAgent: meta.userAgent,
    });

    revalidatePath("/", "layout");
    revalidatePath("/admin/settings");
    return { ok: true };
  } catch (error) {
    console.error("[admin/settings] update failed", error);
    return { error: true };
  }
}
