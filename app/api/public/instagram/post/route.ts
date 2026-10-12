import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getScrapeCreatorsClient } from '@/lib/scrapecreators';

export async function GET(request: Request) {
  const client = getScrapeCreatorsClient();
  if (!client) return NextResponse.json({ error: 'Public post retrieval is not configured. Add SCRAPECREATORS_API_KEY on the server.' }, { status: 503 });
  try {
    const url = z.string().url().refine((value) => value.includes('instagram.com'), 'Only Instagram URLs are supported.').parse(new URL(request.url).searchParams.get('url'));
    return NextResponse.json({ provider: 'scrapecreators', data: await client.post(url) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to retrieve the public post.' }, { status: 400 });
  }
}
