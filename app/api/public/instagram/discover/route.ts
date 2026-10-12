import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getScrapeCreatorsClient } from '@/lib/scrapecreators';

const querySchema = z.object({ kind: z.enum(['search', 'popular', 'reels']).default('search'), query: z.string().min(1).max(160), cursor: z.string().optional(), page: z.string().optional() });

export async function GET(request: Request) {
  const client = getScrapeCreatorsClient();
  if (!client) return NextResponse.json({ error: 'Public discovery is not configured. Add SCRAPECREATORS_API_KEY on the server.' }, { status: 503 });
  try {
    const input = querySchema.parse(Object.fromEntries(new URL(request.url).searchParams));
    const data = input.kind === 'popular' ? await client.popularSearch(input.query, input.cursor) : input.kind === 'reels' ? await client.reelsSearch(input.query, input.page) : await client.search(input.query);
    return NextResponse.json({ provider: 'scrapecreators', kind: input.kind, data });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to retrieve public discovery data.' }, { status: 400 });
  }
}
