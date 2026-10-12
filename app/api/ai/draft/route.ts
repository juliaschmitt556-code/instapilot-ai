import { NextResponse } from 'next/server';
import { generateReplyDrafts } from '@/lib/ai';
import { aiDraftSchema } from '@/lib/validation';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const context = aiDraftSchema.parse(body);
    const drafts = await generateReplyDrafts(context);
    return NextResponse.json({ data: drafts, mode: process.env.GROQ_API_KEY ? 'groq' : 'sample', provenance: 'Drafts are suggestions; publishing always requires approval.' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to generate drafts.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
