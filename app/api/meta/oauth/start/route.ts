import { randomBytes } from 'node:crypto';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const appId = process.env.META_APP_ID;
  const redirectUri = process.env.META_REDIRECT_URI;
  const version = process.env.META_GRAPH_API_VERSION;
  const scopes = process.env.META_OAUTH_SCOPES;
  if (!appId || !redirectUri || !version || !scopes) return NextResponse.json({ error: 'Meta OAuth is not configured. Add app ID, redirect URI, API version, and reviewed scopes first.' }, { status: 503 });
  const nonce = randomBytes(24).toString('hex');
  const state = Buffer.from(JSON.stringify({ nonce, redirectUri })).toString('base64url');
  const authorizeUrl = new URL(`https://www.facebook.com/${version}/dialog/oauth`);
  authorizeUrl.searchParams.set('client_id', appId);
  authorizeUrl.searchParams.set('redirect_uri', redirectUri);
  authorizeUrl.searchParams.set('state', state);
  authorizeUrl.searchParams.set('scope', scopes);
  const response = NextResponse.redirect(authorizeUrl);
  response.cookies.set('meta_oauth_state', nonce, { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 600, path: '/' });
  return response;
}
