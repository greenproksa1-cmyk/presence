import { Prisma } from "@prisma/client";
import type { CheckInMethod } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  decryptTicketToken,
  encryptTicketToken,
  extractTicketToken,
  generateTicketToken,
  hashToken,
} from "@/lib/crypto";
import { normalizeEmail } from "@/lib/email";
import { normalizePhone } from "@/lib/phone";
import type {
  CheckInResult,
  RegistrationInput,
} from "@/lib/types";
import type { AuthUser } from "@/lib/session";

export const REGISTRATION_NUMBER_PREFIX = "MFF-2027";

export class DuplicateRegistrationError extends Error {
  constructor(public readonly field: "email" | "phone") {
    super(`duplicate_${field}`);
    this.name = "DuplicateRegistrationError";
  }
}

export class RegistrationSystemError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RegistrationSystemError";
  }
}

function isUniqueViolation(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002"
  );
}

function duplicateFieldFrom(error: unknown): "email" | "phone" {
  const target = String(
    (error as Prisma.PrismaClientKnownRequestError)?.meta?.target ?? "",
  ).toLowerCase();
  return target.includes("phone") ? "phone" : "email";
}

export async function formatNextRegistrationNumber(
  client: Prisma.TransactionClient | typeof prisma = prisma,
): Promise<string> {
  const rows = await client.$queryRaw<Array<{ nextval: bigint }>>`
    SELECT nextval('registration_number_seq') AS nextval
  `;
  const next = Number(rows[0]?.nextval ?? 0);
  if (!next) throw new RegistrationSystemError("Could not allocate a registration number.");
  return `${REGISTRATION_NUMBER_PREFIX}-${String(next).padStart(5, "0")}`;
}

export interface CreatedRegistration {
  registrationId: string;
  registrationNumber: string;
  fullName: string;
  email: string;
  phone: string;
  locale: "ar" | "en";
  token: string;
  createdAt: Date;
}

/**
 * Creates the registration and ticket in ONE database transaction.
 *
 * The registration number sequence, the registration row, and the ticket row
 * either all commit or none do. Duplicate email/phone is enforced by unique
 * indexes, so two simultaneous submissions cannot both succeed.
 */
export async function createRegistration(
  input: RegistrationInput,
): Promise<CreatedRegistration> {
  const emailNormalized = normalizeEmail(input.email);
  const phoneNormalized = normalizePhone(input.phone, input.countryCode);
  if (!phoneNormalized) throw new RegistrationSystemError("Invalid phone number.");

  const existing = await prisma.registration.findFirst({
    where: {
      OR: [{ emailNormalized }, { phoneNormalized }],
    },
    select: { emailNormalized: true, phoneNormalized: true },
  });
  if (existing) {
    throw new DuplicateRegistrationError(
      existing.emailNormalized === emailNormalized ? "email" : "phone",
    );
  }

  const token = generateTicketToken();
  const tokenHash = hashToken(token);
  const tokenCipher = encryptTicketToken(token);

  try {
    const result = await prisma.$transaction(async (tx) => {
      const registrationNumber = await formatNextRegistrationNumber(tx);
      const registration = await tx.registration.create({
        data: {
          registrationNumber,
          fullName: input.fullName,
          email: input.email.trim(),
          emailNormalized,
          phone: input.phone.trim(),
          phoneNormalized,
          countryCode: input.countryCode,
          city: input.city,
          company: input.company,
          jobTitle: input.jobTitle,
          organizationType: input.organizationType,
          interest: input.interest ?? null,
          locale: input.locale,
          consentAt: new Date(),
          status: "CONFIRMED",
        },
      });

      await tx.ticket.create({
        data: {
          registrationId: registration.id,
          tokenHash,
          tokenCipher,
          status: "CONFIRMED",
        },
      });

      return registration;
    });

    return {
      registrationId: result.id,
      registrationNumber: result.registrationNumber,
      fullName: result.fullName,
      email: result.email,
      phone: result.phone,
      locale: result.locale === "en" ? "en" : "ar",
      token,
      createdAt: result.createdAt,
    };
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new DuplicateRegistrationError(duplicateFieldFrom(error));
    }
    console.error("[registration] failed", error);
    throw new RegistrationSystemError("Registration could not be completed.");
  }
}

export interface TicketView {
  ticketId: string;
  ticketStatus: "CONFIRMED" | "CANCELLED";
  issuedAt: Date;
  tokenCipher: string;
  registration: {
    id: string;
    registrationNumber: string;
    fullName: string;
    email: string;
    company: string;
    jobTitle: string;
    city: string;
    countryCode: string;
    organizationType: string;
    locale: string;
    status: "CONFIRMED" | "CANCELLED";
    createdAt: Date;
  };
  checkedInAt: Date | null;
}

