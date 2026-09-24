#!/usr/bin/env -S npx tsx
// Draft one day's public product update from the merged pull requests.
//
//   npx tsx scripts/updates/draft.ts                       # yesterday, Atlantic time
//   npx tsx scripts/updates/draft.ts --date 2026-09-16
//   npx tsx scripts/updates/draft.ts --date 2026-09-16 --dry-run     # print, write nothing
//   npx tsx scripts/updates/draft.ts --site /path/to/checkout          # default: this repo
//   npx tsx scripts/updates/draft.ts --no-pr --no-slack               # write the file only
//
// What it does, in order:
//   1. Lists every PR merged on that day (Atlantic time) in the source repos.
//   2. Sorts them by reach from their GitHub labels (the same tags the
//      Slack announce script applies): partner-facing and client-facing feed
//      "For our partners"; staff-only, internal and unlabelled feed "Behind
//      the scenes". `hush` drops a PR; `billing` drops it unless `announce`.
//   3. Asks the model to write the post under scripts/updates/VOICE.md, as
//      JSON, and refuses to post when the day has nothing tellable.
//   4. Writes src/content/updates/YYYY-MM-DD.md into the website checkout,
//      pushes a branch and opens a pull request there. Merging the PR is the
//      approval; nothing publishes until someone merges it.
//   5. Tells Devon on Slack: title, the partners section, the PR link and
//      the LinkedIn variant.
//
// This lives in the website repo: the post is written into this checkout
// and the review PR opens here. Environment: ANTHROPIC_API_KEY (required);
// PLATFORM_READ_TOKEN (or a logged-in gh) to read the platform's PRs;
// GITHUB_TOKEN (Actions) or gh to push and open the PR here; SLACK_BOT_TOKEN
// for the ping. UPDATES_SOURCE_REPOS overrides the repo list (comma
// separated), UPDATES_SLACK_TO the Slack recipient.
import Anthropic from '@anthropic-ai/sdk';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const TZ = 'America/Halifax';
const MODEL = 'claude-opus-5';
const SOURCE_REPOS = (process.env.UPDATES_SOURCE_REPOS ?? '4sons/theseoplatform').split(',').map((s) => s.trim()).filter(Boolean);
const WEBSITE_REPO = process.env.UPDATES_WEBSITE_REPO ?? 'seobrothers/seo-bros-website';
const SLACK_TO = process.env.UPDATES_SLACK_TO ?? 'U1A6LAR25'; // Devon
const SITE_URL = 'https://seobrothers.com';

const REACH_PARTNERS = new Set(['partner-facing', 'client-facing']);
const REACH_KNOWN = new Set(['partner-facing', 'client-facing', 'staff-only', 'internal']);
let cachedReadToken = '';

// ── args ────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const flag = (name: string) => args.includes(name);
const opt = (name: string) => {
	const i = args.indexOf(name);
	return i >= 0 ? args[i + 1] : undefined;
};
if (flag('--help') || flag('-h')) {
	console.log(readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').slice(1, 30).map((l) => l.replace(/^\/\/ ?/, '')).join('\n'));
	process.exit(0);
}
const dryRun = flag('--dry-run');
const noPr = flag('--no-pr') || dryRun;
const noSlack = flag('--no-slack') || dryRun;
const sitePath = path.resolve(opt('--site') ?? process.env.UPDATES_SITE_PATH ?? path.join(here, '../..'));
const date = opt('--date') ?? yesterday();
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) fail(`--date must be YYYY-MM-DD, got ${date}`);

// ── main ────────────────────────────────────────────────────────────────────
const prs = (await Promise.all(SOURCE_REPOS.map((r) => mergedOn(r, date)))).flat();
console.log(`${prs.length} PR(s) merged on ${date} (${TZ}) across ${SOURCE_REPOS.join(', ')}`);
if (prs.length === 0) {
	await slack(`No merged changes on ${date}, so no product update today.`);
	process.exit(0);
}

const kept = prs.filter((p) => !p.labels.includes('hush') && (!p.labels.includes('billing') || p.labels.includes('announce')));
const dropped = prs.filter((p) => !kept.includes(p));
for (const p of dropped) console.log(`  dropped #${p.number} (${p.labels.join(', ') || 'no labels'}): ${p.title}`);
if (kept.length === 0) {
	await slack(`Every change merged on ${date} was held back (billing or hush), so no product update today.`);
	process.exit(0);
}

