import { describe, expect, it } from 'vitest';
import { containsUnsafeClaim, generateReplyDrafts } from '@/lib/ai';
import { SupabaseAdsProvider, SupabaseInstagramProvider } from '@/lib/adapters';

describe('InstaPilot safety seams', () => {
  it('flags unsupported or unsafe claims', () => {
    expect(containsUnsafeClaim('We guarantee 90% off')).toBe(true);
    expect(containsUnsafeClaim('Thanks for your kind note')).toBe(false);
  });

  it('does not fabricate drafts when Groq is not configured', async () => {
    const original = process.env.GROQ_API_KEY;
    delete process.env.GROQ_API_KEY;
    await expect(generateReplyDrafts({ comment: 'Is this available?', tone: 'Friendly' })).rejects.toThrow('not configured');
    if (original) process.env.GROQ_API_KEY = original;
  });

  it('prevents publishing without an idempotency key', async () => {
    const provider = new SupabaseInstagramProvider();
    await expect(provider.publishReply('comment', 'Reply', '')).rejects.toThrow('idempotency');
  });

  it('requires explicit confirmation for campaign status changes', async () => {
    const provider = new SupabaseAdsProvider();
    await expect(provider.updateCampaignStatus('cmp_01', 'Paused', '')).rejects.toThrow('confirmation');
    await expect(provider.updateCampaignStatus('cmp_01', 'Paused', 'confirmed-by-owner')).rejects.toThrow('cookies');
  });
});
