// Lightweight event logging for the lead/snapshot endpoints, so abuse is
// watchable. Two sinks:
//   1. console.log of a structured line -> Cloudflare Workers Logs (observability
//      is enabled in wrangler.jsonc; filter/tail in the dashboard). Always on.
//   2. Analytics Engine writeDataPoint -> queryable by IP/domain for dashboards
//      and rate-limit logic. Only if the optional AE binding is present.

export interface AnalyticsEngine {
  writeDataPoint: (event: {
    blobs?: string[];
    doubles?: number[];
    indexes?: string[];
  }) => void;
}

export interface EventLogEnv {
  AE?: AnalyticsEngine;
}

/** The real visitor IP behind Cloudflare. */
export function clientIp(request: Request): string {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for") ||
    "unknown"
  );
}

type Fields = Record<string, string | number | boolean | undefined>;

export function logEvent(env: EventLogEnv, name: string, fields: Fields): void {
  try {
    console.log(JSON.stringify({ evt: name, ...fields }));
  } catch {
    /* logging must never throw */
  }
  try {
    env.AE?.writeDataPoint({
      blobs: [
        name,
        String(fields.ip ?? ""),
        String(fields.domain ?? ""),
        String(fields.detail ?? ""),
      ],
      // Index by IP so abuse (one IP, many requests) is cheap to query.
      indexes: [String(fields.ip ?? "unknown")],
    });
  } catch {
    /* AE not bound / unavailable — console line still captured it */
  }
}
