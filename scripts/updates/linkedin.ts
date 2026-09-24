#!/usr/bin/env -S npx tsx
// Friday roll-up: the week's published product updates become three LinkedIn
// options, one per lane (Lesson, Agency problem, Arc), appended to Devon's
// LinkedIn bank sheet as Proposed and sent to him on Slack.
//
//   npx tsx scripts/updates/linkedin.ts                                # week ending today
//   npx tsx scripts/updates/linkedin.ts --week-ending 2026-09-19
//   npx tsx scripts/updates/linkedin.ts --dry-run                      # print, write nothing
//   npx tsx scripts/updates/linkedin.ts --no-sheet --no-slack
//
// Source: this repo's src/content/updates (--site points elsewhere if needed). Posts published in the
// seven days ending on --week-ending (Atlantic) feed the Lesson and Agency
// problem lanes; every chapter post is offered to the Arc lane so the week
// can be tied back to the story it grew out of. Drafts are ignored.
//
// Environment: ANTHROPIC_API_KEY (required); GOOGLE_SERVICE_ACCOUNT_JSON and
// LINKEDIN_SHEET_ID for the sheet (the service account must be a writer on
// it); SLACK_BOT_TOKEN for the ping. UPDATES_SLACK_TO overrides the recipient.
import Anthropic from '@anthropic-ai/sdk';
import { createSign } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const TZ = 'America/Halifax';
const MODEL = 'claude-opus-5';
const SITE_URL = 'https://seobrothers.com';
const SLACK_TO = process.env.UPDATES_SLACK_TO ?? 'U1A6LAR25'; // Devon
const LANES = ['Lesson', 'Agency problem', 'Arc'] as const;

// ── args ────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const flag = (name: string) => args.includes(name);
const opt = (name: string) => {
	const i = args.indexOf(name);
	return i >= 0 ? args[i + 1] : undefined;
};
if (flag('--help') || flag('-h')) {
	console.log(readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').slice(1, 18).map((l) => l.replace(/^\/\/ ?/, '')).join('\n'));
	process.exit(0);
}
const dryRun = flag('--dry-run');
const noSheet = flag('--no-sheet') || dryRun;
const noSlack = flag('--no-slack') || dryRun;
const sitePath = path.resolve(opt('--site') ?? process.env.UPDATES_SITE_PATH ?? path.join(here, '../..'));
const weekEnding = opt('--week-ending') ?? localDate(new Date());
if (!/^\d{4}-\d{2}-\d{2}$/.test(weekEnding)) fail(`--week-ending must be YYYY-MM-DD, got ${weekEnding}`);
const weekStart = shift(weekEnding, -6);

// ── main ────────────────────────────────────────────────────────────────────
const dir = path.join(sitePath, 'src/content/updates');
if (!existsSync(dir)) fail(`${dir} does not exist. Pass --site with the website checkout.`);
const all = readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => parsePost(path.join(dir, f))).filter((p) => !p.draft);
const week = all.filter((p) => p.span !== 'chapter' && p.publishDate >= weekStart && p.publishDate <= weekEnding).sort((a, b) => a.publishDate.localeCompare(b.publishDate));
const chapters = all.filter((p) => p.span === 'chapter').sort((a, b) => a.publishDate.localeCompare(b.publishDate));
console.log(`${week.length} post(s) published ${weekStart} to ${weekEnding}; ${chapters.length} chapters available for the Arc lane`);
if (week.length === 0) {
	await slack(`No product updates were published in the week ending ${weekEnding}, so no LinkedIn roll-up this Friday.`);
	process.exit(0);
}

const voice = readFileSync(path.join(here, 'VOICE.md'), 'utf8');
const options = await write(voice, week, chapters);
const slots = nextSlots(weekEnding);
for (const [i, o] of options.entries()) {
	console.log(`\n[${o.lane}] suggested ${slots[i]} · source ${o.source_slug}\n${o.body}\n\nnote: ${o.note}`);
}
if (dryRun) process.exit(0);

let sheetUrl = '';
if (!noSheet) sheetUrl = await appendToSheet(options, slots, weekEnding);

