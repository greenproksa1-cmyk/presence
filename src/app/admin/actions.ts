"use server";

import { redirect } from "next/navigation";
import { destroySession, getAuth } from "@/lib/session";
import { recordAudit } from "@/lib/audit";
import { getRequestMeta } from "@/lib/request";

export async function signOutAction(): Promise<void> {
  const auth = await getAuth();
  const meta = await getRequestMeta();
  if (auth.user) {
    await recordAudit({
      actor: auth.user,
      action: "auth.sign_out",
      entityType: "auth_session",
      entityId: auth.sessionId,
      ip: meta.ip,
      userAgent: meta.userAgent,
    });
  }
  await destroySession();
  redirect("/admin/login");
}
