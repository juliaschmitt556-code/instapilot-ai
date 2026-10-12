export type ScrapeCreatorsResponse<T> = {
  success?: boolean;
  cached?: boolean;
  cached_at?: string;
  credits_charged?: number;
  credits_remaining?: number;
  data?: T;
  [key: string]: unknown;
};

export class ScrapeCreatorsClient {
  constructor(private readonly apiKey: string, private readonly baseUrl = 'https://api.scrapecreators.com') {}

  private async get<T>(path: string, params: Record<string, string | boolean | undefined>) {
    const url = new URL(path, this.baseUrl);
    Object.entries(params).forEach(([key, value]) => value !== undefined && url.searchParams.set(key, String(value)));
    const response = await fetch(url, { headers: { 'x-api-key': this.apiKey, Accept: 'application/json' }, cache: 'no-store' });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(`ScrapeCreators request failed with ${response.status}.`);
    return payload as T;
  }

  profile(handle: string, cacheMaxAge = process.env.SCRAPECREATORS_CACHE_MAX_AGE) {
    return this.get<ScrapeCreatorsResponse<unknown>>('/v1/instagram/profile', { handle, cache_max_age: cacheMaxAge });
  }

  post(url: string, cacheMaxAge = process.env.SCRAPECREATORS_CACHE_MAX_AGE) {
    return this.get<ScrapeCreatorsResponse<unknown>>('/v1/instagram/post', { url, cache_max_age: cacheMaxAge });
  }

  comments(url: string, cursor?: string, includeReplies = false) {
    return this.get<ScrapeCreatorsResponse<unknown>>('/v2/instagram/post/comments', { url, cursor, include_replies: includeReplies });
  }

  search(query: string) {
    return this.get<ScrapeCreatorsResponse<unknown>>('/v1/instagram/search', { query });
  }

  popularSearch(query: string, cursor?: string) {
    return this.get<ScrapeCreatorsResponse<unknown>>('/v1/instagram/search/popular', { query, cursor });
  }

  reelsSearch(query: string, page?: string, startDate?: string, endDate?: string) {
    return this.get<ScrapeCreatorsResponse<unknown>>('/v2/instagram/reels/search', { query, page, start_date: startDate, end_date: endDate });
  }
}

export function getScrapeCreatorsClient() {
  const key = process.env.SCRAPECREATORS_API_KEY;
  return key ? new ScrapeCreatorsClient(key, process.env.SCRAPECREATORS_BASE_URL) : null;
}
