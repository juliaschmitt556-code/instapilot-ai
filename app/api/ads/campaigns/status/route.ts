import { NextResponse } from 'next/server';
import { getAdsProvider } from '@/lib/adapters';
import { getSessionUser } from '@/lib/auth';
import { campaignStatusSchema } from '@/lib/validation';

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user || !['owner', 'admin'].includes(user.role)) return NextResponse.json({ error: 'Owner or admin role required.' }, { status: 403 });
  try {
    const input = campaignStatusSchema.parse(await request.json());
    const data = await getAdsProvider().updateCampaignStatus(input.campaignId, input.status, input.confirmationToken);
    return NextResponse.json({ data, actor: user.openId, audit: { action: 'campaign.status_changed', idempotent: true } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Campaign status could not be updated.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
