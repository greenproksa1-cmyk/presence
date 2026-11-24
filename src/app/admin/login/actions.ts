"use server";

import { compare } from "bcryptjs";
import { redirect } from "next/navigation";
import type { AdminRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import { createSession, type AuthUser } from "@/lib/session";
import { loginSchema } from "@/lib/validation";
import { clearRateLimit, consumeRateLimit } from "@/lib/rate-limit";
import { getRequestMeta } from "@/lib/request";
import { recordAudit } from "@/lib/audit";

export interface LoginState {
  error?: "invalid" | "rate_limited" | "system" | "fields";
}

interface Candidate {
  type: "ADMIN" | "STAFF";
  id: string;
  name: string;
  email: string;
  adminRole: AdminRole | null;
}

export async function signInAction(
  _previous: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: "fields" };

  const meta = await getRequestMeta();
  const rateLimitKey = `login:${parsed.data.email}:${meta.ip ?? "unknown"}`;
  const limit = await consumeRateLimit(rateLimitKey, 8, 15 * 60);
  if (!limit.allowed) return { error: "rate_limited" };

  let candidate: Candidate | null = null;
  try {
    const admin = await prisma.adminUser.findUnique({
      where: { email: parsed.data.email },
      select: { id: true, name: true, email: true, passwordHash: true, role: true, isActive: true },
    });
    if (admin?.isActive && (await compare(parsed.data.password, admin.passwordHash))) {
      candidate = {
        type: "ADMIN",
        id: admin.id,
        name: admin.name,
        email: admin.email,
        adminRole: admin.role,
      };
    }

    if (!candidate) {
      const staff = await prisma.staffUser.findUnique({
        where: { email: parsed.data.email },
        select: { id: true, name: true, email: true, passwordHash: true, isActive: true },
      });
      if (staff?.isActive && (await compare(parsed.data.password, staff.passwordHash))) {
        candidate = {
          type: "STAFF",
          id: staff.id,
          name: staff.name,
          email: staff.email,
          adminRole: null,
        };
      }
    }
  } catch (error) {
    console.error("[auth] sign-in lookup failed", error);
    return { error: "system" };
  }

  if (!candidate) {
    await recordAudit({
      actor: null,
      action: "auth.failed",
      entityType: "auth",
      details: { email: parsed.data.email },
      ip: meta.ip,
      userAgent: meta.userAgent,
    });
    return { error: "invalid" };
  }

  const actor: AuthUser = {
    id: candidate.id,
    name: candidate.name,
    email: candidate.email,
    role: candidate.type,
    adminRole: candidate.adminRole,
  };

  await clearRateLimit(rateLimitKey);
  await createSession(
    { type: candidate.type, id: candidate.id, email: candidate.email },
    { ip: meta.ip, userAgent: meta.userAgent },
  );

  try {
    const now = new Date();
    if (candidate.type === "ADMIN") {
      await prisma.adminUser.update({ where: { id: candidate.id }, data: { lastLoginAt: now } });
    } else {
      await prisma.staffUser.update({ where: { id: candidate.id }, data: { lastLoginAt: now } });
    }
  } catch (error) {
    console.error("[auth] could not update last_login_at", error);
  }

  await recordAudit({
    actor,
    action: "auth.sign_in",
    entityType: candidate.type === "ADMIN" ? "admin_user" : "staff_user",
    entityId: candidate.id,
    ip: meta.ip,
    userAgent: meta.userAgent,
  });

  redirect(candidate.type === "ADMIN" ? "/admin/dashboard" : "/admin/check-in");
}
