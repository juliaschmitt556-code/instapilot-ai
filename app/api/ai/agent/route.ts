import { NextResponse } from 'next/server';
import { z } from 'zod';
import { runPublicAnalysisAgent } from '@/lib/agent';

const schema = z.object({ task: z.string().min(1).max(4000), comment: z.string().max(2000).optional(), caption: z.string().max(5000).optional(), postUrl: z.string().url().optional(), handle: z.string().max(80).optional() });

export async function POST(request: Request) {
  try {
    const input = schema.parse(await request.json());
    const result = await runPublicAnalysisAgent(input);
    return NextResponse.json({ provider: 'langchain-groq', result, approvalRequired: true, publishBoundary: 'Meta-authorized API only' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to run the public-data analysis agent.';
    return NextResponse.json({ error: message }, { status: message.includes('not configured') ? 503 : 400 });
  }
}
