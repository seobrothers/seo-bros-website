// Minimal ActiveCampaign v3 helpers shared by the lead endpoints
// (/api/audit and /api/partner-lead). Pure HTTP, no env reading: callers pass
// the resolved base URL + API token.

export interface AC {
  base: string;
  token: string;
}

function headers(ac: AC) {
  return {
    "Api-Token": ac.token,
    "content-type": "application/json",
    accept: "application/json",
  };
}

/** Create or update a contact. Returns the contact id. Throws on failure. */
export async function syncContact(
  ac: AC,
  contact: { email: string; firstName: string; lastName: string }
): Promise<string> {
  const res = await fetch(`${ac.base}/api/3/contact/sync`, {
    method: "POST",
    headers: headers(ac),
    body: JSON.stringify({ contact }),
  });
  if (!res.ok) {
    throw new Error(`AC contact/sync failed: ${res.status} ${await res.text()}`);
  }
  const body = (await res.json()) as { contact?: { id?: string } };
  const id = body.contact?.id;
  if (!id) throw new Error("AC contact/sync returned no contact id");
  return String(id);
}

/** Add a contact to a list. Throws on failure. */
export async function addToList(ac: AC, contactId: string, listId: number): Promise<void> {
  const res = await fetch(`${ac.base}/api/3/contactLists`, {
    method: "POST",
    headers: headers(ac),
    body: JSON.stringify({
      contactList: { list: listId, contact: contactId, status: 1 },
    }),
  });
  if (!res.ok) {
    throw new Error(`AC contactLists add failed: ${res.status} ${await res.text()}`);
  }
}

/**
 * Resolve a tag id by name, creating the tag if it doesn't exist yet.
 * Best-effort: returns null on any failure so tagging never blocks a lead.
 */
export async function ensureTag(ac: AC, name: string): Promise<string | null> {
  try {
    const search = await fetch(
      `${ac.base}/api/3/tags?search=${encodeURIComponent(name)}`,
      { headers: headers(ac) }
    );
    if (search.ok) {
      const body = (await search.json()) as { tags?: Array<{ id: string; tag: string }> };
      const exact = body.tags?.find((t) => t.tag === name);
      if (exact) return exact.id;
    }
    const create = await fetch(`${ac.base}/api/3/tags`, {
      method: "POST",
      headers: headers(ac),
      body: JSON.stringify({ tag: { tag: name, tagType: "contact" } }),
    });
    if (!create.ok) return null;
    const body = (await create.json()) as { tag?: { id?: string } };
    return body.tag?.id ?? null;
  } catch (err) {
    console.error("AC ensureTag failed", err);
    return null;
  }
}

/** Apply a tag to a contact. Best-effort: logs and swallows failures. */
export async function tagContact(ac: AC, contactId: string, tagId: string): Promise<void> {
  try {
    const res = await fetch(`${ac.base}/api/3/contactTags`, {
      method: "POST",
      headers: headers(ac),
      body: JSON.stringify({ contactTag: { contact: contactId, tag: tagId } }),
    });
    if (!res.ok) console.error(`AC contactTags add failed: ${res.status} ${await res.text()}`);
  } catch (err) {
    console.error("AC tagContact failed", err);
  }
}

/** Convenience: ensure a tag exists and apply it, all best-effort. */
export async function applyTag(ac: AC, contactId: string, tagName: string): Promise<void> {
  const tagId = await ensureTag(ac, tagName);
  if (tagId) await tagContact(ac, contactId, tagId);
}
