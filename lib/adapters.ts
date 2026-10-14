import type { Campaign, CommentItem, ConnectedAccount } from './types'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { InstagramGraphClient } from '@/lib/instagram-graph'

export interface InstagramProvider {
  listAccounts(): Promise<ConnectedAccount[]>
  listComments(accountId: string): Promise<CommentItem[]>
  publishReply(commentId: string, text: string, idempotencyKey: string): Promise<{ id: string; status: 'published' }>
}

export interface AdsProvider {
  listCampaigns(accountId: string): Promise<Campaign[]>
  updateCampaignStatus(campaignId: string, status: 'Active' | 'Paused', confirmationToken: string): Promise<Campaign>
}

async function workspaceId() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized workspace request.')
  const { data } = await supabase.from('workspace_members').select('workspace_id').eq('user_id', user.id).limit(1).maybeSingle()
  if (!data) throw new Error('No workspace is configured for this account.')
  return { supabase, id: data.workspace_id }
}

export class SupabaseInstagramProvider implements InstagramProvider {
  async listAccounts() {
    const { supabase, id } = await workspaceId()
    const { data, error } = await supabase.from('connected_accounts').select('id, username, display_name, status, created_at').eq('workspace_id', id).order('created_at')
    if (error) throw error
    return (data ?? []).map((account) => ({ id: account.id, username: account.username, displayName: account.display_name, avatar: '', status: account.status, followers: '—', posts: '—', permissions: [], lastSynced: account.created_at, mode: 'live' as const }))
  }

  async listComments(accountId: string) {
    const { supabase, id } = await workspaceId()
    const { data, error } = await supabase.from('comments').select('id, username, body, post_external_id, reply_status, created_at').eq('workspace_id', id).eq('account_id', accountId).order('created_at', { ascending: false })
    if (error) throw error
    return (data ?? []).map((comment) => ({ id: comment.id, username: comment.username, initials: comment.username.slice(0, 2).toUpperCase(), timestamp: comment.created_at, text: comment.body, post: comment.post_external_id ?? 'Instagram post', postType: 'Photo' as const, sentiment: 'Question' as const, priority: 'Normal' as const, replyStatus: comment.reply_status, color: '' }))
  }

  async publishReply(commentId: string, text: string, idempotencyKey: string) {
    if (!idempotencyKey.trim()) throw new Error('An idempotency key is required before publishing.')
    if (!text.trim()) throw new Error('Reply text is required.')
    const existing = await prisma.idempotencyKey.findUnique({ where: { key: idempotencyKey } })
    if (existing?.response) return JSON.parse(existing.response) as { id: string; status: 'published' }

    const credential = await prisma.marketingCredential.findFirst({ where: { provider: 'instagram' }, orderBy: { updatedAt: 'desc' } })
    if (!credential) throw new Error('Instagram publishing requires an authorized Meta account connection.')
    const result = await new InstagramGraphClient(credential.accessToken).replyToComment(commentId, text)
    const response = { id: result.id, status: 'published' as const }
    await prisma.idempotencyKey.upsert({ where: { key: idempotencyKey }, create: { key: idempotencyKey, scope: `instagram:reply:${commentId}`, response: JSON.stringify(response) }, update: { response: JSON.stringify(response) } })
    return response
  }
}

export class SupabaseAdsProvider implements AdsProvider {
  async listCampaigns(accountId: string) {
    const { supabase, id } = await workspaceId()
    const { data, error } = await supabase.from('campaigns').select('id, name, objective, status, budget_cents').eq('workspace_id', id).eq('account_id', accountId).order('name')
    if (error) throw error
    return (data ?? []).map((campaign) => ({ id: campaign.id, name: campaign.name, objective: campaign.objective, status: campaign.status, spend: '—', spendValue: 0, budget: campaign.budget_cents == null ? '—' : `$${(campaign.budget_cents / 100).toFixed(2)}`, reach: '—', clicks: '—', ctr: '—', change: '—', color: '' }))
  }

  async updateCampaignStatus(campaignId: string, status: 'Active' | 'Paused', confirmationToken: string) {
    if (!confirmationToken.trim()) throw new Error('Explicit confirmation is required before changing campaign status.')
    const { supabase } = await workspaceId()
    const { data, error } = await supabase.from('campaigns').update({ status }).eq('id', campaignId).select('id, name, objective, status, budget_cents').single()
    if (error) throw error
    return { id: data.id, name: data.name, objective: data.objective, status: data.status, spend: '—', spendValue: 0, budget: data.budget_cents == null ? '—' : `$${(data.budget_cents / 100).toFixed(2)}`, reach: '—', clicks: '—', ctr: '—', change: '—', color: '' }
  }
}

export function getInstagramProvider(): InstagramProvider { return new SupabaseInstagramProvider() }
export function getAdsProvider(): AdsProvider { return new SupabaseAdsProvider() }