const voice = readFileSync(path.join(here, 'VOICE.md'), 'utf8');
const draft = await write(date, kept, voice);
if (!draft.post) {
	console.log(`Model says nothing tellable on ${date}: ${draft.reason}`);
	await slack(`Nothing worth telling from ${date} (${kept.length} merged, all housekeeping), so no product update today.`);
	process.exit(0);
}

const file = renderPost(date, draft, kept, dropped);
console.log('\n' + file + '\n');
console.log(`LinkedIn (${draft.linkedin_lane}):\n` + draft.linkedin + '\n');
if (dryRun) process.exit(0);

const rel = `src/content/updates/${date}.md`;
const abs = path.join(sitePath, rel);
if (!existsSync(path.join(sitePath, 'src/content'))) fail(`${sitePath} is not the website checkout (no src/content). Pass --site.`);
mkdirSync(path.dirname(abs), { recursive: true });
writeFileSync(abs, file);
console.log(`wrote ${abs}`);

let prUrl = '';
if (!noPr) prUrl = openPr(date, rel, draft, kept);

if (!noSlack) {
	const lines = [
		`*Product update for ${date}: ${draft.title}*`,
		draft.summary,
		'',
		prUrl ? `Review and merge to publish: ${prUrl}` : `Written to ${rel} (no PR opened).`,
		'',
		`_LinkedIn draft, ${draft.linkedin_lane} lane_`,
		draft.linkedin,
	];
	await slack(lines.join('\n'));
}

// ── pieces ──────────────────────────────────────────────────────────────────
interface Pr {
	repo: string;
	number: number;
	title: string;
	body: string;
	labels: string[];
	mergedAt: string;
	url: string;
}
interface Draft {
	post: boolean;
	reason: string;
	title: string;
	summary: string;
	partners: string;
	behind: string;
	opening: string;
	linkedin: string;
	linkedin_lane: string;
	left_out: string[];
}

function yesterday(): string {
	const d = new Date(Date.now() - 24 * 3600 * 1000);
	return localDate(d);
}
function localDate(d: Date): string {
	return new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
}
function fail(msg: string): never {
	console.error(msg);
	process.exit(1);
}

// Reading the platform's PRs: PLATFORM_READ_TOKEN (a fine-grained token with
// pull requests: read on 4sons/theseoplatform), else the developer's gh login.
function ghToken(): string {
	if (cachedReadToken) return cachedReadToken;
	cachedReadToken = process.env.PLATFORM_READ_TOKEN ?? ghLoginToken();
	if (!cachedReadToken) fail('No token for reading the platform: set PLATFORM_READ_TOKEN or log in with gh.');
	return cachedReadToken;
}
// Pushing and opening the PR in this repo: the Actions token, else gh.
function repoToken(): string {
	const t = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN ?? ghLoginToken();
	if (!t) fail('No token for this repo: set GITHUB_TOKEN or log in with gh.');
	return t;
}
function ghLoginToken(): string {
	try {
		return execFileSync('gh', ['auth', 'token'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], env: { ...process.env, GH_TOKEN: '', GITHUB_TOKEN: '' } }).trim();
	} catch {
		return '';
	}
}

async function gh<T>(url: string, token = ghToken()): Promise<T> {
	const res = await fetch(url, {
		headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
	});
	if (!res.ok) fail(`GitHub ${res.status} for ${url}: ${await res.text()}`);
	return (await res.json()) as T;
}

