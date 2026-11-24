"use server";

import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { staffCreateSchema } from "@/lib/validation";
import { generatePassword } from "@/lib/crypto";
import { recordAudit } from "@/lib/audit";
import { getRequestMeta } from "@/lib/request";

export interface StaffFormState {
  ok?: boolean;
  error?: "invalid" | "duplicate" | "system";
  password?: string;
  email?: string;
}

export async function createStaffAction(
  _previous: StaffFormState,
  formData: FormData,
): Promise<StaffFormState> {
  const admin = await requireAdmin();

  const rawPassword = String(formData.get("password") ?? "").trim();
  const parsed = staffCreateSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: rawPassword || generatePassword(16),
  });
  if (!parsed.success) return { error: "invalid" };

  try {
    const existing = await prisma.staffUser.findUnique({
      where: { email: parsed.data.email },
      select: { id: true },
    });
    if (existing) return { error: "duplicate" };

    const passwordHash = await hash(parsed.data.password, 12);
    const created = await prisma.staffUser.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        passwordHash,
        createdById: admin.id,
      },
      select: { id: true, email: true },
    });

    const meta = await getRequestMeta();
    await recordAudit({
      actor: admin,
      action: "staff.created",
      entityType: "staff_user",
      entityId: created.id,
      details: { email: created.email },
      ip: meta.ip,
      userAgent: meta.userAgent,
    });

    revalidatePath("/admin/staff");
    return { ok: true, password: parsed.data.password, email: created.email };
  } catch (error) {
    console.error("[admin/staff] create failed", error);
    return { error: "system" };
  }
}

export async function toggleStaffActiveAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  const nextActive = String(formData.get("active") ?? "") === "true";
  if (!id) return;

  try {
    await prisma.staffUser.update({ where: { id }, data: { isActive: nextActive } });
    const meta = await getRequestMeta();
    await recordAudit({
      actor: admin,
      action: nextActive ? "staff.activated" : "staff.deactivated",
      entityType: "staff_user",
      entityId: id,
      ip: meta.ip,
      userAgent: meta.userAgent,
    });
  } catch (error) {
    console.error("[admin/staff] toggle failed", error);
  }

  revalidatePath("/admin/staff");
}