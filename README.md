# InstaPilot AI

InstaPilot AI is a focused Instagram operations cockpit: advertising campaigns, accessible comments, public research, AI-assisted reply drafts, approval workflows, and reporting in one calm workspace. Meta’s official APIs remain the boundary for authorized account actions and publishing. ScrapeCreators is used only for public discovery and analysis data, never as proof of account ownership or publishing permission.

## What is implemented

The working slice includes a premium responsive SaaS interface with marketing landing page, managed-account sign-in/onboarding surfaces, dashboard overview, connected accounts, campaign manager with confirmation dialog, new campaign validation surface, comments inbox with search/filter/detail/reply editor, AI agent configuration and multi-tone drafts, analytics charts, notifications/settings/billing-ready pages, and a managed Preview route manifest.

The server seams include typed mock adapters for Instagram comments/replies and advertising campaigns, validated AI draft generation, explicit idempotency and confirmation inputs, a health endpoint, Meta webhook verification, ScrapeCreators public Instagram adapters, and a LangChain.js + ChatGroq public-data analysis route. Sample data is visibly labeled and never claimed to be live.

## Local development

```bash
pnpm install
pnpm dev
```

The app listens on port 3000. Run checks with:

```bash
pnpm typecheck
pnpm test
pnpm lint
pnpm build
```

## Environment

Copy `.env.example` to `.env.local` for local work. Never commit real credentials. Managed Preview injects the project’s server/database values. Provider secrets stay server-side.

`APP_DATA_MODE=sample` keeps the local experience honest until provider credentials and eligible Meta accounts are available. A missing provider key produces a clear configuration response rather than fabricated live data.

## ScrapeCreators public Instagram research

Configure `SCRAPECREATORS_API_KEY` and optionally `SCRAPECREATORS_CACHE_MAX_AGE` to enable the public-data routes:

- `GET /api/public/instagram/profile?handle=...`
- `GET /api/public/instagram/post?url=...`
- `GET /api/public/instagram/comments?url=...&cursor=...&includeReplies=false`
- `GET /api/public/instagram/discover?kind=search|popular|reels&query=...`

The adapter maps the documented profile, post, comments, native search, popular search, and keyword Reels endpoints. Public comments are fetched top-level by default. Reply expansion is selective because the provider documents additional credit cost, higher latency, and approximately 90% success for the comments endpoint. The app stores provider, source URL, collection time, freshness, and raw-response provenance in the public research tables.

Read [`docs/integration-research.md`](docs/integration-research.md) for the endpoint matrix, limitations, and source links.

## LangChain.js + Groq agent

The server-side agent in `lib/agent.ts` uses `createAgent` from LangChain.js, `ChatGroq` from `@langchain/groq`, and tools for public profile, post, comment, and deterministic-first comment classification. `POST /api/ai/agent` accepts a task plus optional comment, caption, post URL, or handle. The agent is instructed to separate facts from inference, apply brand voice and safety rules, and return drafts with provenance. The route always returns `approvalRequired: true`.

LangGraph is not required for the first synchronous slice. It is the intended next step for durable, resumable agent runs and human-in-the-loop interrupts backed by the `agent_runs` table. Publishing remains a separate Meta-authorized, confirmation-gated action and is never triggered by a public-data lookup.

## Meta setup checklist

1. Create a Meta developer app and configure the current Instagram Platform authorization flow for eligible professional accounts.
2. Add the exact Preview and production callback URL(s) and protect the OAuth `state` with a single-use nonce bound to the initiating browser.
3. Configure the current supported Graph API version and only request permissions required by the product, as approved for the account and app.
4. Connect the Instagram professional account and relevant business/ad assets through the official authorization flow.
5. Configure webhook verification and app-secret signature checks for supported comment events; persist event IDs before processing for idempotency.
6. Complete Meta app review for the requested permissions and verify account eligibility. Do not claim a live integration until it is tested with valid credentials.

## Data model

`db/schema.ts` and `db/migrations/0000_init.sql` cover users, workspaces, memberships, connected accounts, campaigns, authorized comments, public media, public comments, AI drafts, agent runs, automation rules, and audit logs. Add migrations for published replies, webhook events, notifications, subscription/usage records, and data export/deletion bookkeeping as live provider stages are enabled. The managed database is shared between development and publication, so migrations must be additive and reviewed.

## Security notes

Use the reserved `webdev_app_session` cookie for the managed Preview application session. Production must validate the JWT signature with `MANUS_JWT_SECRET`, check expiry and project ID, resolve the authenticated identity to workspace membership, and enforce roles server-side. Provider access tokens and ScrapeCreators keys must never appear in frontend code, browser storage, logs, or public responses. Add production rate limiting, CSRF protection where applicable, strict webhook HMAC verification, exponential backoff, structured logs, data export/deletion, Meta data-deletion callbacks, and audit entries for publishing, campaign changes, public-data collection, and automation.

## Deployment

Use the managed Webdev project’s canonical checkpoint flow. The project uses server and database capabilities and exposes `/api/health` for readiness. Keep `DATABASE_URL`, Meta credentials, ScrapeCreators keys, Groq credentials, and LangSmith credentials runtime-only. Do not enable automatic publishing without explicit user authorization.

## Repository

The source of truth is the private GitHub repository: <https://github.com/lilcoins89/instapilot-ai>.