// Every PR merged on the local date. The search runs on a UTC window one day
// wide on each side, then the merge time is folded into Atlantic time.
async function mergedOn(repo: string, day: string): Promise<Pr[]> {
	const from = shift(day, -1);
	const to = shift(day, +1);
	const q = encodeURIComponent(`repo:${repo} is:pr is:merged merged:${from}..${to}`);
	const out: Pr[] = [];
	for (let page = 1; page <= 5; page++) {
		const data = await gh<{ items: any[] }>(`https://api.github.com/search/issues?q=${q}&per_page=100&page=${page}`);
		for (const it of data.items) {
			const mergedAt: string = it.pull_request?.merged_at;
			if (!mergedAt || localDate(new Date(mergedAt)) !== day) continue;
			out.push({
				repo,
				number: it.number,
				title: it.title,
				body: it.body ?? '',
				labels: (it.labels ?? []).map((l: any) => String(l.name).toLowerCase()),
				mergedAt,
				url: it.html_url,
			});
		}
		if (data.items.length < 100) break;
	}
	return out.sort((a, b) => a.mergedAt.localeCompare(b.mergedAt));
}
function shift(day: string, days: number): string {
	const d = new Date(`${day}T12:00:00Z`);
	d.setUTCDate(d.getUTCDate() + days);
	return d.toISOString().slice(0, 10);
}

function reachOf(p: Pr): 'partners' | 'behind' {
	return p.labels.some((l) => REACH_PARTNERS.has(l)) ? 'partners' : 'behind';
}

async function write(day: string, list: Pr[], voice: string): Promise<Draft> {
	const client = new Anthropic();
	const describe = (p: Pr) => {
		const reach = p.labels.find((l) => REACH_KNOWN.has(l)) ?? 'unlabelled (treat as internal)';
		const impact = p.labels.filter((l) => !REACH_KNOWN.has(l));
		const body = p.body.replace(/🤖 Generated with.*$/s, '').trim().slice(0, 4000);
		return `### ${p.repo}#${p.number} · reach: ${reach}${impact.length ? ` · touches: ${impact.join(', ')}` : ''}\nTitle: ${p.title}\n\n${body || '(no description)'}`;
	};
	const partners = list.filter((p) => reachOf(p) === 'partners');
	const behind = list.filter((p) => reachOf(p) === 'behind');
	const user = [
		`Write the product update for ${day}. Source: ${list.length} merged changes, listed below by reach.`,
		'',
		'Return JSON with these fields:',
		'- post: false when the day has nothing a reader should be told (then fill reason and leave the rest empty).',
		'- reason: one sentence on why post is false; empty otherwise.',
		'- title, summary: per the brief.',
		'- opening: the one to three sentence opening paragraph, no heading.',
		'- partners: the body of "For our partners" in Markdown, no heading line. Three or more changes: the numbered summary then `### N.` expansions, per the brief.',
		'- behind: the body of "Behind the scenes" in Markdown, no heading line. Same shape only if it has three or more separate threads.',
		'- linkedin: the LinkedIn variant, written in one of the three lanes from the brief.',
		'- linkedin_lane: which lane it is: Lesson, Agency problem or Arc.',
		'- left_out: short notes on what you deliberately left out and why (flip-flop, pricing, security, too small), for the reviewer.',
		'',
		`## Candidates for "For our partners" (${partners.length})`,
		partners.map(describe).join('\n\n') || '(none)',
		'',
		`## Candidates for "Behind the scenes" (${behind.length})`,
		behind.map(describe).join('\n\n') || '(none)',
	].join('\n');

	const schema = {
		type: 'object',
		additionalProperties: false,
		required: ['post', 'reason', 'title', 'summary', 'opening', 'partners', 'behind', 'linkedin', 'linkedin_lane', 'left_out'],
		properties: {
			post: { type: 'boolean' },
			reason: { type: 'string' },
			title: { type: 'string' },
			summary: { type: 'string' },
			opening: { type: 'string' },
			partners: { type: 'string' },
			behind: { type: 'string' },
			linkedin: { type: 'string' },
			linkedin_lane: { type: 'string', enum: ['Lesson', 'Agency problem', 'Arc'] },
			left_out: { type: 'array', items: { type: 'string' } },
		},
	};

	const res = await client.messages
		.stream({
			model: MODEL,
			max_tokens: 16000,
			system: [{ type: 'text', text: voice, cache_control: { type: 'ephemeral' } }],
			messages: [{ role: 'user', content: user }],
			output_config: { effort: 'high', format: { type: 'json_schema', schema } },
		})
		.finalMessage();
	if (res.stop_reason === 'refusal') fail(`Model refused: ${res.stop_details?.explanation ?? ''}`);
	const text = res.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
	const draft = JSON.parse(text) as Draft;
	for (const k of ['title', 'summary', 'opening', 'partners', 'behind', 'linkedin'] as const) {
		draft[k] = (draft[k] ?? '').replace(/—/g, ',').trim();
	}
	return draft;
}

