import { describe, expect, it } from 'vitest';
import { containsUnsafeClaim, generateReplyDrafts } from '@/lib/ai';
import { MockAdsProvider, MockInstagramProvider } from '@/lib/adapters';

describe('InstaPilot safety seams', () => {
  it('flags unsupported or unsafe claims', () => {
    expect(containsUnsafeClaim('We guarantee 90% off')).toBe(true);
    expect(containsUnsafeClaim('Thanks for your kind note')).toBe(false);
  });

  it('returns contextual sample drafts without exposing credentials', async () => {
    const drafts = await generateReplyDrafts({ comment: 'Is this available?', tone: 'Friendly' });
    expect(drafts.length).toBeGreaterThan(0);
    expect(drafts[0].text).not.toContain('guarantee');
  });

  it('prevents publishing without an idempotency key', async () => {
    const provider = new MockInstagramProvider();
    await expect(provider.publishReply('comment', 'Reply', '')).rejects.toThrow('idempotency');
  });

  it('requires explicit confirmation for campaign status changes', async () => {
    const provider = new MockAdsProvider();
    await expect(provider.updateCampaignStatus('cmp_01', 'Paused', '')).rejects.toThrow('confirmation');
    const campaign = await provider.updateCampaignStatus('cmp_01', 'Paused', 'confirmed-by-owner');
    expect(campaign.status).toBe('Paused');
  });
});
