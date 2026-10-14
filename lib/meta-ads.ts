import 'server-only'

const DEFAULT_VERSION = process.env.META_GRAPH_API_VERSION ?? 'v21.0'

export class MetaApiError extends Error {
  constructor(public status: number, message: string, public code?: string | number) {
    super(message)
    this.name = 'MetaApiError'
  }
}

export type MetaTargeting = {
  ageMin?: number
  ageMax?: number
  countries?: string[]
  genders?: number[]
  interests?: Array<{ id: string; name?: string }>
  platforms?: string[]
}

export class MetaAdsClient {
  private readonly baseUrl: string
  constructor(private readonly accessToken: string, private readonly adAccountId: string, private readonly version = DEFAULT_VERSION) {
    if (!accessToken || !adAccountId) throw new Error('Meta Ads credentials are required.')
    this.baseUrl = `https://graph.facebook.com/${version}`
  }

  private async request<T>(endpoint: string, init: RequestInit = {}, params: Record<string, string | number | undefined> = {}): Promise<T> {
    const url = new URL(`${this.baseUrl}/${endpoint.replace(/^\//, '')}`)
    url.searchParams.set('access_token', this.accessToken)
    Object.entries(params).forEach(([key, value]) => value !== undefined && url.searchParams.set(key, String(value)))
    const response = await fetch(url, { ...init, cache: 'no-store' })
    const payload = await response.json().catch(() => ({}))
    if (!response.ok || payload.error) throw new MetaApiError(response.status, payload.error?.message ?? 'Meta API request failed.', payload.error?.code)
    return payload as T
  }

  listCampaigns(limit = 25) { return this.request<{ data: Array<Record<string, unknown>> }>(`act_${this.adAccountId}/campaigns`, undefined, { fields: 'id,name,status,effective_status,objective,created_time,updated_time', limit }) }
  listAdSets(limit = 25) { return this.request<{ data: Array<Record<string, unknown>> }>(`act_${this.adAccountId}/adsets`, undefined, { fields: 'id,name,status,effective_status,daily_budget,campaign_id', limit }) }
  listAds(limit = 25) { return this.request<{ data: Array<Record<string, unknown>> }>(`act_${this.adAccountId}/ads`, undefined, { fields: 'id,name,status,effective_status,adset_id,campaign_id', limit }) }
  getInsights(objectId: string, datePreset = 'last_7d') { return this.request<{ data: Array<Record<string, unknown>> }>(`${objectId}/insights`, undefined, { fields: 'impressions,clicks,spend,cpc,cpm,ctr,actions', date_preset: datePreset }) }
  updateStatus(objectId: string, status: 'ACTIVE' | 'PAUSED') { return this.request<Record<string, unknown>>(objectId, { method: 'POST' }, { status }) }
  updateDailyBudget(objectId: string, dailyBudgetCents: number) {
    if (!Number.isInteger(dailyBudgetCents) || dailyBudgetCents <= 0 || dailyBudgetCents > 100_000_00) throw new Error('Daily budget must be a positive integer within the safety limit.')
    return this.request<Record<string, unknown>>(objectId, { method: 'POST' }, { daily_budget: dailyBudgetCents })
  }
  createCampaign(name: string, objective = 'OUTCOME_TRAFFIC', status: 'PAUSED' | 'ACTIVE' = 'PAUSED') {
    if (!name.trim()) throw new Error('Campaign name is required.')
    return this.request<{ id: string }>(`act_${this.adAccountId}/campaigns`, { method: 'POST' }, { name: name.trim(), objective, status, special_ad_categories: '[]' })
  }
}
