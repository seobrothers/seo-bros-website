// Fixed-window IP rate limiting backed by Cloudflare KV.
//
// Graceful: if the KV binding isn't present (local dev, or before the namespace
// is created), it allows everything — so nothing breaks until you wire it.
//
// KV isn't atomic, so the count is approximate under bursts. That's fine for
// abuse throttling: a script hammering the endpoint still trips the limit.

export interface RateLimitKV {
  get(key: string, type: "json"): Promise<{ n: number; exp: number } | null>;
  put(key: string, value: string, opts?: { expirationTtl?: number }): Promise<void>;
}

export interface RateLimitResult {
  allowed: boolean;
  /** Seconds until the window resets (when blocked). */
  retryAfter?: number;
}

export async function rateLimit(
  kv: RateLimitKV | undefined,
  key: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  if (!kv) return { allowed: true }; // not bound — skip
  try {
    const now = Date.now();
    const rec = await kv.get(key, "json");
    if (rec && rec.exp > now) {
      const remaining = Math.ceil((rec.exp - now) / 1000);
      if (rec.n >= limit) return { allowed: false, retryAfter: remaining };
      // Preserve the existing window expiry; just bump the count.
      await kv.put(key, JSON.stringify({ n: rec.n + 1, exp: rec.exp }), {
        expirationTtl: remaining + 1,
      });
      return { allowed: true };
    }
    // New window.
    await kv.put(key, JSON.stringify({ n: 1, exp: now + windowSeconds * 1000 }), {
      expirationTtl: windowSeconds,
    });
    return { allowed: true };
  } catch {
    // KV hiccup must not block legitimate users.
    return { allowed: true };
  }
}
