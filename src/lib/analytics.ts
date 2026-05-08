export type AnalyticsEvent =
  | "click_to_call"
  | "email_click"
  | "demo_form_submission"
  | "portal_signups";

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

export function initOutboundTracking(): void {
  if (typeof document === "undefined") return;
  document.addEventListener("click", (e) => {
    const target = e.target as Element | null;
    if (!target) return;
    const link = target.closest<HTMLAnchorElement>("a[href]");
    if (!link) return;
    const href = link.getAttribute("href") ?? "";
    if (href.startsWith("tel:")) {
      track("click_to_call", { link_url: href });
    } else if (href.startsWith("mailto:")) {
      track("email_click", { link_url: href });
    }
  });
}
