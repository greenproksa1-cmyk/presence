"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/session";
import { cancelRegistration } from "@/lib/registration-service";
import { recordAudit } from "@/lib/audit";
import { getRequestMeta } from "@/lib/request";

export async function cancelRegistrationAction(formData: FormData): Promise<void> {
  const user = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  const ok = await cancelRegistration(id);
  if (ok) {
    const meta = await getRequestMeta();
    await recordAudit({
      actor: user,
      action: "registration.cancelled",
      entityType: "registration",
      entityId: id,
      ip: meta.ip,
      userAgent: meta.userAgent,
    });
  }

  revalidatePath("/admin/registrations");
  revalidatePath(`/admin/registrations/${id}`);
  revalidatePath("/admin/dashboard");
}
