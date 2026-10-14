import 'server-only'

const GRAPH_URL = `https://graph.facebook.com/${process.env.META_GRAPH_API_VERSION ?? 'v21.0'}`

export class InstagramGraphClient {
  constructor(private readonly accessToken: string) {
    if (!accessToken) throw new Error('An authorized Instagram access token is required.')
  }

  private async request<T>(endpoint: string, init: RequestInit = {}, params: Record<string, string | boolean | undefined> = {}) {
    const url = new URL(`${GRAPH_URL}/${endpoint.replace(/^\//, '')}`)
    url.searchParams.set('access_token', this.accessToken)
    for (const [key, value] of Object.entries(params)) if (value !== undefined) url.searchParams.set(key, String(value))
    const response = await fetch(url, { ...init, cache: 'no-store' })
    const payload = await response.json().catch(() => ({}))
    if (!response.ok || payload.error) throw new Error(payload.error?.message ?? 'Instagram Graph API request failed.')
    return payload as T
  }

  getComment(commentId: string) { return this.request<Record<string, unknown>>(commentId, undefined, { fields: 'id,text,username,timestamp,media' }) }
  replyToComment(commentId: string, message: string) {
    if (!commentId.trim() || !message.trim()) throw new Error('Comment id and reply message are required.')
    return this.request<{ id: string }>(`${commentId}/replies`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ message: message.trim() }) })
  }
  hideComment(commentId: string, hidden = true) { return this.request<Record<string, unknown>>(commentId, { method: 'POST' }, { hide: hidden }) }
  deleteComment(commentId: string) { return this.request<Record<string, unknown>>(commentId, { method: 'DELETE' }) }
  listMedia(igUserId: string, limit = 25) { return this.request<{ data: Array<Record<string, unknown>> }>(`${igUserId}/media`, undefined, { fields: 'id,caption,media_type,media_url,permalink,timestamp', limit: String(limit) }) }
}
