// lib/rate-limit.ts
const buckets = new Map<string, { count: number; resetAt: number }>();

/** windowMs içinde `limit` isteğe kadar izin verir. */
export function checkRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return {
      ok: true,
      remaining: limit - 1,
      reset: Math.ceil((now + windowMs) / 1000),
    };
    // reset = epoch seconds
  }

  if (bucket.count < limit) {
    bucket.count += 1;
    return {
      ok: true,
      remaining: limit - bucket.count,
      reset: Math.ceil(bucket.resetAt / 1000),
    };
  }

  return { ok: false, remaining: 0, reset: Math.ceil(bucket.resetAt / 1000) };
}

