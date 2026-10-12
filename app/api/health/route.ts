import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json({ ok: true, service: 'instapilot-ai', dataMode: process.env.APP_DATA_MODE === 'live' ? 'live' : 'unconfigured' });
}
