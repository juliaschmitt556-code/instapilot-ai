import { NextResponse } from 'next/server';
import { getAdsProvider } from '@/lib/adapters';
import { getSessionUser } from '@/lib/auth';

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  const accountId = new URL(request.url).searchParams.get('accountId');
  if (!accountId) return NextResponse.json({ error: 'An authorized accountId is required.' }, { status: 400 });
  return NextResponse.json({ data: await getAdsProvider().listCampaigns(accountId), mode: process.env.APP_DATA_MODE === 'live' ? 'live' : 'sample' });
}
