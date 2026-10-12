import { NextResponse } from 'next/server';
import { getInstagramProvider } from '@/lib/adapters';
import { getSessionUser } from '@/lib/auth';

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  const accountId = new URL(request.url).searchParams.get('accountId');
  if (!accountId) return NextResponse.json({ error: 'An authorized accountId is required.' }, { status: 400 });
  const data = await getInstagramProvider().listComments(accountId);
  return NextResponse.json({ data, mode: process.env.APP_DATA_MODE === 'live' ? 'live' : 'unconfigured', accessModel: 'Authorized accessible content only.' });
}