export async function getTicketByRawToken(token: string): Promise<TicketView | null> {
  if (!token) return null;
  const ticket = await prisma.ticket.findUnique({
    where: { tokenHash: hashToken(token) },
    include: {
      registration: {
        select: {
          id: true,
          registrationNumber: true,
          fullName: true,
          email: true,
          company: true,
          jobTitle: true,
          city: true,
          countryCode: true,
          organizationType: true,
          locale: true,
          status: true,
          createdAt: true,
        },
      },
      checkIn: { select: { checkedInAt: true } },
    },
  });
  if (!ticket) return null;
  return {
    ticketId: ticket.id,
    ticketStatus: ticket.status,
    issuedAt: ticket.issuedAt,
    tokenCipher: ticket.tokenCipher,
    registration: ticket.registration,
    checkedInAt: ticket.checkIn?.checkedInAt ?? null,
  };
}

export async function getTicketForRegistration(registrationId: string): Promise<{
  token: string | null;
  registrationNumber: string;
  fullName: string;
  email: string;
  phone: string;
  locale: "ar" | "en";
} | null> {
  const registration = await prisma.registration.findUnique({
    where: { id: registrationId },
    include: { ticket: true },
  });
  if (!registration) return null;
  return {
    token: registration.ticket ? decryptTicketToken(registration.ticket.tokenCipher) : null,
    registrationNumber: registration.registrationNumber,
    fullName: registration.fullName,
    email: registration.email,
    phone: registration.phone,
    locale: registration.locale === "en" ? "en" : "ar",
  };
}

export async function cancelRegistration(registrationId: string): Promise<boolean> {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.registration.update({
        where: { id: registrationId },
        data: { status: "CANCELLED", cancelledAt: new Date() },
      });
      await tx.ticket.updateMany({
        where: { registrationId },
        data: { status: "CANCELLED" },
      });
    });
    return true;
  } catch (error) {
    console.error("[registration] cancel failed", error);
    return false;
  }
}

export interface RegistrationEditInput {
  fullName: string;
  email: string;
  phone: string;
  countryCode: string;
  city: string;
  company: string;
  jobTitle: string;
  organizationType: string;
  interest?: string;
}

export async function updateRegistrationDetails(
  registrationId: string,
  input: RegistrationEditInput,
): Promise<
  | { ok: true; before: Record<string, unknown>; after: Record<string, unknown> }
  | { ok: false; field?: "email" | "phone"; notFound?: boolean }
> {
  const before = await prisma.registration.findUnique({ where: { id: registrationId } });
  if (!before) return { ok: false, notFound: true };

  const emailNormalized = normalizeEmail(input.email);
  const phoneNormalized = normalizePhone(input.phone, input.countryCode);
  if (!phoneNormalized) return { ok: false, field: "phone" };

  try {
    const after = await prisma.registration.update({
      where: { id: registrationId },
      data: {
        fullName: input.fullName,
        email: input.email.trim(),
        emailNormalized,
        phone: input.phone.trim(),
        phoneNormalized,
        countryCode: input.countryCode,
        city: input.city,
        company: input.company,
        jobTitle: input.jobTitle,
        organizationType: input.organizationType,
        interest: input.interest?.trim() || null,
      },
    });
    return {
      ok: true,
      before: {
        fullName: before.fullName,
        email: before.email,
        phone: before.phone,
        company: before.company,
        jobTitle: before.jobTitle,
        city: before.city,
        countryCode: before.countryCode,
        organizationType: before.organizationType,
        interest: before.interest,
      },
      after: {
        fullName: after.fullName,
        email: after.email,
        phone: after.phone,
        company: after.company,
        jobTitle: after.jobTitle,
        city: after.city,
        countryCode: after.countryCode,
        organizationType: after.organizationType,
        interest: after.interest,
      },
    };
  } catch (error) {
    if (isUniqueViolation(error)) {
      return { ok: false, field: duplicateFieldFrom(error) };
    }
    console.error("[registration] update failed", error);
    return { ok: false };
  }
}

export async function findRegistrationByNumber(registrationNumber: string) {
  return prisma.registration.findUnique({
    where: { registrationNumber: registrationNumber.trim().toUpperCase() },
    include: {
      ticket: { select: { status: true, issuedAt: true } },
      checkIn: { select: { checkedInAt: true } },
    },
  });
}

interface CheckInRow {
  ticketId: string;
  ticketStatus: "CONFIRMED" | "CANCELLED";
  registrationId: string;
  registrationStatus: "CONFIRMED" | "CANCELLED";
  fullName: string;
  registrationNumber: string;
  company: string;
}

