import type { APIRoute } from "astro";
import { consentRequiredFor } from "../../lib/consent";

// Consent-region lookup for the cookie banner. Cloudflare already knows where
// the request came from (`locals.runtime.cf`), so the layout asks this endpoint
// whether the visitor is somewhere that needs opt-in consent before analytics
// runs, and only shows the banner there. Runs on-demand in the Worker; local
// dev has no `cf` and falls back to "required", the safe default.
export const prerender = false;

interface CfGeo {
  country?: string;
  regionCode?: string;
}

export const GET: APIRoute = ({ locals }) => {
  const cf = (locals as { runtime?: { cf?: CfGeo } }).runtime?.cf;
  const country = cf?.country ?? null;
  const region = cf?.regionCode ?? null;
  const consent = consentRequiredFor(country, region) ? "required" : "implied";
  return new Response(JSON.stringify({ country, region, consent }), {
    headers: {
      "content-type": "application/json",
      "cache-control": "private, no-store",
    },
  });
};
