import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getScrapeCreatorsClient } from '@/lib/scrapecreators';

const schema = z.object({ url: z.string().url().refine((value) => value.includes('instagram.com'), 'Only Instagram URLs are supported.'), cursor: z.string().optional(), includeReplies: z.coerce.boolean().default(false) });

export async function GET(request: Request) {
  const client = getScrapeCreatorsClient();
  if (!client) return NextResponse.json({ error: 'Public comments retrieval is not configured. Add SCRAPECREATORS_API_KEY on the server.' }, { status: 503 });
  try {
    const input = schema.parse(Object.fromEntries(new URL(request.url).searchParams));
    return NextResponse.json({ provider: 'scrapecreators', data: await client.comments(input.url, input.cursor, input.includeReplies), note: input.includeReplies ? 'Replies may cost extra credits and increase latency.' : 'Top-level comments requested; expand replies selectively.' });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to retrieve public comments.' }, { status: 400 });
  }
}
