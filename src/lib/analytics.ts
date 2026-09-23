export type AnalyticsEvent =
  | "click_to_call"
  | "email_click"
  | "demo_form_submission"
  | "audit_form_submission"
  | "free_audit_form_submission"
  | "partner_optin"
  | "portal_signups"
  | "calendar_event_scheduled"
  | "early_access_request";

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

// Calendly inline iframes (the "Book a walkthrough" / growth-call embeds)
// post a "calendly.event_scheduled" message to the parent window when a booking
// completes. Fire our analytics event off that, anywhere a Calendly embed lives.
export function initCalendlyTracking(): void {
  if (typeof window === "undefined") return;
  window.addEventListener("message", (e) => {
    if (e.origin !== "https://calendly.com") return;
    const data = e.data as
      | { event?: string; payload?: { event?: { uri?: string }; invitee?: { uri?: string } } }
      | null;
    if (!data || data.event !== "calendly.event_scheduled") return;
    // Calendly then redirects the booker to /call-booked/, which fires the same
    // event from the URL details. Both paths mark the booking in sessionStorage
    // (keyed by the invitee id) so it is counted once whichever path wins.
    const inviteeUri = data.payload?.invitee?.uri ?? "";
    const inviteeId = inviteeUri.split("/").filter(Boolean).pop();
    if (inviteeId) {
      const key = `calendly_tracked:${inviteeId}`;
      try {
        if (sessionStorage.getItem(key) === "1") return;
        sessionStorage.setItem(key, "1");
      } catch {}
    }
    track("calendar_event_scheduled", {
      event_uri: data.payload?.event?.uri,
      invitee_uri: inviteeUri || undefined,
      method: "embed",
    });
  });
}
