# SEO Brothers Editorial Style Guide

How content sounds across seobrothers.co. Two distinct voices, plus the rules that apply to both.

## When each voice is used

- **Adam Bate** authors guides built around his personal experience, hot takes, and the stories that anchor the original SEO Brothers content. PBNs, link building, on-page, keyword mapping, the long-arc strategy guides where he was the original source. If a guide opens with one of his anecdotes (Websavers, BuildMyRank, LocalRank), it's an Adam guide.
- **Devon Bate** authors anything reworked from generic legacy content, anything newly written, and anything where the source author is unclear. Devon's voice is the default going forward. New hubs like `home-services-seo` and `serp-features-evolution` are Devon's.
- **Set it in frontmatter:** `author: "Adam Bate"` or `author: "Devon Bate"`. The schema defaults to Adam, so be deliberate when it should be Devon.

---

## Voice profile: Adam

Personal, direct, occasionally spicy. The reader feels like Adam is across the table from them.

**Yes:**
- First-person stories with specific details (companies, dollar amounts, dates, mistakes). "I owned a web services company called Websavers for over a decade." "We sat happily within the top three for 'web hosting' for about 8 to 12 months before getting destroyed during the de-indexing of BMR."
- Direct reader address that breaks the wall. "If you're thinking but Adam, expired domains don't work, let me stop you right there."
- Hot takes that pick a fight. "I really don't like the PBN-only SEO consultant. Stop giving the rest of us a bad name."
- Self-aware asides. "I got a little carried away there, lets move back on point."
- Casual phrasing. "Fill your boots." "In a nutshell." "Lets dive in."
- **Lots of line breaks. Many short paragraphs. Sometimes single sentences standing alone.** That rhythm is part of the voice.
- Loose grammar where it sounds natural. Sentence fragments are fine. Comma splices in moderation.

**No:**
- Smoothing his voice into editorial neutral. If a sentence sounds like a McKinsey deck, rewrite it.
- Stripping out the personal stories during edits. They're load-bearing.
- Hedging the hot takes into "some practitioners argue..." style mush.

---

## Voice profile: Devon

A degree more serious than Adam. Drier humor, light sarcasm, fewer fireworks. Grounded in observation, not war stories.

**Yes:**
- Direct, declarative sentences. Confidence without bravado.
- Short paragraphs and bite-size chunks. The Adam line-break habit, dialed back. Most paragraphs are two to four sentences. Single-sentence paragraphs exist but they're rarer and intentional, used for emphasis.
- Light sarcasm where it earns the line. "Most local business backlink profiles look like they were assembled in 2014 and abandoned." "The vendors who say PBNs are dead are usually the ones selling something else."
- Calling out industry nonsense without ranting. Make the point, move on.
- Practical framing. What it is, what it costs, when to do it, when not to.
- Opinions stated plainly. "We don't run general PBNs. The math doesn't work below a certain scale and the footprint risk grows faster than the upside."

**No:**
- Performed energy. No exclamation points outside of dialogue. No "let's dive in!" hype.
- McKinsey-speak. "Leveraging strategic frameworks to drive synergies" gets shot on sight.
- Bulleted-bolded-lead-everywhere structure. Use prose for prose. Save bullets for things that are actually lists.
- First-person personal anecdotes with specific company history. Those belong to Adam. Devon can reference observation across client work ("we see this constantly," "the audits we run usually surface...") but not "back when I was running X."

---

## Shared rules (both voices)

These apply regardless of author.

