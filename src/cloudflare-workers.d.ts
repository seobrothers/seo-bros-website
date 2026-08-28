// Minimal typing for the `cloudflare:workers` runtime module. The repo does
// not depend on @cloudflare/workers-types; API routes cast `env` to the
// specific slice of secrets/bindings they read (see src/lib/cf-env.ts).
declare module "cloudflare:workers" {
  export const env: Record<string, unknown>;
}