async function lockAndCheckIn(
  lookup: { tokenHash: string } | { registrationNumber: string },
  actor: AuthUser,
  method: CheckInMethod,
  meta: { ipHash: string | null; gate?: string | null },
): Promise<CheckInResult> {
  try {
    return await prisma.$transaction(async (tx) => {
      const rows =
        "tokenHash" in lookup
          ? await tx.$queryRaw<CheckInRow[]>`
              SELECT t.id AS "ticketId", t.status AS "ticketStatus",
                     r.id AS "registrationId", r.status AS "registrationStatus",
                     r.full_name AS "fullName", r.registration_number AS "registrationNumber",
                     r.company AS "company"
              FROM tickets t
              JOIN registrations r ON r.id = t.registration_id
              WHERE t.token_hash = ${lookup.tokenHash}
              FOR UPDATE OF t
            `
          : await tx.$queryRaw<CheckInRow[]>`
              SELECT t.id AS "ticketId", t.status AS "ticketStatus",
                     r.id AS "registrationId", r.status AS "registrationStatus",
                     r.full_name AS "fullName", r.registration_number AS "registrationNumber",
                     r.company AS "company"
              FROM tickets t
              JOIN registrations r ON r.id = t.registration_id
              WHERE r.registration_number = ${lookup.registrationNumber}
              FOR UPDATE OF t
            `;

      const row = rows[0];
      if (!row) return { state: "INVALID" };
      if (row.ticketStatus === "CANCELLED" || row.registrationStatus === "CANCELLED") {
        return { state: "CANCELLED" };
      }

      // Fresh statement after the row lock: sees a concurrent check-in that
      // committed while this transaction was waiting.
      const existing = await tx.checkIn.findUnique({
        where: { ticketId: row.ticketId },
        select: { checkedInAt: true },
      });
      if (existing) {
        return {
          state: "ALREADY_CHECKED_IN",
          checkedInAt: existing.checkedInAt.toISOString(),
          registration: {
            fullName: row.fullName,
            registrationNumber: row.registrationNumber,
            company: row.company,
            checkedInAt: existing.checkedInAt.toISOString(),
          },
        };
      }

      const checkIn = await tx.checkIn.create({
        data: {
          ticketId: row.ticketId,
          registrationId: row.registrationId,
          method,
          gate: meta.gate?.slice(0, 60) || null,
          adminUserId: actor.role === "ADMIN" ? actor.id : null,
          staffUserId: actor.role === "STAFF" ? actor.id : null,
          operatorName: actor.name,
          ipHash: meta.ipHash,
        },
      });

      return {
        state: "VALID",
        checkedInAt: checkIn.checkedInAt.toISOString(),
        registration: {
          fullName: row.fullName,
          registrationNumber: row.registrationNumber,
          company: row.company,
          checkedInAt: checkIn.checkedInAt.toISOString(),
        },
      };
    });
  } catch (error) {
    if (isUniqueViolation(error)) {
      const existing = await prisma.checkIn
        .findFirst({
          where:
            "tokenHash" in lookup
              ? { ticket: { tokenHash: lookup.tokenHash } }
              : { registration: { registrationNumber: lookup.registrationNumber } },
          select: { checkedInAt: true, registration: { select: { fullName: true, registrationNumber: true, company: true } } },
        })
        .catch(() => null);
      if (existing) {
        return {
          state: "ALREADY_CHECKED_IN",
          checkedInAt: existing.checkedInAt.toISOString(),
          registration: {
            fullName: existing.registration.fullName,
            registrationNumber: existing.registration.registrationNumber,
            company: existing.registration.company,
            checkedInAt: existing.checkedInAt.toISOString(),
          },
        };
      }
    }
    console.error("[check-in] failed", error);
    return { state: "INVALID", message: "system_error" };
  }
}

export async function checkInByScan(
  rawInput: string,
  actor: AuthUser,
  meta: { ipHash: string | null; gate?: string | null },
): Promise<CheckInResult> {
  const token = extractTicketToken(rawInput);
  if (!token) return { state: "INVALID" };
  return lockAndCheckIn({ tokenHash: hashToken(token) }, actor, "QR", meta);
}

export async function checkInByRegistrationNumber(
  registrationNumber: string,
  actor: AuthUser,
  meta: { ipHash: string | null; gate?: string | null },
): Promise<CheckInResult> {
  const normalized = registrationNumber.trim().toUpperCase();
  if (!/^MFF-2027-\d{5,}$/.test(normalized)) return { state: "INVALID" };
  return lockAndCheckIn({ registrationNumber: normalized }, actor, "MANUAL", meta);
}
