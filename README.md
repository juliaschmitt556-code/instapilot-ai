# InstaPilot AI

InstaPilot AI is a focused Instagram operations cockpit: advertising campaigns, accessible comments, AI-assisted reply drafts, approval workflows, and reporting in one calm workspace. It is designed for authorized Instagram professional accounts through Meta’s official APIs. It does not scrape public content or imply unrestricted access.

## What is implemented

The first working slice includes a premium responsive SaaS interface with marketing landing page, managed-account sign-in/onboarding surfaces, dashboard overview, connected accounts, campaign manager with confirmation dialog, new campaign validation surface, comments inbox with search/filter/detail/reply editor, AI agent configuration and multi-tone drafts, analytics charts, notifications/settings/billing-ready pages, and a route manifest for managed Preview.

The server seams include typed mock adapters for Instagram comments/replies and advertising campaigns, validated AI draft generation, explicit idempotency and confirmation inputs, a health endpoint, and a Meta webhook verification/ingestion boundary. Sample data is visually labeled and never claimed to be live.

## Local development

```bash
pnpm install
pnpm dev
```

The app listens on port 3000. Run checks with:

```bash
pnpm typecheck
pnpm test
pnpm build
```

## Environment

Copy `.env.example` to `.env.local` for local work. Never commit real credentials. Managed Preview injects the project’s server/database values. Provider secrets must stay server-side.

`APP_DATA_MODE=sample` keeps the local experience honest until Meta credentials and an eligible account are available. The current UI and mock adapters are the replaceable development path, not proof that Meta or Groq credentials are configured.

## Meta setup checklist

1. Create a Meta developer app and configure the current Instagram Platform authorization flow for eligible professional accounts.
2. Add the exact Preview and production callback URL(s) and protect the OAuth `state` with a single-use nonce bound to the initiating browser.
3. Configure the current supported Graph API version and only request permissions required by the product, such as comment management, insights, and advertising access as approved for the account and app.
4. Connect the Instagram professional account and relevant business/ad assets through the official authorization flow.
5. Configure webhook verification and app-secret signature checks for supported comment events; persist event IDs before processing for idempotency.
6. Complete Meta app review for the requested permissions and verify account eligibility. Do not claim a live integration until this is tested with valid credentials.

## Groq / AI setup

The AI boundary in `lib/ai.ts` is provider-neutral. Add `GROQ_API_KEY` and `GROQ_MODEL` when the external provider is approved, then implement the server-side Groq call inside the route/adaptor without shipping the key to the client. The managed platform LLM route is also compatible with the same orchestration shape. Generated content must be validated, must not fabricate product facts or private details, and should remain in approval mode by default.

## Data model

`db/schema.ts` and `db/migrations/0000_init.sql` cover users, workspaces, memberships, connected accounts, campaigns, comments, AI drafts, automation rules, and audit logs. Add migrations for posts/media, published replies, webhook events, notifications, subscription/usage records, and data export/deletion bookkeeping as the live provider stages are enabled. The managed database is shared between development and publication, so migrations must be additive and reviewed.

## Security notes

Use the reserved `webdev_app_session` cookie for the managed Preview application session. Production must validate the JWT signature with `MANUS_JWT_SECRET`, check expiry and project ID, resolve the authenticated identity to workspace membership, and enforce roles server-side. Provider access tokens must be encrypted or stored through a protected credential reference; they must never appear in frontend code, browser storage, logs, or public responses. Add production rate limiting, CSRF protection where applicable, strict webhook HMAC verification, exponential backoff, structured logs, data export/deletion, Meta data-deletion callbacks, and audit entries for publishing, campaign changes, and automation.

## Deployment

Use the managed Webdev project’s canonical checkpoint flow. The project uses server and database capabilities and exposes `/api/health` for readiness. When moving to a published container, provide a self-contained build/install command, a Dockerfile or compatible runtime contract, and keep `DATABASE_URL` and all provider secrets runtime-only. Do not enable automatic publishing without explicit user authorization.

## Repository

This project is intended to be connected to a private GitHub repository through the managed canonical-repository workflow so checkpoints remain recoverable in Manus while the user gets a GitHub-owned source of truth.
