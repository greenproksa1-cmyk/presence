import { createHmac } from "node:crypto";
import { cookies } from "next/headers";
import { getSessionSecret } from "@/lib/crypto";

/**
 * Short-lived, HttpOnly hand-off between the registration action and the
 * success page. It keeps the raw ticket token out of URLs, browser history,
 * analytics and referrer headers.
 */
const COOKIE = "mff_recent_ticket";
const MAX_AGE_SECONDS = 30 * 60;

export interface RecentTicket {
  token: string;
  registrationId: string;
  createdAt: number;
}

function sign(value: string): string {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

export async function setRecentTicket(ticket: RecentTicket): Promise<void> {
  const payload = Buffer.from(JSON.stringify(ticket), "utf8").toString("base64url");
  const jar = await cookies();
  jar.set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function getRecentTicket(): Promise<RecentTicket | null> {
  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value;
  if (!raw) return null;
  const index = raw.lastIndexOf(".");
  if (index < 1) return null;
  const payload = raw.slice(0, index);
  const signature = raw.slice(index + 1);
  const expected = sign(payload);
  if (signature.length !== expected.length) return null;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i += 1) {
    mismatch |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  if (mismatch !== 0) return null;

  try {
    const parsed = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as Partial<RecentTicket>;
    if (
      typeof parsed.token !== "string" ||
      typeof parsed.registrationId !== "string" ||
      typeof parsed.createdAt !== "number"
    ) {
      return null;
    }
    if (Date.now() - parsed.createdAt > MAX_AGE_SECONDS * 1000) return null;
    return {
      token: parsed.token,
      registrationId: parsed.registrationId,
      createdAt: parsed.createdAt,
    };
  } catch {
    return null;
  }
}

export async function clearRecentTicket(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}
