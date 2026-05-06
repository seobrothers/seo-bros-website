export type AnalyticsEvent = "demo_form_submission" | "portal_signups";

export type EventProperties = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export function track(event: AnalyticsEvent, properties?: EventProperties): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", event, properties ?? {});
}
