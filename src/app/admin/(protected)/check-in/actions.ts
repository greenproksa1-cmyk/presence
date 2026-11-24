"use server";

import { requireStaffOrAdmin } from "@/lib/session";
import {
  checkInByRegistrationNumber,
  checkInByScan,
} from "@/lib/registration-service";
import { recordAudit } from "@/lib/audit";
import { getRequestMeta } from "@/lib/request";
import { hashIp } from "@/lib/crypto";
import type { CheckInState } from "@/lib/types";

export interface CheckInActionState {
  state: CheckInState | "IDLE";
  value?: string;
  message?: string;
  registration?: {
    fullName: string;
    registrationNumber: string;
    company: string;
    checkedInAt: string | null;
  };
  checkedInAt?: string;
  operator?: string;
}

export const initialCheckInState: CheckInActionState = { state: "IDLE" };

export async function checkInAction(
  _previous: CheckInActionState,
  formData: FormData,
): Promise<CheckInActionState> {
  const user = await requireStaffOrAdmin();
  const raw = String(formData.get("value") ?? "").trim();
  if (!raw) return { state: "INVALID", message: "empty" };

  const meta = await getRequestMeta();
  const gate = String(formData.get("gate") ?? "").trim().slice(0, 60) || "main";
  const ipHash = hashIp(meta.ip);
  const normalized = raw.toUpperCase();

  const result = /^MFF-2027-\d{5,}$/.test(normalized)
    ? await checkInByRegistrationNumber(normalized, user, { ipHash, gate })
    : await checkInByScan(raw, user, { ipHash, gate });

  if (result.state === "VALID") {
    await recordAudit({
      actor: user,
      action: "checkin.valid",
      entityType: "registration",
      entityId: result.registration?.registrationNumber ?? null,
      details: {
        registrationNumber: result.registration?.registrationNumber,
        gate,
      },
      ip: meta.ip,
      userAgent: meta.userAgent,
    });
  } else if (result.state === "CANCELLED") {
    await recordAudit({
      actor: user,
      action: "checkin.cancelled_ticket",
      entityType: "registration",
      details: { input: normalized.slice(0, 80), gate },
      ip: meta.ip,
      userAgent: meta.userAgent,
    });
  }

  return {
    state: result.state,
    value: normalized,
    message: result.message,
    registration: result.registration,
    checkedInAt: result.checkedInAt,
    operator: user.name,
  };
}
