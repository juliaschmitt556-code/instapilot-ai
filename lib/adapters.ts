import type { Campaign, CommentItem, ConnectedAccount } from './types';

export interface InstagramProvider {
  listAccounts(): Promise<ConnectedAccount[]>;
  listComments(accountId: string): Promise<CommentItem[]>;
  publishReply(commentId: string, text: string, idempotencyKey: string): Promise<{ id: string; status: 'published' }>;
}

export interface AdsProvider {
  listCampaigns(accountId: string): Promise<Campaign[]>;
  updateCampaignStatus(campaignId: string, status: 'Active' | 'Paused', confirmationToken: string): Promise<Campaign>;
}

export class MockInstagramProvider implements InstagramProvider {
  async listAccounts() { return []; }
  async listComments(_accountId: string) { return []; }
  async publishReply(_commentId: string, _text: string, idempotencyKey: string): Promise<never> {
    if (!idempotencyKey.trim()) throw new Error('An idempotency key is required before publishing.');
    throw new Error('Meta publishing is not configured. Connect an authorized account first.');
  }
}

export class MockAdsProvider implements AdsProvider {
  async listCampaigns(_accountId: string) { return []; }
  async updateCampaignStatus(_campaignId: string, _status: 'Active' | 'Paused', confirmationToken: string): Promise<never> {
    if (!confirmationToken.trim()) throw new Error('Explicit confirmation is required before changing campaign status.');
    throw new Error('Meta advertising is not configured. Connect an authorized ad account first.');
  }
}

export function getInstagramProvider(): InstagramProvider { return new MockInstagramProvider(); }
export function getAdsProvider(): AdsProvider { return new MockAdsProvider(); }
