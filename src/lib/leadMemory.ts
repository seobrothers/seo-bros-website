// Lead memory: remember a visitor's name/email (first-party localStorage) once
// they've submitted any form, then pre-fill it on every other form so the lead
// flows feel connected instead of asking for the same details twice.
//
// First-party, functional storage of data the visitor entered themselves (their
// own contact details, to save them re-typing). Not tracking/advertising state.
// The server still requires the email on submit, so this is purely UX — it does
// not weaken the abuse gate.

const KEY = "sb_lead";

export interface Lead {
  name?: string;
  email?: string;
}

export function getLead(): Lead {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}") as Lead;
  } catch {
    return {};
  }
}

/** Merge-and-store what we know about the lead. */
export function saveLead(data: Lead): void {
  try {
    const merged = { ...getLead(), ...data };
    // Drop empties so a blank submit doesn't wipe a known value.
    for (const k of Object.keys(merged) as (keyof Lead)[]) {
      if (!merged[k]) delete merged[k];
    }
    localStorage.setItem(KEY, JSON.stringify(merged));
  } catch {
    /* storage unavailable (private mode, etc.) — pre-fill just won't happen */
  }
}

/** Pre-fill a form's name/email inputs from stored lead data (only if empty). */
export function prefillForm(form: HTMLFormElement): void {
  const lead = getLead();
  const fill = (name: string, value?: string) => {
    if (!value) return;
    const el = form.querySelector<HTMLInputElement>(`input[name="${name}"]`);
    if (el && !el.value) el.value = value;
  };
  fill("name", lead.name);
  fill("email", lead.email);
}
