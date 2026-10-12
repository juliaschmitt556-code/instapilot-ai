# ScrapeCreators + LangChain integration research

## Decision

InstaPilot uses ScrapeCreators for **public Instagram discovery and analysis data**. Meta’s official APIs remain the boundary for authorized account actions and reply publishing. Public scraped data is never presented as proof of ownership, endorsement, paid partnership, or permission to publish.

## Endpoint coverage

| Product need | Endpoint | Support confirmed | Implementation role |
|---|---|---:|---|
| Find public profiles, hashtags, places, and keyword suggestions | `GET /v1/instagram/search?query=` | Yes | Discovery search. One ranked page; it does not return posts. |
| Discover public posts around a topic | `GET /v1/instagram/search/popular?query=&cursor=` | Yes | Topic analysis, curated public posts, context, suggested terms, media counts, cursor pagination. Not a complete firehose. |
| Retrieve a public profile and recent posts | `GET /v1/instagram/profile?handle=` | Yes | Account lookup, public profile metadata, recent posts, related accounts, numeric user ID resolution. |
| Retrieve a post or Reel in detail | `GET /v1/instagram/post?url=` | Yes | Caption, media URLs, media type, likes, comments, owner, and Reel play count when available. |
| Find public Reels by keyword | `GET /v2/instagram/reels/search?query=` | Yes | Keyword discovery with date filters and page-based results for Google-indexed Reels. Results are best-effort, not complete. |
| Retrieve available public comments | `GET /v2/instagram/post/comments?url=&cursor=` | Yes | Top-level comments with author, timestamps, likes, child counts, and optional replies. The vendor documents approximately 90% success for this endpoint. |
| Retrieve public comment replies | `GET /v1/instagram/post/comment/replies?url=&comment_id=&cursor=` | Yes from vendor announcement | Thread expansion for selected comments. Prefer this for shortlisted threads. |
| Collect analysis dashboard data | Compose profile, post, search, comments, and reply endpoints | Yes | Persist source URL, collection time, endpoint, cursor, freshness, and data provenance alongside normalized records. |

## Important provider constraints

- Every request uses the `x-api-key` header and must run server-side.
- The vendor states that cached results can be free and live requests consume credits; adapter code exposes cache-age options without hiding credit usage.
- Comments with `include_replies=true` cost 15 credits, are slower, and may hit a 29-second timeout. The product defaults to top-level comments and expands replies selectively.
- Public endpoint access is not the same as authorization to reply. Only Meta-authorized accounts can publish through the existing approval-gated Meta seam.
- Results are time-sensitive. Every stored record needs `sourceUrl`, `collectedAt`, `provider`, and `freshness` metadata. Missing, private, deleted, blocked, or vendor-failed data is displayed as unavailable rather than inferred.

## LangChain architecture

LangChain.js provides `createAgent` as the model + prompt + tools harness. The app will use `@langchain/groq` for Groq chat models and structured JSON output, with tools for public profile/post/comment retrieval, classification, and draft generation. LangGraph is reserved for durable, stateful workflows where approval, persistence, retries, and human-in-the-loop interrupts need explicit graph state.

The initial agent flow is:

1. Normalize and validate the public Instagram URL or search query.
2. Retrieve the minimum public context through the ScrapeCreators adapter.
3. Classify comments as `question`, `complaint`, `sales_lead`, `praise`, `spam`, or `other`.
4. Apply brand voice, prohibited phrases, privacy boundaries, and “do not invent” rules.
5. Generate one or more drafts with rationale and confidence.
6. Persist the draft and provenance in the database.
7. Route to approval by default; publishing is a separate Meta-authorized action requiring explicit confirmation and idempotency protection.

## Sources

[1]: https://scrapecreators.com/instagram-comments-api "ScrapeCreators Instagram Comments API"
[2]: https://scrapecreators.com/ "ScrapeCreators Social Media Scraping API"
[3]: https://scrapecreators.com/blog/new-instagram-search-comments-tagged-posts-apis "ScrapeCreators Instagram search, tagged posts, and replies announcement"
[4]: https://docs.scrapecreators.com/v1/instagram/profile "ScrapeCreators Instagram Profile API"
[5]: https://docs.scrapecreators.com/v1/instagram/post "ScrapeCreators Instagram Post API"
[6]: https://docs.scrapecreators.com/v1/instagram/search "ScrapeCreators Instagram Search API"
[7]: https://docs.scrapecreators.com/v1/instagram/search/popular "ScrapeCreators Instagram Popular Search API"
[8]: https://docs.scrapecreators.com/v2/instagram/reels/search "ScrapeCreators Instagram Search Reels API"
[9]: https://docs.scrapecreators.com/v2/instagram/post/comments "ScrapeCreators Instagram Comments API reference"
[10]: https://docs.langchain.com/oss/javascript/langchain/overview "LangChain.js overview and create_agent"
[11]: https://docs.langchain.com/oss/javascript/integrations/chat/groq "LangChain.js ChatGroq integration"
[12]: https://docs.langchain.com/oss/javascript/langgraph/overview "LangGraph.js orchestration overview"
[13]: https://github.com/langchain-ai/langchainjs "LangChain.js GitHub repository"
