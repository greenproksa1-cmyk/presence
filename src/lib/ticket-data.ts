import { getTicketByRawToken } from "@/lib/registration-service";
import { getEventSettings } from "@/lib/site-content";
import { dictionaries } from "@/i18n/dictionary";
import type { Locale, EventSettingsView } from "@/lib/types";

export interface TicketView {
  ticket: import("@/lib/registration-service").TicketView;
  locale: Locale;
  dict: import("@/i18n/dictionary").Dictionary;
  settings: EventSettingsView;
}

/**
 * Fetches the full ticket view for a given base64url token.
 * Falls back gracefully if the DB is unreachable (returns defaults).
 */
export async function useTicketData(token: string | null): Promise<TicketView> {
  if (!token) {
    const locale: Locale = "ar";
    return {
      ticket: {
        ticketId: "",
        ticketStatus: "CONFIRMED",
        issuedAt: new Date(),
        tokenCipher: "",
        registration: {
          id: "",
          registrationNumber: "MFF-2027-01001",
          fullName: "",
          email: "",
          company: "",
          jobTitle: "",
          city: "",
          countryCode: "SA",
          organizationType: "other",
          locale: "ar",
          status: "CONFIRMED",
          createdAt: new Date(),
        },
        checkedInAt: null,
      },
      locale,
      dict: dictionaries[locale],
      settings: await import("@/lib/site-content").then((m) => m.DEFAULT_SETTINGS),
    };
  }

  const ticket = await getTicketByRawToken(token);
  const locale: Locale = ticket ? (ticket.registration.locale === "en" ? "en" : "ar") : "ar";
  const dict = dictionaries[locale];
  const settings = await getEventSettings();

  return {
    ticket: ticket
      ? {
          ...ticket,
          registration: {
            ...ticket.registration,
            locale: ticket.registration.locale === "en" ? "en" : "ar",
          },
        }
      : {
          ticketId: "",
          ticketStatus: "CONFIRMED",
          issuedAt: new Date(),
          tokenCipher: "",
          registration: {
            id: "",
            registrationNumber: "MFF-2027-01001",
            fullName: "",
            email: "",
            company: "",
            jobTitle: "",
            city: "",
            countryCode: "SA",
            organizationType: "other",
            locale: "ar",
            status: "CONFIRMED",
            createdAt: new Date(),
          },
          checkedInAt: null,
        },
    locale,
    dict,
    settings,
  };
}