import { prisma } from "@/lib/db";

export interface RateLimitResult {
  allowed: boolean;
  count: number;
  limit: number;
  retryAfterSeconds: number;
}

/**
 * Atomic, database-backed fixed-window rate limiter.
 *
 * A single UPSERT increments the counter, so concurrent requests in different
 * serverless instances cannot race past the limit. Keys contain hashed IPs /
 * normalised identifiers — never raw personal data.
 */
export async function consumeRateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<RateLimitResult> {
  const windowMs = windowSeconds * 1000;
  const windowStart = new Date(Math.floor(Date.now() / windowMs) * windowMs);

  try {
    const rows = await prisma.$queryRaw<Array<{ count: number }>>`
      INSERT INTO "rate_limits" ("key", "window_start", "count", "created_at")
      VALUES (${key}, ${windowStart}, 1, now())
      ON CONFLICT ("key", "window_start")
      DO UPDATE SET "count" = "rate_limits"."count" + 1
      RETURNING "count"
    `;
    const count = Number(rows[0]?.count ?? 1);
    return {
      allowed: count <= limit,
      count,
      limit,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((windowStart.getTime() + windowMs - Date.now()) / 1000),
      ),
    };
  } catch (error) {
    // The database is required for every privileged operation anyway; let the
    // caller surface its own error instead of masking it as a rate limit.
    console.error("[rate-limit] failed", error);
    return { allowed: true, count: 0, limit, retryAfterSeconds: 0 };
  }
}

export async function clearRateLimit(key: string): Promise<void> {
  try {
    await prisma.rateLimit.deleteMany({ where: { key } });
  } catch {
    /* best effort */
  }
}
