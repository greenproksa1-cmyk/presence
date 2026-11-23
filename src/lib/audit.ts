import type { ActorType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { AuthUser } from "@/lib/session";
import { hashIp } from "@/lib/crypto";

export interface AuditInput {
  actor: AuthUser | null;
  actorType?: ActorType;
  action: string;
  entityType: string;
  entityId?: string | null;
  details?: Record<string, unknown> | null;
  ip?: string | null;
  userAgent?: string | null;
}

function compactDetails(
  details: Record<string, unknown> | null | undefined,
): Prisma.InputJsonValue | undefined {
  if (!details) return undefined;
  const json = JSON.stringify(details);
  if (json.length > 6000) {
    return { truncated: true, preview: json.slice(0, 5000) };
  }
  return JSON.parse(json) as Prisma.InputJsonValue;
}

/** Writes an immutable audit entry. Failures never break the user action. */
export async function recordAudit(input: AuditInput): Promise<void> {
  const actorType: ActorType = input.actorType ?? (input.actor ? input.actor.role : "SYSTEM");
  const actorName = input.actor?.name ?? "النظام";
  const actorId = input.actor?.id ?? null;

  try {
    await prisma.auditLog.create({
      data: {
        actorType,
        actorName,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId ?? null,
        details: compactDetails(input.details),
        ipHash: hashIp(input.ip),
        userAgent: input.userAgent?.slice(0, 300) ?? null,
        ...(actorType === "ADMIN" && actorId
          ? { adminUser: { connect: { id: actorId } } }
          : {}),
        ...(actorType === "STAFF" && actorId
          ? { staffUser: { connect: { id: actorId } } }
          : {}),
      },
    });
  } catch (error) {
    console.error("[audit] failed to record entry", input.action, error);
  }
}
