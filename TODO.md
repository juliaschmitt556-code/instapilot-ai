# InstaPilot AI delivery checklist

- **Authentication and workspace isolation:** A user can register/sign in through the managed Manus OAuth flow, the application validates the `webdev_app_session` JWT with `MANUS_JWT_SECRET`, resolves workspace membership server-side, enforces owner/admin/member roles, and never trusts frontend account IDs.
- **Meta OAuth and account management:** An eligible Instagram professional account can be connected using current official Meta authorization, granted permissions are displayed, credentials are stored only server-side, token expiration/revocation is handled, and disconnect/export/deletion workflows are available.
- **Official comments sync and publishing:** Authorized accessible posts, ads, comments, and supported threads synchronize through Meta APIs/webhooks or scheduled fallback, pagination/rate limits/idempotency are handled, duplicate replies are prevented, and reply publishing is verified with valid credentials.
- **AI provider integration:** Configure Groq or the managed LLM route, generate contextual drafts from comment/caption/brand voice/instructions, support rewrite/translation/length/CTA actions, validate output, and keep approval mode as default.
- **Marketing API:** Retrieve eligible ad accounts and campaigns, validate only supported objectives/placements, manage budgets/statuses only after explicit confirmation, surface API/review/permission failures, and show real metrics when available.
- **Automation and auditability:** Add per-account manual/approval/automatic modes, rate limits, safety rules, pause-all, retry limits, priority routing, notifications, webhook verification, structured logs, and immutable audit records.
- **Analytics and reporting:** Persist advertising and organic metrics separately, define calculations and missing-data semantics, avoid double-counting, and export CSV reports.
- **Production hardening:** Add CSRF protection where applicable, production rate limiting, signed webhook verification, migration runner, integration tests against approved mocks, deployment config, data export/deletion, Meta data-deletion callback, monitoring, and app review documentation.


## Public research and agent integration

- Provide server-side ScrapeCreators adapters and routes for public Instagram profile retrieval, post/Reel detail retrieval, available comments with cursor pagination, native search, popular topic search, and keyword Reels discovery; return provider provenance and clear configuration errors when the API key is absent.
- Persist public media and comments with provider, source URL, collection time, freshness, and raw response provenance; do not treat public data as account ownership or publishing authorization.
- Provide a LangChain.js + ChatGroq agent route that can retrieve public context, classify comments, apply brand voice and safety rules, generate drafts with provenance, and require approval before any Meta-authorized publish action.
- Keep ScrapeCreators public ingestion separate from Meta-authorized publishing, with no automatic publishing from public-data lookups.
