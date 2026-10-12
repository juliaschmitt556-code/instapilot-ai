# InstaPilot AI — implementation plan

## Product scope

InstaPilot AI is a focused Instagram operations cockpit: authorized Instagram professional accounts, advertising campaign operations, a unified comments inbox, AI-assisted replies, automation guardrails, and reporting. It never scrapes or implies unrestricted access to public Instagram content; demo metrics and comments are explicitly labeled sample data until an eligible Meta account is connected.

## Implementation approach

- **Frontend:** Next.js App Router, React, TypeScript, Tailwind CSS plus a small CSS token layer for the premium dashboard system.
- **Backend:** Next.js route handlers and server-only adapters. The UI talks to typed server routes rather than handling tokens or provider secrets.
- **Persistence:** Managed MySQL-compatible database is enabled at the project level, with Drizzle schema and additive SQL migrations for workspace-scoped users, accounts, ads, comments, drafts, automations, webhooks, notifications, audits, and usage.
- **Authentication:** Manus OAuth-compatible application-session seam using the reserved `webdev_app_session` cookie contract, with server-side identity/role checks documented for hardening. The preview stays usable in explicitly labeled sample mode until a real session and eligible account are present.
- **Providers:** `InstagramProvider` and `AdsProvider` interfaces use clearly labeled mock adapters in local/demo mode. Meta OAuth/Marketing API configuration and Groq credentials are environment-driven. The AI route prefers Groq when configured and otherwise returns safe deterministic sample drafts; no provider secret reaches the browser.
- **Reliability:** Zod request validation, idempotency fields on publishing seams, audit-log payloads, rate-limit notes, and explicit confirmation UI for launches/budget changes.
- **Delivery:** `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`; route manifest committed before the dev server starts. GitHub connection uses the managed canonical-repository flow after the first checkpoint.

## Project structure

- `app/` — route pages, layout, global styles, API handlers.
- `components/` — dashboard shell and reusable product surfaces.
- `lib/` — domain types, sample data, provider adapters, AI orchestration, auth helpers, validation.
- `db/` — Drizzle schema and SQL migrations.
- `tests/` — unit tests for provider and safety behavior.
- `public/` — route manifest and static assets.
- `README.md`, `.env.example`, `TODO.md` — setup, provider checklist, and unresolved production work.

## Design system

### Design movement

**Editorial operator cockpit** — a blend of Swiss information design and soft brutalism. It should feel like an instrument panel for a calm, capable team, not a clone of Instagram or a generic admin template.

### Core principles

1. **Signal over noise:** hierarchy, labels, and metric provenance are always visible.
2. **Warm precision:** dense operational information is balanced with paper-like surfaces and friendly copy.
3. **Human in the loop:** approval states, confidence, and safety context are visually prominent.
4. **Quiet momentum:** restrained motion and clear next actions make the product feel fast without being frantic.

### Color philosophy

Deep ink (`#0B1020`) anchors the product in trust. Warm paper (`#F5F3EE`) prevents the interface from feeling cold. Pilot Lime (`#D7F36B`) is the ownable signature color for “ready to act”; indigo (`#5D5FEF`) carries product intelligence; coral (`#FF7B6B`) flags human attention without alarmism.

### Layout paradigm

A persistent command rail on the left, a narrow status header, and an asymmetric content canvas: primary work occupies a broad editorial column while evidence, AI context, and next actions sit in smaller side panels. Tables become legible cards on small screens.

### Signature elements

- A lime signal dot beside live, synced, and approval states.
- Metric cards use a vertical provenance rail distinguishing sample, organic, and advertising data.
- The AI reply composer uses a context stack showing what the agent saw before it drafted.

### Interaction and animation

Hover states raise surfaces by 2px and add a soft shadow. Page changes use a 160ms fade/slide. Data refreshes pulse the signal dot instead of flashing spinners. Consequential actions open a confirmation panel with the exact operation and account scope. Reduced-motion users receive no transforms.

### Typography

Use a clean sans stack (`Inter`, `ui-sans-serif`) for UI and a restrained display face (`Space Grotesk`, fallback `Arial`) for hero headlines and large KPIs. Labels are compact uppercase with letter spacing; body copy is 14–15px with generous line-height.

### Brand essence

**The calm command center for Instagram growth teams — with AI that drafts, humans who decide, and APIs you can trust.**

Personality: **clear, opinionated, reassuring.**

### Brand voice

Headlines are direct and outcome-oriented. CTAs use confident verbs. Microcopy explains provenance and limits instead of hiding them.

- “Turn comment volume into considered conversations.”
- “AI can draft the answer. You keep the final word.”

### Wordmark & logo

A compact wordmark with a two-line “I / P” signal mark: two offset vertical bars connected by a lime pulse, suggesting a pilot light and a message thread. Avoid Meta or Instagram glyphs.

### Signature brand color

**Pilot Lime `#D7F36B`.** It belongs to InstaPilot’s own approval and readiness language.


## Revised provider and agent architecture

ScrapeCreators is the public-data research provider. Its server-only adapter covers verified endpoints for profiles, post/Reel details, comments, native search, popular topic search, and keyword Reels discovery. All responses carry provider/source/freshness metadata and are stored in workspace-scoped public media/comment tables. The adapter never exposes its API key to the browser and never grants publishing rights.

LangChain.js with `createAgent`, `@langchain/groq`, and the public-data tools coordinates context retrieval, deterministic-first comment classification, brand-voice analysis, and draft generation. The application approval queue remains the publishing gate. Meta’s authorized API seam is the only route that can publish replies, and it requires explicit confirmation plus idempotency. LangGraph can be added for durable resumable runs and human-in-the-loop interrupts once persistence is enabled for long-running agent jobs.

See `docs/integration-research.md` for the endpoint matrix, limitations, and source links.
