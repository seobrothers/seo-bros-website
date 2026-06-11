// Tiny provider-agnostic LLM helper for the snapshot engine. Prefers Claude
// (Anthropic) when ANTHROPIC_API_KEY is set; falls back to OpenAI. Both are
// plain fetch calls, so this runs inside the Cloudflare Worker.
//
// Set ANTHROPIC_API_KEY as a Cloudflare secret for production (Devon's pick is
// Claude). Locally, OPENAI_API_KEY in .env.local keeps it working.

export interface LlmEnv {
  ANTHROPIC_API_KEY?: string;
  ANTHROPIC_MODEL?: string;
  OPENAI_API_KEY?: string;
  OPENAI_MODEL?: string;
}

export function hasLlm(env: LlmEnv): boolean {
  return Boolean(env.ANTHROPIC_API_KEY || env.OPENAI_API_KEY);
}

export async function complete(
  env: LlmEnv,
  { system, user, maxTokens = 1400 }: { system: string; user: string; maxTokens?: number }
): Promise<string> {
  if (env.ANTHROPIC_API_KEY) {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: env.ANTHROPIC_MODEL || "claude-3-5-sonnet-latest",
        max_tokens: maxTokens,
        system,
        messages: [{ role: "user", content: user }],
      }),
    });
    if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
    const body = (await res.json()) as { content?: Array<{ text?: string }> };
    return body.content?.map((c) => c.text ?? "").join("") ?? "";
  }

  if (env.OPENAI_API_KEY) {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.OPENAI_API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: env.OPENAI_MODEL || "gpt-4o-mini",
        max_tokens: maxTokens,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });
    if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
    const body = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    return body.choices?.[0]?.message?.content ?? "";
  }

  throw new Error("No LLM key configured (ANTHROPIC_API_KEY or OPENAI_API_KEY)");
}

/** Parse a JSON object from an LLM response, tolerating ```json fences. */
export function parseJsonLoose<T>(text: string): T | null {
  const cleaned = text.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    // Last resort: grab the first {...} block.
    const m = cleaned.match(/\{[\s\S]*\}/);
    if (m) {
      try {
        return JSON.parse(m[0]) as T;
      } catch {
        return null;
      }
    }
    return null;
  }
}