if (!noSlack) {
	const lines = [
		`*LinkedIn options for the week ending ${weekEnding}*`,
		...options.map((o, i) => `• *${o.lane}* (${slots[i]}): ${o.hook}`),
		'',
		sheetUrl ? `Added to the bank as Proposed: ${sheetUrl}` : 'Not written to the sheet.',
		'The backfill rows already hold those dates; pick which goes out.',
	];
	await slack(lines.join('\n'));
}

// ── pieces ──────────────────────────────────────────────────────────────────
interface Post {
	slug: string;
	title: string;
	summary: string;
	publishDate: string;
	span: string;
	draft: boolean;
	body: string;
}
interface Option {
	lane: (typeof LANES)[number];
	hook: string;
	body: string;
	source_slug: string;
	note: string;
}

function fail(msg: string): never {
	console.error(msg);
	process.exit(1);
}
function localDate(d: Date): string {
	return new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
}
function shift(day: string, days: number): string {
	const d = new Date(`${day}T12:00:00Z`);
	d.setUTCDate(d.getUTCDate() + days);
	return d.toISOString().slice(0, 10);
}
// The Monday, Wednesday and Friday after the week that just ended.
function nextSlots(weekEndingDay: string): string[] {
	const d = new Date(`${weekEndingDay}T12:00:00Z`);
	const out: string[] = [];
	while (out.length < 3) {
		d.setUTCDate(d.getUTCDate() + 1);
		if ([1, 3, 5].includes(d.getUTCDay())) out.push(d.toISOString().slice(0, 10));
	}
	return out;
}

function parsePost(file: string): Post {
	const src = readFileSync(file, 'utf8');
	const m = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(src);
	if (!m) fail(`${file}: no frontmatter`);
	const fm: Record<string, string> = {};
	for (const line of m[1].split('\n')) {
		const kv = /^(\w+):\s*(.*)$/.exec(line);
		if (kv) fm[kv[1]] = kv[2].replace(/^"(.*)"$/, '$1');
	}
	// The review block is for the person approving the post, never for the model.
	const body = m[2].replace(/<!--[\s\S]*?-->/g, '').trim();
	return {
		slug: path.basename(file, '.md'),
		title: fm.title ?? '',
		summary: fm.summary ?? '',
		publishDate: fm.publishDate ?? '',
		span: fm.span ?? 'day',
		draft: fm.draft === 'true',
		body,
	};
}

async function write(voice: string, weekPosts: Post[], chapterPosts: Post[]): Promise<Option[]> {
	const client = new Anthropic();
	const render = (p: Post) => `### ${p.slug} (${p.publishDate}, ${p.span})\n# ${p.title}\n${p.summary}\n\n${p.body}`;
	const user = [
		`Write the Friday LinkedIn roll-up for the week ${weekStart} to ${weekEnding}: exactly three options, one per lane, in this order: Lesson, Agency problem, Arc. Follow the LinkedIn section of the brief.`,
		'',
		'Return a JSON object with three keys, lesson, agency_problem and arc, each an object with fields: lane, hook (the first line, identical to the first line of body), body (the full post, paragraphs separated by a blank line), source_slug (the slug of the update the idea comes from; for Arc, the slug of the week\'s update it starts from), note (one line for Devon: what the post is doing and anything to double-check).',
		'',
		`## This week's updates (${weekPosts.length})`,
		weekPosts.map(render).join('\n\n---\n\n'),
		'',
		`## The chapters, for the Arc lane (${chapterPosts.length}). Tie one of this week's changes back to the chapter it grew out of.`,
		chapterPosts.map((p) => `- ${p.slug} (${p.publishDate}): ${p.title}. ${p.summary}`).join('\n'),
	].join('\n');
	const option = {
		type: 'object',
		additionalProperties: false,
		required: ['lane', 'hook', 'body', 'source_slug', 'note'],
		properties: {
			lane: { type: 'string', enum: [...LANES] },
			hook: { type: 'string' },
			body: { type: 'string' },
			source_slug: { type: 'string' },
			note: { type: 'string' },
		},
	};
	// One named slot per lane: the API cannot pin an array's length, and the
	// object shape also guarantees the lane order.
	const schema = {
		type: 'object',
		additionalProperties: false,
		required: ['lesson', 'agency_problem', 'arc'],
		properties: { lesson: option, agency_problem: option, arc: option },
	};
	const res = await client.messages
		.stream({
			model: MODEL,
			max_tokens: 8000,
			system: [{ type: 'text', text: voice, cache_control: { type: 'ephemeral' } }],
			messages: [{ role: 'user', content: user }],
			output_config: { effort: 'high', format: { type: 'json_schema', schema } },
		})
		.finalMessage();
	if (res.stop_reason === 'refusal') fail(`Model refused: ${res.stop_details?.explanation ?? ''}`);
	const text = res.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
	const parsed = JSON.parse(text) as { lesson: Option; agency_problem: Option; arc: Option };
	const options = [parsed.lesson, parsed.agency_problem, parsed.arc];
	for (const [i, o] of options.entries()) {
		o.lane = LANES[i];
		o.body = o.body.replace(/—/g, ',').trim();
		o.hook = o.body.split('\n')[0].trim();
	}
	return options;
}

