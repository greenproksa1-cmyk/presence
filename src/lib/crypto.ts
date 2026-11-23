import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";

const TOKEN_PREFIX = "v1";

export function generateTicketToken(): string {
  return randomBytes(32).toString("base64url");
}

export function generateSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export function isWellFormedTicketToken(token: string): boolean {
  return /^[A-Za-z0-9_-]{43}$/.test(token);
}

/** Accepts a raw token, a full ticket URL, or a scanner payload with extra whitespace. */
export function extractTicketToken(input: string): string | null {
  const value = (input ?? "").trim();
  if (!value) return null;
  if (isWellFormedTicketToken(value)) return value;

  try {
    const url = new URL(value);
    const segments = url.pathname.split("/").filter(Boolean);
    const ticketIndex = segments.indexOf("ticket");
    const candidate = ticketIndex >= 0 ? segments[ticketIndex + 1] : segments.at(-1);
    return candidate && isWellFormedTicketToken(candidate) ? candidate : null;
  } catch {
    const match = value.match(/\/ticket\/([A-Za-z0-9_-]{43})/);
    return match?.[1] ?? null;
  }
}

export function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (secret && secret.length >= 32) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET must be set to at least 32 random characters.");
  }
  return "local-development-session-secret-do-not-use-in-production";
}

export function hashIp(ip: string | null | undefined): string | null {
  if (!ip) return null;
  return createHash("sha256")
    .update(`${ip}:${getSessionSecret()}`)
    .digest("hex")
    .slice(0, 32);
}

function encryptionKey(): Buffer {
  const raw = process.env.TOKEN_ENCRYPTION_KEY;
  if (raw) {
    try {
      const key = Buffer.from(raw, "base64");
      if (key.length === 32) return key;
    } catch {
      /* fall through */
    }
    if (process.env.NODE_ENV === "production") {
      throw new Error("TOKEN_ENCRYPTION_KEY must be a 32-byte base64 value.");
    }
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("TOKEN_ENCRYPTION_KEY is required in production.");
  }
  return createHash("sha256")
    .update(`${getSessionSecret()}:ticket-token-encryption`)
    .digest();
}

export function encryptTicketToken(token: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(token, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [
    TOKEN_PREFIX,
    iv.toString("base64url"),
    tag.toString("base64url"),
    ciphertext.toString("base64url"),
  ].join(".");
}

export function decryptTicketToken(payload: string): string | null {
  try {
    const [prefix, iv, tag, ciphertext] = payload.split(".");
    if (prefix !== TOKEN_PREFIX || !iv || !tag || !ciphertext) return null;
    const decipher = createDecipheriv(
      "aes-256-gcm",
      encryptionKey(),
      Buffer.from(iv, "base64url"),
    );
    decipher.setAuthTag(Buffer.from(tag, "base64url"));
    const plain = Buffer.concat([
      decipher.update(Buffer.from(ciphertext, "base64url")),
      decipher.final(),
    ]).toString("utf8");
    return isWellFormedTicketToken(plain) ? plain : null;
  } catch {
    return null;
  }
}

export function generatePassword(length = 18): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const bytes = randomBytes(length);
  let password = "";
  for (let index = 0; index < length; index += 1) {
    password += alphabet[bytes[index] % alphabet.length];
  }
  return password;
}

export function constantTimeEqual(left: string, right: string): boolean {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";
  return raw.replace(/\/+$/, "");
}

export function ticketUrl(token: string): string {
  return `${getSiteUrl()}/ticket/${token}`;
}
