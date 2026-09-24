# Product updates automation

The public product update feed at seobrothers.com/updates/ and the LinkedIn
bank that grows from it. Marketing owns this folder; the platform repo only
tags its pull requests (reach labels, plus `hush` to keep a PR out of the
public post and `announce` to let a billing PR in).

| File | What it does |
| --- | --- |
| `VOICE.md` | The whole writing brief: the two-section shape, the voice, what never goes in, the LinkedIn lanes. Change it here and the next run follows. |
| `draft.ts` | Every morning (`product-updates.yml`): reads yesterday's merged PRs on the platform by reach label, writes `src/content/updates/YYYY-MM-DD.md`, pushes a branch and opens the review PR here, pings Devon on Slack. Merging the PR publishes. `--date`, `--dry-run`, `--no-pr`, `--no-slack`. |
| `linkedin.ts` | Every Friday (`linkedin-roll-up.yml`): the week's published posts become three LinkedIn options (Lesson, Agency problem, Arc), appended to the LinkedIn bank sheet as Proposed, with a Slack ping. `--week-ending`, `--dry-run`. |

Secrets on this repo: `ANTHROPIC_API_KEY`, `SLACK_BOT_TOKEN`,
`GOOGLE_SERVICE_ACCOUNT_JSON` (a writer on the sheet), `PLATFORM_READ_TOKEN`
(pull requests: read on the platform repo). Variable: `LINKEDIN_SHEET_ID`.
Locally the scripts fall back to your `gh` login for both repos.

`npm run check:updates` typechecks the scripts; the Check workflow runs it and
the site build on every pull request.
