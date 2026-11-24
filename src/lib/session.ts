import { cookies } from "next/headers";
import { createHmac } from "node:crypto";
import { redirect } from "next/navigation";
import type { AdminRole, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { generateSessionToken, getSessionSecret, hashIp, hashToken } from "@/lib/crypto";

export const SESSION_COOKIE = "mff_session";
const SESSION_MAX_AGE_HOURS = 12;
const SESSION_IDLE_MINUTES = 120;

type SessionWithUsers = Prisma.AuthSessionGetPayload<{
  include: { adminUser: true; staffUser: true };
}>;

export type AuthRole = "ADMIN" | "STAFF";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: AuthRole;
  adminRole: AdminRole | null;
}

export interface AuthContext {
  user: AuthUser | null;
  sessionId: string | null;
  unavailable: boolean;
}

function sign(raw: string): string {
  const signature = createHmac("sha256", getSessionSecret()).update(raw).digest("base64url");
  return `${raw}.${signature}`;
}

function unsign(value: string): string | null {
  const index = value.lastIndexOf(".");
  if (index < 1) return null;
  const raw = value.slice(0, index);
  const signature = value.slice(index + 1);
  const expected = createHmac("sha256", getSessionSecret())
    .update(raw)
    .digest("base64url");
  if (signature.length !== expected.length) return null;
  // Constant-time comparison without pulling another dependency.
  let mismatch = 0;
  for (let i = 0; i < expected.length; i += 1) {
    mismatch |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return mismatch === 0 ? raw : null;
}

export async function createSession(
  principal: { type: AuthRole; id: string; email: string },
  meta: { ip: string | null; userAgent: string | null },
): Promise<void> {
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_HOURS * 3_600_000);

  await prisma.authSession.create({
    data: {
      tokenHash: hashToken(token),
      adminUserId: principal.type === "ADMIN" ? principal.id : null,
      staffUserId: principal.type === "STAFF" ? principal.id : null,
      ipHash: hashIp(meta.ip),
      userAgent: meta.userAgent,
      expiresAt,
      lastSeenAt: new Date(),
    },
  });

  const jar = await cookies();
  jar.set(SESSION_COOKIE, sign(token), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_HOURS * 3600,
  });

  // Opportunistic cleanup of old rows; never blocks sign-in on failure.
  prisma.authSession
    .deleteMany({ where: { expiresAt: { lt: new Date(Date.now() - 7 * 86_400_000) } } })
    .catch(() => {});
}

export const getAuth = async (): Promise<AuthContext> => {
  const jar = await cookies();
  const cookie = jar.get(SESSION_COOKIE)?.value;
  if (!cookie) return { user: null, sessionId: null, unavailable: false };

  const token = unsign(cookie);
  if (!token) return { user: null, sessionId: null, unavailable: false };

  const READ_FAILED = Symbol("session-read-failed");
  let session: SessionWithUsers | null | typeof READ_FAILED = READ_FAILED;

  try {
    session = await prisma.authSession.findUnique({
      where: { tokenHash: hashToken(token) },
      include: { adminUser: true, staffUser: true },
    });
  } catch (error) {
    console.error("[session] could not read session", error);
  }

  if (session === READ_FAILED) {
    return { user: null, sessionId: null, unavailable: true };
  }
  if (!session) return { user: null, sessionId: null, unavailable: false };

  const now = Date.now();
  if (session.expiresAt.getTime() < now) {
    return { user: null, sessionId: null, unavailable: false };
  }
  if (now - session.lastSeenAt.getTime() > SESSION_IDLE_MINUTES * 60_000) {
    return { user: null, sessionId: null, unavailable: false };
  }

  if (now - session.lastSeenAt.getTime() > 60_000) {
    prisma.authSession
      .update({ where: { id: session.id }, data: { lastSeenAt: new Date(now) } })
      .catch(() => {});
  }

  if (session.adminUserId) {
    return {
      sessionId: session.id,
      unavailable: false,
      user: {
        id: session.adminUserId,
        name: session.adminUser?.name ?? "Admin",
        email: session.adminUser?.email ?? "",
        role: "ADMIN",
        adminRole: session.adminUser?.role ?? null,
      },
    };
  }

  if (session.staffUserId) {
    return {
      sessionId: session.id,
      unavailable: false,
      user: {
        id: session.staffUserId,
        name: session.staffUser?.name ?? "Staff",
        email: session.staffUser?.email ?? "",
        role: "STAFF",
        adminRole: null,
      },
    };
  }

  return { user: null, sessionId: null, unavailable: false };
}

export async function requireAdmin(): Promise<AuthUser> {
  const auth = await getAuth();
  if (!auth.user) redirect("/admin/login");
  if (auth.user.role !== "ADMIN") redirect("/admin/check-in");
  return auth.user;
}

export async function requireStaffOrAdmin(): Promise<AuthUser> {
  const auth = await getAuth();
  if (!auth.user) redirect("/admin/login");
  return auth.user;
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  const cookie = jar.get(SESSION_COOKIE)?.value;
  if (cookie) {
    const token = unsign(cookie);
    if (token) {
      await prisma.authSession
        .deleteMany({ where: { tokenHash: hashToken(token) } })
        .catch(() => {});
    }
  }
  jar.delete(SESSION_COOKIE);
}

export async function revokeAllSessions(userId: string): Promise<void> {
  await prisma.authSession.deleteMany({
    where: {
      OR: [{ adminUserId: userId }, { staffUserId: userId }],
    },
  });
}