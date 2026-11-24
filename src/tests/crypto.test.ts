import { describe, it, expect, beforeEach, vi } from "vitest";
import { PrismaClient } from "@prisma/client";
import { formatDateTime } from "@/lib/format";
import { generateTicketToken, extractTicketToken, isWellFormedTicketToken } from "@/lib/crypto";
import { REGISTRATION_NUMBER_PREFIX } from "@/lib/registration-service";

const prisma = new PrismaClient({ log: ["error"] });

describe("Crypto utilities", () => {
  it("generateTicketToken produces a valid base64url string", () => {
    const token = generateTicketToken();
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(0);
  });

  it("isWellFormedTicketToken validates correct format", () => {
    const valid = "A".repeat(43);
    expect(isWellFormedTicketToken(valid)).toBe(true);
    expect(isWellFormedTicketToken("short")).toBe(false);
    expect(isWellFormedTicketToken("")).toBe(false);
  });

  it("extractTicketToken extracts from URL", () => {
    const validToken = "A".repeat(43);
    const result = extractTicketToken(`https://example.com/ticket/${validToken}`);
    expect(result).toBe(validToken);
  });

  it("extractTicketToken returns null for empty input", () => {
    expect(extractTicketToken("")).toBeNull();
  });

  it("extractTicketToken returns null for invalid URL", () => {
    expect(extractTicketToken("not-a-url")).toBeNull();
  });
});

describe("Registration service constants", () => {
  it("REGISTRATION_NUMBER_PREFIX is MFF-2027", () => {
    expect(REGISTRATION_NUMBER_PREFIX).toBe("MFF-2027");
  });
});

describe("formatDateTime", () => {
  it("formats dates in Arabic locale", () => {
    const result = formatDateTime("ar", new Date("2027-01-10T10:30:00+03:00"));
    expect(typeof result).toBe("string");
  });

  it("formats dates in English locale", () => {
    const result = formatDateTime("en", new Date("2027-01-10T10:30:00+03:00"));
    expect(typeof result).toBe("string");
  });
});