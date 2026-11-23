"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { hashIp, hashToken } from "@/lib/crypto";
import { getDictionary, normalizeLocale } from "@/i18n";
import { buildRegistrationSchema, flattenFieldErrors } from "@/lib/validation";
import { normalizeEmail } from "@/lib/email";
import { normalizePhone } from "@/lib/phone";
import {
  createRegistration,
  DuplicateRegistrationError,
  RegistrationSystemError,
} from "@/lib/registration-service";
import { sendTicketEmail } from "@/lib/email";
import { consumeRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request";
import { turnstileConfigured, verifyTurnstile } from "@/lib/turnstile";
import { setRecentTicket } from "@/lib/recent-ticket";
import { recordAudit } from "@/lib/audit";

export interface RegistrationActionState {
  ok: boolean;
  fieldErrors?: Record<string, string>;
  formError?: string;
  code?: "duplicate" | "rate_limited" | "captcha" | "system" | "invalid";
}

export const initialRegistrationState: RegistrationActionState = { ok: false };

const MIN_FORM_SECONDS = 2;

export async function registerAction(
  _previous: RegistrationActionState,
  formData: FormData,
): Promise<RegistrationActionState> {
  const locale = normalizeLocale(formData.get("locale"));
  const messages = getDictionary(locale).register.errors;

  const headerList = await headers();
  const ip = getClientIp(headerList);
  const ipHash = hashIp(ip);

  // Honeypot: a field hidden from real users. A filled value means a bot.
  if (String(formData.get("website") ?? "").trim()) {
    return { ok: false, code: "captcha", formError: messages.captcha };
  }

  // Minimum time on form. Bots that post instantly are rejected; humans who
  // autofill still need a couple of seconds to reach the consent checkbox.
  const startedAt = Number(formData.get("startedAt") ?? 0);
  if (!Number.isFinite(startedAt) || startedAt <= 0) {
    return { ok: false, code: "invalid", formError: messages.generic };
  }
  if (Date.now() - startedAt < MIN_FORM_SECONDS * 1000) {
    return { ok: false, code: "rate_limited", formError: messages.rateLimited };
  }

  const raw = {
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    countryCode: formData.get("countryCode"),
    city: formData.get("city"),
    company: formData.get("company"),
    jobTitle: formData.get("jobTitle"),
    organizationType: formData.get("organizationType"),
    interest: formData.get("interest"),
    consent: formData.get("consent"),
    locale: formData.get("locale"),
  };

  const parsed = buildRegistrationSchema(locale).safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      code: "invalid",
      fieldErrors: flattenFieldErrors(parsed.error),
    };
  }
  const input = parsed.data;

  if (turnstileConfigured()) {
    const valid = await verifyTurnstile(
      String(formData.get("cf-turnstile-response") ?? ""),
      ip,
    );
    if (!valid) return { ok: false, code: "captcha", formError: messages.captcha };
  }

  const identifierEmail = hashToken(normalizeEmail(input.email));
  const identifierPhone = hashToken(
    normalizePhone(input.phone, input.countryCode) ?? input.phone,
  );

  const [ipLimit, emailLimit, phoneLimit] = await Promise.all([
    consumeRateLimit(`registration:ip:${ipHash ?? "unknown"}`, 12, 15 * 60),
    consumeRateLimit(`registration:email:${identifierEmail}`, 5, 60 * 60),
    consumeRateLimit(`registration:phone:${identifierPhone}`, 5, 60 * 60),
  ]);
  if (!ipLimit.allowed || !emailLimit.allowed || !phoneLimit.allowed) {
    return { ok: false, code: "rate_limited", formError: messages.rateLimited };
  }

  let created: Awaited<ReturnType<typeof createRegistration>>;
  try {
    created = await createRegistration(input, { ipHash });
  } catch (error) {
    if (error instanceof DuplicateRegistrationError) {
      const field = error.field === "phone" ? "phone" : "email";
      return {
        ok: false,
        code: "duplicate",
        fieldErrors: {
          [field]: field === "phone" ? messages.duplicatePhone : messages.duplicateEmail,
        },
      };
    }
    if (error instanceof RegistrationSystemError) {
      return { ok: false, code: "system", formError: messages.system };
    }
    console.error("[register] unexpected failure", error);
    return { ok: false, code: "system", formError: messages.system };
  }

  // Email delivery is attempted immediately but its failure never rolls back a
  // confirmed registration. The result is logged and shown honestly later.
  try {
    await sendTicketEmail({
      registrationId: created.registrationId,
      registrationNumber: created.registrationNumber,
      fullName: created.fullName,
      email: created.email,
      token: created.token,
      locale,
    });
  } catch (error) {
    console.error("[register] ticket email failed", error);
  }

  await recordAudit({
    actor: null,
    action: "registration.created",
    entityType: "registration",
    entityId: created.registrationId,
    details: {
      registrationNumber: created.registrationNumber,
      organizationType: input.organizationType,
      locale,
    },
    ip,
    userAgent: headerList.get("user-agent"),
  });

  await setRecentTicket({
    token: created.token,
    registrationId: created.registrationId,
    createdAt: Date.now(),
  });

  redirect("/registration-success");
}
