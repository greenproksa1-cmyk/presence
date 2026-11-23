import { prisma } from "@/lib/db";
import { getEventSettings } from "@/lib/site-content";
import { ticketUrl } from "@/lib/crypto";
import { localized } from "@/i18n";
import type { Locale } from "@/lib/types";

export interface WhatsAppSendResult {
  status: "SENT" | "FAILED" | "SKIPPED";
  error?: string;
}

export function whatsappShareLink(message: string, phone?: string | null): string {
  const text = encodeURIComponent(message);
  const digits = phone?.replace(/[^\d]/g, "");
  return digits ? `https://wa.me/${digits}?text=${text}` : `https://wa.me/?text=${text}`;
}

/**
 * WhatsApp Business Cloud API — official integration only.
 *
 * Requires:
 *  - WHATSAPP_ACCESS_TOKEN / WHATSAPP_PHONE_NUMBER_ID
 *  - An approved Meta template (body: guest name + registration number,
 *    URL button: one dynamic suffix) whose name is in WHATSAPP_TEMPLATE_NAME
 *  - The admin setting “whatsappEnabled”
 *
 * Nothing is reported as sent unless the Graph API returns a message id.
 */
export async function sendWhatsAppTicket(input: {
  registrationId: string;
  fullName: string;
  phone: string;
  registrationNumber: string;
  token: string;
  locale: Locale;
}): Promise<WhatsAppSendResult> {
  const settings = await getEventSettings();

  const log = await prisma.whatsAppLog.create({
    data: {
      registrationId: input.registrationId,
      toPhone: input.phone,
      status: "PENDING",
      channel: "cloud_api",
      template: process.env.WHATSAPP_TEMPLATE_NAME || null,
    },
  });

  const finish = async (
    status: "SENT" | "FAILED" | "SKIPPED",
    extra: { providerId?: string; error?: string } = {},
  ): Promise<WhatsAppSendResult> => {
    await prisma.whatsAppLog.update({
      where: { id: log.id },
      data: {
        status,
        providerId: extra.providerId ?? null,
        error: extra.error?.slice(0, 800) ?? null,
        sentAt: status === "SENT" ? new Date() : null,
      },
    });
    return { status, error: extra.error };
  };

  if (!settings.whatsappEnabled) {
    return finish("SKIPPED", { error: "WhatsApp is disabled in settings." });
  }

  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const templateName = process.env.WHATSAPP_TEMPLATE_NAME;
  const envEnabled = process.env.WHATSAPP_ENABLED === "true";

  if (!envEnabled || !token || !phoneNumberId || !templateName) {
    return finish("SKIPPED", { error: "WHATSAPP_NOT_CONFIGURED" });
  }

  const version = process.env.WHATSAPP_API_VERSION || "v23.0";
  const language = process.env.WHATSAPP_TEMPLATE_LANG || input.locale;
  const link = ticketUrl(input.token);
  // Meta URL buttons expect the dynamic suffix, not the full URL.
  const suffix = link.split("/ticket/")[1] ?? input.token;

  try {
    const response = await fetch(
      `https://graph.facebook.com/${version}/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: input.phone.replace(/^\+/, ""),
          type: "template",
          template: {
            name: templateName,
            language: { code: language },
            components: [
              {
                type: "body",
                parameters: [
                  { type: "text", text: input.fullName },
                  { type: "text", text: input.registrationNumber },
                ],
              },
              {
                type: "button",
                sub_type: "url",
                index: "0",
                parameters: [{ type: "text", text: suffix }],
              },
            ],
          },
        }),
        signal: AbortSignal.timeout(12_000),
      },
    );

    const data = (await response.json().catch(() => ({}))) as {
      messages?: Array<{ id?: string }>;
      error?: { message?: string; code?: number };
    };

    const messageId = data.messages?.[0]?.id;
    if (!response.ok || !messageId) {
      return finish("FAILED", {
        error: `WhatsApp API ${response.status}: ${data.error?.message ?? "unknown error"}`,
      });
    }

    return finish("SENT", { providerId: messageId });
  } catch (error) {
    return finish("FAILED", {
      error: error instanceof Error ? error.message : "Unknown WhatsApp error",
    });
  }
}

/** Builds the default share text; useful for the public ticket page. */
export function shareMessage(
  locale: Locale,
  fullName: string,
  registrationNumber: string,
  token: string,
): string {
  const link = ticketUrl(token);
  const settings = getEventSettings();
  void settings;
  return locale === "ar"
    ? `تذكرة ${fullName} (${registrationNumber}) لحضور منتدى مكة الغذائي للإعاشة والتموين: ${link}`
    : `${fullName}'s ticket (${registrationNumber}) for Makkah Food Catering & Supply Forum: ${link}`;
}

/** Kept for the admin UI: shows whether the integration can actually send. */
export function whatsappIntegrationStatus(): {
  configured: boolean;
  missing: string[];
} {
  const missing: string[] = [];
  if (!process.env.WHATSAPP_ACCESS_TOKEN) missing.push("WHATSAPP_ACCESS_TOKEN");
  if (!process.env.WHATSAPP_PHONE_NUMBER_ID) missing.push("WHATSAPP_PHONE_NUMBER_ID");
  if (!process.env.WHATSAPP_TEMPLATE_NAME) missing.push("WHATSAPP_TEMPLATE_NAME");
  if (process.env.WHATSAPP_ENABLED !== "true") missing.push("WHATSAPP_ENABLED=true");
  return { configured: missing.length === 0, missing };
}

export { localized };
