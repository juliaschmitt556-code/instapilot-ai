import { campaigns, comments, sampleAccount } from './sample-data';
import type { Campaign, CommentItem, ConnectedAccount } from './types';

export interface InstagramProvider {
  listAccounts(): Promise<ConnectedAccount[]>;
  listComments(accountId: string): Promise<CommentItem[]>;
  publishReply(commentId: string, text: string, idempotencyKey: string): Promise<{ id: string; status: 'published' | 'queued' }>;
}

export interface AdsProvider {
  listCampaigns(accountId: string): Promise<Campaign[]>;
  updateCampaignStatus(campaignId: string, status: 'Active' | 'Paused', confirmationToken: string): Promise<Campaign>;
}

export class MockInstagramProvider implements InstagramProvider {
  async listAccounts() { return [sampleAccount]; }
  async listComments(_accountId: string) { return comments; }
  async publishReply(commentId: string, text: string, idempotencyKey: string) {
    if (!commentId || !text.trim() || !idempotencyKey) throw new Error('A comment, reply, and idempotency key are required.');
    return { id: `reply_${Date.now()}`, status: 'published' as const };
  }
}

export class MockAdsProvider implements AdsProvider {
  async listCampaigns(_accountId: string) { return campaigns; }
  async updateCampaignStatus(campaignId: string, status: 'Active' | 'Paused', confirmationToken: string) {
    if (!confirmationToken) throw new Error('Explicit confirmation is required before changing campaign delivery.');
    const campaign = campaigns.find((item) => item.id === campaignId);
    if (!campaign) throw new Error('Campaign not found or not authorized for this workspace.');
    return { ...campaign, status };
  }
}

export function getInstagramProvider(): InstagramProvider {
  return new MockInstagramProvider();
}

export function getAdsProvider(): AdsProvider {
  return new MockAdsProvider();
}