function renderPost(day: string, d: Draft, kept: Pr[], dropped: Pr[]): string {
	const sources = kept.map((p) => `${p.repo === SOURCE_REPOS[0] ? '' : p.repo}#${p.number}`).join(', ');
	const held = dropped.map((p) => `#${p.number} (${p.labels.filter((l) => l === 'hush' || l === 'billing').join(', ')})`).join(', ');
	const review = [
		'<!-- review',
		`sources: ${sources}`,
		held ? `held by tag: ${held}` : null,
		...d.left_out.map((l) => `left out: ${l}`),
		'-->',
	].filter(Boolean).join('\n');
	return [
		'---',
		`title: ${yaml(d.title)}`,
		`publishDate: ${day}`,
		`summary: ${yaml(d.summary)}`,
		'author: "Devon Bate"',
		'span: day',
		'draft: false',
		'---',
		'',
		review,
		'',
		d.opening,
		'',
		'## For our partners',
		'',
		d.partners,
		'',
		'## Behind the scenes',
		'',
		d.behind,
		'',
	].join('\n');
}
function yaml(s: string): string {
	return JSON.stringify(s);
}

function openPr(day: string, rel: string, d: Draft, kept: Pr[]): string {
	const token = repoToken();
	const git = (...a: string[]) => execFileSync('git', a, { cwd: sitePath, encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] }).trim();
	const branch = `updates/${day}`;
	git('fetch', 'origin', 'main');
	git('checkout', '-B', branch, 'origin/main');
	git('add', rel);
	git('-c', 'user.name=Product updates', '-c', 'user.email=dev@seobrothers.co', 'commit', '-m', `Product update ${day}: ${d.title}`);
	git('push', '--force', 'origin', branch);
	const body = [
		d.summary,
		'',
		'## For our partners',
		d.partners,
		'',
		'## Behind the scenes',
		d.behind,
		'',
		`## LinkedIn draft (${d.linkedin_lane})`,
		d.linkedin,
		'',
		'## Sources',
		...kept.map((p) => `- ${p.url} ${p.title}`),
		'',
		`Merging publishes the post at ${SITE_URL}/updates/${day}/. Edit the file in this branch first if a line is off.`,
	].join('\n');
	// A rerun for the same day updates the PR that is already open instead of
	// failing on the duplicate.
	const ghEnv = { ...process.env, GH_TOKEN: token };
	const title = `Product update ${day}: ${d.title}`;
	const existing = JSON.parse(
		execFileSync('gh', ['pr', 'list', '--repo', WEBSITE_REPO, '--head', branch, '--state', 'open', '--json', 'url'], { encoding: 'utf8', env: ghEnv }),
	) as { url: string }[];
	if (existing[0]) {
		execFileSync('gh', ['pr', 'edit', existing[0].url, '--repo', WEBSITE_REPO, '--title', title, '--body', body], { encoding: 'utf8', env: ghEnv });
		console.log(`updated ${existing[0].url}`);
		return existing[0].url;
	}
	// The org may forbid Actions from opening pull requests. The branch is
	// pushed either way; fall back to the compare link, which opens the PR in
	// one click from the Slack message.
	try {
		const out = execFileSync(
			'gh',
			['pr', 'create', '--repo', WEBSITE_REPO, '--head', branch, '--base', 'main', '--title', title, '--body', body],
			{ encoding: 'utf8', env: ghEnv, stdio: ['ignore', 'pipe', 'pipe'] },
		).trim();
		const url = out.split('\n').find((l) => l.startsWith('https://')) ?? out;
		console.log(`opened ${url}`);
		return url;
	} catch (err) {
		const compare = `https://github.com/${WEBSITE_REPO}/compare/main...${encodeURIComponent(branch)}?expand=1&title=${encodeURIComponent(title)}`;
		console.warn(`could not open the PR (${(err as Error).message.split('\n')[0]}); branch is pushed, open it here: ${compare}`);
		return compare;
	}
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
