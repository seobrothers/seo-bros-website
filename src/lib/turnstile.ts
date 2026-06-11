// Cloudflare Turnstile — "is this a real person" check on the lead forms.
//
// Graceful by design:
//   - The widget renders only when PUBLIC_TURNSTILE_SITE_KEY is set (build-time
//     public var), so before you create keys the forms look/work exactly as now.
//   - Server verification is skipped when TURNSTILE_SECRET_KEY is unset, so it
//     never blocks submits until you've wired both keys.
//
// To enable: create a Turnstile widget in the Cloudflare dashboard, then set
//   PUBLIC_TURNSTILE_SITE_KEY  (build var — safe to expose)
//   TURNSTILE_SECRET_KEY       (Worker secret)
// Set BOTH together (a secret without a site key would block all submits).

/** Site key for the client widget (public). Empty string if unset. */
export const TURNSTILE_SITE_KEY: string =
  (import.meta.env.PUBLIC_TURNSTILE_SITE_KEY as string | undefined) ?? "";

/**
 * Verify a Turnstile token server-side. Returns true (allow) when no secret is
 * configured, so the gate is opt-in. With a secret set, a missing/invalid token
 * is rejected.
 */
export async function verifyTurnstile(
  secret: string | undefined,
  token: string | undefined,
  ip?: string
): Promise<boolean> {
  if (!secret) return true; // not configured yet — don't block
  if (!token) return false;
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip && ip !== "unknown") body.set("remoteip", ip);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
    });
    const data = (await res.json()) as { success?: boolean };
    return Boolean(data.success);
  } catch {
    // Verification service unreachable — fail closed (treat as not verified).
    return false;
  }
}
