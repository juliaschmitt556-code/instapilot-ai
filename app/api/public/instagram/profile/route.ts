import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getScrapeCreatorsClient } from '@/lib/scrapecreators';

export async function GET(request: Request) {
  const client = getScrapeCreatorsClient();
  if (!client) return NextResponse.json({ error: 'Public profile retrieval is not configured. Add SCRAPECREATORS_API_KEY on the server.' }, { status: 503 });
  try {
    const handle = z.string().min(1).max(80).parse(new URL(request.url).searchParams.get('handle'));
    return NextResponse.json({ provider: 'scrapecreators', data: await client.profile(handle) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to retrieve the public profile.' }, { status: 400 });
  }
}