- **Say what it is, not what it isn't. Lead with the point.** Avoid negative parallelism and backloaded rationale in headings, bullet points, descriptions, and body copy. Write instead, targeting how an average, everyday human would understand.
  - *Negative parallelism* frames a point by first naming the wrong thing: "It's not X, it's Y." "Not a dashboard. A decision." "No fluff, no jargon, just results." "Less about rankings, more about revenue." The reader has to hold the thing you reject before they get the thing you mean. State the thing you mean. ("It's not about traffic, it's about leads" becomes "The goal is leads.")
  - *Backloaded rationale* makes the reader wait for the point. The setup, condition, or reason comes first and the claim arrives at the end: "Because redesigns change URLs and search engines lose track of pages, we map every old URL before launch." Put the claim first, then the reason, in the order a person would say it out loud: "We map every old URL before launch. Redesigns change URLs, and search engines lose track of pages that move."
  - Headings and bullets get the same treatment. "Redesigns Tank Rankings. Ours Don't Have To." becomes "Your Client's Rankings Survive the Redesign." A bullet that reads "Not another page builder" becomes what it actually is.
  - A plain negative fact is fine ("No setup fee." "We never email your client."). The pattern to cut is the rhetorical one, where the negative exists to set up a contrast or a reveal.
- **No em dashes (—) anywhere in prose.** Use commas, parens, colons, or sentence breaks. Exception: stylistic attribution lines (signoffs like `— The Brothers`, pull-quote attributions, byline credits in design contexts). Those are fine.
- **Preserve visual elements during rework.** If the legacy version had inline images, charts, screenshots, embedded videos, or linked downloads, carry them forward. Images get downloaded to `public/images/guides/[slug]/[filename]` and referenced via markdown `![alt](path)` in the guide body. Embeds (YouTube, etc.) stay as embeds. External resource links stay. Don't ship a text-only rewrite of a guide that originally had visual context. If a legacy image is dated or low-quality, surface it as a TODO for replacement rather than silently dropping it.
- **Never refer to SEO Brothers' work as "PBN" or "private blog network."** The internal product name is the **Publishing House** (a managed network of owned media properties plus supplemental aged/auction domains). The term PBN can appear in educational/observational content as an industry term, but never as a label for what we do. No "we run PBNs," no "our PBN," no "PBNs we use." See `LinkBuilding_Partner_Overview.docx` and `LinkBuilding_Client_Overview.docx` (in Devon's iCloud Desktop) for the canonical positioning language. Note those source docs are marked confidential, so don't copy their text verbatim into public site content.
- **"We" means SEO Brothers as a company.** "I" means the named author.
- **Slugs are kebab-case, evergreen, no junk words.** No dates, no "updated," no "guide," no "-companies." Filename equals slug. See `MIGRATION_TRIAGE.md`.
- **Have an opinion, but don't fabricate one.** Hedged content reads like AI, so if a section doesn't take a position, cut it or sharpen it. But if the right position isn't clear, ask the named author. Putting a manufactured opinion under someone's byline is worse than hedging.
- **Show the cost.** Talk about money, time, and risk in concrete terms. Avoid vague "investment required" framing.
- **Internal links go to relevant pillars, not every paragraph.** One or two well-placed internal links per major section, not link-soup.
- **Closing CTA is consistent.** Most guides close with a one-paragraph "how we approach this at SEO Brothers" plus a link to `/sign-up` or `/white-label-seo`. Don't overdesign the close.
- **No stock-image-style filler sentences.** "In today's competitive digital landscape, businesses must..." is an instant cut.

---

## Editing pass checklist

When reworking a migrated guide, run through this:

1. **Voice match.** Is this Adam's voice or Devon's? Frontmatter set correctly?
2. **Adam guides: are the personal stories preserved?** If they were stripped during the original migration, restore them from the legacy version.
3. **Em dashes scrubbed?** Search for `—` and replace.
4. **Negative parallelism and backloaded rationale gone?** Every "not X, it's Y" becomes Y. Every sentence, heading, and bullet leads with its point and follows with the reason.
5. **Bullets earning their place?** Convert bolded-bullet walls back to prose where the content is actually flowing argument.
6. **Hot takes intact?** If the original had an opinion and the migration softened it, restore the edge.
7. **Closing CTA.** One paragraph, link to `/sign-up` or `/white-label-seo`, no over-design.
8. **Length and rhythm.** Adam guides can run long with lots of breaks. Devon guides should feel tighter, shorter paragraphs, less single-line breaks.
