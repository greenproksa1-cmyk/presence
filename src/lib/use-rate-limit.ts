import { consumeRateLimit } from "@/lib/rate-limit";
import { useState, useEffect } from "react";

export interface RateLimitResult {
  allowed: boolean;
  count: number;
  limit: number;
  retryAfterSeconds: number;
}

export function useRateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
): { rateLimit: RateLimitResult; consume: () => Promise<RateLimitResult> } {
  const [rateLimit, setRateLimit] = useState<RateLimitResult>(
    { allowed: true, count: 0, limit, retryAfterSeconds: 0 },
  );

  // Initial consumption on mount
  useEffect(() => {
    consumeRateLimit(key, limit, windowSeconds).then(setRateLimit);
  }, [key, limit, windowSeconds]);

  const consume = async (): Promise<RateLimitResult> => {
    const result = await consumeRateLimit(key, limit, windowSeconds);
    setRateLimit(result);
    return result;
  };

  return { rateLimit, consume };
}