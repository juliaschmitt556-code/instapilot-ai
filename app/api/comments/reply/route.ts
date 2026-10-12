import { NextResponse } from 'next/server';
import { getInstagramProvider } from '@/lib/adapters';
import { getSessionUser } from '@/lib/auth';
import { replyRequestSchema } from '@/lib/validation';

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  try {
    const input = replyRequestSchema.parse(await request.json());
    const result = await getInstagramProvider().publishReply(input.commentId, input.text, input.idempotencyKey);
    return NextResponse.json({ data: result, actor: user.openId, mode: process.env.APP_DATA_MODE === 'live' ? 'live' : 'sample' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Reply could not be published.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
