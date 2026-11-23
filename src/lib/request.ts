import { headers } from "next/headers";

export function getClientIp(headerList: Headers): string | null {
  const forwarded = headerList.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim().slice(0, 60) || null;
  return headerList.get("x-real-ip")?.slice(0, 60) ?? null;
}

export async function getRequestMeta(): Promise<{
  ip: string | null;
  userAgent: string | null;
}> {
  const headerList = await headers();
  return {
    ip: getClientIp(headerList),
    userAgent: (headerList.get("user-agent") ?? "").slice(0, 300) || null,
  };
}

export function assertSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true; // Same-origin navigations and server-to-server calls.
  const host = request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function safeNextPath(value: string | null | undefined, fallback: string): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return fallback;
  return value;
}
