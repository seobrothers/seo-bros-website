// Cloudflare runtime env access (secrets + bindings).
//
// Astro v6 / @astrojs/cloudflare v13 removed `locals.runtime.env` — touching
// it now throws at runtime. The supported replacement is the
// `cloudflare:workers` module, which workerd provides in production, preview,
// and dev. This helper is only imported from prerender=false API routes that
// are bundled into the Worker, so the specifier always resolves.
import { env } from "cloudflare:workers";

/** Returns the Worker env, typed as the slice of secrets/bindings you need. */
export function cfEnv<T extends object>(): T {
  return (env ?? {}) as T;
}
