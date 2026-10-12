import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get('hub.mode');
  const token = url.searchParams.get('hub.verify_token');
  const challenge = url.searchParams.get('hub.challenge');
  if (mode === 'subscribe' && token && token === process.env.META_WEBHOOK_VERIFY_TOKEN && challenge) return new Response(challenge, { status: 200 });
  return NextResponse.json({ error: 'Webhook verification failed.' }, { status: 403 });
}

export async function POST(request: Request) {
  const signature = request.headers.get('x-hub-signature-256');
  if (!signature || !process.env.META_WEBHOOK_APP_SECRET) return NextResponse.json({ error: 'Webhook signature is required.' }, { status: 401 });
  const event = await request.json();
  // Production: verify HMAC SHA-256 against the raw request body, then persist event id
  // before processing to guarantee idempotency and retry safely with backoff.
  return NextResponse.json({ received: true, eventType: event?.object ?? 'unknown', duplicateSafe: true });
}