// ── Google Sheets, service account, no dependencies ─────────────────────────
async function googleToken(): Promise<string> {
	const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
	if (!raw) fail('GOOGLE_SERVICE_ACCOUNT_JSON is not set.');
	const sa = JSON.parse(raw) as { client_email: string; private_key: string };
	const b64 = (s: string) => Buffer.from(s).toString('base64url');
	const now = Math.floor(Date.now() / 1000);
	const unsigned =
		b64(JSON.stringify({ alg: 'RS256', typ: 'JWT' })) +
		'.' +
		b64(JSON.stringify({ iss: sa.client_email, scope: 'https://www.googleapis.com/auth/spreadsheets', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 }));
	const sig = createSign('RSA-SHA256').update(unsigned).sign(sa.private_key).toString('base64url');
	const res = await fetch('https://oauth2.googleapis.com/token', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: `grant_type=${encodeURIComponent('urn:ietf:params:oauth:grant-type:jwt-bearer')}&assertion=${unsigned}.${sig}`,
	});
	const data = (await res.json()) as { access_token?: string; error?: string };
	if (!data.access_token) fail(`Google token failed: ${data.error ?? res.status}`);
	return data.access_token;
}

// Appends one row per option to the first sheet, matching the bank's columns:
// #, Suggested date, Lane, Hook, Post, Source post, Source date, Words, Status, Notes.
async function appendToSheet(options: Option[], slots: string[], weekEndingDay: string): Promise<string> {
	const id = process.env.LINKEDIN_SHEET_ID;
	if (!id) fail('LINKEDIN_SHEET_ID is not set.');
	const token = await googleToken();
	const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
	const current = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${id}/values/A:A`, { headers });
	const col = ((await current.json()) as { values?: string[][] }).values ?? [];
	let n = col.reduce((max, [v]) => Math.max(max, Number(v) || 0), 0);
	const bySlug = new Map(all.map((p) => [p.slug, p]));
	const rows = options.map((o, i) => {
		const src = bySlug.get(o.source_slug);
		n += 1;
		return [
			String(n),
			slots[i],
			o.lane,
			o.hook,
			o.body,
			`${SITE_URL}/updates/${o.source_slug}/`,
			src?.publishDate ?? weekEndingDay,
			String(o.body.split(/\s+/).length),
			'Proposed',
			`Friday roll-up for the week ending ${weekEndingDay}. ${o.note}`,
		];
	});
	const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${id}/values/A:J:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
		method: 'POST',
		headers,
		body: JSON.stringify({ values: rows }),
	});
	if (!res.ok) fail(`Sheets append failed: ${res.status} ${await res.text()}`);
	console.log(`appended ${rows.length} rows to the sheet`);
	return `https://docs.google.com/spreadsheets/d/${id}/edit`;
}

async function slack(text: string): Promise<void> {
	if (noSlack) return;
	const token = process.env.SLACK_BOT_TOKEN;
	if (!token) {
		console.warn('SLACK_BOT_TOKEN not set; skipping Slack');
		return;
	}
	const res = await fetch('https://slack.com/api/chat.postMessage', {
		method: 'POST',
		headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json; charset=utf-8' },
		body: JSON.stringify({ channel: SLACK_TO, text, unfurl_links: false, unfurl_media: false }),
	});
	const data = (await res.json()) as { ok: boolean; error?: string };
	if (!data.ok) console.warn(`Slack refused: ${data.error}`);
}
