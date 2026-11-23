import QRCode from "qrcode";
import { prisma } from "@/lib/db";
import { ticketUrl, getSiteUrl } from "@/lib/crypto";
import { getEventSettings, formatEventDate } from "@/lib/site-content";
import type { Locale } from "@/lib/types";
import { localized } from "@/i18n";

export interface SendTicketPayload {
  registrationId: string;
  registrationNumber: string;
  fullName: string;
  email: string;
  token: string;
  locale: Locale;
  attempt?: number;
  sentById?: string | null;
}

export interface SendTicketResult {
  status: "SENT" | "FAILED" | "SKIPPED";
  logId: string;
  error?: string;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildEmailHtml(options: {
  locale: Locale;
  fullName: string;
  registrationNumber: string;
  eventDate: string;
  venueName: string;
  venueAddress: string;
  ticketLink: string;
  logoUrl: string;
  brandName: string;
  entryNote: string;
  eventNameEn: string;
}): string {
  const ar = options.locale === "ar";
  const dir = ar ? "rtl" : "ltr";
  const align = ar ? "right" : "left";
  const labels = ar
    ? {
        greeting: "مرحبًا",
        intro:
          "تم تأكيد تسجيلك في منتدى مكة الغذائي للإعاشة والتموين. تذكرتك الإلكترونية جاهزة أدناه.",
        date: "تاريخ المنتدى",
        venue: "مكان الإقامة",
        registration: "رقم التسجيل",
        button: "عرض التذكرة وتحميلها",
        qr: "امسح رمز QR عند بوابة المنتدى",
        footer: "هذه رسالة آلية من منصة التسجيل. يرجى عدم الرد عليها.",
        note: options.entryNote,
        subjectName: options.brandName,
      }
    : {
        greeting: "Hello",
        intro:
          "Your registration for Makkah Food Catering & Supply Forum is confirmed. Your e-ticket is below.",
        date: "Forum date",
        venue: "Venue",
        registration: "Registration no.",
        button: "View & download ticket",
        qr: "Scan the QR code at the forum entrance",
        footer: "This is an automated message from the registration platform.",
        note: options.entryNote,
        subjectName: options.brandName,
      };

  const safeName = escapeHtml(options.fullName);
  const safeNumber = escapeHtml(options.registrationNumber);
  const safeVenue = escapeHtml(options.venueName);
  const safeAddress = escapeHtml(options.venueAddress);

  return `<!doctype html>
<html lang="${options.locale}" dir="${dir}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(labels.subjectName)}</title>
</head>
<body style="margin:0;padding:0;background:#f6f2ea;font-family:'IBM Plex Sans Arabic','Segoe UI',Tahoma,Arial,sans-serif;color:#1b2559;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f2ea;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #e8e1d3;border-radius:18px;overflow:hidden;">
        <tr>
          <td style="background:#16224a;padding:28px 32px;" align="${align}">
            <img src="${options.logoUrl}" width="64" height="64" alt="" style="display:block;margin-bottom:14px;" />
            <div style="color:#ffffff;font-size:20px;font-weight:700;line-height:1.6;">${escapeHtml(options.brandName)}</div>
            <div style="color:#e5ad4b;font-size:13px;margin-top:4px;letter-spacing:.02em;">${escapeHtml(options.eventNameEn)}</div>
          </td>
        </tr>
        <tr><td style="height:4px;background:#e5ad4b;font-size:0;line-height:0;">&nbsp;</td></tr>
        <tr>
          <td style="padding:32px;" align="${align}">
            <p style="margin:0 0 8px;font-size:15px;color:#5b6478;">${labels.greeting}</p>
            <p style="margin:0 0 18px;font-size:19px;font-weight:700;">${safeName}</p>
            <p style="margin:0 0 24px;font-size:15px;line-height:1.9;color:#3c4661;">${labels.intro}</p>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fbf8f2;border:1px solid #ede6d8;border-radius:12px;margin-bottom:24px;">
              <tr>
                <td style="padding:16px 18px;font-size:13px;color:#6b7280;">${labels.date}</td>
                <td style="padding:16px 18px;font-size:14px;font-weight:600;" align="${ar ? "left" : "right"}">${escapeHtml(options.eventDate)}</td>
              </tr>
              <tr>
                <td style="padding:0 18px 16px;font-size:13px;color:#6b7280;vertical-align:top;">${labels.venue}</td>
                <td style="padding:0 18px 16px;font-size:14px;line-height:1.7;" align="${ar ? "left" : "right"}">
                  <strong>${safeVenue}</strong><br />
                  <span style="color:#5b6478;font-size:13px;">${safeAddress}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:0 18px 16px;font-size:13px;color:#6b7280;">${labels.registration}</td>
                <td style="padding:0 18px 16px;font-family:Consolas,Menlo,monospace;font-size:15px;font-weight:700;color:#16224a;" align="${ar ? "left" : "right"}">${safeNumber}</td>
              </tr>
            </table>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="padding:8px 0 12px;">
                  <div style="display:inline-block;padding:12px;border:1px solid #e8e1d3;border-radius:14px;background:#ffffff;">
                    <img src="cid:ticket-qr" width="190" height="190" alt="QR" style="display:block;" />
                  </div>
                  <div style="font-size:12px;color:#6b7280;margin-top:10px;">${labels.qr}</div>
                </td>
              </tr>
            </table>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0 4px;">
              <tr><td align="center">
                <a href="${escapeHtml(options.ticketLink)}" style="display:inline-block;background:#e5ad4b;color:#16224a;text-decoration:none;font-weight:700;font-size:15px;padding:14px 28px;border-radius:10px;">${labels.button}</a>
              </td></tr>
            </table>
            <p style="margin:16px 0 0;font-size:12px;line-height:1.8;color:#7a8296;text-align:center;">${escapeHtml(labels.note)}</p>
          </td>
        </tr>
        <tr>
          <td style="background:#fbf8f2;border-top:1px solid #ede6d8;padding:18px 32px;text-align:center;">
            <p style="margin:0;font-size:11px;color:#8a91a3;line-height:1.7;">${labels.footer}</p>
            <p style="margin:6px 0 0;font-size:11px;color:#8a91a3;direction:ltr;">${escapeHtml(getSiteUrl())}</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendTicketEmail(payload: SendTicketPayload): Promise<SendTicketResult> {
  const settings = await getEventSettings();
  const content = settings.content;
  const locale = payload.locale;
  const ar = locale === "ar";

  const log = await prisma.emailLog.create({
    data: {
      registrationId: payload.registrationId,
      toEmail: payload.email,
      template: "ticket_confirmation",
      locale,
      status: "PENDING",
      attempt: payload.attempt ?? 1,
      sentById: payload.sentById ?? null,
    },
  });

  const finish = async (
    status: "SENT" | "FAILED" | "SKIPPED",
    extra: { providerId?: string; error?: string } = {},
  ): Promise<SendTicketResult> => {
    await prisma.emailLog.update({
      where: { id: log.id },
      data: {
        status,
        providerId: extra.providerId ?? null,
        error: extra.error?.slice(0, 800) ?? null,
        sentAt: status === "SENT" ? new Date() : null,
      },
    });
    return { status, logId: log.id, error: extra.error };
  };

  if (!settings.emailEnabled) {
    return finish("SKIPPED", { error: "Email delivery is disabled in settings." });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) {
    return finish("SKIPPED", { error: "EMAIL_NOT_CONFIGURED" });
  }

  const link = ticketUrl(payload.token);
  let qrBuffer: Buffer;
  try {
    qrBuffer = await QRCode.toBuffer(link, {
      type: "png",
      width: 640,
      margin: 2,
      errorCorrectionLevel: "M",
      color: { dark: "#16224a", light: "#ffffff" },
    });
  } catch (error) {
    return finish("FAILED", {
      error: `QR generation failed: ${(error as Error).message}`,
    });
  }

  const subject = ar
    ? `تذكرة الحضور ${payload.registrationNumber} — منتدى مكة الغذائي`
    : `Your ticket ${payload.registrationNumber} — Makkah Food Forum`;

  const html = buildEmailHtml({
    locale,
    fullName: payload.fullName,
    registrationNumber: payload.registrationNumber,
    eventDate: formatEventDate(locale, settings.eventDate),
    venueName: localized(content.event.venueName, locale),
    venueAddress: localized(content.event.venueAddress, locale),
    ticketLink: link,
    logoUrl: /^https?:\/\//.test(settings.logoUrl)
      ? settings.logoUrl
      : `${getSiteUrl()}${settings.logoUrl.endsWith(".svg") ? "/brand/logo-mark.png" : settings.logoUrl}`,
    brandName: localized(content.brand.name, locale),
    entryNote: localized(content.event.note, locale),
    eventNameEn: content.brand.name.en,
  });

  const text = ar
    ? `مرحبًا ${payload.fullName}\nتم تأكيد تسجيلك.\nرقم التسجيل: ${payload.registrationNumber}\nتاريخ المنتدى: ${formatEventDate(locale, settings.eventDate)}\nالمكان: ${localized(content.event.venueName, locale)}\nعرض التذكرة: ${link}`
    : `Hello ${payload.fullName}\nYour registration is confirmed.\nRegistration no.: ${payload.registrationNumber}\nDate: ${formatEventDate(locale, settings.eventDate)}\nVenue: ${localized(content.event.venueName, locale)}\nView ticket: ${link}`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [payload.email],
        reply_to: process.env.EMAIL_REPLY_TO || undefined,
        subject,
        html,
        text,
        attachments: [
          {
            filename: "ticket-qr.png",
            content: qrBuffer.toString("base64"),
            content_type: "image/png",
            content_id: "ticket-qr",
          },
        ],
      }),
      signal: AbortSignal.timeout(15_000),
    });

    const data = (await response.json().catch(() => ({}))) as {
      id?: string;
      message?: string;
      name?: string;
    };

    if (!response.ok || !data.id) {
      return finish("FAILED", {
        error: `Resend ${response.status}: ${data.message ?? data.name ?? "unknown error"}`,
      });
    }

    return finish("SENT", { providerId: data.id });
  } catch (error) {
    return finish("FAILED", {
      error: error instanceof Error ? error.message : "Unknown email error",
    });
  }
}

/**
 * Public delivery status for the success page. Returns null when the database
 * is unreachable so the page can still show the ticket link.
 */
export async function getLatestEmailStatus(
  registrationId: string,
): Promise<{ status: string; createdAt: Date } | null> {
  try {
    return await prisma.emailLog.findFirst({
      where: { registrationId },
      orderBy: { createdAt: "desc" },
      select: { status: true, createdAt: true },
    });
  } catch {
    return null;
  }
}

export function normalizeEmail(value: string): string {
  return value.replace(/^\s+|\s+$/g, "").toLowerCase();
}

export function isValidEmail(value: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(value);
}
